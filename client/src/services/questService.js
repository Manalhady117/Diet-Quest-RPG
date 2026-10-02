import api from '../config/api.js';

export const questService = {
  async getQuests() {
    const response = await api.get('/quests');
    return response.data;
  },

  async completeQuest(questId) {
    const response = await api.post(`/quests/${questId}/complete`);
    return response.data;
  },

  async claimQuest(questId) {
    const response = await api.post(`/quests/${questId}/claim`);
    return response.data;
  },

  async resetDailyQuests() {
    const response = await api.post('/quests/reset');
    return response.data;
  },

  async generatePlan(payload) {
    const response = await api.post('/quests/generate-plan', payload);
    return response.data;
  },

  async updateProgress(questId, amount, isIncremental = true) {
    try {
      const response = await api.put(`/quests/${questId}/progress`, { amount, isIncremental });
      return response.data;
    } catch (err) {
      const response = await api.post(`/quests/${questId}/progress`, { amount, isIncremental });
      return response.data;
    }
  }
};

export default questService;
