import React, { useState, useEffect } from 'react';
import { 
    UserIcon, BuildingOfficeIcon, MagnifyingGlassIcon,
    ChevronDownIcon, BriefcaseIcon, BanknotesIcon, 
    GlobeAltIcon, BookOpenIcon, PhoneIcon, MapPinIcon, 
    ShieldCheckIcon, ClockIcon, PlusIcon, TrashIcon
} from '@heroicons/react/24/outline';
import { cliniqueService } from '../../../api/cliniquesService';
import { SPECIALITES } from '../../../constants/specialties';

export default function EditDoctorForm({ doctor, onSubmit, onCancel, loading }) {
    const initialWorkingHours = () => {
        let hours = doctor?.working_hours;
        
        // Si c'est une chaîne de caractères (à cause du bug de stockage), on la parse
        if (typeof hours === 'string') {
            try {
                hours = JSON.parse(hours);
                // Si après le premier parse c'est encore une string, on re-parse (cas du double encodage)
                if (typeof hours === 'string') hours = JSON.parse(hours);
            } catch (e) {
                hours = [];
            }
        }
        
        return Array.isArray(hours) ? hours : [];
    };
    // Initialisation avec tous les champs manquants
    const [formData, setFormData] = useState({
        prenom: doctor?.prenom || "",
        nom: doctor?.nom || "",
        email: doctor?.email || "",
        telephone: doctor?.telephone || "",
        specialite: doctor?.specialite || "",
        address: doctor?.address || "",
        experience_years: doctor?.experience_years || 0,
        consultation_price: doctor?.consultation_price || 0,
        bio: doctor?.bio || "",
        languages: String(doctor?.languages || ""),
        professional_background: doctor?.professional_background || "",
        insurance_accepted: doctor?.insurance_accepted || false,
        working_hours: initialWorkingHours(),
        type: doctor?.type || "independant",
        clinique_id: doctor?.clinique_id || (doctor?.cliniques?.[0]?.id || ""),
        fonction: doctor?.fonction || ""
    });

    const [cliniques, setCliniques] = useState([]);
    const [showSpecDropdown, setShowSpecDropdown] = useState(false);

    useEffect(() => {
        const loadCliniques = async () => {
            try {
                const res = await cliniqueService.getAllCliniques();
                setCliniques(Array.isArray(res) ? res : res.data || []);
            } catch (err) { console.error(err); }
        };
        loadCliniques();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Gestion des horaires
    const addHourRow = () => setFormData(p => ({ ...p, working_hours: [...p.working_hours, { day: "", hours: "" }] }));
    const removeHourRow = (index) => setFormData(p => ({ ...p, working_hours: p.working_hours.filter((_, i) => i !== index) }));
    const updateHourRow = (index, field, val) => {
        const newHours = [...formData.working_hours];
        newHours[index][field] = val;
        setFormData(p => ({ ...p, working_hours: newHours }));
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); const submissionData = {...formData, languages: formData.languages || "", bio: formData.bio || "", professional_background: formData.professional_background || ""}; onSubmit(submissionData); }} className="space-y-6 pb-6">
            
            {/* --- IDENTITÉ & CONTACT --- */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Prénom</label>
                    <input name="prenom" value={formData.prenom} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl text-sm outline-none focus:border-blue-500 bg-gray-50" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Nom</label>
                    <input name="nom" value={formData.nom} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl text-sm outline-none focus:border-blue-500 bg-gray-50" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><PhoneIcon className="w-3 h-3"/> Téléphone</label>
                    <input name="telephone" value={formData.telephone} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl text-sm bg-gray-50" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><MapPinIcon className="w-3 h-3"/> Adresse</label>
                    <input name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl text-sm bg-gray-50" />
                </div>
            </div>

            {/* --- SPÉCIALITÉ & EXPÉRIENCE --- */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Spécialité</label>
                    <div className="relative">
                        <button type="button" onClick={() => setShowSpecDropdown(!showSpecDropdown)} className="w-full px-4 py-2 border rounded-xl text-sm flex justify-between bg-white items-center">
                            {formData.specialite || "Choisir..."}
                            <ChevronDownIcon className="w-4 h-4" />
                        </button>
                        {showSpecDropdown && (
                            <div className="absolute z-50 w-full mt-1 bg-white border rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                                {SPECIALITES.map(s => (
                                    <div key={s} onClick={() => { setFormData(p => ({...p, specialite: s})); setShowSpecDropdown(false); }} className="px-4 py-2.5 text-sm hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0">
                                        {s}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Expérience (Années)</label>
                    <input type="number" name="experience_years" value={formData.experience_years} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl text-sm bg-gray-50" />
                </div>
            </div>

            {/* --- TARIF, LANGUES & ASSURANCE --- */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><BanknotesIcon className="w-3 h-3" /> Prix (FCFA)</label>
                    <input type="number" name="consultation_price" value={formData.consultation_price} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl text-sm bg-gray-50" />
                </div>
                <div className="flex flex-col justify-end pb-1">
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-green-50 border border-green-100">
                        <input type="checkbox" name="insurance_accepted" checked={formData.insurance_accepted} onChange={handleChange} className="w-4 h-4 text-green-600 rounded" />
                        <span className="text-xs font-bold text-green-700 flex items-center gap-1"><ShieldCheckIcon className="w-4 h-4"/> Accepte les assurances</span>
                    </label>
                </div>
            </div>

            {/* --- PRATIQUE & CLINIQUE --- */}
            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Structure de travail</p>
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                        <input type="radio" name="type" value="independant" checked={formData.type === 'independant'} onChange={handleChange} /> Indépendant
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                        <input type="radio" name="type" value="clinique" checked={formData.type === 'clinique'} onChange={handleChange} /> En Clinique
                    </label>
                </div>

                {formData.type === 'clinique' && (
                    <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-1">
                        <select name="clinique_id" value={formData.clinique_id} onChange={handleChange} className="px-3 py-2 border rounded-lg text-sm bg-white">
                            <option value="">Choisir la clinique...</option>
                            {cliniques.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                        </select>
                        <input name="fonction" value={formData.fonction} onChange={handleChange} placeholder="Fonction (ex: Chirurgien)" className="px-3 py-2 border rounded-lg text-sm" />
                    </div>
                )}
            </div>

            {/* --- HORAIRES DE TRAVAIL --- */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><ClockIcon className="w-3 h-3"/> Horaires</label>
                    <button type="button" onClick={addHourRow} className="text-[10px] bg-white border px-2 py-1 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                        <PlusIcon className="w-3 h-3"/> Ajouter
                    </button>
                </div>
                <div className="space-y-2">
                    {formData.working_hours.length === 0 ? (
                        /* Affichage si NULL ou VIDE */
                        <div className="text-center py-4 border-2 border-dashed border-gray-100 rounded-xl">
                            <p className="text-xs text-gray-400 italic">Horaires non définis</p>
                        </div>
                    ) : (
                        /* Affichage de la liste des horaires */
                        formData.working_hours.map((item, idx) => (
                            <div key={idx} className="flex gap-2 animate-in fade-in slide-in-from-left-1">
                                <input 
                                    placeholder="Ex: Lundi" 
                                    value={item.day} 
                                    onChange={(e) => updateHourRow(idx, 'day', e.target.value)} 
                                    className="flex-1 px-3 py-1.5 border rounded-lg text-xs bg-gray-50 focus:bg-white outline-none focus:border-blue-300" 
                                />
                                <input 
                                    placeholder="Ex: 08:00 - 18:00" 
                                    value={item.hours} 
                                    onChange={(e) => updateHourRow(idx, 'hours', e.target.value)} 
                                    className="flex-1 px-3 py-1.5 border rounded-lg text-xs bg-gray-50 focus:bg-white outline-none focus:border-blue-300" 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => removeHourRow(idx)} 
                                    className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <TrashIcon className="w-4 h-4"/>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* --- BIO --- */}
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><BookOpenIcon className="w-3 h-3" /> Biographie</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" className="w-full px-4 py-2 border rounded-xl text-sm bg-gray-50 outline-none focus:border-blue-500" />
            </div>

            {/* --- ACTIONS (Boutons fixés par le modal, donc simplifiés ici) --- */}
            <div className="pt-6 flex justify-end gap-3 border-t">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-500">Annuler</button>
                <button type="submit" disabled={loading} className="px-8 py-2 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-600 shadow-lg shadow-amber-200 disabled:opacity-50 transition-all">
                    {loading ? "Enregistrement..." : "Enregistrer les modifications"}
                </button>
            </div>
        </form>
    );
}