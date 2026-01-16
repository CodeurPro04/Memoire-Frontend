import Sidebar from '../components/admin/Sidebar';

export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* On affiche le composant Sidebar ici */}
            <Sidebar />

            {/* Zone de droite : On décale avec ml-64 car la sidebar fait 64 unités */}
            <div className="flex-1 md:ml-64">
                <main className="p-8">
                    {/* C'est ici que DashboardPage s'affichera */}
                    {children}
                </main>
            </div>
        </div>
    );
}