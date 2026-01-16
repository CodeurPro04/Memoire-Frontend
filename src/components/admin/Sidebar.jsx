import { Link, useLocation } from 'react-router-dom';
import { motion } from "framer-motion";
import { 
    HomeIcon, 
    UsersIcon, 
    UserGroupIcon, 
    ShieldCheckIcon,
    ClipboardDocumentCheckIcon, 
    CalendarDaysIcon, 
    FolderIcon,
    EnvelopeIcon 
} from '@heroicons/react/24/outline';

export default function Sidebar() {
    const location = useLocation();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 hidden md:block z-40 overflow-y-auto">
            <nav className="flex flex-col gap-6 px-4">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="flex items-center"
                >
                    <div className="w-24 h-24 flex items-center justify-center">
                        <img
                            src="/logo/meetmed4.png"
                            alt="MeetMed Logo"
                            className="w-20 h-20 object-contain"
                        />
                    </div>

                    {/* Nom du logo avec MeetMed collé */}
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-teal-400 bg-clip-text text-transparent dark:from-sky-400 dark:via-blue-400 dark:to-teal-300">
                    Meet
                    <span className="text-green-500 dark:text-green-400">Med</span>
                    </h1>
                </motion.div>
                
                {/* Section : Vue d'ensemble */}
                <div>
                    <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Général</p>
                    <SidebarLink to="/admin/dashboard" active={location.pathname === '/admin/dashboard'} icon={<HomeIcon className="w-5 h-5" />}>
                        Tableau de Bord
                    </SidebarLink>
                </div>

                {/* Section : Gestion des utilisateurs */}
                <div>
                    <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Utilisateurs</p>
                    <div className="flex flex-col gap-1">
                        <SidebarLink to="/admin/doctors" active={location.pathname === '/admin/doctors'} icon={<UsersIcon className="w-5 h-5" />}>
                            Médecins
                        </SidebarLink>
                        <SidebarLink to="/admin/patients" active={location.pathname === '/admin/patients'} icon={<UserGroupIcon className="w-5 h-5" />}>
                            Patients
                        </SidebarLink>
                        <SidebarLink to="/admin/staff" active={location.pathname === '/admin/staff'} icon={<ShieldCheckIcon className="w-5 h-5" />}>
                            Administrateurs
                        </SidebarLink>
                    </div>
                </div>

                {/* Section : Activité Médicale */}
                <div>
                    <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Activité</p>
                    <div className="flex flex-col gap-1">
                        <SidebarLink to="/admin/appointments" active={location.pathname === '/admin/appointments'} icon={<CalendarDaysIcon className="w-5 h-5" />}>
                            Rendez-vous
                        </SidebarLink>
                        <SidebarLink to="/admin/prescriptions" active={location.pathname === '/admin/prescriptions'} icon={<ClipboardDocumentCheckIcon className="w-5 h-5" />}>
                            Ordonnances
                        </SidebarLink>
                        <SidebarLink to="/admin/records" active={location.pathname === '/admin/records'} icon={<FolderIcon className="w-5 h-5" />}>
                            Dossiers Médicaux
                        </SidebarLink>
                    </div>
                </div>

                {/* Section : Communication */}
                <div>
                    <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Support</p>
                    <SidebarLink to="/admin/messages" active={location.pathname === '/admin/messages'} icon={<EnvelopeIcon className="w-5 h-5" />}>
                        Messages
                    </SidebarLink>
                </div>

            </nav>
        </aside>
    );
}

function SidebarLink({ to, active, children, icon }) {
    return (
        <Link 
            to={to} 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                active 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            }`}
        >
            {icon}
            <span className="font-medium text-sm">{children}</span>
        </Link>
    );
}