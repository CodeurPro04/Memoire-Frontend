import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import Textarea from "@/components/ui/textarea";
import {
  LogIn,
  UserPlus,
  User,
  Stethoscope,
  Building2,
  ArrowLeft,
  Mail,
  Lock,
  Phone,
  MapPin,
  Search,
  ChevronDown,
  ChevronUp,
  Globe,
} from "lucide-react";
import api from "@/api/axios";
import { AuthContext } from "@/context/AuthContext";

const SPECIALITES = [
  "Médecine générale",
  "Cardiologie",
  "Dermatologie",
  "Pédiatrie",
  "Gynécologie",
  "Orthopédie",
  "Neurologie",
  "Psychiatrie",
  "Ophtalmologie",
  "ORL",
  "Gastro-entérologie",
  "Endocrinologie",
];

const TYPE_ETABLISSEMENT = [
  "Clinique privée",
  "Centre médical",
  "Hôpital",
  "Cabinet de groupe",
  "Polyclinique",
  "Centre de santé",
];

const UnifiedAuthPage = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const [mode, setMode] = useState("login");
  const [userType, setUserType] = useState("");
  const [step, setStep] = useState(1);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [patientData, setPatientData] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    address: "",
    password: "",
    confirmPassword: "",
    groupe_sanguin: "",
    serologie_vih: "",
    antecedents_medicaux: "",
    allergies: "",
    traitements_chroniques: "",
  });

  const [medecinData, setMedecinData] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    specialite: "",
    address: "",
    password: "",
    confirmPassword: "",
    type: "independent",
    clinique_id: "",
    fonction: "",
    commune: "",
    ville: "",
  });

  const [cliniqueData, setCliniqueData] = useState({
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
  const [searchSpecialty, setSearchSpecialty] = useState("");
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false);
  const [cliniques, setCliniques] = useState([]);
  const [searchClinique, setSearchClinique] = useState("");
  const [showCliniqueDropdown, setShowCliniqueDropdown] = useState(false);

  const filteredSpecialties = SPECIALITES.filter((s) =>
    s.toLowerCase().includes(searchSpecialty.toLowerCase())
  );

  const filteredCliniques = cliniques.filter((c) =>
    c.nom.toLowerCase().includes(searchClinique.toLowerCase())
  );

  React.useEffect(() => {
    if (medecinData.type === "clinique") {
      api
        .get("/cliniques")
        .then(({ data }) => setCliniques(Array.isArray(data) ? data : []))
        .catch((err) => console.error("Erreur:", err));
    }
  }, [medecinData.type]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword || !userType) {
      setError(
        "Veuillez remplir tous les champs et sélectionner un type de compte"
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const endpoints = {
        patient: "/patient/login",
        medecin: "/medecin/login",
        clinique: "/clinique/login",
      };

      const response = await api.post(endpoints[userType], {
        email: loginEmail,
        password: loginPassword,
      });

      const userData = response.data[userType];
      const accessToken = response.data.access_token;

      loginUser(userData, userType, accessToken);

      const redirects = {
        patient: "/profil-patient",
        medecin: "/profil-medecin",
        clinique: "/profil-clinique",
      };

      navigate(redirects[userType]);
    } catch (err) {
      setError(
        err.response?.data?.message || "Email ou mot de passe incorrect"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSignup = async (e) => {
    e.preventDefault();

    if (step === 1) {
      if (
        !patientData.prenom ||
        !patientData.nom ||
        !patientData.email ||
        !patientData.telephone ||
        !patientData.address
      ) {
        setError("Veuillez remplir tous les champs obligatoires");
        return;
      }
      setError("");
      setStep(2);
      return;
    }

    if (step === 2) {
      setError("");
      setStep(3);
      return;
    }

    if (step === 3) {
      if (patientData.password !== patientData.confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
        return;
      }
      if (patientData.password.length < 8) {
        setError("Le mot de passe doit contenir au moins 8 caractères");
        return;
      }

      setLoading(true);
      setError("");

      try {
        await api.post("/patient/register", {
          nom: patientData.nom,
          prenom: patientData.prenom,
          email: patientData.email,
          telephone: patientData.telephone,
          address: patientData.address,
          password: patientData.password,
          groupe_sanguin: patientData.groupe_sanguin || null,
          serologie_vih: patientData.serologie_vih || null,
          antecedents_medicaux: patientData.antecedents_medicaux || null,
          allergies: patientData.allergies || null,
          traitements_chroniques: patientData.traitements_chroniques || null,
        });

        setMode("login");
        setUserType("patient");
        setStep(1);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Erreur lors de l'inscription");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMedecinSignup = async (e) => {
    e.preventDefault();

    if (step === 1) {
      if (
        !medecinData.prenom ||
        !medecinData.nom ||
        !medecinData.email ||
        !medecinData.telephone
      ) {
        setError("Veuillez remplir tous les champs");
        return;
      }
      setError("");
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!medecinData.specialite || !medecinData.address) {
        setError("Veuillez remplir tous les champs");
        return;
      }
      if (medecinData.type === "clinique" && !medecinData.clinique_id) {
        setError("Veuillez sélectionner une clinique");
        return;
      }
      setError("");
      setStep(3);
      return;
    }

    if (medecinData.password !== medecinData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const signupData = {
        prenom: medecinData.prenom,
        nom: medecinData.nom,
        email: medecinData.email,
        telephone: medecinData.telephone,
        specialite: medecinData.specialite,
        address: medecinData.address,
        password: medecinData.password,
        type: medecinData.type,
        commune: medecinData.commune || null,
        ville: medecinData.ville || null,
      };

      if (medecinData.type === "clinique") {
        signupData.clinique_id = medecinData.clinique_id;
        signupData.fonction = medecinData.fonction || "Médecin";
      }

      await api.post("/medecin/register", signupData);

      setMode("login");
      setUserType("medecin");
      setStep(1);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const handleCliniqueSignup = async (e) => {
    e.preventDefault();

    if (step === 1) {
      if (
        !cliniqueData.nom ||
        !cliniqueData.email ||
        !cliniqueData.telephone ||
        !cliniqueData.address
      ) {
        setError("Veuillez remplir tous les champs obligatoires");
        return;
      }
      setError("");
      setStep(2);
      return;
    }

    if (cliniqueData.password !== cliniqueData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/clinique/register", cliniqueData);

      setMode("login");
      setUserType("clinique");
      setStep(1);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const resetToLogin = () => {
    setMode("login");
    setStep(1);
    setError("");
  };

  const resetToSelectType = () => {
    setMode("select-type");
    setStep(1);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-sky-800 to-sky-600 flex items-center justify-center relative overflow-hidden p-4">
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-full h-full bg-[url('/grid-pattern.svg')] opacity-20"></div>
      </motion.div>

      <AnimatePresence mode="wait">
        {mode === "login" ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="relative bg-white/95 dark:bg-black/85 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md z-10"
          >
            <div className="text-center mb-6">
              <img
                src="/logo/meetmed2.png"
                alt="Medical Logo"
                className="mx-auto w-20 h-20 object-contain rounded-full shadow-lg mb-3"
              />
              <h2 className="text-2xl font-extrabold text-sky-600 dark:text-green-400">
                Connexion
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                Accédez à votre espace MeetMed
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs text-center">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Je suis un(e) *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      type: "patient",
                      icon: User,
                      label: "Patient",
                      color: "emerald",
                    },
                    {
                      type: "medecin",
                      icon: Stethoscope,
                      label: "Médecin",
                      color: "blue",
                    },
                    {
                      type: "clinique",
                      icon: Building2,
                      label: "Clinique",
                      color: "purple",
                    },
                  ].map(({ type, icon: Icon, label, color }) => (
                    <motion.div
                      key={type}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setUserType(type)}
                      className={`cursor-pointer p-3 rounded-xl border-2 transition-all ${
                        userType === type
                          ? `border-${color}-500 bg-${color}-50 dark:bg-${color}-900/30`
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 mx-auto mb-1 ${
                          userType === type
                            ? `text-${color}-600`
                            : "text-gray-500"
                        }`}
                      />
                      <p className="text-[10px] font-medium text-center">
                        {label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="pl-9 h-10 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="pl-9 h-10 text-sm"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !userType}
                className="w-full bg-gradient-to-r from-sky-500 via-teal-400 to-cyan-400 text-white font-bold py-2.5 rounded-xl shadow-lg hover:shadow-sky-500/40 transition-all duration-300 text-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connexion...
                  </span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2 inline" />
                    Se connecter
                  </>
                )}
              </Button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Vous n'avez pas de compte ?{" "}
                <span
                  onClick={resetToSelectType}
                  className="text-sky-500 hover:text-sky-400 cursor-pointer font-semibold"
                >
                  S'inscrire
                </span>
              </p>
            </div>
          </motion.div>
        ) : mode === "select-type" ? (
          <motion.div
            key="select-type"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="relative bg-white/95 dark:bg-black/85 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-3xl z-10"
          >
            <button
              onClick={resetToLogin}
              className="absolute top-4 left-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-extrabold text-sky-600 dark:text-green-400">
                Créer un compte
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                Sélectionnez votre type de compte
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  type: "patient",
                  icon: User,
                  label: "Patient",
                  desc: "Trouvez et consultez des médecins",
                  color: "emerald",
                },
                {
                  type: "medecin",
                  icon: Stethoscope,
                  label: "Médecin",
                  desc: "Gérez vos consultations",
                  color: "blue",
                },
                {
                  type: "clinique",
                  icon: Building2,
                  label: "Clinique",
                  desc: "Enregistrez votre établissement",
                  color: "purple",
                },
              ].map(({ type, icon: Icon, label, desc, color }) => (
                <motion.div
                  key={type}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setUserType(type);
                    setMode("signup");
                  }}
                  className={`cursor-pointer p-6 rounded-2xl border-2 border-gray-300 dark:border-gray-600 hover:border-${color}-500 hover:bg-${color}-50 dark:hover:bg-${color}-900/20 transition-all`}
                >
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-3 bg-${color}-100 dark:bg-${color}-900/30 rounded-full flex items-center justify-center`}
                    >
                      <Icon className={`w-8 h-8 text-${color}-600`} />
                    </div>
                    <h3 className="text-lg font-bold mb-1 text-gray-800 dark:text-gray-200">
                      {label}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Vous avez déjà un compte ?{" "}
                <span
                  onClick={resetToLogin}
                  className="text-sky-500 hover:text-sky-400 cursor-pointer font-semibold"
                >
                  Se connecter
                </span>
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="relative bg-white/95 dark:bg-black/85 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-2xl z-10"
          >
            <button
              onClick={() =>
                step === 1 ? resetToSelectType() : setStep(step - 1)
              }
              className="absolute top-4 left-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-extrabold text-sky-600 dark:text-green-400">
                Inscription{" "}
                {userType === "patient"
                  ? "Patient"
                  : userType === "medecin"
                  ? "Médecin"
                  : "Clinique"}
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                Étape {step} / 3
              </p>
            </div>

            {error && (
              <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs text-center">
                {error}
              </div>
            )}

            {userType === "patient" && (
              <form onSubmit={handlePatientSignup} className="space-y-4">
                {step === 1 ? (
                  // Étape 1: Informations personnelles
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Prénom *
                        </label>
                        <Input
                          value={patientData.prenom}
                          onChange={(e) =>
                            setPatientData({
                              ...patientData,
                              prenom: e.target.value,
                            })
                          }
                          placeholder="Votre prénom"
                          className="h-10 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Nom *
                        </label>
                        <Input
                          value={patientData.nom}
                          onChange={(e) =>
                            setPatientData({
                              ...patientData,
                              nom: e.target.value,
                            })
                          }
                          placeholder="Votre nom"
                          className="h-10 text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email *
                        </label>
                        <Input
                          type="email"
                          value={patientData.email}
                          onChange={(e) =>
                            setPatientData({
                              ...patientData,
                              email: e.target.value,
                            })
                          }
                          placeholder="votre@email.com"
                          className="h-10 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Téléphone *
                        </label>
                        <Input
                          value={patientData.telephone}
                          onChange={(e) =>
                            setPatientData({
                              ...patientData,
                              telephone: e.target.value,
                            })
                          }
                          placeholder="+225 XX XX XX XX"
                          className="h-10 text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Adresse *
                      </label>
                      <Input
                        value={patientData.address}
                        onChange={(e) =>
                          setPatientData({
                            ...patientData,
                            address: e.target.value,
                          })
                        }
                        placeholder="Votre adresse complète"
                        className="h-10 text-sm"
                        required
                      />
                    </div>
                  </>
                ) : step === 2 ? (
                  // Étape 2: Informations médicales facultatives
                  <>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Informations médicales (facultatives)
                      </h3>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Groupe sanguin
                          </label>
                          <select
                            value={patientData.groupe_sanguin || ""}
                            onChange={(e) =>
                              setPatientData({
                                ...patientData,
                                groupe_sanguin: e.target.value,
                              })
                            }
                            className="w-full h-10 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                          >
                            <option value="">Sélectionnez</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Sérologie VIH
                          </label>
                          <select
                            value={patientData.serologie_vih || ""}
                            onChange={(e) =>
                              setPatientData({
                                ...patientData,
                                serologie_vih: e.target.value,
                              })
                            }
                            className="w-full h-10 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                          >
                            <option value="">Statut sérologique</option>
                            <option value="negatif">Négatif</option>
                            <option value="positif">Positif</option>
                            <option value="inconnu">Inconnu</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-3 space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Antécédents médicaux
                          </label>
                          <Textarea
                            value={patientData.antecedents_medicaux || ""}
                            onChange={(e) =>
                              setPatientData({
                                ...patientData,
                                antecedents_medicaux: e.target.value,
                              })
                            }
                            placeholder="Maladies chroniques, interventions chirurgicales, antécédents familiaux..."
                            className="min-h-[80px] text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Allergies
                          </label>
                          <Textarea
                            value={patientData.allergies || ""}
                            onChange={(e) =>
                              setPatientData({
                                ...patientData,
                                allergies: e.target.value,
                              })
                            }
                            placeholder="Allergies médicamenteuses, alimentaires, environnementales..."
                            className="min-h-[60px] text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Traitements chroniques
                          </label>
                          <Textarea
                            value={patientData.traitements_chroniques || ""}
                            onChange={(e) =>
                              setPatientData({
                                ...patientData,
                                traitements_chroniques: e.target.value,
                              })
                            }
                            placeholder="Médicaments pris régulièrement, traitements en cours..."
                            className="min-h-[60px] text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Étape 3: Mot de passe
                  <>
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Création du mot de passe
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Choisissez un mot de passe sécurisé pour votre compte
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Mot de passe *
                        </label>
                        <Input
                          type="password"
                          value={patientData.password}
                          onChange={(e) =>
                            setPatientData({
                              ...patientData,
                              password: e.target.value,
                            })
                          }
                          placeholder="••••••••"
                          className="h-10 text-sm"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Minimum 8 caractères avec des chiffres et lettres
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Confirmer le mot de passe *
                        </label>
                        <Input
                          type="password"
                          value={patientData.confirmPassword}
                          onChange={(e) =>
                            setPatientData({
                              ...patientData,
                              confirmPassword: e.target.value,
                            })
                          }
                          placeholder="••••••••"
                          className="h-10 text-sm"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-sky-500 via-teal-400 to-cyan-400 text-white font-bold py-2.5 rounded-xl shadow-lg hover:shadow-sky-500/40 transition-all duration-300 text-sm"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Inscription...
                    </span>
                  ) : (
                    <>{step === 3 ? "S'inscrire" : "Continuer"}</>
                  )}
                </Button>
              </form>
            )}

            {userType === "medecin" && (
              <form onSubmit={handleMedecinSignup} className="space-y-4">
                {step === 1 ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Prénom *
                        </label>
                        <Input
                          value={medecinData.prenom}
                          onChange={(e) =>
                            setMedecinData({
                              ...medecinData,
                              prenom: e.target.value,
                            })
                          }
                          placeholder="Votre prénom"
                          className="h-10 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Nom *
                        </label>
                        <Input
                          value={medecinData.nom}
                          onChange={(e) =>
                            setMedecinData({
                              ...medecinData,
                              nom: e.target.value,
                            })
                          }
                          placeholder="Votre nom"
                          className="h-10 text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email *
                        </label>
                        <Input
                          type="email"
                          value={medecinData.email}
                          onChange={(e) =>
                            setMedecinData({
                              ...medecinData,
                              email: e.target.value,
                            })
                          }
                          placeholder="votre@email.com"
                          className="h-10 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Téléphone *
                        </label>
                        <Input
                          value={medecinData.telephone}
                          onChange={(e) =>
                            setMedecinData({
                              ...medecinData,
                              telephone: e.target.value,
                            })
                          }
                          placeholder="+225 XX XX XX XX"
                          className="h-10 text-sm"
                          required
                        />
                      </div>
                    </div>
                  </>
                ) : step === 2 ? (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type de pratique *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          {
                            value: "independent",
                            icon: User,
                            label: "Indépendant",
                            desc: "Cabinet privé",
                          },
                          {
                            value: "clinique",
                            icon: Building2,
                            label: "En clinique",
                            desc: "Établissement",
                          },
                        ].map(({ value, icon: Icon, label, desc }) => (
                          <div
                            key={value}
                            onClick={() =>
                              setMedecinData({
                                ...medecinData,
                                type: value,
                                clinique_id: "",
                                fonction: "",
                              })
                            }
                            className={`cursor-pointer p-3 rounded-xl border-2 transition-all ${
                              medecinData.type === value
                                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                                : "border-gray-300 dark:border-gray-600 hover:border-emerald-300"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Icon
                                className={`w-4 h-4 ${
                                  medecinData.type === value
                                    ? "text-emerald-600"
                                    : "text-gray-500"
                                }`}
                              />
                              <div>
                                <p className="font-medium text-xs">{label}</p>
                                <p className="text-[10px] text-gray-500">
                                  {desc}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {medecinData.type === "clinique" && (
                      <div className="space-y-3">
                        <div className="relative">
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Clinique *
                          </label>
                          <div
                            onClick={() =>
                              setShowCliniqueDropdown(!showCliniqueDropdown)
                            }
                            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg cursor-pointer px-3 py-2.5 flex justify-between items-center hover:border-blue-400 transition-all"
                          >
                            <span className="text-sm">
                              {medecinData.clinique_id
                                ? cliniques.find(
                                    (c) => c.id === medecinData.clinique_id
                                  )?.nom
                                : "Sélectionner une clinique"}
                            </span>
                            {showCliniqueDropdown ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>

                          <AnimatePresence>
                            {showCliniqueDropdown && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto"
                              >
                                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                  <div className="relative">
                                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                      type="text"
                                      placeholder="Rechercher une clinique..."
                                      value={searchClinique}
                                      onChange={(e) =>
                                        setSearchClinique(e.target.value)
                                      }
                                      className="pl-8 h-8 text-sm border-0 focus:ring-0"
                                    />
                                  </div>
                                </div>

                                {filteredCliniques.length > 0 ? (
                                  filteredCliniques.map((clinique) => (
                                    <div
                                      key={clinique.id}
                                      onClick={() => {
                                        setMedecinData({
                                          ...medecinData,
                                          clinique_id: clinique.id,
                                        });
                                        setShowCliniqueDropdown(false);
                                        setSearchClinique("");
                                      }}
                                      className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-0"
                                    >
                                      <p className="font-medium text-sm">
                                        {clinique.nom}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {clinique.address}
                                      </p>
                                    </div>
                                  ))
                                ) : (
                                  <div className="p-4 text-center text-gray-500 text-sm">
                                    Aucune clinique trouvée
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Fonction
                          </label>
                          <Input
                            value={medecinData.fonction}
                            onChange={(e) =>
                              setMedecinData({
                                ...medecinData,
                                fonction: e.target.value,
                              })
                            }
                            placeholder="Ex: Médecin généraliste, Chirurgien..."
                            className="h-10 text-sm"
                          />
                        </div>
                      </div>
                    )}

                    <div className="relative">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Spécialité *
                      </label>
                      <div
                        onClick={() =>
                          setShowSpecialtyDropdown(!showSpecialtyDropdown)
                        }
                        className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg cursor-pointer px-3 py-2.5 flex justify-between items-center hover:border-blue-400 transition-all"
                      >
                        <span className="text-sm">
                          {medecinData.specialite ||
                            "Sélectionner une spécialité"}
                        </span>
                        {showSpecialtyDropdown ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>

                      <AnimatePresence>
                        {showSpecialtyDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto"
                          >
                            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                              <div className="relative">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                  type="text"
                                  placeholder="Rechercher une spécialité..."
                                  value={searchSpecialty}
                                  onChange={(e) =>
                                    setSearchSpecialty(e.target.value)
                                  }
                                  className="pl-8 h-8 text-sm border-0 focus:ring-0"
                                />
                              </div>
                            </div>

                            {filteredSpecialties.map((specialite) => (
                              <div
                                key={specialite}
                                onClick={() => {
                                  setMedecinData({
                                    ...medecinData,
                                    specialite,
                                  });
                                  setShowSpecialtyDropdown(false);
                                  setSearchSpecialty("");
                                }}
                                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-0"
                              >
                                <p className="text-sm">{specialite}</p>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Adresse professionnelle *
                      </label>
                      <Input
                        value={medecinData.address}
                        onChange={(e) =>
                          setMedecinData({
                            ...medecinData,
                            address: e.target.value,
                          })
                        }
                        placeholder="Adresse complète de votre cabinet ou clinique"
                        className="h-10 text-sm"
                        required
                      />
                    </div>

                    {/* Nouveaux champs commune et ville */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Commune
                        </label>
                        <Input
                          value={medecinData.commune || ""}
                          onChange={(e) =>
                            setMedecinData({
                              ...medecinData,
                              commune: e.target.value,
                            })
                          }
                          placeholder="Ex: Cocody, Yopougon, Abobo..."
                          className="h-10 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Ville
                        </label>
                        <Input
                          value={medecinData.ville || ""}
                          onChange={(e) =>
                            setMedecinData({
                              ...medecinData,
                              ville: e.target.value,
                            })
                          }
                          placeholder="Ex: Abidjan, Bouaké, Korhogo..."
                          className="h-10 text-sm"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Création du mot de passe
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Choisissez un mot de passe sécurisé pour votre compte
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Mot de passe *
                        </label>
                        <Input
                          type="password"
                          value={medecinData.password}
                          onChange={(e) =>
                            setMedecinData({
                              ...medecinData,
                              password: e.target.value,
                            })
                          }
                          placeholder="••••••••"
                          className="h-10 text-sm"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Minimum 8 caractères avec des chiffres et lettres
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Confirmer le mot de passe *
                        </label>
                        <Input
                          type="password"
                          value={medecinData.confirmPassword}
                          onChange={(e) =>
                            setMedecinData({
                              ...medecinData,
                              confirmPassword: e.target.value,
                            })
                          }
                          placeholder="••••••••"
                          className="h-10 text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                        Récapitulatif de votre inscription
                      </h4>
                      <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                        <p>
                          <strong>Nom:</strong> {medecinData.prenom}{" "}
                          {medecinData.nom}
                        </p>
                        <p>
                          <strong>Email:</strong> {medecinData.email}
                        </p>
                        <p>
                          <strong>Téléphone:</strong> {medecinData.telephone}
                        </p>
                        <p>
                          <strong>Spécialité:</strong> {medecinData.specialite}
                        </p>
                        <p>
                          <strong>Type:</strong>{" "}
                          {medecinData.type === "independent"
                            ? "Indépendant"
                            : "En clinique"}
                        </p>
                        {medecinData.commune && (
                          <p>
                            <strong>Commune:</strong> {medecinData.commune}
                          </p>
                        )}
                        {medecinData.ville && (
                          <p>
                            <strong>Ville:</strong> {medecinData.ville}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-sky-500 via-teal-400 to-cyan-400 text-white font-bold py-2.5 rounded-xl shadow-lg hover:shadow-sky-500/40 transition-all duration-300 text-sm"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Inscription...
                    </span>
                  ) : (
                    <>{step === 3 ? "S'inscrire" : "Continuer"}</>
                  )}
                </Button>
              </form>
            )}

            {userType === "clinique" && (
              <form onSubmit={handleCliniqueSignup} className="space-y-4">
                {step === 1 ? (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nom de la clinique *
                      </label>
                      <Input
                        value={cliniqueData.nom}
                        onChange={(e) =>
                          setCliniqueData({
                            ...cliniqueData,
                            nom: e.target.value,
                          })
                        }
                        placeholder="Nom de votre établissement"
                        className="h-10 text-sm"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email *
                        </label>
                        <Input
                          type="email"
                          value={cliniqueData.email}
                          onChange={(e) =>
                            setCliniqueData({
                              ...cliniqueData,
                              email: e.target.value,
                            })
                          }
                          placeholder="contact@clinique.com"
                          className="h-10 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Téléphone *
                        </label>
                        <Input
                          value={cliniqueData.telephone}
                          onChange={(e) =>
                            setCliniqueData({
                              ...cliniqueData,
                              telephone: e.target.value,
                            })
                          }
                          placeholder="+225 XX XX XX XX"
                          className="h-10 text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Adresse *
                      </label>
                      <Input
                        value={cliniqueData.address}
                        onChange={(e) =>
                          setCliniqueData({
                            ...cliniqueData,
                            address: e.target.value,
                          })
                        }
                        placeholder="Adresse complète de l'établissement"
                        className="h-10 text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Type d'établissement *
                      </label>
                      <select
                        value={cliniqueData.type_etablissement}
                        onChange={(e) =>
                          setCliniqueData({
                            ...cliniqueData,
                            type_etablissement: e.target.value,
                          })
                        }
                        className="w-full h-10 px-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        required
                      >
                        <option value="">Sélectionnez un type</option>
                        {TYPE_ETABLISSEMENT.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Site web
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="url"
                          value={cliniqueData.site_web}
                          onChange={(e) =>
                            setCliniqueData({
                              ...cliniqueData,
                              site_web: e.target.value,
                            })
                          }
                          placeholder="https://www.votre-clinique.com"
                          className="pl-9 h-10 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <Textarea
                        value={cliniqueData.description}
                        onChange={(e) =>
                          setCliniqueData({
                            ...cliniqueData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Description de votre établissement, services proposés..."
                        className="min-h-[80px] text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="urgences_24h"
                          checked={cliniqueData.urgences_24h}
                          onChange={(e) =>
                            setCliniqueData({
                              ...cliniqueData,
                              urgences_24h: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
                        />
                        <label
                          htmlFor="urgences_24h"
                          className="text-xs font-medium text-gray-700 dark:text-gray-300"
                        >
                          Urgences 24h/24
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="parking_disponible"
                          checked={cliniqueData.parking_disponible}
                          onChange={(e) =>
                            setCliniqueData({
                              ...cliniqueData,
                              parking_disponible: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
                        />
                        <label
                          htmlFor="parking_disponible"
                          className="text-xs font-medium text-gray-700 dark:text-gray-300"
                        >
                          Parking disponible
                        </label>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Mot de passe *
                        </label>
                        <Input
                          type="password"
                          value={cliniqueData.password}
                          onChange={(e) =>
                            setCliniqueData({
                              ...cliniqueData,
                              password: e.target.value,
                            })
                          }
                          placeholder="••••••••"
                          className="h-10 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Confirmer *
                        </label>
                        <Input
                          type="password"
                          value={cliniqueData.confirmPassword}
                          onChange={(e) =>
                            setCliniqueData({
                              ...cliniqueData,
                              confirmPassword: e.target.value,
                            })
                          }
                          placeholder="••••••••"
                          className="h-10 text-sm"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-sky-500 via-teal-400 to-cyan-400 text-white font-bold py-2.5 rounded-xl shadow-lg hover:shadow-sky-500/40 transition-all duration-300 text-sm"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Inscription...
                    </span>
                  ) : (
                    <>{step === 1 ? "Continuer" : "S'inscrire"}</>
                  )}
                </Button>
              </form>
            )}

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Vous avez déjà un compte ?{" "}
                <span
                  onClick={resetToLogin}
                  className="text-sky-500 hover:text-sky-400 cursor-pointer font-semibold"
                >
                  Se connecter
                </span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UnifiedAuthPage;
