import React, { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { toast } from "sonner";
import defaultAvatar from "@/assets/default-avatar.png";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Icons
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  Edit,
  Save,
  X,
  Settings,
  Plus,
  Trash2,
  ShieldCheck,
  AlertCircle,
  Car,
  Stethoscope,
  UserPlus,
  Search,
  CheckCircle,
  Star,
  Award,
  Calendar,
  Eye,
  MessageSquare,
  XCircle,
} from "lucide-react";

// Composant Star Rating
const StarRating = React.memo(
  ({ rating, readonly = false, size = "md" }) => {
    const starSize = size === "lg" ? "w-8 h-8" : "w-6 h-6";

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="cursor-default"
            disabled={readonly}
          >
            <Star
              className={`${starSize} ${
                star <= rating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  }
);

StarRating.displayName = "StarRating";

const ProfilClinique = () => {
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [clinique, setClinique] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    address: "",
    description: "",
    type_etablissement: "",
    urgences_24h: false,
    parking_disponible: false,
    site_web: "",
  });
  const [medecins, setMedecins] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profil");

  // État pour l'ajout de médecins
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [searchMedecin, setSearchMedecin] = useState("");
  const [medecinsList, setMedecinsList] = useState([]);
  const [selectedMedecin, setSelectedMedecin] = useState(null);
  const [fonction, setFonction] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // États pour les notes des médecins
  const [medecinsRatings, setMedecinsRatings] = useState({});
  const [loadingRatings, setLoadingRatings] = useState(false);

  // Charger les notes des médecins
  const fetchMedecinsRatings = useCallback(async (medecinsList) => {
    if (!medecinsList.length) return;
    
    setLoadingRatings(true);
    try {
      const ratingsPromises = medecinsList.map(async (medecin) => {
        try {
          const response = await api.get(`/medecins/${medecin.id}/reviews/stats`);
          return {
            id: medecin.id,
            average_rating: response.data.average_rating || 0,
            total_reviews: response.data.total_reviews || 0
          };
        } catch (error) {
          console.error(`Erreur chargement notes médecin ${medecin.id}:`, error);
          return {
            id: medecin.id,
            average_rating: 0,
            total_reviews: 0
          };
        }
      });

      const ratingsResults = await Promise.all(ratingsPromises);
      const ratingsMap = {};
      ratingsResults.forEach(rating => {
        ratingsMap[rating.id] = rating;
      });
      setMedecinsRatings(ratingsMap);
    } catch (error) {
      console.error("Erreur lors du chargement des notes:", error);
      toast.error("Erreur lors du chargement des notes des médecins");
    } finally {
      setLoadingRatings(false);
    }
  }, []);

  // Fonction pour obtenir la note d'un médecin
  const getMedecinRating = (medecinId) => {
    const ratingData = medecinsRatings[medecinId];
    if (!ratingData) return { average: "0.0", total: 0 };
    
    return {
      average: parseFloat(ratingData.average_rating || 0).toFixed(1),
      total: ratingData.total_reviews || 0
    };
  };

  useEffect(() => {
    if (role !== "clinique") return;

    const fetchData = async () => {
      try {
        const { data: profil } = await api.get("/clinique/profile");
        setClinique(profil);

        setFormData({
          nom: profil.nom || "",
          email: profil.email || "",
          telephone: profil.telephone || "",
          address: profil.address || "",
          description: profil.description || "",
          type_etablissement: profil.type_etablissement || "",
          urgences_24h: profil.urgences_24h || false,
          parking_disponible: profil.parking_disponible || false,
          site_web: profil.site_web || "",
        });

        const medecinsData = profil.medecins || [];
        setMedecins(medecinsData);
        
        // Charger les notes des médecins
        if (medecinsData.length > 0) {
          await fetchMedecinsRatings(medecinsData);
        }
      } catch (err) {
        console.error("❌ Erreur chargement données :", err);
        toast.error("Erreur lors du chargement du profil");
      }
    };

    fetchData();
  }, [role, fetchMedecinsRatings]);

  // Recherche dynamique des médecins avec debounce - CORRIGÉE
  const searchMedecins = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) {
      setMedecinsList([]);
      return;
    }

    setSearchLoading(true);
    try {
      const { data } = await api.get(`/medecins?search=${encodeURIComponent(searchTerm)}`);
      
      // Filtrer les résultats pour correspondre exactement à la recherche
      const filteredResults = Array.isArray(data) ? data.filter(medecin => {
        const fullName = `Dr. ${medecin.prenom} ${medecin.nom}`.toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return (
          fullName.includes(searchLower) ||
          medecin.prenom?.toLowerCase().includes(searchLower) ||
          medecin.nom?.toLowerCase().includes(searchLower) ||
          medecin.specialite?.toLowerCase().includes(searchLower) ||
          medecin.email?.toLowerCase().includes(searchLower)
        );
      }) : [];

      console.log("Recherche:", searchTerm, "Résultats filtrés:", filteredResults);
      setMedecinsList(filteredResults);
    } catch (err) {
      console.error("Erreur recherche médecins:", err);
      toast.error("Erreur lors de la recherche");
      setMedecinsList([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Gestion du changement de recherche avec debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchMedecin(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const newTimeout = setTimeout(() => {
      searchMedecins(value);
    }, 500); // Augmenté à 500ms pour moins de requêtes

    setSearchTimeout(newTimeout);
  };

  // Nettoyer le timeout à la destruction du composant
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Réinitialiser la recherche quand on ferme le modal
  const handleCloseModal = () => {
    setShowAddDoctor(false);
    setSelectedMedecin(null);
    setSearchMedecin("");
    setFonction("");
    setMedecinsList([]);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
  };

  // Ajouter un médecin
  const handleAddMedecin = async () => {
    if (!selectedMedecin) {
      toast.error("Veuillez sélectionner un médecin");
      return;
    }

    try {
      const { data } = await api.post("/clinique/medecins/add", {
        medecin_id: selectedMedecin.id,
        fonction: fonction,
      });

      setClinique(data.clinique);
      const newMedecins = data.clinique.medecins || [];
      setMedecins(newMedecins);
      
      // Recharger les notes pour le nouveau médecin
      if (newMedecins.length > 0) {
        await fetchMedecinsRatings(newMedecins);
      }
      
      handleCloseModal();
      toast.success("Médecin ajouté avec succès");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'ajout");
    }
  };

  // Retirer un médecin
  const handleRemoveMedecin = async (medecinId) => {
    if (!confirm("Êtes-vous sûr de vouloir retirer ce médecin ?")) return;

    try {
      const { data } = await api.delete(`/clinique/medecins/${medecinId}`);
      setClinique(data.clinique);
      setMedecins(data.clinique.medecins || []);
      toast.success("Médecin retiré avec succès");
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  // Voir les avis d'un médecin
  const handleViewReviews = (medecinId) => {
    navigate(`/profil-medecin/${medecinId}?tab=avis`);
  };

  // Voir le profil d'un médecin
  const handleViewProfile = (medecinId) => {
    navigate(`/profil-medecin/${medecinId}`);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      const { data } = await api.put("/clinique/profile", formData);
      setClinique(data.clinique);
      setEditMode(false);
      toast.success("Profil mis à jour !");
    } catch (error) {
      console.error("Erreur de mise à jour :", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  // Composant Carte Médecin amélioré - CORRIGÉ (pas de flou au survol)
  const MedecinCard = ({ medecin }) => {
    const rating = getMedecinRating(medecin.id);
    const [showRatingDetails, setShowRatingDetails] = useState(false);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-6 rounded-2xl hover:shadow-lg transition-all relative group"
        onMouseEnter={() => setShowRatingDetails(true)}
        onMouseLeave={() => setShowRatingDetails(false)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                {medecin.prenom?.charAt(0)}
                {medecin.nom?.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-800 text-lg mb-1">
                Dr. {medecin.prenom} {medecin.nom}
              </h3>
              <p className="text-emerald-600 font-semibold text-sm mb-2">
                {medecin.specialite}
              </p>
              {medecin.pivot?.fonction && (
                <Badge className="bg-teal-100 text-teal-700 border-0 text-xs">
                  {medecin.pivot.fonction}
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRemoveMedecin(medecin.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Statistiques du médecin */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center bg-white rounded-lg p-2">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold text-slate-900">
                {medecin.experience_years && medecin.experience_years > 0 
                  ? `${medecin.experience_years}+`
                  : "Non spécifié"
                }
              </span>
            </div>
            <span className="text-xs text-slate-500">ans exp.</span>
          </div>

          <div className="text-center bg-white rounded-lg p-2">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-bold text-slate-900">
                {rating.average}
              </span>
            </div>
            <span className="text-xs text-slate-500">
              {rating.total > 0 ? `${rating.total} avis` : "Aucun avis"}
            </span>
          </div>

          <div className="text-center bg-white rounded-lg p-2">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-bold text-slate-900">
                {medecin.disponibilite === "Aujourd'hui" ? "Dispo" : "Sur RDV"}
              </span>
            </div>
            <span className="text-xs text-slate-500">aujourd'hui</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewProfile(medecin.id)}
            className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400"
          >
            <Eye className="w-4 h-4 mr-2" />
            Voir profil
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewReviews(medecin.id)}
            className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
            disabled={rating.total === 0}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Voir avis
          </Button>
        </div>

        {/* Note détaillée au survol - CORRIGÉ (pas de flou) */}
        {showRatingDetails && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-emerald-300 rounded-xl p-4 shadow-2xl z-10 min-w-[200px]">
            <div className="text-center">
              <StarRating rating={Math.round(parseFloat(rating.average))} readonly size="lg" />
              <p className="text-sm text-slate-700 mt-2 font-semibold">
                {rating.total > 0 
                  ? `${rating.total} avis`
                  : "Aucun avis"
                }
              </p>
              <p className="text-sm text-slate-600">
                Note moyenne: {rating.average}/5
              </p>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  if (!clinique) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 animate-ping opacity-20"></div>
          </div>
          <p className="text-slate-600 font-medium">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header Hero */}
      <div className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500 px-4 md:px-6 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Logo clinique */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition"></div>
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-white/50 shadow-2xl backdrop-blur-xl bg-white/10">
                {clinique.photo_profil ? (
                  <img
                    src={clinique.photo_profil || defaultAvatar}
                    alt={clinique.nom}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Informations principales */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-3">
                  {clinique.nom}
                  <CheckCircle className="w-6 h-6 text-teal-300" />
                </h1>
                <p className="text-teal-100 text-lg">
                  {clinique.type_etablissement || "Établissement médical"}
                </p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 px-4 py-2 text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  {medecins.length} médecin{medecins.length > 1 ? "s" : ""}
                </Badge>

                {clinique.urgences_24h && (
                  <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 px-4 py-2 text-sm">
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Urgences 24h/24
                  </Badge>
                )}

                {clinique.parking_disponible && (
                  <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 px-4 py-2 text-sm">
                    <Car className="w-4 h-4 mr-2" />
                    Parking
                  </Badge>
                )}
              </div>
            </div>

            <Button
              onClick={() => setEditMode(!editMode)}
              className={`${
                editMode
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-white/20 hover:bg-white/30"
              } backdrop-blur-md border border-white/30 text-white shadow-lg transition-all duration-300 hover:scale-105`}
            >
              {editMode ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 py-8 -mt-16 relative z-10">
        {/* Onglets */}
        <div className="bg-white/70 backdrop-blur-md border-0 shadow-lg rounded-2xl p-1.5 mb-8">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveTab("profil")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "profil"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Profil</span>
            </button>
            <button
              onClick={() => setActiveTab("medecins")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "medecins"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span className="hidden sm:inline">Médecins ({medecins.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("parametres")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "parametres"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Paramètres</span>
            </button>
          </div>
        </div>

        {/* Onglet Profil */}
        {activeTab === "profil" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card className="bg-white/70 backdrop-blur-md border-0 shadow-xl">
                <CardHeader className="border-b border-slate-200/50">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    À propos
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {editMode ? (
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Décrivez votre établissement, vos services et équipements..."
                      className="min-h-[150px]"
                    />
                  ) : (
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                      {clinique.description || "Aucune description"}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Informations */}
            <div className="space-y-6">
              <Card className="bg-white/70 backdrop-blur-md border-0 shadow-xl">
                <CardHeader className="border-b border-slate-200/50">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    Informations
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {/* Email */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                      Email
                    </label>
                    {editMode ? (
                      <Input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Mail className="w-5 h-5 text-emerald-500" />
                        <span className="text-slate-700">{clinique.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                      Téléphone
                    </label>
                    {editMode ? (
                      <Input
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Phone className="w-5 h-5 text-green-500" />
                        <span className="text-slate-700">
                          {clinique.telephone}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Adresse */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                      Adresse
                    </label>
                    {editMode ? (
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-red-500" />
                        <span className="text-slate-700">
                          {clinique.address}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Site web */}
                  {(editMode || clinique.site_web) && (
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                        Site web
                      </label>
                      {editMode ? (
                        <Input
                          name="site_web"
                          value={formData.site_web}
                          onChange={handleChange}
                        />
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <Globe className="w-5 h-5 text-blue-500" />
                          <a
                            href={clinique.site_web}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {clinique.site_web}
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Type établissement */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                      Type d'établissement
                    </label>
                    {editMode ? (
                      <Input
                        name="type_etablissement"
                        value={formData.type_etablissement}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Building2 className="w-5 h-5 text-teal-500" />
                        <span className="text-slate-700">
                          {clinique.type_etablissement}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Options */}
                  {editMode && (
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="urgences_24h"
                          checked={formData.urgences_24h}
                          onChange={handleChange}
                          className="w-5 h-5 text-emerald-500 rounded"
                        />
                        <span className="text-slate-700">Urgences 24h/24</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="parking_disponible"
                          checked={formData.parking_disponible}
                          onChange={handleChange}
                          className="w-5 h-5 text-emerald-500 rounded"
                        />
                        <span className="text-slate-700">
                          Parking disponible
                        </span>
                      </label>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "profil" && editMode && (
          <div className="flex justify-end gap-3 mt-8">
            <Button
              variant="outline"
              onClick={() => setEditMode(false)}
              className="border-slate-300 hover:bg-slate-50"
            >
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg"
            >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        )}

        {/* Onglet Médecins */}
        {activeTab === "medecins" && (
          <div className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-md border-0 shadow-xl">
              <CardHeader className="border-b border-slate-200/50">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-white" />
                    </div>
                    Équipe médicale ({medecins.length})
                  </CardTitle>
                  <Button
                    onClick={() => setShowAddDoctor(true)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Ajouter un médecin
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {loadingRatings && (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center gap-2 text-slate-500">
                      <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      Chargement des notes...
                    </div>
                  </div>
                )}

                {medecins.length === 0 ? (
                  <div className="text-center py-12">
                    <Stethoscope className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Aucun médecin enregistré</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {medecins.map((medecin) => (
                      <MedecinCard key={medecin.id} medecin={medecin} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Modal Ajout médecin - AMÉLIORÉ */}
            {showAddDoctor && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                      <UserPlus className="w-6 h-6 text-emerald-500" />
                      Ajouter un médecin
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCloseModal}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {/* Recherche médecin - AMÉLIORÉ */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Rechercher un médecin par nom, prénom ou spécialité
                      </label>
                      <div className="relative">
                        <Input
                          value={searchMedecin}
                          onChange={handleSearchChange}
                          placeholder="Ex: Dr. Dupont, Cardiologie..."
                          className="pr-10"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {searchLoading ? (
                            <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Search className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Tapez au moins 2 caractères pour lancer la recherche
                      </p>
                    </div>

                    {/* Liste des résultats - AMÉLIORÉ */}
                    {medecinsList.length > 0 && (
                      <div>
                        <p className="text-sm text-slate-600 mb-2">
                          {medecinsList.length} médecin(s) trouvé(s)
                        </p>
                        <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-lg">
                          {medecinsList.map((med) => (
                            <div
                              key={med.id}
                              onClick={() => setSelectedMedecin(med)}
                              className={`p-4 cursor-pointer hover:bg-emerald-50 transition-colors border-b border-slate-100 last:border-b-0 ${
                                selectedMedecin?.id === med.id
                                  ? "bg-emerald-100 border-l-4 border-emerald-500"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                  {med.prenom?.charAt(0)}
                                  {med.nom?.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-slate-800 truncate">
                                    Dr. {med.prenom} {med.nom}
                                  </p>
                                  <p className="text-sm text-emerald-600 truncate">
                                    {med.specialite}
                                  </p>
                                  {med.email && (
                                    <p className="text-xs text-slate-500 mt-1 truncate">
                                      {med.email}
                                    </p>
                                  )}
                                </div>
                                {selectedMedecin?.id === med.id && (
                                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchMedecin && searchMedecin.length >= 2 && medecinsList.length === 0 && !searchLoading && (
                      <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
                        <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="font-medium">Aucun médecin trouvé</p>
                        <p className="text-sm mt-1">
                          Vérifiez l'orthographe ou essayez d'autres termes
                        </p>
                      </div>
                    )}

                    {/* Médecin sélectionné */}
                    {selectedMedecin && (
                      <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-lg">
                        <p className="text-sm font-semibold text-slate-700 mb-2">
                          Médecin sélectionné :
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold">
                            {selectedMedecin.prenom?.charAt(0)}
                            {selectedMedecin.nom?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">
                              Dr. {selectedMedecin.prenom} {selectedMedecin.nom}
                            </p>
                            <p className="text-sm text-emerald-600">
                              {selectedMedecin.specialite}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Fonction */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Fonction dans la clinique (optionnel)
                      </label>
                      <Input
                        value={fonction}
                        onChange={(e) => setFonction(e.target.value)}
                        placeholder="Ex: Chef de service, Médecin attaché, Cardiologue..."
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Cette information sera visible sur le profil public
                      </p>
                    </div>

                    {/* Boutons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={handleCloseModal}
                        className="flex-1 border-slate-300 hover:bg-slate-50"
                      >
                        Annuler
                      </Button>
                      <Button
                        onClick={handleAddMedecin}
                        disabled={!selectedMedecin}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {selectedMedecin ? "Ajouter" : "Sélectionnez"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        )}

        {/* Onglet Paramètres */}
        {activeTab === "parametres" && (
          <Card className="bg-white/70 backdrop-blur-md border-0 shadow-xl">
            <CardHeader className="border-b border-slate-200/50">
              <CardTitle className="flex items-center gap-3 text-slate-800">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-700 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                Paramètres du compte
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl">
                  <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    Sécurité et confidentialité
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Gérez vos paramètres de sécurité et de confidentialité
                  </p>
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                    Modifier le mot de passe
                  </Button>
                </div>

                <div className="p-6 bg-red-50 border-2 border-red-200 rounded-2xl">
                  <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    Zone de danger
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Actions irréversibles concernant votre compte
                  </p>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700 w-full justify-start"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Désactiver le compte temporairement
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700 w-full justify-start"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Supprimer définitivement le compte
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfilClinique;