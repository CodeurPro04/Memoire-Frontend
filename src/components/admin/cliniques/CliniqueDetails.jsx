import React from 'react';
import { 
    BuildingOffice2Icon, PhoneIcon, EnvelopeIcon, MapPinIcon, 
    GlobeAltIcon, ClockIcon, WrenchScrewdriverIcon, ListBulletIcon,
    InformationCircleIcon, NoSymbolIcon, CheckCircleIcon, UsersIcon
} from '@heroicons/react/24/outline';

export default function CliniqueDetails({ clinique }) {
    if (!clinique) return null;

    const parseData = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        try { return JSON.parse(data); } catch (e) {
            return typeof data === 'string' ? data.split(',').map(s => s.trim()) : [];
        }
    };

    const services = parseData(clinique.services);
    const equipements = parseData(clinique.equipements);
    const horaires = parseData(clinique.horaires);

    return (
        <div className="mx-3">
            {/* Conteneur Principal Unifié */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                
                {/* 1. Header Intégré */}
                <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-start gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-white border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
                            {clinique.photo_url || clinique.photo_profil ? (
                                <img src={clinique.photo_url || clinique.photo_profil} alt={clinique.nom} className="w-full h-full object-cover" />
                            ) : (
                                <BuildingOffice2Icon className="w-12 h-12 text-amber-500" />
                            )}
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-gray-900">{clinique.nom}</h2>
                                <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-lg border border-amber-100">
                                    {clinique.type_etablissement || 'Clinique'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
                                {clinique.description || "Aucune description disponible pour cet établissement."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Corps du dossier */}
                <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        
                        {/* Colonne Gauche : Coordonnées */}
                        <div className="space-y-6">
                            <h4 className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                <InformationCircleIcon className="w-4 h-4 text-blue-500"/> Informations de contact
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                                        <EnvelopeIcon className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm text-gray-600 font-medium">{clinique.email}</span>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors">
                                        <PhoneIcon className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm text-gray-600 font-medium">{clinique.telephone || 'Non renseigné'}</span>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-600 group-hover:bg-red-100 transition-colors shrink-0">
                                        <MapPinIcon className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm text-gray-600 font-medium leading-relaxed">{clinique.address || 'Adresse non définie'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Colonne Droite : Capacités & Badges */}
                        <div className="space-y-6">
                            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Services & Disponibilités</h4>
                            <div className="flex flex-col gap-3">
                                <div className={`flex items-center justify-between p-4 rounded-xl border ${clinique.urgences_24h ? 'bg-red-50/50 border-red-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                                    <div className="flex items-center gap-3">
                                        {clinique.urgences_24h ? <CheckCircleIcon className="w-5 h-5 text-red-500"/> : <NoSymbolIcon className="w-5 h-5 text-gray-400"/>}
                                        <span className={`text-sm font-bold ${clinique.urgences_24h ? 'text-red-700' : 'text-gray-500'}`}>Urgences 24h/7j</span>
                                    </div>
                                    {clinique.urgences_24h && <span className="text-[10px] font-bold text-red-400 uppercase">Actif</span>}
                                </div>

                                <div className={`flex items-center justify-between p-4 rounded-xl border ${clinique.parking_disponible ? 'bg-emerald-50/50 border-emerald-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                                    <div className="flex items-center gap-3">
                                        {clinique.parking_disponible ? <CheckCircleIcon className="w-5 h-5 text-emerald-500"/> : <NoSymbolIcon className="w-5 h-5 text-gray-400"/>}
                                        <span className={`text-sm font-bold ${clinique.parking_disponible ? 'text-emerald-700' : 'text-gray-500'}`}>Parking client</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl border border-blue-100 bg-blue-50/50">
                                    <div className="flex items-center gap-3 text-blue-700">
                                        <UsersIcon className="w-5 h-5" />
                                        <span className="text-sm font-bold">Médecins rattachés</span>
                                    </div>
                                    <span className="bg-blue-600 text-white font-bold px-3 py-0.5 rounded-full text-[15px]">{clinique.medecins?.length || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Section Bas : Listes détaillées */}
                    <div className="mt-12 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Services */}
                        <div className="space-y-4">
                            <h5 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <ListBulletIcon className="w-4 h-4 text-blue-500"/> Spécialités
                            </h5>
                            <div className="flex flex-wrap gap-2">
                                {services.length > 0 ? services.map((s, i) => (
                                    <span key={i} className="px-2.5 py-1 bg-white border border-gray-200 text-gray-600 text-[11px] font-medium rounded-lg">
                                        {s}
                                    </span>
                                )) : <span className="text-xs text-gray-400 italic">Aucun service listé</span>}
                            </div>
                        </div>

                        {/* Équipements */}
                        <div className="space-y-4">
                            <h5 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <WrenchScrewdriverIcon className="w-4 h-4 text-amber-500"/> Plateau Technique
                            </h5>
                            <div className="flex flex-wrap gap-2">
                                {equipements.length > 0 ? equipements.map((e, i) => (
                                    <span key={i} className="px-2.5 py-1 bg-amber-50/30 border border-amber-100 text-amber-700 text-[11px] font-medium rounded-lg">
                                        {e}
                                    </span>
                                )) : <span className="text-xs text-gray-400 italic">Non renseigné</span>}
                            </div>
                        </div>

                        {/* Horaires */}
                        <div className="space-y-4">
                            <h5 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <ClockIcon className="w-4 h-4 text-green-500"/> Horaires d'ouverture
                            </h5>
                            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                {horaires.length > 0 ? horaires.map((h, i) => (
                                    <div key={i} className="flex justify-between text-[11px] font-medium">
                                        <span className="text-gray-500 capitalize">{h.jour || h.day || h}</span>
                                        <span className="text-gray-900 font-bold">{h.heures || h.hours || ""}</span>
                                    </div>
                                )) : <span className="text-[11px] text-gray-400 italic">Horaires non définis</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}