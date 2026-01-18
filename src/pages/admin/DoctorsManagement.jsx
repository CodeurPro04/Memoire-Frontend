import React, { useState, useEffect } from 'react';
import { 
    MagnifyingGlassIcon, 
    PlusIcon, 
    PencilSquareIcon, 
    TrashIcon, 
    EyeIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
} from '@heroicons/react/24/outline';
import { medecinService } from '../../api/medecinsService';
import Modal from '../../components/admin/Modal';
import DoctorForm from '../../components/admin/DoctorForm';
import toast from 'react-hot-toast';
import DoctorDetails from '../../components/admin/DoctorDetails';

export default function DoctorsManagement() {
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0
    });

    useEffect(() => {
        fetchDoctors(1);
    }, []);

    const fetchDoctors = async (page = 1) => {
        try {
            const data = await medecinService.getAllMedecins(page);
            setDoctors(data.data || []);
            setPagination({
                currentPage: data.current_page,
                lastPage: data.last_page,
                total: data.total
            });
        } catch (error) {
            console.error("Erreur chargement médecins:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (doctor) => {
        setSelectedDoctor(doctor);
        setIsDetailsModalOpen(true);
    };

    // Filtrage dynamique pour la recherche
    const filteredDoctors = doctors.filter(doc => 
        doc.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
        doc.specialite?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddDoctor = async (formData) => {
        setLoading(true);
        try {
            // On appelle le service de création (assure-toi que cette méthode existe dans medecinService)
            await medecinService.register(formData);
            
            // 1. Fermer le modal
            setIsAddModalOpen(false);
            
            // 2. Rafraîchir la liste pour voir le nouveau médecin (page 1)
            await fetchDoctors(1);
            
            // Optionnel: Ajouter une notification de succès ici (ex: toast)
            toast("Médecin ajouté avec succès !")
            console.log("Médecin ajouté avec succès !");
        } catch (error) {
            console.error("Erreur lors de l'ajout du médecin:", error);
            alert(error.response?.data?.message || "Une erreur est survenue lors de l'enregistrement.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header*/}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Gestion des Médecins</h1>
                    <p className="text-sm text-gray-500">Consultez, modifiez ou supprimez les profils médicaux de la plateforme.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm w-fit">
                    <PlusIcon className="w-5 h-5" />
                    Ajouter un médecin
                </button>
            </div>

            {/* Barre de recherche */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Rechercher par nom ou spécialité..."
                    className="flex-1 outline-none text-sm text-gray-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Tableau des médecins */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase">Médecin</th>
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase">Spécialité</th>
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase">Contact</th>
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase text-center">Expérience</th>
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase">Cliniques</th>
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredDoctors.map((doc) => (
                            <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                            {doc.nom[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">Dr. {doc.prenom} {doc.nom}</p>
                                            <p className="text-xs text-gray-500">Inscrit le {new Date(doc.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium">
                                        {doc.specialite || 'Généraliste'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {doc.email}
                                </td>
                               <td className="px-6 py-4 text-center">
                                    <div className="flex flex-col items-center">
                                        <span className="text-sm font-bold text-gray-700">{doc.experience_years ?? 0} an{(doc.experience_years ?? 0) > 1 ? 's' : ''}</span>
                                        <span className="text-[11px] text-gray-700 uppercase tracking-tighter">d'expertise</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1 max-w-[250px]">
                                        {doc.cliniques && doc.cliniques.length > 0 ? (
                                            doc.cliniques.slice(0, 2).map((clinique) => (
                                                <span key={clinique.id} className="inline-flex items-center px-2 py-0.5 rounded text-[13px] font-medium bg-gray-100 text-black border border-gray-200">
                                                    {clinique.nom}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">A son propre compte</span>
                                        )}
                                        {doc.cliniques?.length > 2 && (
                                            <span className="text-[10px] text-blue-600 font-bold self-center ml-1">
                                                +{doc.cliniques.length - 2} de plus
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div onClick={() => handleViewDetails(doc)} className="flex items-center justify-end gap-2 opacity-0 opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-blue-600 transition-all shadow-sm">
                                            <EyeIcon className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-amber-600 transition-all shadow-sm">
                                            <PencilSquareIcon className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-red-600 transition-all shadow-sm">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                        Page <span className="font-semibold text-gray-800">{pagination.currentPage}</span> sur <span className="font-semibold text-gray-800">{pagination.lastPage}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => fetchDoctors(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1 || loading}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                            Précédent
                        </button>
                        
                        <button 
                            onClick={() => fetchDoctors(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.lastPage || loading}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Suivant
                            <ChevronRightIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                
                {filteredDoctors.length === 0 && !loading && (
                    <div className="py-20 text-center text-gray-400 italic">
                        Aucun médecin trouvé pour cette recherche.
                    </div>
                )}
                <Modal 
                    isOpen={isAddModalOpen} 
                    onClose={() => setIsAddModalOpen(false)} 
                    title="Inscrire un nouveau Médecin"
                >
                    <DoctorForm 
                        onSubmit={handleAddDoctor} 
                        onCancel={() => setIsAddModalOpen(false)}
                        loading={loading}
                    />
                </Modal>

                <Modal 
                    isOpen={isDetailsModalOpen} 
                    onClose={() => setIsDetailsModalOpen(false)} 
                    title="Détails du Profil Médecin"
                >
                    <DoctorDetails doctor={selectedDoctor} />
                </Modal>
            </div>
        </div>
    );
}