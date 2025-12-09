import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { UserPlus, MapPin, Phone, Mail, Globe, Lock } from "lucide-react";
import api from "@/api/axios";

const TYPE_ETABLISSEMENT = [
  "Clinique privée",
  "Centre médical",
  "Hôpital",
  "Cabinet de groupe",
  "Polyclinique",
  "Centre de santé",
];

const SignupClinique = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    address: "",
    description: "",
    password: "",
    confirmPassword: "",
    type_etablissement: "",
    urgences_24h: false,
    parking_disponible: false,
    site_web: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.nom ||
      !formData.email ||
      !formData.password ||
      !formData.address
    ) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/clinique/register", {
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        address: formData.address,
        description: formData.description,
        password: formData.password,
        type_etablissement: formData.type_etablissement,
        urgences_24h: formData.urgences_24h,
        parking_disponible: formData.parking_disponible,
        site_web: formData.site_web,
      });
      navigate("/login-clinique");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur serveur, réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-sky-800 to-sky-600 flex items-center justify-center py-28 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-white/95 dark:bg-black/85 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 max-w-2xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="/logo/meetmed2.png"
            alt="Medical Logo"
            className="mx-auto w-24 h-24 object-contain rounded-full shadow-lg mb-4"
          />
          <h2 className="text-3xl font-extrabold text-sky-600 dark:text-green-400 mt-4">
            Inscription Clinique
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Enregistrez votre établissement médical sur MeetMed
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Nom de la clinique */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Nom de l'établissement *
            </label>
            <div className="relative">
              <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Ex: Clinique Santé Plus"
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Email & Téléphone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@clinique.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="+225 XX XX XX XX XX"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Adresse */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Adresse *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Adresse complète de la clinique"
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Type d'établissement */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Type d'établissement
            </label>
            <select
              name="type_etablissement"
              value={formData.type_etablissement}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            >
              <option value="">Sélectionner...</option>
              {TYPE_ETABLISSEMENT.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Site web */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Site web
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                name="site_web"
                value={formData.site_web}
                onChange={handleChange}
                placeholder="https://www.votreclinique.com"
                className="pl-10"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Présentez votre établissement, vos services et spécialités..."
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Options */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="urgences_24h"
                checked={formData.urgences_24h}
                onChange={handleChange}
                className="w-5 h-5 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Urgences 24h/24
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="parking_disponible"
                checked={formData.parking_disponible}
                onChange={handleChange}
                className="w-5 h-5 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Parking disponible
              </span>
            </label>
          </div>

          {/* Mot de passe */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Mot de passe *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Entrez votre mot de passe"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Confirmer le mot de passe *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Entrez a nouveau le mot de passe"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-500 via-teal-400 to-cyan-400 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-sky-500/40 transition-all duration-300"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Inscription en cours...
              </span>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2 inline" />
                Créer mon compte
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Vous avez déjà un compte ?{" "}
            <span
              onClick={() => navigate("/login-clinique")}
              className="text-sky-500 hover:text-sky-400 cursor-pointer font-semibold"
            >
              Se connecter
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupClinique;
