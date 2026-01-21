import React from 'react';
import { 
    ShieldCheckIcon, 
    EnvelopeIcon, 
    CalendarDaysIcon, 
    UserIcon,
    KeyIcon,
    CheckBadgeIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

export default function AdminDetails({ admin }) {
    if (!admin) return null;

    // Formatage de la date de création (ex: 20 Janvier 2026)
    const dateCreation = admin.created_at 
        ? new Date(admin.created_at).toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })
        : "Date inconnue";

    // Formatage de l'heure (ex: 14:30)
    const heureCreation = admin.created_at 
        ? new Date(admin.created_at).toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        : "";

    return (
        <div className="space-y-6">
            {/* --- Profil Header --- */}
            <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-blue-50 to-white rounded-3xl border border-blue-100/50 shadow-sm">
                <div className="w-20 h-20 rounded-2xl bg-white shadow-sm border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    {admin.photo_url ? (
                        <img src={admin.photo_url} alt={admin.name} className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                        <UserIcon className="w-10 h-10" />
                    )}
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-900">{admin.name} {admin.prenom || ""}</h3>
                        <CheckBadgeIcon className="w-5 h-5 text-blue-500" title="Compte vérifié" />
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-200">
                        {admin.role || 'Administrateur'}
                    </span>
                </div>
            </div>

            {/* --- Informations Détaillées --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email Card */}
                <div className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 hover:border-blue-100 transition-all group">
                    <div className="p-2 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                        <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Adresse Email</p>
                        <p className="text-sm font-medium text-gray-700">{admin.email}</p>
                    </div>
                </div>

                {/* Statut Card */}
                <div className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 hover:border-emerald-100 transition-all group">
                    <div className="p-2 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                        <CheckBadgeIcon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">État du compte</p>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="text-sm font-medium text-emerald-700">Actif</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Historique & Traçabilité (Créé le...) --- */}
            <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-2xl">
                <div className="flex items-center gap-3 text-gray-500">
                    <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="text-xs">
                        <p className="font-bold text-gray-400 uppercase text-[9px] tracking-widest">Traçabilité</p>
                        <p className="text-gray-600">
                            Compte créé le <span className="font-bold text-gray-800">{dateCreation}</span> 
                            {heureCreation && <span> à <span className="font-bold text-gray-800">{heureCreation}</span></span>}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}