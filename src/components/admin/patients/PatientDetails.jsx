import React from 'react';
import { 
    EnvelopeIcon, PhoneIcon, MapPinIcon, 
    UserIcon, BeakerIcon, ShieldExclamationIcon,
    ClipboardDocumentListIcon, BugAntIcon, 
    NoSymbolIcon, IdentificationIcon
} from '@heroicons/react/24/outline';

export default function PatientDetails({ patient }) {
    if (!patient) return (
        <div className="p-10 text-center text-gray-500 italic">
            Chargement des informations du patient...
        </div>
    );

    // Helper pour afficher les groupes d'infos avec gestion du NULL
    const infoGroup = (label, value, Icon, colorClass = "text-green-600") => (
        <div className={`flex items-start gap-3 p-3 rounded-xl border ${
            !value ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'
        }`}>
            <Icon className={`w-5 h-5 mt-0.5 ${!value ? 'text-red-400' : colorClass}`} />
            <div>
                <p className="text-[10px] uppercase font-bold text-black tracking-wider">{label}</p>
                <p className={`text-sm font-medium ${!value ? 'text-red-500 italic' : 'text-gray-700'}`}>
                    {value || `${label} non défini`}
                </p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* 1. Header & Photo */}
            <div className="flex items-center gap-5 pb-6 border-b border-gray-100">
                <div className="w-20 h-20 rounded-2xl bg-green-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden">
                    {patient.photo_profil ? (
                        <img src={patient.photo_profil} alt="" className="w-full h-full object-cover" />
                    ) : (patient.nom ? patient.nom[0] : "?")}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {patient.prenom || 'prénom non défini'} {patient.nom || 'nom non défini'}
                    </h2>
                    <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wide border border-green-100">
                        Dossier Patient n°{patient.id}
                    </span>
                </div>
            </div>

            {/* 2. Coordonnées de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {infoGroup("Email", patient.email, EnvelopeIcon)}
                {infoGroup("Téléphone", patient.telephone, PhoneIcon)}
                <div className="md:col-span-2">
                    {infoGroup("Adresse", patient.address, MapPinIcon)}
                </div>
            </div>

            {/* 3. Données Médicales Vitales (Cadre distinct) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border flex items-center gap-4 ${patient.groupe_sanguin ? 'bg-red-50/50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="p-2 bg-red-100 rounded-lg text-red-600">
                        <BeakerIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-black">Groupe Sanguin</p>
                        <p className="text-lg font-black text-red-600">{patient.groupe_sanguin || "non défini"}</p>
                    </div>
                </div>

                <div className={`p-4 rounded-xl border flex items-center gap-4 ${patient.serologie_vih === 'positif' ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-100'}`}>
                    <div className={`p-2 rounded-lg ${patient.serologie_vih === 'positif' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                        <ShieldExclamationIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-black">Sérologie VIH</p>
                        <p className={`text-sm font-bold uppercase ${patient.serologie_vih === 'positif' ? 'text-orange-600' : 'text-gray-700'}`}>
                            {patient.serologie_vih || "non défini"}
                        </p>
                    </div>
                </div>
            </div>

            {/* 4. Antécédents, Allergies et Traitements (Textes longs) */}
            <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                    <h4 className="text-xs font-bold text-amber-800 mb-2 flex items-center gap-2 uppercase">
                        <BugAntIcon className="w-4 h-4" /> Allergies
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {patient.allergies || <span className="text-amber-500 italic">Allergies non définies</span>}
                    </p>
                </div>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <h4 className="text-xs font-bold text-blue-800 mb-2 flex items-center gap-2 uppercase">
                        <ClipboardDocumentListIcon className="w-4 h-4" /> Antécédents Médicaux
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {patient.antecedents_medicaux || <span className="text-blue-400 italic">Antécédents non définis</span>}
                    </p>
                </div>

                <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                    <h4 className="text-xs font-bold text-purple-800 mb-2 flex items-center gap-2 uppercase">
                        <NoSymbolIcon className="w-4 h-4" /> Traitements Chroniques
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {patient.traitements_chroniques || <span className="text-purple-400 italic">Traitements non définis</span>}
                    </p>
                </div>
            </div>

            {/* 5. Footer infos admin */}
            <div className="pt-4 flex justify-between items-center text-[10px] text-gray-400 border-t border-gray-50 italic">
                <span>Dernière mise à jour du dossier : {patient.updated_at ? new Date(patient.updated_at).toLocaleDateString() : "Inconnue"}</span>
                <span>Inscrit le : {patient.created_at ? new Date(patient.created_at).toLocaleDateString() : "Date non définie"}</span>
            </div>
        </div>
    );
}