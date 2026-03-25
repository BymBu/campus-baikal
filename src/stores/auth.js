// src/stores/auth.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/api/api'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem("token") || null,
        user: JSON.parse(localStorage.getItem("user")) || null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
    },

    actions: {
        async login(email, password, deviceName) {
            let response = await api.login(email, password, deviceName)
            this.token = response
            this.user = { email }
            localStorage.setItem("token", response)
            localStorage.setItem("user", JSON.stringify({ email }))
            return true;
        },
        
        logout() {
            this.token = null
            this.user = null
            localStorage.removeItem("token")
            localStorage.removeItem("user")
        }
    }
})