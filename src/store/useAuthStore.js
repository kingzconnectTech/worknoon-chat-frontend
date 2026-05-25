import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user: localStorage.getItem('user') && localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null,
  token: localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: !!localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined',
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token, isAuthenticated: true, loading: false });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.error || 'Login failed', 
        loading: false 
      });
      return false;
    }
  },

  signup: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/signup', userData);
      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token, isAuthenticated: true, loading: false });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.error || 'Registration failed', 
        loading: false 
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null })
}));

export default useAuthStore;
