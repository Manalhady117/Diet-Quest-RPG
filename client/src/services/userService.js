import api from '../config/api.js';

export const userService = {
  async getStats() {
    const response = await api.get('/game/stats');
    return response.data;
  },

  async applyDamage(damage = 20, reason = 'Unplanned caloric overage') {
    const response = await api.post('/game/damage', { damage, reason });
    return response.data;
  },

  async logWater(amount_ml = 250) {
    const response = await api.post('/game/water', { amount_ml });
    return response.data;
  },

  async triggerTrap() {
    const response = await api.post('/game/trap');
    return response.data;
  },

  async useInventoryItem(itemId) {
    const response = await api.post('/game/use-item', { itemId });
    return response.data;
  },

  async getStoreCatalog() {
    const response = await api.get('/store/items');
    return response.data;
  },

  async buyStoreItem(itemId) {
    const response = await api.post('/store/buy', { itemId });
    return response.data;
  },

  async getInventory() {
    const response = await api.get('/store/inventory');
    return response.data;
  },

  async completeDay(completedMealIds = [], dayNotes = '') {
    const response = await api.post('/game/complete-day', { completedMealIds, dayNotes });
    return response.data;
  },

  async nextDay() {
    try {
      const response = await api.post('/diet/next-day');
      return response.data;
    } catch (err) {
      const response = await api.post('/game/complete-day', { completedMealIds: [] });
      return response.data;
    }
  },

  async logWalkBonus(extraKm = 1.0) {
    try {
      const response = await api.post('/game/walk-bonus', { extraKm });
      return response.data;
    } catch (err) {
      return { success: false, error: err?.message };
    }
  },

  async recordWeighIn(weight_kg, note = '') {
    const response = await api.post('/game/weigh-in', { weight_kg, note });
    return response.data;
  },

  async rerollMeal(day = 1, mealId, currentMeal = null, targetCalories = null, goal = null) {
    try {
      const response = await api.post('/diet/reroll-meal', { day, mealId, currentMeal, targetCalories, goal });
      return response.data;
    } catch (err) {
      const response = await api.post('/game/reroll-meal', { day, mealId });
      return response.data;
    }
  },

  async claimMeal(day = 1, mealId) {
    try {
      const response = await api.post('/diet/claim-meal', { day, mealId });
      return response.data;
    } catch (err) {
      return { success: false, error: err?.message };
    }
  },

  async resurrect(method = 'recovery_walk') {
    const response = await api.post('/game/resurrect', { method });
    return response.data;
  },

  async buyPetItem(itemId, costCoins = 100, itemType = 'hat') {
    const response = await api.post('/game/buy-pet-item', { itemId, costCoins, itemType });
    return response.data;
  },

  async equipPetItem(slot, itemId) {
    const response = await api.post('/game/equip-pet-item', { slot, itemId });
    return response.data;
  },

  async interactPet(action = 'pet') {
    const response = await api.post('/game/interact-pet', { action });
    return response.data;
  },

  async claimBadge(badgeId) {
    const response = await api.post('/game/claim-badge', { badgeId });
    return response.data;
  },

  async sendDietitianChat(message, chatHistory = [], userProfile = null) {
    try {
      const response = await api.post('/chat', { message, chatHistory, userProfile });
      return response.data;
    } catch (err) {
      const response = await api.post('/diet/chat', { message, chatHistory, userProfile });
      return response.data;
    }
  }
};

export default userService;
