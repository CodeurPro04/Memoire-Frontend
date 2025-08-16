import React from "react";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Globe,
  Home,
  User,
  Stethoscope,
  Calendar,
  Info,
  Newspaper,
  Mail,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ scrollToSection }) => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
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
                  className={`transition-all duration-300 px-3 py-2 rounded-lg text-sm font-medium flex items-center
            ${
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

          {/* Connexion + langues à droite */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant={i18n.language === "fr" ? "default" : "ghost"}
              size="sm"
              onClick={() => changeLanguage("fr")}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${
                i18n.language === "fr"
                  ? "bg-gradient-to-r from-sky-500 to-teal-400 text-white"
                  : "text-black dark:text-white hover:bg-green-100/40 dark:hover:bg-green-900/20"
              }`}
            >
              <img src="/flags/fr.png" alt="Français" className="w-4 h-4" />
              FR
            </Button>

            <Button
              variant={i18n.language === "en" ? "default" : "ghost"}
              size="sm"
              onClick={() => changeLanguage("en")}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${
                i18n.language === "en"
                  ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-white"
                  : "text-black dark:text-white hover:bg-green-100/40 dark:hover:bg-green-900/20"
              }`}
            >
              <img src="/flags/eng.png" alt="English" className="w-4 h-4" />
              EN
            </Button>

            <Button
              variant="default"
              onClick={() => navigate("/login")}
              className="flex items-center bg-gradient-to-r from-sky-500 to-teal-400 hover:bg-emerald-600 text-white"
            >
              <LogIn className="w-5 h-5 mr-2" />
              {t("nav.login")}
            </Button>
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
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden bg-white dark:bg-black border-t border-black/10 dark:border-white/10"
        >
          <div className="px-4 py-4 space-y-4">
            {/* Bloc liens */}
            <div className="space-y-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Button
                    key={link.path}
                    variant="ghost"
                    onClick={() => {
                      navigate(link.path);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full justify-start px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-300
                ${
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

            {/* Bloc langue */}
            <div className="pt-3 border-t border-black/10 dark:border-white/10">
              <p className="text-sm font-medium text-black dark:text-white mb-3 flex items-center">
                <Globe size={16} className="mr-2" />
                {t("nav.language")}
              </p>
              <div className="flex gap-2">
                <Button
                  variant={i18n.language === "fr" ? "default" : "ghost"}
                  onClick={() => changeLanguage("fr")}
                  className={`flex-1 flex items-center gap-2 font-semibold ${
                    i18n.language === "fr"
                      ? "bg-gradient-to-r from-sky-500 to-teal-400 text-white"
                      : "text-black dark:text-white hover:bg-green-100/40 dark:hover:bg-green-900/20"
                  }`}
                >
                  <img src="/flags/fr.png" alt="Français" className="w-4 h-4" />
                  Français
                </Button>

                <Button
                  variant={i18n.language === "en" ? "default" : "ghost"}
                  onClick={() => changeLanguage("en")}
                  className={`flex-1 flex items-center gap-2 font-semibold ${
                    i18n.language === "en"
                      ? "bg-gradient-to-r from-sky-500 to-teal-400 text-white"
                      : "text-black dark:text-white hover:bg-green-100/40 dark:hover:bg-green-900/20"
                  }`}
                >
                  <img src="/flags/eng.png" alt="English" className="w-4 h-4" />
                  English
                </Button>
              </div>
            </div>

            {/* Bloc connexion */}
            <div className="pt-3 border-t border-black/10 dark:border-white/10">
              <Button
                variant="default"
                onClick={() => {
                  navigate("/login");
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-center bg-gradient-to-r from-sky-500 to-teal-400 hover:bg-emerald-600 text-white"
              >
                <LogIn className="w-5 h-5 mr-2" />
                {t("nav.login")}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
