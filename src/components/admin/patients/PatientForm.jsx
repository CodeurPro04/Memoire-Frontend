import React, { useState } from 'react';
import { 
    UserIcon, 
    EnvelopeIcon, 
    PhoneIcon, 
    MapPinIcon, 
    LockClosedIcon
} from '@heroicons/react/24/outline';

export default function PatientCreateForm({ onSubmit, onCancel, loading }) {
    const [formData, setFormData] = useState({
        prenom: "",
        nom: "",
        email: "",
        telephone: "",
        address: "",
        password: "Password123!",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('prenom', formData.prenom);
        data.append('nom', formData.nom);
        data.append('email', formData.email);
        data.append('telephone', formData.telephone);
        data.append('address', formData.address);
        data.append('password', formData.password);

        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* 1. Identité */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Prénom *</label>
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            name="prenom" required value={formData.prenom} onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            placeholder="Jean"
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nom *</label>
                    <input 
                        name="nom" required value={formData.nom} onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        placeholder="Dupont"
                    />
                </div>
            </div>

            {/* 2. Contact */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email *</label>
                    <div className="relative">
                        <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="email" name="email" required value={formData.email} onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            placeholder="patient@mail.com"
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Téléphone</label>
                    <div className="relative">
                        <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            name="telephone" value={formData.telephone} onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            placeholder="+225..."
                        />
                    </div>
                </div>
            </div>

            {/* 4. Localisation */}
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Adresse</label>
                <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        name="address" value={formData.address} onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all"
                        placeholder="Ville, Quartier, Rue..."
                    />
                </div>
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
                    {loading ? "Création..." : "Enregistrer le patient"}
                </button>
            </div>
        </form>
    );
}