import api from '../config/api.js';

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('diet_quest_token', response.data.token);
      localStorage.setItem('diet_quest_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('diet_quest_token', response.data.token);
      localStorage.setItem('diet_quest_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(updates) {
    const response = await api.put('/auth/profile', updates);
    if (response.data.user) {
      localStorage.setItem('diet_quest_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('diet_quest_token');
    localStorage.removeItem('diet_quest_user');
  },

  getCurrentUser() {
    try {
      const stored = localStorage.getItem('diet_quest_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    try {
      return localStorage.getItem('diet_quest_token');
    } catch {
      return null;
    }
  }
};

export default authService;
