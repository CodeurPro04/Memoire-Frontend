import api from "./axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const medecinService = {
  getAllMedecins: async (page = 1) => {
    try {
      const response = await api.get(`/medecins?page=${page}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des médecins:`, error);
      throw error;
    }
  },

  register: async (data) => {
    try {
        const response = await api.post("/medecin/register", data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Erreur lors de l'inscription";
    }
  },

  updateMedecin: async (doctorData) => {
    const response = await api.put(`/medecin/profile`, doctorData);
    return response.data;
  },

  deleteMedecin: async (id) => {
    try {
        const response = await api.delete(`medecin/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
  },
};