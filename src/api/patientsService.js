import api from "./axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const patientService = {
  // ======================
  // Gestion de la liste (Admin)
  // ======================
  getAllPatients: async () => {
    try {
      const response = await api.get(`/patient`);
      return response.data;
    } catch (error) {
      console.error("Erreur récupération liste patients:", error);
      throw error;
    }
  },

//   // ======================
//   // Authentification & OAuth
//   // ======================
//   register: async (data) => {
//     try {
//       const response = await api.post(`${BASE_URL}/patient/register`, data);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur inscription patient:`, error);
//       throw error;
//     }
//   },

//   login: async (credentials) => {
//     try {
//       const response = await api.post(`${BASE_URL}/patient/login`, credentials);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur connexion patient:`, error);
//       throw error;
//     }
//   },

//   googleAuth: async (data) => {
//     try {
//       const response = await api.post(`${BASE_URL}/auth/google/patient`, data);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur Google Auth patient:`, error);
//       throw error;
//     }
//   },

//   // ======================
//   // Profil & Compte
//   // ======================
//   getProfile: async () => {
//     try {
//       const response = await api.get(`${BASE_URL}/patient/profile`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur récupération profil patient:`, error);
//       throw error;
//     }
//   },

//   updateProfile: async (data) => {
//     try {
//       const response = await api.put(`${BASE_URL}/patient/profile`, data);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur mise à jour profil patient:`, error);
//       throw error;
//     }
//   },

//   updatePassword: async (data) => {
//     try {
//       const response = await api.put(`${BASE_URL}/patient/profile/password`, data);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur changement mot de passe patient:`, error);
//       throw error;
//     }
//   },

//   updatePhoto: async (formData) => {
//     try {
//       const response = await api.post(`${BASE_URL}/patient/profile/photo`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur mise à jour photo patient:`, error);
//       throw error;
//     }
//   },

//   deleteAccount: async (data) => {
//     try {
//       // Note: delete peut accepter un body via l'objet config
//       const response = await api.delete(`${BASE_URL}/patient/profile`, { data });
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur suppression compte patient:`, error);
//       throw error;
//     }
//   },

//   // ======================
//   // Rendez-vous (Appointments)
//   // ======================
//   getAppointments: async () => {
//     try {
//       const response = await api.get(`${BASE_URL}/patient/appointments`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur récupération rendez-vous patient:`, error);
//       throw error;
//     }
//   },

//   createAppointment: async (data) => {
//     try {
//       const response = await api.post(`${BASE_URL}/patient/appointments`, data);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur création rendez-vous:`, error);
//       throw error;
//     }
//   },

//   cancelAppointment: async (id) => {
//     try {
//       const response = await api.delete(`${BASE_URL}/patient/appointments/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur annulation rendez-vous:`, error);
//       throw error;
//     }
//   },

//   // ======================
//   // Dossier Médical & Documents
//   // ======================
//   getDossierMedical: async () => {
//     try {
//       const response = await api.get(`${BASE_URL}/patient/dossier-medical`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur récupération dossier médical:`, error);
//       throw error;
//     }
//   },

//   getOrdonnances: async () => {
//     try {
//       const response = await api.get(`${BASE_URL}/patient/ordonnances`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur récupération ordonnances:`, error);
//       throw error;
//     }
//   },

//   getArretsMaladie: async () => {
//     try {
//       const response = await api.get(`${BASE_URL}/patient/arrets-maladie`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur récupération arrêts maladie:`, error);
//       throw error;
//     }
//   },

//   // ======================
//   // Favoris (Médecins préférés)
//   // ======================
//   getFavorites: async () => {
//     try {
//       const response = await api.get(`${BASE_URL}/favorites`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur récupération favoris:`, error);
//       throw error;
//     }
//   },

//   addFavorite: async (medecinId) => {
//     try {
//       const response = await api.post(`${BASE_URL}/favorites/${medecinId}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur ajout favori:`, error);
//       throw error;
//     }
//   },

//   removeFavorite: async (medecinId) => {
//     try {
//       const response = await api.delete(`${BASE_URL}/favorites/${medecinId}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur suppression favori:`, error);
//       throw error;
//     }
//   },

//   checkIfFavorite: async (medecinId) => {
//     try {
//       const response = await api.get(`${BASE_URL}/favorites/check/${medecinId}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur vérification favori:`, error);
//       throw error;
//     }
//   },

//   // ======================
//   // Avis & Notes (Reviews)
//   // ======================
//   addReview: async (medecinId, data) => {
//     try {
//       const response = await api.post(`${BASE_URL}/medecins/${medecinId}/reviews`, data);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur ajout avis:`, error);
//       throw error;
//     }
//   },

//   updateReview: async (reviewId, data) => {
//     try {
//       const response = await api.put(`${BASE_URL}/reviews/${reviewId}`, data);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur mise à jour avis:`, error);
//       throw error;
//     }
//   },

//   deleteReview: async (reviewId) => {
//     try {
//       const response = await api.delete(`${BASE_URL}/reviews/${reviewId}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur suppression avis:`, error);
//       throw error;
//     }
//   },
};