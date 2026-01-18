import api from "./axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const medecinService = {
  // ======================
  // Authentification
  // ======================
//   register: async (data) => {
//     try {
//       const response = await api.post(`${BASE_URL}/medecin/register`, data);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur inscription médecin:`, error);
//       throw error;
//     }
//   },

//   login: async (credentials) => {
//     try {
//       const response = await api.post(`${BASE_URL}/medecin/login`, credentials);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur connexion médecin:`, error);
//       throw error;
//     }
//   },

  // ======================
  // Profil & Paramètres
  // ======================
//   getProfile: async () => {
//     try {
//       const response = await api.get(`${BASE_URL}/medecin/profile`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur récupération profil médecin:`, error);
//       throw error;
//     }
//   },

//   updateProfile: async (data) => {
//     try {
//       const response = await api.put(`${BASE_URL}/medecin/profile`, data);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur mise à jour profil médecin:`, error);
//       throw error;
//     }
//   },

//   updatePassword: async (data) => {
//     try {
//       const response = await api.put(`${BASE_URL}/medecin/profile/password`, data);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur changement mot de passe médecin:`, error);
//       throw error;
//     }
//   },

//   updatePhoto: async (formData) => {
//     try {
//       const response = await api.post(`${BASE_URL}/medecin/profile/photo`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur mise à jour photo médecin:`, error);
//       throw error;
//     }
//   },

//   updateWorkingHours: async (hours) => {
//     try {
//       const response = await api.put(`${BASE_URL}/medecin/working-hours`, hours);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur mise à jour horaires:`, error);
//       throw error;
//     }
//   },

//   deleteAccount: async () => {
//     try {
//       const response = await api.delete(`${BASE_URL}/medecin/profile`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur suppression compte médecin:`, error);
//       throw error;
//     }
//   },

  // ======================
  // Listes Globales (Public/Admin)
  // ======================
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
  }

//   getMedecinById: async (id) => {
//     try {
//       const response = await api.get(`${BASE_URL}/medecins/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur lors de la récupération du médecin ${id}:`, error);
//       throw error;
//     }
//   },

//   // ======================
//   // Gestion des Rendez-vous
//   // ======================
//   getAppointments: async () => {
//     try {
//       const response = await api.get(`${BASE_URL}/medecin/appointments`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur récupération rendez-vous:`, error);
//       throw error;
//     }
//   },

//   getAppointmentById: async (id) => {
//     try {
//       const response = await api.get(`${BASE_URL}/medecin/appointments/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur récupération détail rendez-vous:`, error);
//       throw error;
//     }
//   },

//   confirmAppointment: async (id) => {
//     try {
//       const response = await api.patch(`${BASE_URL}/medecin/appointments/${id}/confirm`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur confirmation rendez-vous:`, error);
//       throw error;
//     }
//   },

//   rejectAppointment: async (id) => {
//     try {
//       const response = await api.patch(`${BASE_URL}/medecin/appointments/${id}/reject`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur rejet rendez-vous:`, error);
//       throw error;
//     }
//   },

//   // ======================
//   // Fonctionnalités Médicales
//   // ======================
//   getPatientDossier: async (patientId) => {
//     try {
//       const response = await api.get(`${BASE_URL}/medecin/dossier-medical/${patientId}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur récupération dossier patient:`, error);
//       throw error;
//     }
//   },

//   getOrdonnances: async () => {
//     try {
//       const response = await api.get(`${BASE_URL}/medecin/ordonnances`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur récupération ordonnances:`, error);
//       throw error;
//     }
//   },

//   createOrdonnance: async (data) => {
//     try {
//       const response = await api.post(`${BASE_URL}/medecin/ordonnances`, data);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur création ordonnance:`, error);
//       throw error;
//     }
//   },

//   getArretsMaladie: async () => {
//     try {
//       const response = await api.get(`${BASE_URL}/medecin/arrets-maladie`);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur récupération arrêts maladie:`, error);
//       throw error;
//     }
//   },

//   createArretMaladie: async (data) => {
//     try {
//       const response = await api.post(`${BASE_URL}/medecin/arrets-maladie`, data);
//       return response.data;
//     } catch (error) {
//       console.error('Erreur création arrêt maladie:', error);
//       throw error;
//     }
//   },

//   shareMedicalRecord: async (data) => {
//     try {
//       const response = await api.post(`${BASE_URL}/medecin/share-medical-record`, data);
//       return response.data;
//     } catch (error) {
//       console.error(`Erreur partage dossier médical:`, error);
//       throw error;
//     }
//   },
};