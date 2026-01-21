import React, { useState, useEffect } from 'react';
import { 
    MagnifyingGlassIcon, 
    TrashIcon, 
    EyeIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
    UserIcon,
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    PencilSquareIcon
} from '@heroicons/react/24/outline';
import { patientService } from '../../api/patientsService';
import Modal from '../../components/admin/Modal';
import { useToast } from "@/components/ui/use-toast";
import PatientDetails from '../../components/admin/patients/PatientDetails';
import { PlusIcon } from 'lucide-react';
import PatientCreateForm from '../../components/admin/patients/PatientForm';
import EditPatientForm from '../../components/admin/patients/EditPatientForm';

export default function PatientsManagement() {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { toast } = useToast();

    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0
    });

    useEffect(() => {
        fetchPatients(1);
    }, [searchTerm]);

    const fetchPatients = async (page = 1) => {
        setLoading(true);
        try {
            const data = await patientService.getAllPatients(page, searchTerm);
            const patientsList = data.data || data; 
            setPatients(patientsList);
            
            if (data.current_page) {
                setPagination({
                    currentPage: data.current_page,
                    lastPage: data.last_page,
                    total: data.total
                });
            }
        } catch (error) {
            console.error("Erreur chargement patients:", error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de charger la liste des patients.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAdd = () => {
        setSelectedPatient(null);
        setIsAddModalOpen(true);
    };

    const handleAddPatient = async (formData) => {
        setActionLoading(true);
        try {
            await patientService.registerPatient(formData);
            toast({ title: "Succès", description: "Le compte patient a été créé avec succès." });
            setIsAddModalOpen(false);
            fetchPatients(1);
        } catch (error) {
            toast({ 
                variant: "destructive", 
                title: "Échec de création", 
                description: error.response?.data?.message || "Vérifiez les informations saisies." 
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleEditClick = (patient) => {
        setSelectedPatient(patient);
        setIsEditModalOpen(true);
    };

    const handleUpdatePatient = async (formData) => {
        setLoading(true);
        try {
            // On s'assure que l'ID est inclus dans les données envoyées
            await patientService.updatePatient(formData);
            
            toast({
                title: "Succès",
                description: "Le dossier du patient a été mis à jour avec succès.",
            });
            
            setIsEditModalOpen(false); // Fermer le modal
            fetchPatients(pagination.currentPage); // Rafraîchir la liste
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error.response?.data?.message || "Erreur lors de la modification.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (patient) => {
        setSelectedPatient(patient);
        setIsDetailsModalOpen(true);
    };

    const openDeleteConfirm = (patient) => {
        setPatientToDelete(patient);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!patientToDelete) return;
        setLoading(true);
        setIsDeleteModalOpen(false);

        try {
            await patientService.deletePatient(patientToDelete.id);
            toast({
                title: "Succès",
                description: `Le dossier de ${patientToDelete.nom ?? 'Patient'} a été supprimé.`,
            });
            fetchPatients(pagination.currentPage); 
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Échec de la suppression.",
            });
        } finally {
            setLoading(false);
            setPatientToDelete(null);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Gestion des Patients</h1>
                    <p className="text-sm text-gray-500">Visualisez et gérez les informations des patients.</p>
                </div>
                <button 
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm w-fit"
                >
                    <PlusIcon className="w-5 h-5" />
                    Ajouter un patient
                </button>
            </div>

            {/* Recherche */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Rechercher..."
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
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase">Patient</th>
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase">Email</th>
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase">Téléphone</th>
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase">Adresse</th>
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="py-10 text-center text-gray-400">Chargement...</td>
                            </tr>
                        ) : (
                        patients.map((patient) => (
                            <tr key={patient.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {/* <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">
                                            {patient.nom ? patient.nom[0] : <UserIcon className="w-5 h-5" />}
                                        </div> */}
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">
                                                {patient.nom || patient.prenom ? `${patient.nom || 'nom non défini'} ${patient.prenom || 'prénom non défini'}` : 'Identité non définie'}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        {patient.email || <span className="text-red-400 italic">Email non défini</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        {patient.telephone || <span className="text-red-400 italic">Téléphone non défini</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 max-w-[200px] whitespace-normal break-words">
                                        {patient.address || <span className="text-red-400 italic">Adresse non définie</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => handleViewDetails(patient)}
                                            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-blue-600 transition-all shadow-sm"
                                            title="Voir détails"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleEditClick(patient)} className="p-2 text-gray-400 hover:text-amber-600 transition-colors" title="Modifier">
                                            <PencilSquareIcon className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => openDeleteConfirm(patient)}
                                            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-red-600 transition-all shadow-sm"
                                            title="Supprimer"
                                        >
                                            <TrashIcon className="w-4 h-4" />
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
                                onClick={() => fetchPatients(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === 1 || loading}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                <ChevronLeftIcon className="w-4 h-4" /> Précédent
                            </button>
                            <button 
                                onClick={() => fetchPatients(pagination.currentPage + 1)}
                                disabled={pagination.currentPage === pagination.lastPage || loading}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                Suivant <ChevronRightIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                <Modal 
                    isOpen={isAddModalOpen} 
                    onClose={() => setIsAddModalOpen(false)} 
                    title="Inscrire un nouveau patient"
                >
                    <PatientCreateForm
                        onSubmit={handleAddPatient} 
                        onCancel={() => setIsAddModalOpen(false)} 
                        loading={actionLoading} 
                    />
                </Modal>

                {/* Modal de suppression */}
                <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Supprimer le compte patient">
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Êtes-vous sûr de vouloir supprimer définitivement le patient : <br/>
                            <span className="font-bold text-gray-800">
                                {patientToDelete?.nom || 'nom non défini'} {patientToDelete?.prenom || 'prénom non défini'}
                            </span> ? <br/>
                            Cette action est <span className="text-red-600 font-bold uppercase">irréversible</span>.
                        </p>
                        <div className="flex justify-end gap-3 pt-4">
                            <button 
                                onClick={() => setIsDeleteModalOpen(false)} 
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Annuler
                            </button>
                            <button 
                                onClick={handleConfirmDelete} 
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm transition-colors"
                            >
                                Confirmer la suppression
                            </button>
                        </div>
                    </div>
                </Modal>

                <Modal 
                    isOpen={isDetailsModalOpen} 
                    onClose={() => setIsDetailsModalOpen(false)} 
                    title="Dossier Administratif du Patient"
                >
                    <PatientDetails patient={selectedPatient} />
                </Modal>

                <Modal 
                    isOpen={isEditModalOpen} 
                    onClose={() => setIsEditModalOpen(false)} 
                    title="Modifier le dossier patient"
                >
                    <EditPatientForm 
                        patient={selectedPatient}
                        onSubmit={handleUpdatePatient}
                        onCancel={() => setIsEditModalOpen(false)}
                        loading={loading}
                    />
                </Modal>
            </div>
        </div>
    );
}