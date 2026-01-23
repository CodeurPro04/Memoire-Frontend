import React, { useState, useEffect } from 'react';
import { 
    MagnifyingGlassIcon, 
    TrashIcon, 
    EyeIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
    DocumentTextIcon,
    CalendarIcon,
    UserIcon,
    ShieldCheckIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import { prescriptionService } from '../../api/prescriptionService';
import Modal from '../../components/admin/Modal';
import { useToast } from "@/components/ui/use-toast";

export default function PrescriptionsManagement() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [prescriptionToDelete, setPrescriptionToDelete] = useState(null);

    const { toast } = useToast();
    const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, total: 0 });

    useEffect(() => {
        fetchPrescriptions(1);
    }, [searchTerm]);

    const fetchPrescriptions = async (page = 1) => {
        setLoading(true);
        try {
            const data = await prescriptionService.getAllPrescriptions(page, searchTerm);
            setPrescriptions(data.data || []);
            setPagination({
                currentPage: data.current_page,
                lastPage: data.last_page,
                total: data.total
            });
        } catch (error) {
            toast({ variant: "destructive", title: "Erreur", description: "Impossible de charger les ordonnances." });
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!prescriptionToDelete) return;
        try {
            await prescriptionService.deletePrescription(prescriptionToDelete.id);
            toast({ title: "Succès", description: "L'ordonnance a été supprimée." });
            fetchPrescriptions(pagination.currentPage);
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast({ variant: "destructive", title: "Erreur", description: "Échec de la suppression." });
        }
    };

    const formatDate = (date) => new Date(date).toLocaleDateString('fr-FR');

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Gestion des Ordonnances</h1>
                <p className="text-sm text-gray-500">Historique des prescriptions et suivi des assurances.</p>
            </div>

            {/* Recherche */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Rechercher par patient, médecin ou assurance..."
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
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase">Validité</th>
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase">Assurance</th>
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase">Statut</th>
                            <th className="px-6 py-4 text-xs font-bold text-black uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="5" className="py-10 text-center text-gray-400">Chargement...</td></tr>
                        ) : (
                            prescriptions.map((presc) => (
                                <tr key={presc.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-800">{presc.patient?.nom} {presc.patient?.prenom}</span>
                                            <span className="text-xs text-gray-500 italic flex items-center gap-1">
                                                <UserIcon className="w-3 h-3"/> Dr. {presc.medecin?.nom}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-[11px] space-y-1">
                                            <p className="text-gray-600 flex items-center gap-1">
                                                <CalendarIcon className="w-3 h-3"/> Du {formatDate(presc.date_prescription)}
                                            </p>
                                            <p className="text-red-500 flex items-center gap-1 font-semibold">
                                                <ArrowPathIcon className="w-3 h-3"/> Au {formatDate(presc.date_validitedate)}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {presc.bon_assurance ? (
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1">
                                                    <ShieldCheckIcon className="w-3 h-3"/> {presc.organisme_assurance}
                                                </span>
                                                <span className="text-[10px] text-gray-400">{presc.numero_carte_assurance}</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-gray-400 italic">Sans assurance</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase border ${
                                            presc.statut === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                                            presc.statut === 'expiree' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                            'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                            {presc.statut}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => { setSelectedPrescription(presc); setIsDetailsModalOpen(true); }} className="p-2 text-gray-400 hover:text-blue-600"><EyeIcon className="w-5 h-5"/></button>
                                            <button onClick={() => { setPrescriptionToDelete(presc); setIsDeleteModalOpen(true); }} className="p-2 text-gray-400 hover:text-red-600"><TrashIcon className="w-5 h-5"/></button>
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
                        <div className="text-sm text-gray-500">Page {pagination.currentPage} sur {pagination.lastPage}</div>
                        <div className="flex gap-2">
                            <button onClick={() => fetchPrescriptions(pagination.currentPage - 1)} disabled={pagination.currentPage === 1} className="px-3 py-1.5 text-sm bg-white border rounded-lg disabled:opacity-50"><ChevronLeftIcon className="w-4 h-4"/></button>
                            <button onClick={() => fetchPrescriptions(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.lastPage} className="px-3 py-1.5 text-sm bg-white border rounded-lg disabled:opacity-50"><ChevronRightIcon className="w-4 h-4"/></button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Détails */}
            <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Détail de l'ordonnance">
                {selectedPrescription && (
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Instructions médicales</h4>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                {selectedPrescription.instructions || "Aucune instruction saisie."}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 border rounded-lg">
                                <p className="text-[10px] text-gray-400 uppercase">Renouvellements</p>
                                <p className="text-lg font-bold text-blue-600">{selectedPrescription.renouvellements} fois</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                                <p className="text-[10px] text-gray-400 uppercase">Cachet officiel</p>
                                <p className="text-xs font-bold uppercase">{selectedPrescription.avec_cachet ? "✅ Apposé" : "❌ Non présent"}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal Suppression */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Supprimer l'ordonnance">
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 italic">Attention, cette ordonnance ne sera plus accessible pour le patient et le médecin.</p>
                    <div className="flex justify-end gap-3 pt-4">
                        <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg">Annuler</button>
                        <button onClick={handleConfirmDelete} className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg">Confirmer la suppression</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}