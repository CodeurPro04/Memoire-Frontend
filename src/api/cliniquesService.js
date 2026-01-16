import api from "./axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const cliniqueService = {
  // ======================
  // Authentification
  // ======================
//   register: async (data) => {
//     try {
//       const response = await api.post(`${BASE_URL}/clinique/register`, data);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur lors de l'inscription clinique:`, error);
//       throw error;
//     }
//   },

//   login: async (credentials) => {
//     try {
//       const response = await api.post(`${BASE_URL}/clinique/login`, credentials);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur lors de la connexion clinique:`, error);
//       throw error;
//     }
//   },

//   // ======================
//   // Profil de la Clinique
//   // ======================
//   getProfile: async () => {
//     try {
//       const response = await api.get(`${BASE_URL}/clinique/profile`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur lors de la récupération du profil:`, error);
//       throw error;
//     }
//   },

//   updateProfile: async (data) => {
//     try {
//       const response = await api.put(`${BASE_URL}/clinique/profile`, data);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur lors de la mise à jour du profil:`, error);
//       throw error;
//     }
//   },

//   updatePassword: async (data) => {
//     try {
//       const response = await api.put(`${BASE_URL}/clinique/profile/password`, data);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur lors du changement de mot de passe:`, error);
//       throw error;
//     }
//   },

//   updatePhoto: async (formData) => {
//     try {
//       const response = await api.post(`${BASE_URL}/clinique/profile/photo`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur lors de la mise à jour de la photo:`, error);
//       throw error;
//     }
//   },

//   deleteAccount: async () => {
//     try {
//       const response = await api.delete(`${BASE_URL}/clinique/profile`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur lors de la suppression du compte:`, error);
//       throw error;
//     }
//   },

  // ======================
  // Gestion des Listes (Public/Admin)
  // ======================
  getAllCliniques: async () => {
    try {
      const response = await api.get(`/cliniques`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des cliniques:`, error);
      throw error;
    }
  },

//   getCliniqueById: async (id) => {
//     try {
//       const response = await api.get(`${BASE_URL}/cliniques/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur lors de la récupération de la clinique ${id}:`, error);
//       throw error;
//     }
//   },

//   // ======================
//   // Gestion des Médecins (Rattachés)
//   // ======================
//   getMedecins: async () => {
//     try {
//       const response = await api.get(`${BASE_URL}/clinique/medecins`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur lors de la récupération des médecins rattachés:`, error);
//       throw error;
//     }
//   },

//   addMedecin: async (medecinData) => {
//     try {
//       const response = await api.post(`${BASE_URL}/clinique/medecins/add`, medecinData);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur lors de l'ajout du médecin:`, error);
//       throw error;
//     }
//   },

//   removeMedecin: async (medecinId) => {
//     try {
//       const response = await api.delete(`${BASE_URL}/clinique/medecins/${medecinId}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur lors du retrait du médecin:`, error);
//       throw error;
//     }
//   },

//   // ======================
//   // Google OAuth
//   // ======================
//   googleAuth: async (data) => {
//     try {
//       const response = await api.post(`${BASE_URL}/auth/google/clinique`, data);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur lors de l'authentification Google:`, error);
//       throw error;
//     }
//   },
};