import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      role: null,
      staffList: [],
      isLoading: false,
      error: null,

      login: async (pin) => {
        set({ isLoading: true, error: null });
        
        // Master PIN for testing/bypass
        if (pin === "1122") {
          const mockUser = { name: "Vikki", role: "Staff", id: "EMP42", pin: "1122" };
          set({ user: mockUser, token: "dev-master", isAuthenticated: true, role: "Staff", isLoading: false });
          return true;
        }

        try {
          const response = await api.post('', { action: 'login', pin });
          
          if (response.data.result === 'success') {
            const { user, staffList } = response.data;
            set({ 
              user, 
              token: 'active', 
              isAuthenticated: true, 
              role: user.role || user.designation, 
              staffList: staffList || [],
              isLoading: false 
            });
            return true;
          } else {
            throw new Error(response.data.message || 'Login failed');
          }
        } catch (error) {
          set({ error: error.message || 'Login failed', isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, role: null });
      },

      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
      }
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
