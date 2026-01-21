import React, { useState, useEffect } from 'react';
import { 
    MagnifyingGlassIcon, 
    TrashIcon, 
    EyeIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
    BuildingOffice2Icon,
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    PencilSquareIcon
} from '@heroicons/react/24/outline';
import { PlusIcon } from 'lucide-react';

// Services & Composants
import { cliniqueService } from '../../api/cliniquesService';
import Modal from '../../components/admin/Modal';
import { useToast } from "@/components/ui/use-toast";
import EditCliniqueForm from '../../components/admin/cliniques/EditCliniqueForm';
import CliniqueCreateForm from '../../components/admin/cliniques/CliniqueForm';
import CliniqueDetails from '../../components/admin/cliniques/CliniqueDetails';

export default function CliniquesManagement() {
    const [cliniques, setCliniques] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    
    const [selectedClinique, setSelectedClinique] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [cliniqueToDelete, setCliniqueToDelete] = useState(null);

    const { toast } = useToast();

    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0
    });

    useEffect(() => {
    fetchCliniques(pagination.currentPage);
}, [searchTerm, pagination.currentPage]);

    const fetchCliniques = async (page = 1) => {
        setLoading(true);
        try {
            const data = await cliniqueService.getAllCliniques(page, searchTerm);
            const cliniquesList = data.data || data; 
            setCliniques(cliniquesList);
            
            if (data.current_page) {
                setPagination({
                    currentPage: data.current_page,
                    lastPage: data.last_page,
                    total: data.total
                });
            }
        } catch (error) {
            console.error("Erreur chargement cliniques:", error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de charger la liste des établissements.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAdd = () => {
        setSelectedClinique(null);
        setIsAddModalOpen(true);
    };

    const handleAddClinique = async (formData) => {
        setActionLoading(true);
        try {
            await cliniqueService.register(formData);
            toast({ title: "Succès", description: "La clinique a été enregistrée." });
            setIsAddModalOpen(false);
            fetchCliniques(1);
        } catch (error) {
            toast({ 
                variant: "destructive", 
                title: "Erreur", 
                description: error.response?.data?.message || "Vérifiez les données saisies." 
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleEditClick = (clinique) => {
        setSelectedClinique(clinique);
        setIsEditModalOpen(true);
    };

    const handleUpdateClinique = async (formData) => {
        setActionLoading(true);
        try {
            await cliniqueService.updateClinique(formData);
            toast({ title: "Succès", description: "Établissement mis à jour." });
            setIsEditModalOpen(false);
            fetchCliniques(pagination.currentPage);
        } catch (error) {
            toast({ variant: "destructive", title: "Erreur", description: "Échec de la modification." });
        } finally {
            setActionLoading(false);
        }
    };

    const openDeleteConfirm = (clinique) => {
        setCliniqueToDelete(clinique);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!cliniqueToDelete) return;
        setLoading(true);
        setIsDeleteModalOpen(false);
        try {
            await cliniqueService.deleteClinique(cliniqueToDelete.id);
            toast({ title: "Succès", description: `${cliniqueToDelete.nom} a été supprimée.` });
            fetchCliniques(pagination.currentPage); 
        } catch (error) {
            toast({ variant: "destructive", title: "Erreur", description: "Échec de la suppression." });
        } finally {
            setLoading(false);
            setCliniqueToDelete(null);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header - Identique Page 2 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Gestion des Cliniques</h1>
                    <p className="text-sm text-gray-500">Supervisez les établissements partenaires enregistrés.</p>
                </div>
                <button 
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm w-fit font-semibold"
                >
                    <PlusIcon className="w-5 h-5" />
                    Ajouter une clinique
                </button>
            </div>

            {/* Recherche - Identique Page 2 */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Rechercher une clinique..."
                    className="flex-1 outline-none text-sm text-gray-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Tableau - Identique Page 2 */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase">Établissement</th>
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase">Email</th>
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase">Localisation</th>
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase">Contact</th>
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="4" className="py-10 text-center text-gray-400 italic">Chargement...</td></tr>
                        ) : (
                        cliniques.map((clinique) => (
                            <tr key={clinique.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {/* <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                                            <BuildingOffice2Icon className="w-6 h-6" />
                                        </div> */}
                                        <span className="text-sm font-semibold text-gray-800">{clinique.nom}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        {clinique.email || <span className="text-red-400 italic">Non définie</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        {clinique.address || <span className="text-red-400 italic">Non définie</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">{clinique.telephone}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => {
                                                setSelectedClinique(clinique);
                                                setIsDetailsModalOpen(true);
                                            }} 
                                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                            title="Voir les détails"
                                        >
                                            <EyeIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleEditClick(clinique)} className="p-2 text-gray-400 hover:text-amber-600 transition-colors">
                                            <PencilSquareIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => openDeleteConfirm(clinique)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                        )}
                    </tbody>
                </table>

                {/* Pagination - Identique Page 2 */}
                {!loading && pagination.lastPage > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <div className="text-sm text-gray-500">
                            Page <span className="font-semibold text-gray-800">{pagination.currentPage}</span> sur <span className="font-semibold text-gray-800">{pagination.lastPage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                                disabled={pagination.currentPage === 1 || loading}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                <ChevronLeftIcon className="w-4 h-4" /> Précédent
                            </button>

                            <button 
                                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                                disabled={pagination.currentPage === pagination.lastPage || loading}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                Suivant <ChevronRightIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Modal d'Ajout */}
                <Modal 
                    isOpen={isAddModalOpen} 
                    onClose={() => setIsAddModalOpen(false)} 
                    title="Enregistrer une nouvelle clinique"
                >
                    <CliniqueCreateForm 
                        onSubmit={handleAddClinique} 
                        onCancel={() => setIsAddModalOpen(false)} 
                        loading={actionLoading} 
                    />
                </Modal>

                {/* Modal de Suppression - Design Page 2 */}
                <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Supprimer l'établissement">
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Êtes-vous sûr de vouloir supprimer la clinique : <br/>
                            <span className="font-bold text-gray-800">{cliniqueToDelete?.nom}</span> ? <br/>
                            Cette action est <span className="text-red-600 font-bold uppercase">irréversible</span>.
                        </p>
                        <div className="flex justify-end gap-3 pt-4">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">
                                Annuler
                            </button>
                            <button onClick={handleConfirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm transition-colors">
                                Confirmer la suppression
                            </button>
                        </div>
                    </div>
                </Modal>

                {/* Modal Édition */}
                <Modal 
                    isOpen={isEditModalOpen} 
                    onClose={() => setIsEditModalOpen(false)} 
                    title="Modifier l'établissement"
                >
                    <EditCliniqueForm 
                        clinique={selectedClinique}
                        onSubmit={handleUpdateClinique}
                        onCancel={() => setIsEditModalOpen(false)}
                        loading={actionLoading}
                    />
                </Modal>

                {/* Modal des détails */}
                <Modal 
                    isOpen={isDetailsModalOpen} 
                    onClose={() => setIsDetailsModalOpen(false)} 
                    title="Dossier de l'établissement"
                >
                    <CliniqueDetails clinique={selectedClinique} />
                </Modal>
            </div>
        </div>
    );
}