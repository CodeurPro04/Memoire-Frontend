import React, { useState } from 'react';
import { 
    UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, 
    BeakerIcon, ClipboardDocumentListIcon, ExclamationTriangleIcon,
    ClipboardIcon
} from '@heroicons/react/24/outline';

export default function EditPatientForm({ patient, onSubmit, onCancel, loading }) {
    const [formData, setFormData] = useState({
        id: patient?.id,
        nom: patient?.nom || "",
        prenom: patient?.prenom || "",
        email: patient?.email || "",
        telephone: patient?.telephone || "",
        address: patient?.address || "",
        groupe_sanguin: patient?.groupe_sanguin || "inconnu",
        serologie_vih: patient?.serologie_vih || "inconnu",
        antecedents_medicaux: patient?.antecedents_medicaux || "",
        allergies: patient?.allergies || "",
        traitements_chroniques: patient?.traitements_chroniques || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* --- IDENTITÉ --- */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Prénom</label>
                    <div className="relative">
                        <input name="prenom" value={formData.prenom} onChange={handleChange} className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm outline-none focus:border-blue-500 bg-gray-50" />
                        <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Nom</label>
                    <input name="nom" value={formData.nom} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl text-sm outline-none focus:border-blue-500 bg-gray-50" />
                </div>
            </div>

            {/* --- CONTACT & ADRESSE --- */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><EnvelopeIcon className="w-3 h-3"/> Email</label>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl text-sm bg-gray-50" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><PhoneIcon className="w-3 h-3"/> Téléphone</label>
                    <input name="telephone" value={formData.telephone} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl text-sm bg-gray-50" />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><MapPinIcon className="w-3 h-3"/> Adresse complète</label>
                <textarea name="address" value={formData.address} onChange={handleChange} rows="2" className="w-full px-4 py-2 border rounded-xl text-sm bg-gray-50 outline-none focus:border-blue-500" />
            </div>

            {/* --- DONNÉES MÉDICALES CRITIQUES --- */}
            <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-red-400 uppercase flex items-center gap-1"><BeakerIcon className="w-3 h-3"/> Groupe Sanguin</label>
                    <select name="groupe_sanguin" value={formData.groupe_sanguin} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm bg-white outline-none">
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'inconnu'].map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-red-400 uppercase flex items-center gap-1">Sérologie VIH</label>
                    <select name="serologie_vih" value={formData.serologie_vih} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm bg-white outline-none">
                        <option value="inconnu">Inconnu</option>
                        <option value="negatif">Négatif</option>
                        <option value="positif">Positif</option>
                    </select>
                </div>
            </div>

            {/* --- ANTÉCÉDENTS & ALLERGIES --- */}
            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><ExclamationTriangleIcon className="w-3 h-3 text-amber-500" /> Allergies</label>
                    <input name="allergies" value={formData.allergies} onChange={handleChange} placeholder="Ex: Pénicilline, Arachides..." className="w-full px-4 py-2 border rounded-xl text-sm bg-gray-50" />
                </div>
                
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><ClipboardDocumentListIcon className="w-3 h-3" /> Antécédents Médicaux</label>
                    <textarea name="antecedents_medicaux" value={formData.antecedents_medicaux} onChange={handleChange} rows="2" className="w-full px-4 py-2 border rounded-xl text-sm bg-gray-50" />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><ClipboardIcon className="w-3 h-3" /> Traitements Chroniques</label>
                    <textarea name="traitements_chroniques" value={formData.traitements_chroniques} onChange={handleChange} rows="2" className="w-full px-4 py-2 border rounded-xl text-sm bg-gray-50" />
                </div>
            </div>

            {/* --- ACTIONS --- */}
            <div className="pt-6 flex justify-end gap-3 border-t">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Annuler</button>
                <button type="submit" disabled={loading} className="px-8 py-2 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-600 shadow-lg shadow-amber-200 disabled:opacity-50 transition-all">
                    {loading ? "Mise à jour..." : "Enregistrer les modifications"}
                </button>
            </div>
        </form>
    );
}