import api from '../config/api.js';

export const healthService = {
  async syncTelemetry({ steps, bpm, caloriesBurned, deviceType }) {
    const response = await api.post('/health/sync', {
      steps,
      bpm,
      caloriesBurned,
      deviceType
    });
    return response.data;
  },

  async getHealthHistory() {
    const response = await api.get('/health/history');
    return response.data;
  },

  async mockStepIncrement({ deltaSteps = 1000, bpm = 84 }) {
    const response = await api.post('/health/mock-step', {
      deltaSteps,
      bpm
    });
    return response.data;
  }
};

export default healthService;
