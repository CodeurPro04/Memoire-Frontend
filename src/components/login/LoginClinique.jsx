import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Building2, LogIn, Mail, Lock } from "lucide-react";
import api from "@/api/axios";
import { AuthContext } from "@/context/AuthContext";

const LoginClinique = () => {
  const { t } = useTranslation();
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/clinique/login", { email, password });
      const clinique = response.data.clinique;
      const accessToken = response.data.access_token;
      loginUser(clinique, "clinique", accessToken);
      navigate("/profil-clinique");
    } catch (err) {
      setError(
        err.response?.data?.message || "Email ou mot de passe incorrect"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-sky-800 to-sky-600 flex items-center justify-center relative overflow-hidden py-28">
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-full h-full bg-[url('/grid-pattern.svg')] opacity-20"></div>
      </motion.div>

      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative bg-white/95 dark:bg-black/85 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-md w-full z-10"
      >
        <div className="text-center mb-8">
          <img
            src="/logo/meetmed2.png"
            alt="Medical Logo"
            className="mx-auto w-24 h-24 object-contain rounded-full shadow-lg mb-4"
          />
          <h2 className="text-3xl font-extrabold text-sky-600 dark:text-green-400 mt-4">
            {t("loginn.titleee")}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            {t("loginn.subtitlee")}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Contact@clinique.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-gradient-to-r from-sky-500 via-teal-400 to-cyan-400 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-sky-500/40 transition-all duration-300"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connexion...
              </span>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Se connecter
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t("login.noAccount")}{" "}
            <span
              className="text-sky-500 hover:text-sky-400 cursor-pointer font-semibold"
              onClick={() => navigate("/register-clinique")}
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
              {t("loginn.registerrr")}
            </span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t("login.noAccounttt")}{" "}
            <span
              className="text-sky-500 hover:text-sky-400 cursor-pointer font-semibold"
              onClick={() => navigate("/login")}
            >
              {t("login.registerr")}
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginClinique;
