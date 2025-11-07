import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "@/context/AuthContext";
import {
  Search,
  MapPin,
  Stethoscope,
  Calendar,
  Star,
  Heart,
  ArrowRight,
  Filter,
  Clock,
  Award,
  Phone,
  Shield,
  CheckCircle,
  Zap,
  Users,
  Sparkles,
  BadgeCheck,
  ChevronDown,
  Building2,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/api/axios";
import SafeAvatar from "@/components/common/SafeAvatar";
import { toast } from "sonner";
import defaultAvatar from "@/assets/default-avatar.png";

// Composant Select simple et fonctionnel
const SimpleSelect = ({
  value,
  onValueChange,
  options,
  placeholder,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-14 px-4 flex items-center justify-between rounded-xl border-2 border-slate-200 bg-white hover:border-blue-500 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all ${className}`}
      >
        <span className={selectedOption ? "text-slate-900" : "text-slate-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 w-full mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onValueChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                  value === option.value
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// getCurrentAvailability (adaptée au format tableau [{day, hours, enabled}, ...])
const getCurrentAvailability = (workingHours) => {
  if (!workingHours || !Array.isArray(workingHours)) {
    return {
      is_available: false,
      status: "unavailable",
      message: "Horaires non définis",
      next_available: null,
    };
  }

  const now = new Date();
  const today = now
    .toLocaleDateString("fr-FR", { weekday: "long" })
    .toLowerCase();
  const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

  const todaySchedule = workingHours.find(
    (d) => d.day && d.day.toLowerCase() === today
  );

  if (!todaySchedule || !todaySchedule.enabled || !todaySchedule.hours) {
    return {
      is_available: false,
      status: "unavailable",
      message: "Fermé aujourd'hui",
      next_available: null,
    };
  }

  const timeSlots = todaySchedule.hours
    .split(" | ")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const slot of timeSlots) {
    const [start, end] = slot.split(" - ").map((s) => s.trim());
    if (!start || !end) continue;
    if (currentTime >= start && currentTime <= end) {
      return {
        is_available: true,
        status: "available",
        message: `Ouvert jusqu'à ${end}`,
        next_available: null,
      };
    }
  }

  const firstSlot = timeSlots[0]?.split(" - ")[0]?.trim();
  if (firstSlot && currentTime < firstSlot) {
    return {
      is_available: false,
      status: "later_today",
      message: `Ouvre à ${firstSlot}`,
      next_available: firstSlot,
    };
  }

  const days = [
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
    "dimanche",
  ];
  const todayIndex = days.indexOf(today);

  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (todayIndex + i) % 7;
    const nextDay = days[nextDayIndex];

    const nextDaySchedule = workingHours.find(
      (d) => d.day && d.day.toLowerCase() === nextDay && d.enabled && d.hours
    );
    if (nextDaySchedule) {
      const nextStart =
        nextDaySchedule.hours.split(" | ")[0]?.split(" - ")[0]?.trim() || null;
      return {
        is_available: false,
        status: "next_day",
        message: `Réouverture ${nextDay} à ${nextStart}`,
        next_available: { day: nextDay, time: nextStart },
      };
    }
  }

  return {
    is_available: false,
    status: "unavailable",
    message: "Indisponible",
    next_available: null,
  };
};

// Composant Carte Médecin avec système de favoris fonctionnel
const MedecinCard = ({
  medecin,
  index,
  favorites,
  toggleFavorite,
  navigate,
  isAuthenticated,
  role, // Ajoutez role dans les props
}) => {
  const [rating, setRating] = useState({ average: "0.0", total: 0 });
  const [loadingRating, setLoadingRating] = useState(true);
  const [isFavoriting, setIsFavoriting] = useState(false);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await api.get(`/medecins/${medecin.id}/reviews/stats`);
        setRating({
          average: parseFloat(response.data.average_rating || 0).toFixed(1),
          total: response.data.total_reviews || 0,
        });
      } catch (error) {
        console.error(`Erreur chargement note médecin ${medecin.id}:`, error);
        setRating({ average: "0.0", total: 0 });
      } finally {
        setLoadingRating(false);
      }
    };

    fetchRating();
  }, [medecin.id]);

  // Parser si le backend renvoie une string JSON
  const parsedWorkingHours =
    typeof medecin.working_hours === "string"
      ? (() => {
          try {
            return JSON.parse(medecin.working_hours);
          } catch (e) {
            console.warn("working_hours JSON parse error:", e);
            return null;
          }
        })()
      : medecin.working_hours;

  const availability = getCurrentAvailability(parsedWorkingHours);

  // Fonction pour obtenir les informations du type de pratique
  const getPracticeTypeInfo = (medecin) => {
    if (medecin.type === "clinique" && medecin.clinique) {
      return {
        type: "clinique",
        label: `Clinique ${medecin.clinique.nom}`,
        icon: Building2,
        color: "blue",
      };
    }
    return {
      type: "independant",
      label: "Indépendant",
      icon: User,
      color: "emerald",
    };
  };

  const practiceInfo = getPracticeTypeInfo(medecin);
  const PracticeIcon = practiceInfo.icon;

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour gérer vos favoris");
      navigate("/login");
      return;
    }

    if (role !== "patient") {
      toast.error("Seuls les patients peuvent ajouter aux favoris");
      return; // NE PAS naviguer, juste empêcher l'ajout
    }

    setIsFavoriting(true);
    try {
      // Vérifier si le médecin est déjà en favori
      const isCurrentlyFavorite = Array.isArray(favorites)
        ? favorites.some((fav) => fav.id === medecin.id)
        : false;

      if (isCurrentlyFavorite) {
        // Retirer des favoris
        await api.delete(`/favorites/${medecin.id}`);
        setFavorites((prev) =>
          Array.isArray(prev) ? prev.filter((fav) => fav.id !== medecin.id) : []
        );
        toast.success("Médecin retiré des favoris");
      } else {
        // Ajouter aux favoris
        await api.post(`/favorites/${medecin.id}`);

        // Recharger les favoris pour avoir les données complètes du médecin
        const favoritesResponse = await api.get("/favorites");
        setFavorites(favoritesResponse.data);

        toast.success("Médecin ajouté aux favoris");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des favoris:", error);

      if (error.response?.status === 401) {
        toast.error("Veuillez vous connecter pour gérer vos favoris");
        navigate("/login-patient");
      } else if (error.response?.status === 404) {
        toast.error("Médecin non trouvé");
      } else {
        toast.error("Erreur lors de la mise à jour des favoris");
      }
    } finally {
      setIsFavoriting(false);
    }
  };

  // Vérifier si ce médecin est dans les favoris
  const isFavorite = Array.isArray(favorites)
    ? favorites.some((fav) => fav.id === medecin.id)
    : false;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-blue-200"
    >
      <div className="relative h-32 bg-gradient-to-br from-blue-500 to-cyan-500">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />

        {/* Badge type de pratique */}
        <div className="absolute top-4 left-4">
          <Badge
            className={`bg-${
              practiceInfo.color === "blue" ? "blue" : "emerald"
            }-100 text-${
              practiceInfo.color === "blue" ? "blue" : "emerald"
            }-700 border-0 px-3 py-1 flex items-center gap-1`}
          >
            <PracticeIcon className="w-3 h-3" />
            {practiceInfo.label}
          </Badge>
        </div>
        {/* Bouton favoris
        <button
          onClick={handleFavoriteClick}
          disabled={isFavoriting || role !== "patient"} // Désactivé si pas patient ou en train de cliquer
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50"
          title={
            role !== "patient"
              ? "Seuls les patients peuvent ajouter aux favoris"
              : ""
          }
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite ? "text-red-500 fill-current" : "text-slate-400"
            }`}
          />
        </button>  */}
      </div>

      <div className="p-6 -mt-12 relative">
        <div className="relative inline-block mb-4">
          <SafeAvatar
            src={
              medecin.photo_profil
                ? `/assets/images/${medecin.photo_profil}`
                : defaultAvatar
            }
            alt={`Dr. ${medecin?.prenom || ""} ${medecin?.nom || ""}`}
            size={96}
            initials={`${medecin?.prenom?.charAt(0) ?? ""}${
              medecin?.nom?.charAt(0) ?? ""
            }`}
            className="rounded-2xl border-4 border-white shadow-xl"
          />
          {medecin.verified && (
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center border-4 border-white">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-1">
          Dr. {medecin.prenom} {medecin.nom}
        </h3>
        <p className="text-blue-600 font-semibold mb-3">{medecin.specialite}</p>

        {/* Info clinique si applicable */}
        {practiceInfo.type === "clinique" && (
          <div className="flex items-center gap-2 text-sm text-blue-600 mb-3">
            <Building2 className="w-4 h-4" />
            <span className="text-sm">{practiceInfo.label}</span>
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 text-amber-500 fill-current" />
            {loadingRating ? (
              <div className="flex items-center gap-1">
                <div className="w-8 h-4 bg-amber-200 rounded animate-pulse"></div>
                <div className="w-4 h-3 bg-amber-200 rounded animate-pulse"></div>
              </div>
            ) : (
              <>
                <span className="text-sm font-bold text-amber-700">
                  {rating.average}
                </span>
                <span className="text-xs text-amber-600 ml-1">
                  ({rating.total})
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1 text-slate-600 text-sm">
            <Award className="w-4 h-4" />
            <span>
              {medecin.experience_years
                ? `${medecin.experience_years} ans`
                : "Non spécifié"}
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span>{medecin.address || "Adresse non renseignée"}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <Building2 className="w-4 h-4 text-purple-500 flex-shrink-0" />
            <span>{medecin.commune || "Commune non renseignée"}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <Clock className="w-4 h-4 text-green-500 flex-shrink-0" />
            {availability.is_available ? (
              <span className="text-green-600 font-semibold">
                {availability.message}
              </span>
            ) : availability.status === "later_today" ? (
              <span className="text-amber-600 font-semibold">
                {availability.message}
              </span>
            ) : availability.status === "next_day" ? (
              <span className="text-blue-600 font-semibold">
                {availability.message}
              </span>
            ) : (
              <span className="text-slate-500 italic">
                {availability.message}
              </span>
            )}
          </div>
        </div>

        {medecin.consultation_price && (
          <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-3 mb-4">
            <span className="text-slate-600 text-sm font-medium">
              Consultation
            </span>
            <span className="text-xl font-bold text-slate-900">
              {medecin.consultation_price.toLocaleString()}{" "}
              <span className="text-sm text-slate-600">FCFA</span>
            </span>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-11 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50"
            onClick={() => navigate(`/profil-medecin/${medecin.id}`)}
          >
            Voir profil
          </Button>
          <Button
            className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
            onClick={() => navigate(`/profil-medecin/${medecin.id}`)}
          >
            <Calendar className="w-4 h-4" />
            Réserver
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const TrouverMedecinPremium = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, role } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    availability: "all",
    experience: "all",
    rating: "all",
    priceRange: "all",
  });
  const [medecins, setMedecins] = useState([]);
  const [cliniques, setCliniques] = useState([]);
  const [activeTab, setActiveTab] = useState("medecins");

  // Charger les favoris au démarrage
  useEffect(() => {
    const fetchFavorites = async () => {
      if (isAuthenticated) {
        try {
          const response = await api.get("/favorites");
          setFavorites(response.data);
        } catch (error) {
          console.error("Erreur lors du chargement des favoris:", error);
          // Si erreur 401, le patient n'est pas connecté
          if (error.response?.status === 401) {
            console.log("Patient non authentifié");
          }
        }
      }
    };

    fetchFavorites();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [medecinsResponse, cliniquesResponse] = await Promise.all([
          api.get("/medecins"),
          api.get("/cliniques"),
        ]);
        setMedecins(medecinsResponse.data);
        setCliniques(cliniquesResponse.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonction pour basculer les favoris
  const toggleFavorite = async (medecinId) => {
    try {
      // Vérifier si le médecin est déjà en favori
      const isCurrentlyFavorite = Array.isArray(favorites)
        ? favorites.some((fav) => fav.id === medecinId)
        : false;

      if (isCurrentlyFavorite) {
        // Retirer des favoris
        await api.delete(`/favorites/${medecinId}`);
        setFavorites((prev) =>
          Array.isArray(prev) ? prev.filter((fav) => fav.id !== medecinId) : []
        );
        toast.success("Médecin retiré des favoris");
      } else {
        // Ajouter aux favoris
        await api.post(`/favorites/${medecinId}`);

        // Recharger les favoris pour avoir les données complètes du médecin
        const favoritesResponse = await api.get("/favorites");
        setFavorites(favoritesResponse.data);

        toast.success("Médecin ajouté aux favoris");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des favoris:", error);

      if (error.response?.status === 401) {
        toast.error("Veuillez vous connecter pour gérer vos favoris");
        navigate("/login-patient");
      } else if (error.response?.status === 404) {
        toast.error("Médecin non trouvé");
      } else {
        toast.error("Erreur lors de la mise à jour des favoris");
      }
    }
  };

  // Filtres pour les médecins
  const filteredMedecins = medecins.filter((medecin) => {
    const matchesSearch =
      !search ||
      medecin.nom?.toLowerCase().includes(search.toLowerCase()) ||
      medecin.prenom?.toLowerCase().includes(search.toLowerCase()) ||
      medecin.specialite?.toLowerCase().includes(search.toLowerCase()) ||
      medecin.commune?.toLowerCase().includes(search.toLowerCase());

    const matchesSpecialty =
      !specialty ||
      specialty === "all" ||
      medecin.specialite?.toLowerCase() === specialty.toLowerCase();

    const matchesLocation =
      !location ||
      location === "all" ||
      medecin.commune?.toLowerCase().includes(location.toLowerCase());

    const matchesAvailability =
      filters.availability === "all" ||
      (filters.availability === "today" &&
        medecin.disponibilite === "Aujourd'hui") ||
      (filters.availability === "tomorrow" &&
        medecin.disponibilite === "Demain");

    const matchesExperience =
      filters.experience === "all" ||
      (filters.experience === "junior" && medecin.experience_years < 5) ||
      (filters.experience === "mid" &&
        medecin.experience_years >= 5 &&
        medecin.experience_years < 15) ||
      (filters.experience === "senior" && medecin.experience_years >= 15);

    const matchesRating = filters.rating === "all";

    const matchesPriceRange =
      filters.priceRange === "all" ||
      (filters.priceRange === "budget" &&
        medecin.consultation_price <= 15000) ||
      (filters.priceRange === "medium" &&
        medecin.consultation_price > 15000 &&
        medecin.consultation_price <= 25000) ||
      (filters.priceRange === "premium" && medecin.consultation_price > 25000);

    return (
      matchesSearch &&
      matchesSpecialty &&
      matchesLocation &&
      matchesAvailability &&
      matchesExperience &&
      matchesRating &&
      matchesPriceRange
    );
  });

  // Filtres pour les cliniques
  const filteredCliniques = cliniques.filter((clinique) => {
    const matchesSearch =
      !search ||
      clinique.nom?.toLowerCase().includes(search.toLowerCase()) ||
      clinique.type_etablissement
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      clinique.address?.toLowerCase().includes(search.toLowerCase());

    const matchesLocation =
      !location ||
      location === "all" ||
      clinique.address?.toLowerCase().includes(location.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  const specialitesUniques = [
    { value: "all", label: "Toutes les spécialités" },
    ...Array.from(
      new Set(medecins.map((m) => m.specialite).filter(Boolean))
    ).map((spec) => ({
      value: spec,
      label: spec,
    })),
  ];

  const communesUniques = [
    { value: "all", label: "Toutes les communes" },
    ...Array.from(
      new Set(medecins.map((m) => m.commune?.split(",")[0]).filter(Boolean))
    ).map((commune) => ({
      value: commune,
      label: commune,
    })),
  ];

  const availabilityOptions = [
    { value: "all", label: "Toutes disponibilités" },
    { value: "today", label: "Aujourd'hui" },
    { value: "tomorrow", label: "Demain" },
  ];

  const experienceOptions = [
    { value: "all", label: "Tous niveaux" },
    { value: "junior", label: "Junior (0-5 ans)" },
    { value: "mid", label: "Confirmé (5-15 ans)" },
    { value: "senior", label: "Expert (15+ ans)" },
  ];

  const ratingOptions = [
    { value: "all", label: "Toutes notes" },
    { value: "4.0", label: "4+ étoiles" },
    { value: "4.5", label: "4.5+ étoiles" },
  ];

  const priceOptions = [
    { value: "all", label: "Tous prix" },
    { value: "budget", label: "Économique (-15k)" },
    { value: "medium", label: "Standard (15k-25k)" },
    { value: "premium", label: "Premium (25k+)" },
  ];

  const stats = [
    {
      icon: Users,
      value: `${medecins.length}+`,
      label: "Médecins vérifiés",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: CheckCircle,
      value: "95%",
      label: "Satisfaction",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Zap,
      value: "24/7",
      label: "Disponibilité",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Award,
      value: `${specialitesUniques.length - 1}+`,
      label: "Spécialités",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const resetFilters = () => {
    setSearch("");
    setSpecialty("");
    setLocation("");
    setFilters({
      availability: "all",
      experience: "all",
      rating: "all",
      priceRange: "all",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-600/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        </div>

        <div className="container mx-auto px-6 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-400/20 rounded-full px-6 py-3 mb-8"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-200">
                Plateforme médicale de confiance
              </span>
              <BadgeCheck className="w-4 h-4 text-cyan-400" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                Trouvez votre médecin
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-blue-200 bg-clip-text text-transparent">
                en quelques clics
              </span>
            </h1>

            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Accédez aux meilleurs professionnels de santé certifiés. Prenez
              rendez-vous en ligne, consultation rapide et sécurisée.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="relative group"
                >
                  <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
                    <div
                      className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="rgb(248, 250, 252)"
            />
          </svg>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="container mx-auto px-6 relative -mt-16 z-30 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl shadow-slate-900/10 p-8 border border-slate-200"
        >
          {/* Onglets Médecins/Cliniques */}
          <div className="flex mb-6 bg-slate-100 rounded-2xl p-1">
            <button
              onClick={() => setActiveTab("medecins")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "medecins"
                  ? "bg-white text-slate-900 shadow-lg"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <Stethoscope className="w-5 h-5" />
              Médecins ({medecins.length})
            </button>
            <button
              onClick={() => setActiveTab("cliniques")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "cliniques"
                  ? "bg-white text-slate-900 shadow-lg"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <Building2 className="w-5 h-5" />
              Cliniques ({cliniques.length})
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600" />
                Rechercher
              </label>
              <Input
                type="text"
                placeholder="Nom, Spécialité, Clinique, Commune..."
                className="w-full h-14 pl-5 pr-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="lg:col-span-3">
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-blue-600" />
                Spécialité
              </label>
              <SimpleSelect
                value={specialty}
                onValueChange={setSpecialty}
                options={specialitesUniques}
                placeholder="Toutes"
              />
            </div>

            <div className="lg:col-span-3">
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Commune
              </label>
              <SimpleSelect
                value={location}
                onValueChange={setLocation}
                options={communesUniques}
                placeholder="Partout"
              />
            </div>

            <div className="lg:col-span-1 flex items-end">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className={`w-full h-14 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-300 shadow-lg ${
                  showFilters
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Filter className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && activeTab === "medecins" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-slate-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Disponibilité
                    </label>
                    <SimpleSelect
                      value={filters.availability}
                      onValueChange={(val) =>
                        setFilters({ ...filters, availability: val })
                      }
                      options={availabilityOptions}
                      placeholder="Toutes"
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Expérience
                    </label>
                    <SimpleSelect
                      value={filters.experience}
                      onValueChange={(val) =>
                        setFilters({ ...filters, experience: val })
                      }
                      options={experienceOptions}
                      placeholder="Tous niveaux"
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Note minimum
                    </label>
                    <SimpleSelect
                      value={filters.rating}
                      onValueChange={(val) =>
                        setFilters({ ...filters, rating: val })
                      }
                      options={ratingOptions}
                      placeholder="Toutes notes"
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Budget
                    </label>
                    <SimpleSelect
                      value={filters.priceRange}
                      onValueChange={(val) =>
                        setFilters({ ...filters, priceRange: val })
                      }
                      options={priceOptions}
                      placeholder="Tous prix"
                      className="h-12"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Liste des médecins ou cliniques */}
      <div className="container mx-auto px-6 pb-20">
        {activeTab === "medecins" ? (
          /* Liste des médecins */
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  {filteredMedecins.length} Médecin
                  {filteredMedecins.length !== 1 ? "s" : ""} disponible
                  {filteredMedecins.length !== 1 ? "s" : ""}
                </h2>
                <p className="text-slate-600">
                  Des professionnels de santé qualifiés à votre service
                </p>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
                  >
                    <div className="h-32 bg-slate-200 rounded-xl mb-4"></div>
                    <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-slate-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredMedecins.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Aucun médecin trouvé
                </h3>
                <p className="text-slate-600 mb-6">
                  Essayez d'ajuster vos critères de recherche
                </p>
                <Button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
                >
                  Réinitialiser les filtres
                </Button>
              </motion.div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {filteredMedecins.map((medecin, index) => (
                    <MedecinCard
                      key={medecin.id}
                      medecin={medecin}
                      index={index}
                      favorites={favorites}
                      toggleFavorite={toggleFavorite}
                      navigate={navigate}
                      isAuthenticated={isAuthenticated}
                      role={role}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        ) : (
          /* Liste des cliniques */
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  {filteredCliniques.length} Clinique
                  {filteredCliniques.length !== 1 ? "s" : ""} disponible
                  {filteredCliniques.length !== 1 ? "s" : ""}
                </h2>
                <p className="text-slate-600">
                  Établissements de santé partenaires
                </p>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
                  >
                    <div className="h-32 bg-slate-200 rounded-xl mb-4"></div>
                    <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-slate-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredCliniques.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Aucune clinique trouvée
                </h3>
                <p className="text-slate-600 mb-6">
                  Essayez d'ajuster vos critères de recherche
                </p>
                <Button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
                >
                  Réinitialiser les filtres
                </Button>
              </motion.div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {filteredCliniques.map((clinique, index) => (
                    <motion.div
                      key={clinique.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-purple-200"
                    >
                      <div className="relative h-32 bg-gradient-to-br from-purple-500 to-pink-500">
                        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />

                        {/* Badge type d'établissement */}
                        {clinique.type_etablissement && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-white/90 backdrop-blur-sm text-purple-700 border-0 px-3 py-1">
                              {clinique.type_etablissement}
                            </Badge>
                          </div>
                        )}

                        {/* Services Dynamiques */}
                        <div className="absolute bottom-4 left-4 flex gap-2">
                          {Boolean(clinique.urgences_24h) && (
                            <Badge className="bg-red-100 text-red-700 border-0 px-2 py-1 text-xs">
                              Urgences 24h
                            </Badge>
                          )}
                          {Boolean(clinique.parking_disponible) && (
                            <Badge className="bg-green-100 text-green-700 border-0 px-2 py-1 text-xs">
                              Parking
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            <Building2 className="w-8 h-8" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-1">
                              {clinique.nom}
                            </h3>
                            <p className="text-purple-600 font-semibold">
                              {clinique.medecins ? clinique.medecins.length : 0}{" "}
                              médecin
                              {clinique.medecins && clinique.medecins.length > 1
                                ? "s"
                                : ""}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <MapPin className="w-4 h-4 text-purple-500 flex-shrink-0" />
                            <span>{clinique.address}</span>
                          </div>

                          {clinique.telephone && (
                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                              <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span>{clinique.telephone}</span>
                            </div>
                          )}
                        </div>

                        {clinique.description && (
                          <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                            {clinique.description}
                          </p>
                        )}

                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            className="flex-1 h-11 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50"
                            onClick={() =>
                              navigate(`/profil-clinique/${clinique.id}`)
                            }
                          >
                            Voir profil
                          </Button>
                          <Button
                            className="flex-1 h-11 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
                            onClick={() =>
                              navigate(`/profil-clinique/${clinique.id}`)
                            }
                          >
                            <Users className="w-4 h-4" />
                            Voir médecins
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 py-3 mb-8">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium">
                Plateforme 100% sécurisée
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Prenez votre santé en main
              </span>
            </h2>

            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Rejoignez des milliers de patients satisfaits. Consultation
              rapide, médecins certifiés, rendez-vous en ligne 24/7.
            </p>

            <div className="grid grid-cols-3 gap-6 mb-10 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {medecins.length}+
                </div>
                <div className="text-sm text-slate-400">Médecins</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">2K+</div>
                <div className="text-sm text-slate-400">Consultations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">98%</div>
                <div className="text-sm text-slate-400">Satisfaction</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/trouver-medecin")}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl text-white font-semibold shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                Commencer maintenant
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => navigate("/contact")}
                className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Nous contacter
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TrouverMedecinPremium;
