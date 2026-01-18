import React from 'react';
import { 
    EnvelopeIcon, PhoneIcon, MapPinIcon, 
    AcademicCapIcon, BanknotesIcon, GlobeAltIcon,
    CheckCircleIcon, XCircleIcon, 
    BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { ClockIcon, UserIcon } from 'lucide-react';

export default function DoctorDetails({ doctor }) {
    if (!doctor) return null;

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
            {/* Header avec Photo et Nom */}
            <div className="flex items-center gap-5 pb-6 border-b border-gray-100">
                <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {doctor.photo_profil ? (
                        <img src={doctor.photo_profil} alt="" className="w-full h-full object-cover rounded-2xl" />
                    ) : doctor.nom[0]}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Dr. {doctor.prenom} {doctor.nom}</h2>
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide">
                        {doctor.specialite}
                    </span>
                </div>
            </div>

            {/* Grille d'infos rapides */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {infoGroup("Email", doctor.email, EnvelopeIcon)}
                {infoGroup("Téléphone", doctor.telephone, PhoneIcon)}
                {infoGroup("Localisation", `${doctor.commune || ''}, ${doctor.ville || ''}`, MapPinIcon)}
                {infoGroup("Prix Consultation", `${doctor.consultation_price ?? 'N/A'} FCFA`, BanknotesIcon)}
            </div>

            {/* Bio & Parcours */}
            <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100">
                    <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                        <AcademicCapIcon className="w-4 h-4" /> Biographie & Expertise
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {doctor.bio || doctor.professional_background || "Aucune description disponible."}
                    </p>
                </div>
            </div>

            {/* Langues & Assurances */}
            <div className="grid grid-cols-2 gap-4 items-start">
                <div className="p-4 rounded-xl border border-gray-100">
                    <p className="text-xs font-bold text-black uppercase mb-2 flex items-center gap-2">
                        <GlobeAltIcon className="w-4 h-4" /> Langues
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {doctor.languages ? (
                        (Array.isArray(doctor.languages) ? doctor.languages : doctor.languages.split(',')).map((l, index) => (
                            <span key={index} className="text-xs bg-white border border-gray-100 px-2 py-1 rounded-md text-gray-600 shadow-sm">
                                {l.trim()}
                            </span>
                        ))
                    ) : <span className="text-xs italic text-black">Non spécifié</span>}
                    </div>
                </div>
                <div className="p-4 rounded-xl border border-gray-100">
                    <p className="text-xs font-bold text-black uppercase mb-2">Assurances</p>
                    <div className="flex items-center gap-2">
                        {doctor.insurance_accepted ? (
                            <><CheckCircleIcon className="w-5 h-5 text-green-500" /> <span className="text-sm font-medium">Acceptées</span></>
                        ) : (
                            <><XCircleIcon className="w-5 h-5 text-red-500" /> <span className="text-sm font-medium">Non acceptées</span></>
                        )}
                    </div>
                </div>

                <div className="p-5 rounded-2xl border border-gray-100 bg-white">
                    <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 text-blue-600" /> Lieux d'intervention
                    </h4>
                    
                    <div className="space-y-3">
                        {doctor.cliniques && doctor.cliniques.length > 0 ? (
                            doctor.cliniques.map((clinique) => (
                                <div key={clinique.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                                            <BuildingOfficeIcon className="w-4 h-4 text-black" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{clinique.nom}</p>
                                            <p className="text-[11px] text-gray-500">{clinique.address}</p>
                                        </div>
                                    </div>
                                    {clinique.pivot?.fonction && (
                                        <span className="text-[10px] font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded-md uppercase">
                                            {clinique.pivot.fonction}
                                        </span>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-700">
                                <UserIcon className="w-5 h-5" />
                                <p className="text-sm font-medium">À son propre compte (Indépendant)</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                    <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-blue-600" /> Horaires de consultation
                    </h4>
                    <div className="grid grid-cols-2 gap-y-2">
                        {doctor.working_hours ? Object.entries(doctor.working_hours).map(([day, hours]) => (
                            <div key={day} className="flex justify-between text-sm pr-4">
                                <span className="capitalize text-gray-500">{day}</span>
                                <span className="font-medium text-gray-700">{hours}</span>
                            </div>
                        )) : (
                            <p className="text-xs italic text-black">Horaires non définis</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}