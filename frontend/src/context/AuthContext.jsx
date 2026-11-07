import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  registerUser as apiRegisterUser,
  loginUser as apiLoginUser,
  getCurrentUser as apiGetCurrentUser,
  updateUserProfile as apiUpdateUserProfile,
} from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('smartfind_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('smartfind_token');
      if (storedToken) {
        try {
          const res = await apiGetCurrentUser(storedToken);
          if (res.success && res.user) {
            setUser(res.user);
            setToken(storedToken);
          } else {
            logout();
          }
        } catch (error) {
          console.warn('[AuthContext] Session expired or token invalid. Clearing auth.');
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const register = async (userData) => {
    const res = await apiRegisterUser(userData);
    if (res.success && res.token) {
      localStorage.setItem('smartfind_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const login = async (credentials) => {
    const res = await apiLoginUser(credentials);
    if (res.success && res.token) {
      localStorage.setItem('smartfind_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('smartfind_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    if (!token) throw new Error('No active authentication token');
    const res = await apiUpdateUserProfile(token, profileData);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    loading,
    register,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
