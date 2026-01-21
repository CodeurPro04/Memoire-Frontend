import api from "./axios";

export const cliniqueService = {
  getAllCliniques: async (page=1, search = "") => {
    try {
      const response = await api.get(`/cliniques?page=${page}&search=${search}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des cliniques:`, error);
      throw error;
    }
  },

  register: async (data) => {
    try {
        const response = await api.post("/clinique/register", data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Erreur lors de l'inscription";
    }
  },

  updateClinique: async (doctorData) => {
    const response = await api.put(`/clinique/profile`, doctorData);
    return response.data;
  },

  deleteClinique: async (id) => {
    try {
        const response = await api.delete(`clinique/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
  },

};