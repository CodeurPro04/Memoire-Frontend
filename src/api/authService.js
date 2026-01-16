import api from './axios';


export const authService = {
    login: async (credentials) => {
        const response = await api.post(`/login`, credentials);
        if (response.data.access_token) {
            // On stocke le token et les infos user
            localStorage.setItem(`token`, response.data.access_token);
            localStorage.setItem(`user`, JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: async () => {
        try {
            await api.post(`/logout`);
        } finally {
            // on nettoie le stockage local
            localStorage.removeItem(`token`);
            localStorage.removeItem(`user`);
        }
    },

    // Récupérer tous les utilisateurs
    getAllUsers: async () => {
        const response = await api.get(`/users`);
        return response.data; // Retourne le tableau des utilisateurs
    },


};