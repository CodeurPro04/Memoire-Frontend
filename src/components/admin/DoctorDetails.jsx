import React from 'react';
import { 
    EnvelopeIcon, PhoneIcon, MapPinIcon, 
    AcademicCapIcon, BanknotesIcon, GlobeAltIcon,
    CheckCircleIcon, XCircleIcon, 
    BuildingOfficeIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import { ClockIcon } from 'lucide-react';

export default function DoctorDetails({ doctor }) {
    // Sécurité si doctor est undefined
    if (!doctor) return (
        <div className="p-10 text-center text-gray-500 italic">
            Chargement des informations...
        </div>
    );

    const formatWorkingHours = (data) => {
        if (!data) return [];
        
        try {
            // Si c'est une chaîne JSON, on la transforme en tableau
            const parsed = typeof data === 'string' ? JSON.parse(data) : data;
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("Erreur format horaires", e);
            return [];
        }
    };

    const hours = formatWorkingHours(doctor.working_hours);

    const infoGroup = (label, value, Icon) => (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <Icon className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
                <p className="text-[10px] uppercase font-bold text-black tracking-wider">{label}</p>
                <p className="text-sm text-gray-700 font-medium">{value || 'Non renseigné'}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* 1. Header avec Photo et Nom */}
            <div className="flex items-center gap-5 pb-6 border-b border-gray-100">
                <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden">
                    {doctor.photo_profil ? (
                        <img src={doctor.photo_profil} alt="" className="w-full h-full object-cover" />
                    ) : (doctor.nom ? doctor.nom[0] : "?")}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Dr. {doctor.prenom ?? ""} {doctor.nom ?? ""}
                    </h2>
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide border border-blue-100">
                        {doctor.specialite || 'Spécialité non définie'}
                    </span>
                </div>
            </div>

            {/* 2. Grille d'infos rapides */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {infoGroup("Email", doctor.email, EnvelopeIcon)}
                {infoGroup("Téléphone", doctor.telephone, PhoneIcon)}
                {infoGroup("Localisation", `${doctor.commune || ''} ${doctor.ville || ''}`.trim() || 'Non localisé', MapPinIcon)}
                {infoGroup("Prix Consultation", doctor.consultation_price ? `${doctor.consultation_price} FCFA` : 'N/A', BanknotesIcon)}
            </div>

            {/* 3. Bio & Parcours */}
            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100">
                <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                    <AcademicCapIcon className="w-4 h-4" /> Biographie & Expertise
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                    {doctor.bio || doctor.professional_background || "Aucune description disponible pour ce profil."}
                </p>
            </div>

            {/* 4. Langues & Assurances (Ligne de 2 cadres) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm h-fit">
                    <p className="text-xs font-bold text-black uppercase mb-3 flex items-center gap-2">
                        <GlobeAltIcon className="w-4 h-4 text-blue-500" /> Langues parlées
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {doctor.languages ? (
                            (Array.isArray(doctor.languages) ? doctor.languages : doctor.languages.split(',')).map((l, index) => (
                                <span key={index} className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded-md text-gray-600">
                                    {l.trim()}
                                </span>
                            ))
                        ) : <span className="text-xs italic text-gray-400">Non spécifié</span>}
                    </div>
                </div>

                <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm h-fit">
                    <p className="text-xs font-bold text-black uppercase mb-3 flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-blue-500" /> Assurances
                    </p>
                    <div className="flex items-center gap-2">
                        {doctor.insurance_accepted ? (
                            <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                <CheckCircleIcon className="w-4 h-4" /> Acceptées
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 text-sm font-medium text-red-500 bg-red-50 px-3 py-1 rounded-full">
                                <XCircleIcon className="w-4 h-4" /> Non acceptées
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* 5. Lieux & Horaires (Ligne de 2 cadres) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {/* Lieux d'intervention */}
                <div className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm h-fit">
                    <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <BuildingOfficeIcon className="w-4 h-4 text-blue-600" /> Établissements
                    </h4>
                    <div className="space-y-3">
                            {doctor.cliniques && doctor.cliniques.length > 0 ? (
                                doctor.cliniques.map((clinique) => (
                                    <div key={clinique.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <p className="text-xs font-bold text-gray-800">{clinique.nom}</p>
                                                <p className="text-[10px] text-gray-500">{clinique.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-700">
                                    <UserIcon className="w-4 h-4" />
                                    <p className="text-xs font-medium">À son propre compte</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Horaires */}
                    <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm h-fit">
                        <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <ClockIcon className="w-4 h-4 text-blue-600" /> Horaires
                        </h4>
                        <div className="space-y-2">
                            {hours.length > 0 ? (
                                hours.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center text-xs border-b border-gray-200/50 pb-1 last:border-0">
                                        <span className="font-medium text-gray-600 capitalize">{item.day}</span>
                                        <span className="text-blue-600 font-bold">{item.hours}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400 italic">Horaires non définis</p>
                            )}
                        </div>
                </div>
            </div>
        </div>
    );
}