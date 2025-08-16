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
import SingupPage from "@/components/signup/SingupPage";
import SingupMedcin from "@/components/signup/SingupMedcin";
import DocteursPage from "@/components/medécin/DocteursPage";
import MedecinProfilePage from "@/components/medécin/MedecinProfilePage";
import SpecialitePage from "@/components/specialites/SpecialitePage";
import InfosPage from "@/components/infos/InfosPage";
import RealisationsPage from "@/pages/RealisationsPage";
import StartupPage from "@/pages/StartupPage";
import BlogPage from "@/pages/BlogPage";
import BlogDetailPage from "@/pages/BlogDetailPage";
import ContactPage from "@/pages/ContactPage";
import AdminLogin from "@/pages/AdminLogin";
import AdminPage from "@/pages/AdminPage";

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

// Route protégée avec hash
function AdminProtectedRoute({ component: Component }) {
  const { hash } = useParams();
  const validHash = import.meta.env.VITE_ADMIN_HASH;

  if (hash !== validHash) {
    return <Navigate to="/" replace />;
  }

  return <Component />;
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
          <Route path="/register-client" element={<SingupPage />} />
          <Route path="/register-medcin" element={<SingupMedcin />} />
          <Route path="/trouver-medecin" element={<DocteursPage />} />
          <Route path="/profil-medecin/:id" element={<MedecinProfilePage />} />
          <Route path="/specialites" element={<SpecialitePage />} />
          <Route path="/comment-ca-marche" element={<InfosPage />} />
          <Route path="/realisations" element={<RealisationsPage />} />
          <Route path="/startup" element={<StartupPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Routes admin AVEC HASH obligatoire */}
          <Route path="/admin/:hash/login" element={<AdminProtectedRoute component={AdminLogin} />} />
          <Route path="/admin/:hash" element={<AdminProtectedRoute component={AdminPage} />} />

          {/* Redirection des routes inconnues */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
