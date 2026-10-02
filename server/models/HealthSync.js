import { getCollection } from '../config/db.js';

const syncCollection = () => getCollection('healthSync');

export const HealthSyncModel = {
  async logTelemetry({ userId, deviceType, steps, bpm, caloriesBurned = 0 }) {
    const record = {
      userId,
      deviceType: deviceType || 'Apple Watch',
      steps: Number(steps) || 0,
      bpm: Number(bpm) || 72,
      caloriesBurned: Number(caloriesBurned) || 0,
      syncedAt: new Date().toISOString(),
      status: 'synced'
    };

    return await syncCollection().insertOne(record);
  },

  async getRecentLogs(userId, limit = 10) {
    const records = await syncCollection().find(r => r.userId === userId);
    return records.slice(-limit).reverse();
  }
};

export default HealthSyncModel;
