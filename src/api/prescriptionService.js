import api from './axios';

export const prescriptionService = {
    getAllPrescriptions: async (page = 1, search = "") => {
        const response = await api.get(`/admin/prescriptions`, { params: { page, search } });
        return response.data;
    },
    deletePrescription: async (id) => {
        return await api.delete(`/admin/prescriptions/${id}`);
    }
};