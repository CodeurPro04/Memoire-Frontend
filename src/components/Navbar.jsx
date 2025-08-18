import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Globe,
  Home,
  User,
  Stethoscope,
  Info,
  Newspaper,
  Mail,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

const Navbar = () => {
  const { user, role, logoutUser } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    {
      path: "/",
      labelKey: "nav.home",
      icon: <Home className="w-5 h-5 mr-2" />,
    },
    {
      path: "/trouver-medecin",
      labelKey: "nav.findDoctor",
      icon: <Stethoscope className="w-5 h-5 mr-2" />,
    },
    {
      path: "/specialites",
      labelKey: "nav.specialties",
      icon: <User className="w-5 h-5 mr-2" />,
    },
    {
      path: "/comment-ca-marche",
      labelKey: "nav.howItWorks",
      icon: <Info className="w-5 h-5 mr-2" />,
    },
    {
      path: "/blog",
      labelKey: "nav.blog",
      icon: <Newspaper className="w-5 h-5 mr-2" />,
    },
    {
      path: "/contact",
      labelKey: "nav.contact",
      icon: <Mail className="w-5 h-5 mr-2" />,
    },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-lg border-b border-black/10 dark:border-white/10">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 relative">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex items-center space-x-3"
          >
            <div className="w-24 h-24 flex items-center justify-center">
              <img
                src="/logo/logo1.png"
                alt="KofGo Logo"
                className="w-20 h-20 object-contain"
              />
            </div>
          </motion.div>

          {/* Nav centrée */}
          <div className="hidden md:flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Button
                  key={link.path}
                  variant="ghost"
                  onClick={() => navigate(link.path)}
                  className={`transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium flex items-center ${
                    isActive
                      ? "text-white dark:text-green-400 font-bold bg-gradient-to-r from-sky-500 to-teal-400 dark:bg-green-900/20"
                      : "text-black dark:text-white hover:text-black dark:hover:text-green-400 hover:bg-green-100/40 dark:hover:bg-green-900/20"
                  }`}
                >
                  {link.icon}
                  {t(link.labelKey)}
                </Button>
              );
            })}
          </div>

          {/* Connexion + langues */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Langues */}
            <Button
              variant={i18n.language === "fr" ? "default" : "ghost"}
              size="sm"
              onClick={() => changeLanguage("fr")}
            >
              <img src="/flags/fr.png" alt="FR" className="w-4 h-4" /> FR
            </Button>
            <Button
              variant={i18n.language === "en" ? "default" : "ghost"}
              size="sm"
              onClick={() => changeLanguage("en")}
            >
              <img src="/flags/eng.png" alt="EN" className="w-4 h-4" /> EN
            </Button>

            {/* Bouton Connexion / Profil / Déconnexion */}
            {user ? (
              <div className="flex items-center gap-2">
                {/* Bouton Profil */}
                <Button
                  variant="default"
                  onClick={() =>
                    navigate(
                      role === "patient" ? "/profil-patient" : "/profil-medecin"
                    )
                  }
                  className="flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-teal-400 hover:from-teal-400 hover:to-sky-500 text-white w-10 h-10 p-2 shadow-lg transition-all duration-300"
                >
                  <User className="w-5 h-5" />
                </Button>

                {/* Bouton Déconnexion */}
                <Button
                  variant="outline"
                  onClick={() => {
                    logoutUser();
                    navigate("/");
                  }}
                  className="flex items-center justify-center rounded-full border-red-500 text-red-500 hover:bg-red-500/10 w-10 h-10 p-2 transition-all duration-300"
                >
                  <LogIn className="w-5 h-5 rotate-180" />{" "}
                  {/* icône inversée pour symboliser la sortie */}
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                onClick={() => navigate("/login")}
                className="flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-teal-400 hover:from-teal-400 hover:to-sky-500 text-white w-10 h-10 p-2 shadow-lg transition-all duration-300"
              >
                <LogIn className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-black dark:text-white hover:text-green-700 dark:hover:text-green-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 rounded-md"
            aria-label={t("nav.openMenu")}
          >
            {isMenuOpen ? (
              <X className="w-7 h-7" />
            ) : (
              <Menu className="w-7 h-7" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden bg-white dark:bg-black border-t border-black/10 dark:border-white/10"
        >
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Button
                key={link.path}
                variant="ghost"
                onClick={() => {
                  navigate(link.path);
                  setIsMenuOpen(false);
                }}
                className="w-full justify-start px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                {link.icon} {t(link.labelKey)}
              </Button>
            ))}

            {/* Sélection de langue mobile */}
            <div className="flex items-center justify-start gap-2 px-4 py-2">
              <Button
                variant={i18n.language === "fr" ? "default" : "ghost"}
                size="sm"
                onClick={() => changeLanguage("fr")}
              >
                <img src="/flags/fr.png" alt="FR" className="w-4 h-4" /> FR
              </Button>
              <Button
                variant={i18n.language === "en" ? "default" : "ghost"}
                size="sm"
                onClick={() => changeLanguage("en")}
              >
                <img src="/flags/eng.png" alt="EN" className="w-4 h-4" /> EN
              </Button>
            </div>

            {/* Connexion / Profil / Déconnexion mobile */}
            <div className="flex flex-col gap-2 px-4 py-2">
              {user ? (
                <>
                  <Button
                    variant="default"
                    onClick={() => {
                      navigate(
                        role === "patient"
                          ? "/profil-patient"
                          : "/profil-medecin"
                      );
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-start gap-2 px-4 py-3 bg-gradient-to-r from-sky-500 to-teal-400 hover:from-teal-400 hover:to-sky-500 text-white rounded-lg shadow-lg transition-all duration-300"
                  >
                    <User className="w-5 h-5" />
                    {t("nav.profile")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      logoutUser();
                      navigate("/");
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-start gap-2 px-4 py-3 rounded-lg border-red-500 text-red-500 hover:bg-red-500/10 transition-all duration-300"
                  >
                    <LogIn className="w-5 h-5 rotate-180" />
                    {t("nav.logout")}
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-start gap-2 px-4 py-3 bg-gradient-to-r from-sky-500 to-teal-400 hover:from-teal-400 hover:to-sky-500 text-white rounded-lg shadow-lg transition-all duration-300"
                >
                  <LogIn className="w-5 h-5" />
                  {t("nav.login")}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
