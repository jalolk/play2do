import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import apiClient from '../utils/api-client';

interface AuthState {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: async (email: string, password: string) => {
        const response = await apiClient.post('/auth/login', {
          email,
          password,
        });
        const token = response.data.access_token;
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({ user: { token } });
      },
      register: async (email: string, password: string, name: string) => {
        const response = await apiClient.post('/auth/register', {
          email,
          password,
          name,
        });
        const token = response.data.access_token;
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({ user: { token } });
      },
      logout: () => {
        delete apiClient.defaults.headers.common['Authorization'];
        set({ user: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
