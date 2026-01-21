import React, { useState, useEffect } from 'react';
import { 
    BuildingOffice2Icon, 
    EnvelopeIcon, 
    PhoneIcon, 
    MapPinIcon,
    GlobeAltIcon,
    DocumentTextIcon,
    WrenchScrewdriverIcon,
    ClockIcon,
    TagIcon,
    CheckBadgeIcon
} from '@heroicons/react/24/outline';

export default function EditCliniqueForm({ clinique, onSubmit, onCancel, loading }) {
    const [formData, setFormData] = useState({
        id: "",
        nom: "",
        email: "",
        telephone: "",
        address: "",
        site_web: "",
        description: "",
        type_etablissement: "",
        urgences_24h: false,
        parking_disponible: false,
        services: "",
        equipements: "",
        horaires: ""
    });

    useEffect(() => {
        if (clinique) {
            setFormData({
                id: clinique.id,
                nom: clinique.nom || "",
                email: clinique.email || "",
                telephone: clinique.telephone || "",
                address: clinique.address || clinique.adresse || "",
                site_web: clinique.site_web || "",
                description: clinique.description || "",
                type_etablissement: clinique.type_etablissement || "",
                urgences_24h: !!clinique.urgences_24h,
                parking_disponible: !!clinique.parking_disponible,
                // Conversion Array -> String pour les inputs textuels
                services: Array.isArray(clinique.services) ? clinique.services.join(', ') : (clinique.services || ""),
                equipements: Array.isArray(clinique.equipements) ? clinique.equipements.join(', ') : (clinique.equipements || ""),
                horaires: Array.isArray(clinique.horaires) ? clinique.horaires.join(', ') : (clinique.horaires || ""),
            });
        }
    }, [clinique]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // On prépare les données pour le backend (conversion des strings en tableaux)
        const finalData = {
            ...formData,
            services: formData.services.split(',').map(s => s.trim()).filter(s => s !== ""),
            equipements: formData.equipements.split(',').map(e => e.trim()).filter(e => e !== ""),
            horaires: formData.horaires.split(',').map(h => h.trim()).filter(h => h !== ""),
        };

        onSubmit(finalData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-1 max-h-[80vh] overflow-y-auto px-2">
            
            {/* Informations Générales */}
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nom de l'établissement</label>
                <div className="relative">
                    <BuildingOffice2Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        name="nom" required value={formData.nom} onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email</label>
                    <div className="relative">
                        <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="email" name="email" required value={formData.email} onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Téléphone</label>
                    <div className="relative">
                        <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            name="telephone" value={formData.telephone} onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Adresse (Localisation)</label>
                    <div className="relative">
                        <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            name="address" value={formData.address} onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Type d'établissement</label>
                    <div className="relative">
                        <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            name="type_etablissement" value={formData.type_etablissement} onChange={handleChange}
                            placeholder="Ex: Clinique, Hôpital"
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Services, Equipements, Horaires */}
            {/* <div className="space-y-4 bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Services offerts (séparés par des virgules)</label>
                    <div className="relative">
                        <CheckBadgeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            name="services" value={formData.services} onChange={handleChange}
                            placeholder="Pédiatrie, Chirurgie, Radiologie..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:border-amber-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Équipements disponibles</label>
                    <div className="relative">
                        <WrenchScrewdriverIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            name="equipements" value={formData.equipements} onChange={handleChange}
                            placeholder="Scanner, IRM, Laboratoire..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:border-amber-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Horaires (ex: Lun-Ven 8h-18h)</label>
                    <div className="relative">
                        <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            name="horaires" value={formData.horaires} onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:border-amber-500 outline-none transition-all"
                        />
                    </div>
                </div>
            </div> */}

            {/* Options binaires */}
            <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="checkbox" name="urgences_24h" checked={formData.urgences_24h} onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Urgences 24h/24</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="checkbox" name="parking_disponible" checked={formData.parking_disponible} onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Parking disponible</span>
                </label>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Site Web</label>
                <div className="relative">
                    <GlobeAltIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="url" name="site_web" value={formData.site_web} onChange={handleChange}
                        placeholder="https://www.clinique.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Description / Notes</label>
                <div className="relative">
                    <DocumentTextIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange}
                        rows="3"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all resize-none"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 bg-white sticky bottom-0">
                <button 
                    type="button" onClick={onCancel}
                    className="px-5 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                >
                    Annuler
                </button>
                <button 
                    type="submit" disabled={loading}
                    className="px-8 py-2.5 bg-amber-600 text-white text-sm font-bold rounded-xl hover:bg-amber-700 shadow-lg shadow-amber-100 disabled:opacity-50 transition-all"
                >
                    {loading ? "Mise à jour..." : "Enregistrer les modifications"}
                </button>
            </div>
        </form>
    );
}