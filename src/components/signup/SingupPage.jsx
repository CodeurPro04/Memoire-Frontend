import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { UserPlus } from "lucide-react";

const SingupPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !phone || !address) {
      setError(t("signup.errorEmpty"));
      return;
    }
    // Ici, appeler ton backend pour créer le client
    navigate("/login");
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
            alt="Logo"
            className="mx-auto w-24 h-24 object-contain rounded-full shadow-lg mb-4"
          />
          <h2 className="text-3xl font-extrabold text-sky-600 dark:text-green-400 mt-4">
            {t("signup.titleClient")}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            {t("signup.subtitleClient")}
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Première ligne : prénom + nom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("signup.firstName")}
              </label>
              <Input
                type="text"
                placeholder={t("signup.firstNamePlaceholder")}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("signup.lastName")}
              </label>
              <Input
                type="text"
                placeholder={t("signup.lastNamePlaceholder")}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Deuxième ligne : email + téléphone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("signup.email")}
              </label>
              <Input
                type="email"
                placeholder={t("signup.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("signup.phone")}
              </label>
              <Input
                type="text"
                placeholder={t("signup.phonePlaceholder")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Troisième ligne : mot de passe + adresse */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("signup.password")}
              </label>
              <Input
                type="password"
                placeholder={t("signup.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("signup.address")}
              </label>
              <Input
                type="text"
                placeholder={t("signup.addressPlaceholder")}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full flex items-center justify-center bg-gradient-to-r from-sky-500 via-teal-400 to-cyan-400 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-sky-500/40 transition-all duration-300"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            {t("signup.signupButton")}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t("signup.alreadyAccount")}{" "}
            <span
              className="text-sky-500 hover:text-sky-400 cursor-pointer font-semibold"
              onClick={() => navigate("/login")}
            >
              {t("signup.login")}
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SingupPage;
