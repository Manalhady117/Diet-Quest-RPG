import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [token, setToken] = useState(() => authService.getToken());
  const [isLoading, setIsLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = authService.getToken();
      if (savedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          }
        } catch (err) {
          console.warn('[Auth] Session validation failed:', err.message);
          // Token expired or invalid
          authService.logout();
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await authService.login({ email, password });
      if (res.success) {
        setUser(res.user);
        setToken(res.token);
        return { success: true, user: res.user, stats: res.stats };
      }
      return { success: false, message: res.message || 'Login failed.' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Login failed.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const res = await authService.register(userData);
      if (res.success) {
        setUser(res.user);
        setToken(res.token);
        return { success: true, user: res.user, stats: res.stats };
      }
      return { success: false, message: res.message || 'Registration failed.' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Registration failed.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const res = await authService.updateProfile(updates);
      if (res.success) {
        setUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message
      };
    }
  };

  const refreshUser = async () => {
    try {
      const res = await authService.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        return res.user;
      }
    } catch (err) {
      console.warn('[Auth] refreshUser failed:', err.message);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        updateProfile,
        refreshUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
