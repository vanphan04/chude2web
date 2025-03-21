import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    isSuperAdmin: (state) => state.user?.role === 'superadmin',
    isAdmin: (state) => state.user?.role === 'admin',
    isUser: (state) => state.user?.role === 'user',
  },
  actions: {
    login(userData) {
      this.user = userData;
      localStorage.setItem('user', JSON.stringify(userData));
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
      const router = useRouter();
      router.push('/login');
    },
  }
});
