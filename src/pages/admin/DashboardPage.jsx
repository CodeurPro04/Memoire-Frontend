import React, { useState, useEffect } from 'react';
import { 
    UserGroupIcon, 
    CalendarIcon, 
    ClipboardDocumentCheckIcon, 
    UserPlusIcon,
    BuildingOfficeIcon,
    AcademicCapIcon
} from '@heroicons/react/24/outline';

import { authService } from '../../api/authService';
import { medecinService } from '../../api/medecinsService';
import { cliniqueService } from '../../api/cliniquesService';
import { patientService } from '../../api/patientsService';
import { appointmentService } from '../../api/appointmentService';

export default function DashboardPage() {
    const [data, setData] = useState({
        totalUsers: 0,
        doctors: 0,
        clinics: 0,
        patients: 0,
        appointments: 0,
        prescriptions: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
              const [resAdmins, resMed, resClin, resPat, resApptStats] = await Promise.all([
                authService.getAllUsers(),
                medecinService.getAllMedecins(),
                cliniqueService.getAllCliniques(),
                patientService.getAllPatients(),
                appointmentService.getAdminStats()
              ]);

              const admins = resAdmins.total !== undefined ? resAdmins.total : (resAdmins.length || 0);
              const doctors = resMed.total !== undefined ? resMed.total : (resMed.length || 0);
              const clinics = resClin.total !== undefined ? resClin.total : (resClin.length || 0);
              const patients = resPat.total !== undefined ? resPat.total : (resPat.length || 0);

                

              setData({
                totalUsers: admins + doctors + clinics + patients,
                doctors: doctors,
                clinics: clinics,
                patients: patients,
                appointments: resApptStats.total_historique || 0,
                appointmentsToday: resApptStats.total_aujourd_hui || 0,
                appointmentsPending: resApptStats.total_a_venir || 0,
                prescriptions: 0 
              });
            } catch (error) {
                console.error("Erreur lors du chargement des statistiques:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 animate-pulse font-medium">
                    Chargement des données MeetMed...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Vue d'ensemble</h1>
                <p className="text-gray-500 text-sm">Statistiques en temps réel.</p>
            </div>

            {/* Grille de statistiques - 6 Cartes dynamiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard title="Total Utilisateurs" value={data.totalUsers} icon={<UserGroupIcon className="w-6 h-6" />} color="text-gray-600" bg="bg-gray-100" />
                <StatCard title="Médecins" value={data.doctors} icon={<AcademicCapIcon className="w-6 h-6" />} color="text-blue-600" bg="bg-blue-100" />
                <StatCard title="Cliniques" value={data.clinics} icon={<BuildingOfficeIcon className="w-6 h-6" />} color="text-indigo-600" bg="bg-indigo-100" />
                <StatCard title="Patients" value={data.patients} icon={<UserPlusIcon className="w-6 h-6" />} color="text-emerald-600" bg="bg-emerald-100" />
                <StatCard title="Total RDV" value={data.appointments} icon={<CalendarIcon className="w-6 h-6" />} color="text-amber-600" bg="bg-amber-100" />
                <StatCard title="Rendez-vous Aujourd'hui" value={data.appointmentsToday} icon={<ClipboardDocumentCheckIcon className="w-6 h-6" />} color="text-rose-600" bg="bg-rose-100" />
                <StatCard title="Rendez-vous à Venir" value={data.appointmentsPending} icon={<UserGroupIcon className="w-6 h-6" />} color="text-orange-600" bg="bg-orange-100" />
            </div>

            {/* Section Analyse & Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">                    
                    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-sm text-gray-400 italic">Graphique de croissance bientôt disponible</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Composants utilitaires (internes au fichier pour la clarté)
function StatCard({ title, value, icon, color, bg }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3 hover:shadow-md transition-all duration-300">
            <div className={`${bg} ${color} w-fit p-2 rounded-lg`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value.toLocaleString()}</p>
            </div>
        </div>
    );
}

function ProgressLine({ label, current, total, color }) {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-gray-700">
                <span>{label}</span>
                <span className="text-gray-400">{Math.round(percentage)}%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                    className={`${color} h-full transition-all duration-700 ease-out`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}