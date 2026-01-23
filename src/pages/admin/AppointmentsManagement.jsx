import React, { useState, useEffect } from 'react';
import { 
    MagnifyingGlassIcon, 
    TrashIcon, 
    EyeIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
    CalendarIcon,
    ClockIcon,
    UserIcon,
    VideoCameraIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';
import { appointmentService } from '../../api/appointmentService';
import Modal from '../../components/admin/Modal';
import { useToast } from "@/components/ui/use-toast";
import { PlusIcon } from 'lucide-react';

// Note: Vous devrez créer ce composant pour afficher le détail complet
// import AppointmentDetails from '../../components/admin/appointments/AppointmentDetails';

export default function AppointmentsManagement() {
    const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState(null);

    const { toast } = useToast();

    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0
    });

    useEffect(() => {
        fetchAppointments(1);
    }, [searchTerm]);

    const fetchAppointments = async (page = 1) => {
        setLoading(true);
        try {
            const data = await appointmentService.getAllAppointments(page, searchTerm);
            setAppointments(data.data || []);
            
            if (data.current_page) {
                setPagination({
                    currentPage: data.current_page,
                    lastPage: data.last_page,
                    total: data.total
                });
            }
        } catch (error) {
            console.error("Erreur chargement rendez-vous:", error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de charger la liste des rendez-vous.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (appointment) => {
        setSelectedAppointment(appointment);
        setIsDetailsModalOpen(true);
    };

    const openDeleteConfirm = (appointment) => {
        setAppointmentToDelete(appointment);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!appointmentToDelete) return;
        setLoading(true);
        setIsDeleteModalOpen(false);

        try {
            // Assurez-vous d'avoir cette méthode dans votre service
            await appointmentService.deleteAppointment(appointmentToDelete.id);
            toast({
                title: "Succès",
                description: "Le rendez-vous a été annulé et supprimé.",
            });
            fetchAppointments(pagination.currentPage); 
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Échec de la suppression.",
            });
        } finally {
            setLoading(false);
            setAppointmentToDelete(null);
        }
    };

    // Formattage de la date en français
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Gestion des Rendez-vous</h1>
                    <p className="text-sm text-gray-500">Suivi des consultations et des modes de prise en charge.</p>
                </div>
            </div>

            {/* Recherche */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Rechercher un patient ou un médecin..."
                    className="flex-1 outline-none text-sm text-gray-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Tableau */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase">Patient / Médecin</th>
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase">Date & Heure</th>
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase">Mode</th>
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase">Statut</th>
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="5" className="py-10 text-center text-gray-400">Chargement...</td></tr>
                        ) : (
                        appointments.map((apt) => (
                            <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <p className="text-sm font-bold text-gray-800 flex items-center gap-1">
                                            <UserIcon className="w-3 h-3 text-blue-500"/>
                                            {apt.patient?.nom} {apt.patient?.prenom}
                                        </p>
                                        <p className="text-xs text-gray-500 italic">
                                            Dr. {apt.medecin?.nom} ({apt.medecin?.specialite})
                                        </p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-gray-400"/> {formatDate(apt.date)}</p>
                                        <p className="flex items-center gap-2 font-medium text-gray-800"><ClockIcon className="w-4 h-4 text-gray-400"/> {apt.time?.substring(0,5)}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                        apt.consultation_mode === 'telemedicine' 
                                        ? 'bg-purple-50 text-purple-700 border border-purple-100' 
                                        : 'bg-blue-50 text-blue-700 border border-blue-100'
                                    }`}>
                                        {apt.consultation_mode === 'telemedicine' ? <VideoCameraIcon className="w-3 h-3"/> : <MapPinIcon className="w-3 h-3"/>}
                                        {apt.consultation_mode}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-green-100 text-green-700 border border-green-200">
                                        {apt.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => handleViewDetails(apt)}
                                            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-blue-600 transition-all shadow-sm"
                                        >
                                            <EyeIcon className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => openDeleteConfirm(apt)}
                                            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-red-600 transition-all shadow-sm"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {!loading && pagination.lastPage > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <div className="text-sm text-gray-500">
                            Page <span className="font-semibold text-gray-800">{pagination.currentPage}</span> sur <span className="font-semibold text-gray-800">{pagination.lastPage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => fetchAppointments(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === 1 || loading}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                <ChevronLeftIcon className="w-4 h-4" /> Précédent
                            </button>
                            <button 
                                onClick={() => fetchAppointments(pagination.currentPage + 1)}
                                disabled={pagination.currentPage === pagination.lastPage || loading}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                Suivant <ChevronRightIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Modal de suppression */}
                <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Annuler le rendez-vous">
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Voulez-vous vraiment annuler le RDV du <span className="font-bold">{selectedAppointment && formatDate(selectedAppointment.date)}</span> pour <br/>
                            <span className="font-bold text-gray-800">
                                {selectedAppointment?.patient?.nom} {selectedAppointment?.patient?.prenom}
                            </span> ?
                        </p>
                        <div className="flex justify-end gap-3 pt-4">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">
                                Garder
                            </button>
                            <button onClick={handleConfirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm transition-colors">
                                Confirmer l'annulation
                            </button>
                        </div>
                    </div>
                </Modal>

                {/* Modal de Détails */}
                <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Détails du Rendez-vous">
                    <div className="p-4 text-center text-gray-500 italic">
                        {/* Vous pouvez créer un composant AppointmentDetails ici */}
                        L'ID de la salle vidéo : {selectedAppointment?.video_room_id || 'N/A'}
                    </div>
                </Modal>
            </div>
        </div>
    );
}