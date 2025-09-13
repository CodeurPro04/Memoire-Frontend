import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import {
  Calendar,
  MessageCircle,
  Star,
  MapPin,
  Clock,
  Award,
  Stethoscope,
  Shield,
  Globe,
} from "lucide-react";
import api from "@/api/axios";
import defaultAvatar from "@/assets/default-avatar.png";

const MedecinProfilePage = () => {
  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long" });
  const { id } = useParams();
  const navigate = useNavigate();

  const [medecin, setMedecin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [rdvDate, setRdvDate] = useState("");
  const [rdvTime, setRdvTime] = useState(""); // Nouvel état pour l'heure
  const [consultationType, setConsultationType] = useState(
    "Consultation générale"
  );
  const [loadingRdv, setLoadingRdv] = useState(false);
  const [rdvMessage, setRdvMessage] = useState("");

  const [alternativeMedecins, setAlternativeMedecins] = useState([]); // Médecins alternatifs

  // Données par défaut pour éviter les erreurs
  const defaultMedecin = {
    titre: "Dr.",
    photo: defaultAvatar,
    specialite: "Spécialité non spécifiée",
    rating: 0,
    reviews: 0,
    address: "Adresse non spécifiée",
    disponibilite: "Disponibilité non spécifiée",
    education: "Diplôme non spécifié",
    bio: "Aucune biographie disponible",
    annees_experience: 0,
    languages: ["Français"],
    experiences: [],
    formations: [],
    prix: "Non spécifié",
    assurances: [],
  };

  const medecinData = medecin
    ? {
        ...defaultMedecin,
        ...medecin,
        languages: Array.isArray(medecin.languages)
          ? medecin.languages
          : medecin.languages
          ? medecin.languages.split(",").map((l) => l.trim())
          : [],
      }
    : null;

  useEffect(() => {
    const fetchMedecin = async () => {
      try {
        const response = await api.get(`/medecins/${id}`);
        setMedecin(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement du médecin:", err);
        setError("Impossible de charger les informations du médecin");
        setLoading(false);
      }
    };
    fetchMedecin();
  }, [id]);

  const handleSendMessage = () => {
    if (!message.trim()) {
      alert("Veuillez écrire un message avant d'envoyer");
      return;
    }
    alert(`Message envoyé à ${medecinData.nom} : ${message}`);
    setMessage("");
    setChatOpen(false);
  };

  const handlePrendreRdv = async () => {
    if (!rdvDate || !rdvTime) {
      alert("Veuillez sélectionner une date et une heure pour le rendez-vous");
      return;
    }

    setLoadingRdv(true);
    setMessage("");
    setAlternativeMedecins([]);

    try {
      const response = await api.post("/appointments", {
        medecin_id: medecinData.id,
        date: rdvDate,
        time: rdvTime, // On envoie également l'heure
        consultation_type: consultationType,
      });

      setMessage(response.data.message || "Rendez-vous pris avec succès !");
      setRdvDate("");
      setRdvTime("");
      setConsultationType("Consultation générale");
    } catch (error) {
      const response = error.response;

      if (response?.status === 409) {
        const alternatives = response.data.alternative_medecins || [];
        setAlternativeMedecins(alternatives);
        setMessage(
          response.data.message ||
            "Rendez-vous indisponible. Médecins alternatifs disponibles :"
        );
      } else {
        setMessage(
          response?.data?.message || "Erreur lors de la prise de rendez-vous."
        );
      }
    }

    setLoadingRdv(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center p-8 bg-white rounded-xl shadow-xl max-w-md">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            Chargement...
          </h2>
          <p className="text-gray-600 mb-6">
            Récupération des informations du médecin
          </p>
        </div>
      </div>
    );
  }

  if (error || !medecinData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center p-8 bg-white rounded-xl shadow-xl max-w-md">
          <h2 className="text-3xl font-bold text-red-600 mb-4">
            Médecin non trouvé
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "Vérifiez l'URL ou retournez à la liste des médecins."}
          </p>
          <Button
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={() => navigate("/trouver-medecin")}
          >
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  // Extraire ville et quartier de l'adresse
  const [quartier, ville] = medecinData.address
    ? medecinData.address.split(",")
    : ["Non spécifié", "Non spécifié"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header Profil Premium */}
      <div className="relative bg-gradient-to-r from-blue-600 to-teal-500 text-white overflow-hidden py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>
        </div>
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative">
            <img
              src={medecinData.photo || defaultAvatar}
              alt={medecinData.nom}
              className="w-40 h-40 rounded-full border-4 border-white shadow-xl object-cover"
              onError={(e) => {
                e.target.src = defaultAvatar;
              }}
            />
            <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Dr. {medecinData.prenom} {medecinData.nom}
                </h1>
                <p className="text-xl font-medium text-blue-100">
                  {medecinData.specialite || "Spécialité non renseignée"}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-bold">
                  {medecinData.average_rating || "0.0"}
                </span>
                <span className="text-sm text-blue-100">
                  ({medecinData.reviews_count || 0} avis)
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Adresse */}
              <p className="flex items-center gap-2 text-blue-100">
                <MapPin className="w-5 h-5 text-white" />
                <span className="font-medium">
                  {medecinData.address || "Adresse non renseignée"}
                </span>
              </p>

              {/* Disponibilité */}
              <p className="flex items-center gap-2 text-blue-100">
                <Clock className="w-4 h-4" />
                {(() => {
                  const todayLower = today.toLowerCase();
                  const todayHours = medecin.working_hours?.find(
                    (wh) => wh.day.toLowerCase() === todayLower
                  );
                  return todayHours
                    ? `Disponible Aujourd'hui: ${todayHours.hours}`
                    : "Indisponible";
                })()}
              </p>

              {/* Diplôme / Éducation */}
              <p className="flex items-center gap-2 text-blue-100">
                <Award className="w-5 h-5 text-white" />
                <span className="font-medium">
                  {medecinData.education || "Diplôme non spécifié"}
                </span>
              </p>

              {/* Assurances */}
              <p className="flex items-center gap-2 text-blue-100">
                <Shield className="w-5 h-5 text-white" />
                <span className="font-medium">
                  Assurances acceptées :{" "}
                  {medecinData.insurance_accepted === 1 ? "Oui" : "Non"}
                </span>
              </p>
              {/* Langues parlées */}
              <p className="flex flex-wrap gap-2 text-blue-100">
                <Globe className="w-5 h-5 text-white" />
                {medecinData.languages?.length > 0 ? (
                  medecinData.languages.map((lang, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 flex items-center gap-1 px-3 py-1 rounded-full"
                    >
                      {lang.trim()}
                    </Badge>
                  ))
                ) : (
                  <span className="font-medium">Non renseigné</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="container mx-auto px-6 py-12 -mt-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Section Principale */}
          <div className="md:col-span-2 space-y-8">
            {/* À propos */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-600 rounded-full"></span>À
                propos du Dr. {medecinData.prenom}
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {medecinData.bio ||
                  "Aucune biographie disponible pour ce médecin."}
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full"
                >
                  {medecinData.experience_years || "?"}+ ans d'expérience
                </Badge>
              </div>

              <div className="flex gap-4 flex-wrap">
                {/* Header Profil Premium 
                <Button
                  onClick={() => setChatOpen(!chatOpen)}
                  variant="outline"
                  className="flex items-center gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl"
                >
                  <MessageCircle className="w-5 h-5" />
                  {chatOpen ? "Fermer le chat" : "Envoyer un message"}
                </Button> 

                <Button
                  onClick={() =>
                    document
                      .getElementById("rdvForm")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-gradient-to-r from-blue-600 to-teal-500 text-white hover:from-blue-700 hover:to-teal-600 flex items-center gap-2 px-6 py-3 rounded-xl shadow-md"
                >
                  <Calendar className="w-5 h-5" /> Prendre RDV
                </Button>
                */}
              </div>
              {/* Chat Box  */}
              {chatOpen && (
                <div className="mt-8 p-6 border border-gray-200 rounded-xl bg-gray-50">
                  <h3 className="font-bold text-lg mb-4 text-gray-800">
                    Message pour Dr. {medecinData.prenom} {medecinData.nom}
                  </h3>
                  <Textarea
                    placeholder="Décrivez brièvement votre situation médicale..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mb-4 h-32"
                  />
                  <div className="flex justify-end gap-3">
                    <Button
                      onClick={() => setChatOpen(false)}
                      variant="outline"
                      className="hover:bg-red-500/90 hover:text-white border-gray-300 text-gray-700"
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                      disabled={!message.trim()}
                    >
                      Envoyer
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Expérience et Formations */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                Parcours Professionnel
              </h2>

              <div className="space-y-6">
                <div>
                  {medecinData.professional_background ? (
                    <p className="text-gray-700">
                      {medecinData.professional_background}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">
                      Aucun parcours professionnel renseigné
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar RDV */}
          <div id="rdvForm" className="space-y-8">
            <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-xl font-bold mb-6 text-gray-800">
                Prendre rendez-vous
              </h2>
              <div className="space-y-4">
                {/* Date du rendez-vous */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date du rendez-vous *
                  </label>
                  <Input
                    type="date"
                    value={rdvDate}
                    onChange={(e) => setRdvDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {/* Heure du rendez-vous */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure du rendez-vous *
                  </label>
                  <Input
                    type="time"
                    value={rdvTime}
                    onChange={(e) => setRdvTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Motif de consultation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Motif de consultation
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={consultationType}
                    onChange={(e) => setConsultationType(e.target.value)}
                  >
                    <option value="Consultation générale">
                      Consultation générale
                    </option>
                    <option value="Suivi de traitement">
                      Suivi de traitement
                    </option>
                    <option value="Bilan de santé">Bilan de santé</option>
                    <option value="Urgence">Urgence</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                {/* Bouton confirmation */}
                <Button
                  onClick={handlePrendreRdv}
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white hover:from-blue-700 hover:to-teal-600 py-3 rounded-xl shadow-md text-lg font-medium"
                  disabled={!rdvDate || !rdvTime || loadingRdv}
                >
                  {loadingRdv ? "Chargement..." : "Confirmer le rendez-vous"}
                </Button>

                {/* Message de retour */}
                {message && (
                  <p
                    className={`mt-4 text-sm ${
                      message.toLowerCase().includes("erreur")
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {message}
                  </p>
                )}
              </div>

              {/* Liste des médecins alternatifs */}
              {alternativeMedecins.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {alternativeMedecins.map((med) => (
                    <button
                      key={med.id}
                      onClick={() => navigate(`/profil-medecin/${med.id}`)}
                      className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-teal-600 transition-colors duration-300"
                    >
                      {med.nom} {med.prenom}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-800 mb-3">
                  Tarifs de Consultation
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consultation standard</span>
                    <span className="font-medium">
                      {medecinData.consultation_price || "Non spécifié"} FCFA
                    </span>
                  </div>
                  {medecinData.assurances &&
                    medecinData.assurances.length > 0 && (
                      <div className="pt-2">
                        <p className="text-sm text-gray-600 mb-1">
                          Assurances acceptées :
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {medecinData.assurances.map((assurance, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {assurance}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3">Localisation</h3>
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                <div className="w-full h-48 bg-blue-100 flex items-center justify-center text-blue-600">
                  <MapPin className="w-12 h-12" />
                  <span className="ml-2 font-medium">
                    {medecinData.address}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                {medecinData.address}
              </p>
              <Button
                variant="outline"
                className="mt-4 w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() =>
                  window.open(
                    `https://maps.google.com/?q=${medecinData.address}`,
                    "_blank"
                  )
                }
              >
                Voir sur la carte
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedecinProfilePage;
