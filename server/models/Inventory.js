import { getCollection } from '../config/db.js';

const inventoryCollection = () => getCollection('inventory');

export const STORE_CATALOG = [
  {
    id: 'speed_potion',
    name: 'Speed Potion',
    costXP: 400,
    type: 'consumable',
    icon: 'potion',
    description: 'Consumed 15 minutes prior to a meal. Grants +50 XP for drinking 500 mL water to curb excessive hunger.',
    effect: 'grants_water_bonus',
    duration: 'instant'
  },
  {
    id: 'shield_barrier',
    name: 'Aegis Shield',
    costXP: 650,
    type: 'buff',
    icon: 'shield',
    description: 'Preps a healthy meal shield protecting you from all junk food & calorie HP logging penalties for 6 hours.',
    effect: 'penalty_immunity',
    durationHours: 6
  },
  {
    id: 'cheat_meal_pass',
    name: 'Cheat Meal Pass',
    costXP: 2000,
    type: 'pass',
    icon: 'pass',
    description: 'Allows one controlled off-plan meal without deducting HP or triggering XP penalty traps.',
    effect: 'consume_cheat_meal',
    duration: 'single_use'
  },
  {
    id: 'rest_day_pass',
    name: 'Rest Day Pass',
    costXP: 1500,
    type: 'pass',
    icon: 'scroll',
    description: 'Exempts player from Side Quests for 24 hours while preserving active streak multiplier.',
    effect: 'streak_freeze',
    durationHours: 24
  }
];

export const InventoryModel = {
  async getByUserId(userId) {
    let inv = await inventoryCollection().findOne({ userId });
    if (!inv) {
      inv = await inventoryCollection().insertOne({
        userId,
        speedPotions: 2, // starter pack
        shields: 1,      // starter pack
        cheatMealPasses: 0,
        restDayPasses: 1,
        activeBuffs: [],
        purchaseHistory: []
      });
    }
    return inv;
  },

  async updateInventory(userId, updates) {
    const inv = await this.getByUserId(userId);
    const merged = { ...inv, ...updates };
    await inventoryCollection().updateOne({ userId }, merged);
    return merged;
  },

  async addItem(userId, itemId, quantity = 1) {
    const inv = await this.getByUserId(userId);
    const updates = {};
    if (itemId === 'speed_potion') updates.speedPotions = (inv.speedPotions || 0) + quantity;
    if (itemId === 'shield_barrier') updates.shields = (inv.shields || 0) + quantity;
    if (itemId === 'cheat_meal_pass') updates.cheatMealPasses = (inv.cheatMealPasses || 0) + quantity;
    if (itemId === 'rest_day_pass') updates.restDayPasses = (inv.restDayPasses || 0) + quantity;

    return await this.updateInventory(userId, updates);
  },

  async consumeItem(userId, itemId) {
    const inv = await this.getByUserId(userId);
    const updates = {};

    if (itemId === 'speed_potion') {
      if ((inv.speedPotions || 0) <= 0) return { success: false, message: 'No Speed Potions remaining in inventory!' };
      updates.speedPotions = inv.speedPotions - 1;
    } else if (itemId === 'shield_barrier') {
      if ((inv.shields || 0) <= 0) return { success: false, message: 'No Shields remaining in inventory!' };
      updates.shields = inv.shields - 1;
    } else if (itemId === 'cheat_meal_pass') {
      if ((inv.cheatMealPasses || 0) <= 0) return { success: false, message: 'No Cheat Meal Passes in inventory!' };
      updates.cheatMealPasses = inv.cheatMealPasses - 1;
    } else if (itemId === 'rest_day_pass') {
      if ((inv.restDayPasses || 0) <= 0) return { success: false, message: 'No Rest Day Passes in inventory!' };
      updates.restDayPasses = inv.restDayPasses - 1;
    }

    const updated = await this.updateInventory(userId, updates);
    return { success: true, inventory: updated };
  }
};

export default InventoryModel;
