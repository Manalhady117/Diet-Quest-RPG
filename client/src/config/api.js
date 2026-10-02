import axios from 'axios';

// Determine base URL: fallback to /api or env variable
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token if available
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('diet_quest_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Could not read token from storage', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle unauthenticated or server errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK' || !error.response) {
      console.warn('[API Warning] Backend server is unreachable. Ensure the backend is running.');
    }
    if (error.response && error.response.status === 401) {
      // Clear token on 401 Unauthorized
      try {
        localStorage.removeItem('diet_quest_token');
        localStorage.removeItem('diet_quest_user');
      } catch (e) {
        // ignore
      }
    }
    return Promise.reject(error);
  }
);

export default api;
