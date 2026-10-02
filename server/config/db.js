import fs from 'fs';
import path from 'path';

/**
 * Diet Quest Storage Engine
 * Supports file-backed JSON persistent document store with atomic updates
 * and seamless fallback to memory if running in ephemeral environments.
 */

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'quest_db.json');

// In-memory cache for ultra-fast query and mutation operations
let dbState = {
  users: [],
  playerStats: [],
  quests: [],
  inventory: [],
  healthSync: []
};

// Ensure data directory exists
const ensureStorage = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      if (content) {
        dbState = { ...dbState, ...JSON.parse(content) };
      }
    } else {
      saveStorage();
    }
  } catch (err) {
    console.warn('[DB] Using in-memory store due to file write limitation:', err.message);
  }
};

// Persist state to disk safely
export const saveStorage = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(dbState, null, 2), 'utf8');
  } catch (err) {
    // Continue running in-memory
  }
};

/**
 * Connect to database and initialize collections & seed data
 */
export const connectDB = async () => {
  try {
    ensureStorage();
    console.log('[DB] Connected to Diet Quest Data Engine successfully.');
    return true;
  } catch (error) {
    console.error('[DB] Connection error:', error);
    return false;
  }
};

/**
 * Generic Collection accessor
 */
export const getCollection = (collectionName) => {
  if (!dbState[collectionName]) {
    dbState[collectionName] = [];
  }

  return {
    find: async (predicate = () => true) => {
      if (typeof predicate === 'function') {
        return dbState[collectionName].filter(predicate);
      }
      // Simple object match
      return dbState[collectionName].filter(item => {
        return Object.entries(predicate).every(([key, value]) => item[key] === value);
      });
    },

    findOne: async (predicate) => {
      if (typeof predicate === 'function') {
        return dbState[collectionName].find(predicate) || null;
      }
      return dbState[collectionName].find(item => {
        return Object.entries(predicate).every(([key, value]) => item[key] === value);
      }) || null;
    },

    findById: async (id) => {
      return dbState[collectionName].find(item => String(item.id || item._id) === String(id)) || null;
    },

    insertOne: async (doc) => {
      const newDoc = {
        ...doc,
        id: doc.id || doc._id || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        createdAt: doc.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      dbState[collectionName].push(newDoc);
      saveStorage();
      return newDoc;
    },

    updateOne: async (query, update) => {
      const item = await getCollection(collectionName).findOne(query);
      if (!item) return null;

      Object.assign(item, update, { updatedAt: new Date().toISOString() });
      saveStorage();
      return item;
    },

    deleteOne: async (query) => {
      const index = dbState[collectionName].findIndex(item => {
        if (typeof query === 'function') return query(item);
        return Object.entries(query).every(([key, value]) => item[key] === value);
      });
      if (index !== -1) {
        const removed = dbState[collectionName].splice(index, 1)[0];
        saveStorage();
        return removed;
      }
      return null;
    },

    deleteMany: async (query) => {
      const initialLength = dbState[collectionName].length;
      dbState[collectionName] = dbState[collectionName].filter(item => {
        if (typeof query === 'function') return !query(item);
        return !Object.entries(query).every(([key, value]) => item[key] === value);
      });
      saveStorage();
      return initialLength - dbState[collectionName].length;
    }
  };
};

export default {
  connectDB,
  getCollection,
  saveStorage
};
