import { STORE_CATALOG, InventoryModel } from '../models/Inventory.js';
import PlayerStatsModel from '../models/PlayerStats.js';

export const getStoreCatalog = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const inventory = await InventoryModel.getByUserId(userId);
    const stats = await PlayerStatsModel.findByUserId(userId);

    res.json({
      success: true,
      catalog: STORE_CATALOG,
      inventory,
      currentXP: stats.xp_total || 0
    });
  } catch (error) {
    next(error);
  }
};

export const buyStoreItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.body;

    const item = STORE_CATALOG.find(i => i.id === itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in Loot Store.' });
    }

    const stats = await PlayerStatsModel.findByUserId(userId);
    if ((stats.xp_total || 0) < item.costXP) {
      return res.status(400).json({
        success: false,
        message: `Insufficient XP! You need ${item.costXP} XP, but only have ${stats.xp_total || 0} XP.`
      });
    }

    // Deduct XP
    const updatedStats = await PlayerStatsModel.deductXP(userId, item.costXP);
    // Add item to inventory
    const updatedInventory = await InventoryModel.addItem(userId, item.id, 1);

    res.json({
      success: true,
      message: `🎉 Acquired ${item.name} for ${item.costXP} XP! Stored in inventory.`,
      item,
      inventory: updatedInventory,
      stats: updatedStats
    });
  } catch (error) {
    next(error);
  }
};

export const getInventory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const inventory = await InventoryModel.getByUserId(userId);
    const stats = await PlayerStatsModel.findByUserId(userId);

    res.json({
      success: true,
      inventory,
      stats
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getStoreCatalog,
  buyStoreItem,
  getInventory
};
