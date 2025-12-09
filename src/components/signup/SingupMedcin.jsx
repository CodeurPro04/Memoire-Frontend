import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UserPlus,
  Search,
  Building2,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import api from "@/api/axios";

const SPECIALITES = [
  // 🌍 Médecine générale et interne
  "Médecine générale",
  "Médecine interne",
  "Médecine familiale",
  "Médecine hospitalière",
  "Médecine de premier recours",

  // ❤️ Appareil cardiovasculaire
  "Cardiologie",
  "Chirurgie cardiaque",
  "Angiologie",
  "Médecine vasculaire",
  "Hypertension artérielle clinique",

  // 🧠 Système nerveux
  "Neurologie",
  "Neurochirurgie",
  "Neuroradiologie",
  "Neurophysiologie clinique",
  "Psychiatrie",
  "Psychologie médicale",
  "Addictologie",

  // 💉 Sang, immunité, infections
  "Hématologie",
  "Immunologie",
  "Allergologie",
  "Infectiologie",
  "Maladies infectieuses et tropicales",
  "Vaccinologie",

  // 🌬️ Appareil respiratoire
  "Pneumologie",
  "Médecine du sommeil",
  "Chirurgie thoracique",

  // 🍽️ Appareil digestif
  "Gastro-entérologie",
  "Hépatologie",
  "Proctologie",
  "Chirurgie digestive",
  "Nutrition",
  "Diététique médicale",

  // 🧬 Endocrine, métabolisme et rein
  "Endocrinologie",
  "Diabétologie",
  "Néphrologie",
  "Urologie",
  "Andrologie",

  // 🦴 Appareil locomoteur
  "Rhumatologie",
  "Orthopédie et Traumatologie",
  "Chirurgie de la main",
  "Médecine du sport",
  "Rééducation fonctionnelle",
  "Kinésithérapie médicale",

  // 👶 Femmes et enfants
  "Gynécologie médicale",
  "Gynécologie-obstétrique",
  "Obstétrique",
  "Pédiatrie",
  "Néonatologie",
  "Médecine de l’adolescent",

  // 👁️ Organes des sens
  "Ophtalmologie",
  "Oto-rhino-laryngologie (ORL)",
  "Audiologie",
  "Phoniatrie",
  "Chirurgie cervico-faciale",
  "Stomatologie",
  "Chirurgie dentaire",

  // 🧴 Peau et apparence
  "Dermatologie",
  "Médecine esthétique",
  "Chirurgie plastique",
  "Chirurgie reconstructrice",
  "Brûlologie",

  // 🎯 Cancer, soins complexes
  "Oncologie",
  "Radiothérapie",
  "Soins palliatifs",
  "Douleur chronique",

  // 🧪 Diagnostic et biologie
  "Radiologie",
  "Imagerie médicale",
  "Médecine nucléaire",
  "Anatomopathologie",
  "Biologie médicale",
  "Génétique médicale",
  "Cytogénétique",
  "Médecine de précision",

  // 👵 Populations spécifiques
  "Gériatrie",
  "Médecine palliative",
  "Médecine du travail",
  "Médecine pénitentiaire",
  "Médecine d’urgence",
  "Médecine militaire",
  "Médecine humanitaire",
  "Médecine tropicale",
  "Médecine de catastrophe",

  // 🧘‍♀️ Spécialités transversales et nouvelles
  "Santé publique",
  "Épidémiologie",
  "Médecine préventive",
  "Médecine environnementale",
  "Télé-médecine",
  "Médecine spatiale",
  "Intelligence artificielle médicale",
  "Robotique chirurgicale",
  "Médecine intégrative",
  "Acupuncture médicale",
  "Médecine traditionnelle chinoise (intégrée)",
  "Homéopathie clinique",

  // ⚖️ Légal et administratif
  "Médecine légale",
  "Expertise médicale",
  "Assurance et réparation du dommage corporel",
];

const SignupMedcin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [address, setAddress] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");

  // Nouveaux états pour le type de pratique et les cliniques
  const [practiceType, setPracticeType] = useState(""); // "independant" ou "clinique"
  const [cliniques, setCliniques] = useState([]);
  const [selectedClinique, setSelectedClinique] = useState("");
  const [searchClinique, setSearchClinique] = useState("");
  const [showCliniqueDropdown, setShowCliniqueDropdown] = useState(false);
  const [loadingCliniques, setLoadingCliniques] = useState(false);
  const [fonction, setFonction] = useState(""); // AJOUT DE CETTE LIGNE MANQUANTE

  const filteredSpecialties = SPECIALITES.filter((s) =>
    s.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrer les cliniques selon la recherche
  const filteredCliniques = cliniques.filter((clinique) =>
    clinique.nom.toLowerCase().includes(searchClinique.toLowerCase())
  );

  // Charger les cliniques depuis l'API
  useEffect(() => {
    const fetchCliniques = async () => {
      if (practiceType === "clinique") {
        setLoadingCliniques(true);
        try {
          const { data } = await api.get("/cliniques");
          setCliniques(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Erreur chargement cliniques:", err);
          setError("Erreur lors du chargement des cliniques");
        } finally {
          setLoadingCliniques(false);
        }
      }
    };

    fetchCliniques();
  }, [practiceType]);

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log("Tentative d'inscription..."); // Debug

    // Validation des champs obligatoires
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phone ||
      !specialty ||
      !address ||
      !practiceType
    ) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Validation supplémentaire si médecin en clinique
    if (practiceType === "clinique" && !selectedClinique) {
      setError("Veuillez sélectionner une clinique.");
      return;
    }

    try {
      const signupData = {
        prenom: firstName,
        nom: lastName,
        email,
        telephone: phone,
        specialite: specialty,
        address,
        password,
        type: practiceType,
      };

      // Ajouter l'ID de la clinique si médecin en clinique
      if (practiceType === "clinique" && selectedClinique) {
        signupData.clinique_id = selectedClinique;
        signupData.fonction = fonction || "Médecin"; // Utiliser la valeur ou une valeur par défaut
      }

      console.log("Données envoyées:", signupData); // Debug

      const response = await api.post("/medecin/register", signupData);
      console.log("Réponse du serveur:", response); // Debug

      navigate("/login-medecin");
    } catch (err) {
      console.error("Erreur complète:", err); // Debug
      setError(err.response?.data?.message || "Erreur serveur, réessayez.");
    }
  };

  const handlePracticeTypeChange = (type) => {
    setPracticeType(type);
    // Réinitialiser la sélection de clinique si on passe à indépendant
    if (type === "independant") {
      setSelectedClinique("");
      setFonction("");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-sky-800 to-sky-600 flex items-center justify-center py-28 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 max-w-md w-full z-10"
      >
        <div className="text-center mb-8">
          <img
            src="/logo/meetmed2.png"
            alt="Medical Logo"
            className="mx-auto w-24 h-24 object-contain rounded-full shadow-lg mb-4"
          />
          <h2 className="text-3xl font-extrabold text-sky-600 dark:text-green-400 mt-4">
            Inscription Médecin
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Rejoignez MeetMed et aidez vos patients à mieux vous trouver.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Prénom & Nom */}
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Prénom
              <Input
                placeholder="Entrez votre prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nom
              <Input
                placeholder="Entrez votre nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
          </div>

          {/* Email & Téléphone */}
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
              <Input
                type="email"
                placeholder="Adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Téléphone
              <Input
                placeholder="Entrez votre numéro de téléphone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
          </div>

          {/* Mot de passe */}
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Mot de passe
            <Input
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {/* Type de pratique */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Type de pratique *
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Médecin indépendant */}
              <div
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                  practiceType === "independent"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-emerald-300"
                }`}
                onClick={() => handlePracticeTypeChange("independent")}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      practiceType === "independent"
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">Indépendant</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Cabinet privé
                    </p>
                  </div>
                </div>
              </div>

              {/* Médecin en clinique */}
              <div
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                  practiceType === "clinique"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-300"
                }`}
                onClick={() => handlePracticeTypeChange("clinique")}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      practiceType === "clinique"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">En clinique</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Établissement
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sélection de la clinique (affiché dynamiquement) */}
          {practiceType === "clinique" && (
            <div className="space-y-3 animate-in fade-in duration-300">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sélectionner une clinique *
              </label>

              <div className="relative">
                <div
                  className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg cursor-pointer px-3 py-3 flex justify-between items-center hover:border-blue-400 transition-colors"
                  onClick={() => setShowCliniqueDropdown(!showCliniqueDropdown)}
                >
                  <span
                    className={
                      selectedClinique
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-400"
                    }
                  >
                    {selectedClinique
                      ? cliniques.find((c) => c.id === selectedClinique)?.nom
                      : "Sélectionner une clinique..."}
                  </span>
                  {showCliniqueDropdown ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </div>

                {showCliniqueDropdown && (
                  <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                    {/* Barre de recherche des cliniques */}
                    <div className="sticky top-0 bg-gray-100 dark:bg-gray-800 p-2 border-b border-gray-200 dark:border-gray-700">
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
                        placeholder="Rechercher une clinique..."
                        value={searchClinique}
                        onChange={(e) => setSearchClinique(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Liste des cliniques */}
                    <div className="max-h-48 overflow-y-auto">
                      {loadingCliniques ? (
                        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                          Chargement des cliniques...
                        </div>
                      ) : filteredCliniques.length > 0 ? (
                        filteredCliniques.map((clinique) => (
                          <div
                            key={clinique.id}
                            onClick={() => {
                              setSelectedClinique(clinique.id);
                              setShowCliniqueDropdown(false);
                              setSearchClinique("");
                            }}
                            className={`px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-sm text-gray-800 dark:text-gray-200 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-b-0 ${
                              selectedClinique === clinique.id
                                ? "bg-blue-100 dark:bg-blue-900/50"
                                : ""
                            }`}
                          >
                            <div className="font-medium">{clinique.nom}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {clinique.address}
                            </div>
                            {clinique.type_etablissement && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {clinique.type_etablissement}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                          Aucune clinique trouvée
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {selectedClinique && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Clinique sélectionnée :</strong>{" "}
                    {cliniques.find((c) => c.id === selectedClinique)?.nom}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Spécialité avec recherche */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Spécialité médicale *
            </label>
            <div
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg cursor-pointer px-3 py-2 flex justify-between items-center hover:border-cyan-400 transition-colors"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className={specialty ? "" : "text-gray-400"}>
                {specialty || "Sélectionner une spécialité..."}
              </span>
              <Search className="w-4 h-4 text-gray-500" />
            </div>

            {showDropdown && (
              <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                <div className="sticky top-0 bg-gray-100 dark:bg-gray-800 p-2 border-b border-gray-200 dark:border-gray-700">
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200"
                    placeholder="Rechercher une spécialité..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                {filteredSpecialties.map((s) => (
                  <div
                    key={s}
                    onClick={() => {
                      setSpecialty(s);
                      setShowDropdown(false);
                      setSearchTerm("");
                    }}
                    className="px-4 py-2 hover:bg-cyan-100 dark:hover:bg-cyan-800 text-sm text-gray-800 dark:text-gray-200 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Adresse */}
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Adresse *
            <Input
              placeholder="Abidjan, Marcory"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 via-teal-400 to-cyan-400 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-sky-500/40 transition-all duration-300"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            S'inscrire
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Vous avez déjà un compte ?{" "}
            <span
              onClick={() => navigate("/login-medecin")}
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

export default SignupMedcin;
