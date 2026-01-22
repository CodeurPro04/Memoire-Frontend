import api from './axios';

export const appointmentService = {
  // 1. STATS POUR LE PATIENT (L'intercepteur injecte l'ID via le Token)
  getPersonalStats: async () => {
    // Appelle la route : GET /api/appointments/stats
    const response = await api.get('/appointments/stats');
    return response.data; 
  },

  // 2. STATS GLOBALES (Pour le Dashboard Admin)
  getAdminStats: async () => {
    // Appelle la route : GET /api/admin/stats/global
    const response = await api.get('/admin/stats/global');
    return response.data;
  },

  getAllAppointments: async (page = 1, search = "") => {
        try {
            const response = await api.get(`/appointments`, {
                params: { 
                    page: page,
                    search: search 
                }
            });
            return response.data;
        } catch (error) {
            console.error("Erreur service appointments:", error);
            throw error;
        }
    },

    updateStatus: async (id, status) => {
        try {
            const response = await api.patch(`/admin/appointments/${id}/status`, { status });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};