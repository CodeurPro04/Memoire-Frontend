import api from "./axios";


export const patientService = {
  getAllPatients: async (page=1) => {
    try {
      const response = await api.get(`/patient?page=${page}`);
      return response.data;
    } catch (error) {
      console.error("Erreur récupération liste patients:", error);
      throw error;
    }
  },

  registerPatient: async (patientData) => {
    try {
      const response = await api.post(`/patient/register`, patientData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du patient:", error);
      throw error;
    }
  },

  updatePatient: async (formData) => {
    try {
        const response = await api.put(`/patient/profile`, formData);
        return response.data;
    } catch (error) {
        console.error("Erreur dans updatePatient service:", error);
        throw error;
    }
  },

  deletePatient: async (id) => {
    try {
      const response = await api.delete(`/patient/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur suppression patient:", error);
      throw error;
    }
  },

};