import React, { useState, useEffect } from 'react';
import { 
    UserIcon, 
    BuildingOfficeIcon, 
    MagnifyingGlassIcon, 
    ChevronDownIcon, 
} from '@heroicons/react/24/outline';
import { cliniqueService } from '../../../api/cliniquesService';
import { SPECIALITES } from '../../../constants/specialties';

export default function DoctorForm({ onSubmit, onCancel, loading, initialData }) {
    const [formData, setFormData] = useState({
        prenom: initialData?.prenom || "",
        nom: initialData?.nom || "",
        email: initialData?.email || "",
        password: initialData ? "" : "Password123!",
        telephone: initialData?.telephone || "",
        specialite: initialData?.specialite || "",
        address: initialData?.address || "",
        type: initialData?.type || "independent",
        clinique_id: initialData?.cliniques?.[0]?.id || "",
        fonction: initialData?.fonction || ""
    });

    const [cliniques, setCliniques] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSpecDropdown, setShowSpecDropdown] = useState(false);
    const [searchClinique, setSearchClinique] = useState("");
    const [showCliniqueDropdown, setShowCliniqueDropdown] = useState(false);

    useEffect(() => {
        const loadCliniques = async () => {
            try {
                const res = await cliniqueService.getAllCliniques();
                setCliniques(Array.isArray(res) ? res : res.data || []);
            } catch (err) { console.error("Erreur cliniques:", err); }
        };
        loadCliniques();
    }, []);

    // Filtrages
    const filteredSpecialties = SPECIALITES.filter(s => 
        s.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCliniques = cliniques.filter(c => 
        c.nom.toLowerCase().includes(searchClinique.toLowerCase())
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const selectSpecialty = (spec) => {
        setFormData(prev => ({ ...prev, specialite: spec }));
        setShowSpecDropdown(false);
        setSearchTerm("");
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-5">
            
            {/* Prénom & Nom */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Prénom</label>
                    <input 
                        name="prenom" required onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        placeholder="Jean"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nom</label>
                    <input 
                        name="nom" required onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        placeholder="Dupont"
                    />
                </div>
            </div>

            {/* Email & Téléphone */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email</label>
                    <input 
                        type="email" name="email" required onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        placeholder="dr.dupont@mail.com"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Téléphone</label>
                    <input 
                        name="telephone" required onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        placeholder="+225 07..."
                    />
                </div>
            </div>

            {/* Spécialité avec recherche (Design Inscription) */}
            <div className="relative space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Spécialité *</label>
                <div 
                    onClick={() => setShowSpecDropdown(!showSpecDropdown)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm flex justify-between items-center cursor-pointer hover:border-blue-400 transition-colors"
                >
                    <span className={formData.specialite ? "text-gray-900" : "text-gray-400"}>
                        {formData.specialite || "Rechercher une spécialité..."}
                    </span>
                    <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
                </div>

                {showSpecDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <input 
                            className="w-full p-3 border-b border-gray-100 outline-none text-sm bg-gray-50"
                            placeholder="Tapez pour filtrer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                        <div className="max-h-48 overflow-y-auto">
                            {filteredSpecialties.map(s => (
                                <div 
                                    key={s} onClick={() => selectSpecialty(s)}
                                    className="px-4 py-2.5 text-sm hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                                >
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Type de Pratique (Design Inscription avec les Cartes) */}
            <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Type de pratique *</label>
                <div className="grid grid-cols-2 gap-3">
                    <div 
                        onClick={() => setFormData(p => ({...p, type: 'independant', clinique_id: ""}))}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${formData.type === 'independant' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                        <div className={`p-2 rounded-lg ${formData.type === 'independant' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                            <UserIcon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold">Indépendant</span>
                    </div>

                    <div 
                        onClick={() => setFormData(p => ({...p, type: 'clinique'}))}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${formData.type === 'clinique' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                        <div className={`p-2 rounded-lg ${formData.type === 'clinique' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                            <BuildingOfficeIcon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold">En Clinique</span>
                    </div>
                </div>
            </div>

            {/* Sélecteur de Clinique dynamique */}
            {formData.type === 'clinique' && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Choisir l'établissement</label>
                    <div className="relative">
                        <div 
                            onClick={() => setShowCliniqueDropdown(!showCliniqueDropdown)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm flex justify-between items-center cursor-pointer"
                        >
                            <span className={formData.clinique_id ? "text-gray-900" : "text-gray-400"}>
                                {formData.clinique_id ? cliniques.find(c => c.id === formData.clinique_id)?.nom : "Sélectionner une clinique..."}
                            </span>
                            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                        </div>
                        {showCliniqueDropdown && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                                {filteredCliniques.map(c => (
                                    <div 
                                        key={c.id} 
                                        onClick={() => { setFormData(p => ({...p, clinique_id: c.id})); setShowCliniqueDropdown(false); }}
                                        className="px-4 py-2.5 text-sm hover:bg-blue-50 cursor-pointer border-b border-gray-50"
                                    >
                                        <p className="font-medium">{c.nom}</p>
                                        <p className="text-[10px] text-gray-400">{c.address}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Adresse */}
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Adresse locale</label>
                <input 
                    name="address" required onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
                    placeholder="Ex: Abidjan, Cocody"
                />
            </div>

            {/* Actions */}
            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button 
                    type="button" onClick={onCancel}
                    className="px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                >
                    Annuler
                </button>
                <button 
                    type="submit" disabled={loading}
                    className="px-8 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 transition-all"
                >
                    {loading ? "Chargement..." : initialData ? "Mettre à jour" : "Enregistrer le médecin"}
                </button>
            </div>
        </form>
    );
}