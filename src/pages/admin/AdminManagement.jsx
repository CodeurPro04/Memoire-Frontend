import React, { useState, useEffect } from 'react';
import { 
    MagnifyingGlassIcon, 
    TrashIcon, 
    PencilSquareIcon,
    ShieldCheckIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import { PlusIcon } from 'lucide-react'; // Importé pour le bouton d'ajout

// Services & Composants
import { authService } from '../../api/authService'; 
import Modal from '../../components/admin/Modal';
import { useToast } from "@/components/ui/use-toast";
import AdminDetails from '../../components/admin/admin/AdminDetails';
import AdminForm from '../../components/admin/admin/AdminForm';
import EditAdminForm from '../../components/admin/admin/EditAdminForm';

export default function AdministrateursManagement() {
    const [admins, setAdmins] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState(null);

    const { toast } = useToast();

    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0
    });

    useEffect(() => {
        fetchAdmins(pagination.currentPage);
    }, [searchTerm, pagination.currentPage]);

    const fetchAdmins = async (page = 1) => {
        setLoading(true);
        try {
            const response = await authService.getAllUsers();
            // Si votre API Laravel renvoie une pagination classique :
            if (response.data && Array.isArray(response.data)) {
                setAdmins(response.data);
                setPagination({
                    currentPage: response.current_page || 1,
                    lastPage: response.last_page || 1,
                    total: response.total || response.data.length
                });
            } else {
                // Si l'API renvoie juste un tableau simple
                setAdmins(response);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de charger la liste des administrateurs.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterAdmin = async (formData) => {
        setActionLoading(true);
        try {
            await authService.registerAdmin(formData);
            toast({
                title: "Succès !",
                description: `Le compte de ${formData.name} a été créé avec succès.`,
            });
            setIsAddModalOpen(false); // Fermer le modal
            fetchAdmins(1); // Rafraîchir la liste
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur lors de la création",
                description: error.response?.data?.message || "Une erreur est survenue.",
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!adminToDelete) return;
        setLoading(true);
        try {
            await authService.deleteUser(adminToDelete.id);
            
            toast({
                title: "Succès",
                description: "L'utilisateur a été supprimé avec succès.",
            });
            
            setIsDeleteModalOpen(false);
            fetchAdmins(pagination.currentPage);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de supprimer cet utilisateur.",
            });
        } finally {
            setLoading(false);
            setAdminToDelete(null);
        }
    };

    const handleUpdateAdmin = async (formData) => {
        setActionLoading(true);
        try {
            // formData contient les nouvelles valeurs, selectedAdmin.id contient l'ID
            await authService.updateUser({ ...formData, id: selectedAdmin.id });
            
            toast({
                title: "Mise à jour réussie",
                description: `Le profil de ${formData.name} a été modifié.`,
            });
            
            setIsEditModalOpen(false);
            fetchAdmins(pagination.currentPage); // Rafraîchir la liste
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error.response?.data?.message || "Échec de la modification.",
            });
        } finally {
            setActionLoading(false);
        }
    };

    // Filtrage local pour la recherche immédiate
    const filteredAdmins = admins.filter(admin => 
        admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Équipe Administrative</h1>
                    <p className="text-sm text-gray-500">Gérez les accès et les comptes du personnel administratif.</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)} 
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm w-fit font-semibold"
                >
                    <PlusIcon className="w-5 h-5" />
                    Ajouter un administrateur
                </button>
            </div>

            {/* Barre de Recherche */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Rechercher par email ou nom..."
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
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase">Nom</th>
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase">Email</th>
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="3" className="py-10 text-center text-gray-400 italic">Chargement des données...</td></tr>
                        ) : filteredAdmins.length === 0 ? (
                            <tr><td colSpan="3" className="py-10 text-center text-gray-400">Aucun utilisateur trouvé.</td></tr>
                        ) : (
                            filteredAdmins.map((admin) => (
                                <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {/* <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                                                {admin.name?.charAt(0) || <ShieldCheckIcon className="w-5 h-5" />}
                                            </div> */}
                                            <span className="text-sm font-semibold text-gray-800">
                                                {admin.name} {admin.prenom || ""}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">{admin.email}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => { setSelectedAdmin(admin); setIsDetailsModalOpen(true); }}
                                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                title="Voir détails"
                                            >
                                                <EyeIcon className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => { setSelectedAdmin(admin); setIsEditModalOpen(true); }}
                                                className="p-2 text-gray-400 hover:text-amber-600 transition-colors"
                                            >
                                                <PencilSquareIcon className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => { setAdminToDelete(admin); setIsDeleteModalOpen(true); }}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
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

                {/* Pagination (visible si nécessaire) */}
                {!loading && pagination.lastPage > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <div className="text-sm text-gray-500 font-medium">
                            Page <span className="font-bold text-gray-800">{pagination.currentPage}</span> sur <span className="font-bold text-gray-800">{pagination.lastPage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                                disabled={pagination.currentPage === 1}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
                            >
                                <ChevronLeftIcon className="w-4 h-4" /> Précédent
                            </button>
                            <button 
                                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                                disabled={pagination.currentPage === pagination.lastPage}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
                            >
                                Suivant <ChevronRightIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Modal Détails */}
                <Modal 
                    isOpen={isDetailsModalOpen} 
                    onClose={() => setIsDetailsModalOpen(false)} 
                    title="Dossier Administrateur"
                >
                    <AdminDetails admin={selectedAdmin} />
                </Modal>


                {/* Modal de Modification */}
                <Modal 
                    isOpen={isEditModalOpen} 
                    onClose={() => setIsEditModalOpen(false)} 
                    title="Modifier l'administrateur"
                >
                    <EditAdminForm 
                        admin={selectedAdmin} 
                        onSubmit={handleUpdateAdmin} 
                        onCancel={() => setIsEditModalOpen(false)} 
                        loading={actionLoading} 
                    />
                </Modal>

                {/* Modal de Suppression */}
                <Modal 
                    isOpen={isDeleteModalOpen} 
                    onClose={() => setIsDeleteModalOpen(false)} 
                    title="Confirmation de suppression"
                >
                    <div className="space-y-4">
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                            <p className="text-sm text-red-800">
                                Êtes-vous sûr de vouloir supprimer <strong>{adminToDelete?.name}</strong> ? 
                                Cette action est irréversible.
                            </p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg">
                                Annuler
                            </button>
                            <button onClick={handleConfirmDelete} className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-md">
                                Supprimer définitivement
                            </button>
                        </div>
                    </div>
                </Modal>

                {/* Modal d'Ajout */}
                <Modal 
                    isOpen={isAddModalOpen} 
                    onClose={() => setIsAddModalOpen(false)} 
                    title="Nouvel Administrateur"
                >
                    <AdminForm 
                        onSubmit={handleRegisterAdmin} 
                        onCancel={() => setIsAddModalOpen(false)} 
                        loading={actionLoading} 
                    />
                </Modal>
            </div>
        </div>
    );
}