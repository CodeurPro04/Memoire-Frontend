import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { LogIn } from "lucide-react";

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Ici tu peux connecter ton backend ou mock
    if (!email || !password) {
      setError(t("login.errorEmpty"));
      return;
    }
    // Redirection fictive après succès
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-sky-800 to-sky-600 flex items-center justify-center relative overflow-hidden py-28">
      
      {/* Particules animées */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-full h-full bg-[url('/grid-pattern.svg')] opacity-20"></div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 max-w-md w-full z-10"
      >
        <div className="text-center mb-8">
          <img
            src="/logo/logo.png"
            alt="Medical Logo"
            className="mx-auto w-24 h-24 object-contain rounded-full shadow-lg mb-4"
          />
          <h2 className="text-3xl font-extrabold text-sky-600 dark:text-green-400 mt-4">
            {t("login.title")}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            {t("login.subtitle")}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("login.email")}
            </label>
            <Input
              type="email"
              placeholder={t("login.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("login.password")}
            </label>
            <Input
              type="password"
              placeholder={t("login.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full flex items-center justify-center bg-gradient-to-r from-sky-500 via-teal-400 to-cyan-400 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-sky-500/40 transition-all duration-300"
          >
            <LogIn className="w-5 h-5 mr-2" />
            {t("login.loginButton")}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t("login.noAccount")}{" "}
            <span
              className="text-sky-500 hover:text-sky-400 cursor-pointer font-semibold"
              onClick={() => navigate("/register-client")}
            >
              {t("login.register")}
            </span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t("login.noAccountt")}{" "}
            <span
              className="text-sky-500 hover:text-sky-400 cursor-pointer font-semibold"
              onClick={() => navigate("/login-medecin")}
            >
              {t("login.registerr")}
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
