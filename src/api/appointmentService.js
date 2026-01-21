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
  }
};