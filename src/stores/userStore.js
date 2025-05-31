import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.user,
        getUser: (state) => state.user,
    },
    actions: {
        setUser(user) {
            this.user = user;
        },
        resetUser() {
            this.user = null;
        },
    },
});

