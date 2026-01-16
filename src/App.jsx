import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { useTranslation } from "react-i18next";

// Pages
import HomePage from "@/pages/HomePage";
import LoginPage from "@/components/login/LoginPage";
import LoginMedcin from "@/components/login/LoginMedcin";
import LoginClinique from "@/components/login/LoginClinique";
import SingupPage from "@/components/signup/SingupPage";
import SingupMedcin from "@/components/signup/SingupMedcin";
import SingupClinique from "@/components/signup/SingupClinique";
import DocteursPage from "@/components/medécin/DocteursPage";
import MedecinProfilePage from "@/components/medécin/MedecinProfilePage";
import ProfilPage from "@/components/medécin/ProfilPage";
import ProfilePage from "@/components/patient/ProfilePage";
import ProfilClinique from "@/components/clinique/ProfilClinique";
import ProfileClinique from "@/components/clinique/ProfileClinique";
import SpecialitePage from "@/components/specialites/SpecialitePage";
import InfosPage from "@/components/infos/InfosPage";
import RealisationsPage from "@/pages/RealisationsPage";
import StartupPage from "@/pages/StartupPage";
import BlogPage from "@/pages/BlogPage";
import BlogDetailPage from "@/pages/BlogDetailPage";
import ContactPage from "@/pages/ContactPage";
import AdminLogin from "@/pages/AdminLogin";
import AdminPage from "@/pages/AdminPage";
import TelemedicineConsultation from "@/components/patient/TelemedicineConsultation";
import DossierMedical from "@/components/DossierMedical";
import ArretMaladie from "@/components/ArretMaladie";
import Ordonnance from "@/components/Ordonnance";
import DashboardPage from "./pages/DashboardPage";
import DashboardLayout from "./layouts/DashboardLayout";

function Layout({ children }) {
  const location = useLocation();
  const hideNavFooter = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavFooter && <Navbar />}
      <main className="min-h-screen bg-background text-foreground scroll-smooth flex flex-col flex-grow">
        {children}
      </main>
      {!hideNavFooter && <Footer />}
      <Chatbot />
      <Toaster />
    </>
  );
}

// Protection des routes Admin
function AdminProtectedRoute({children, component: Component }) {
  // 1. On récupère le token et le rôle stockés lors du login
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user"); 
  
  // 1. On transforme le string en objet JS
  const user = userString ? JSON.parse(userString) : null;

  // 2. Vérification : si pas de token ou si le rôle n'est pas admin
  if (!token || user?.role !== "admin") {
    // On redirige vers le login admin (ou l'accueil)
    return <Navigate to="/" replace />;
  }

  // 3. Retourne soit le composant passé en prop, soit les enfants (Layout + Page)
  return Component ? <Component /> : children;
}


function App() {
  const { i18n } = useTranslation();

  React.useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Routes publiques */}        
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login-medecin" element={<LoginMedcin />} />
          <Route path="/login-clinique" element={<LoginClinique />} />
          <Route path="/register-client" element={<SingupPage />} />
          <Route path="/register-medcin" element={<SingupMedcin />} />
          <Route path="/register-clinique" element={<SingupClinique />} />
          <Route path="/trouver-medecin" element={<DocteursPage />} />
          <Route path="/profil-medecin/:id" element={<MedecinProfilePage />} />
          <Route path="/profil-medecin" element={<ProfilPage />} />
          <Route path="/profil-patient" element={<ProfilePage />} />
          <Route path="/profil-clinique" element={<ProfilClinique />} />
          <Route path="/profil-clinique/:id" element={<ProfileClinique />} />
          <Route path="/specialites" element={<SpecialitePage />} />
          <Route path="/comment-ca-marche" element={<InfosPage />} />
          <Route path="/realisations" element={<RealisationsPage />} />
          <Route path="/startup" element={<StartupPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/medecin/dossier-medical/:patientId"
            element={<DossierMedical />}
          />
          <Route
            path="/medecin/arret-maladie/:appointmentId"
            element={<ArretMaladie />}
          />
          <Route
            path="/medecin/ordonnance/:appointmentId"
            element={<Ordonnance />}
          />
          <Route
            path="/patient/telemedicine/:appointmentId"
            element={<TelemedicineConsultation />}
          />
          <Route
            path="/medecin/telemedicine/:appointmentId"
            element={<TelemedicineConsultation />}
          />
          {/* Routes admin */}
          <Route
            path="/admin/login"
            element={<AdminLogin/>}
          />

          <Route 
            path="/admin/dashboard" 
            element={
              <AdminProtectedRoute component={() => (
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              )} />
            } 
          />

          <Route
            path="/admin"
            element={<AdminProtectedRoute component={AdminPage} />}
          />
          {/* Redirection des routes inconnues */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
