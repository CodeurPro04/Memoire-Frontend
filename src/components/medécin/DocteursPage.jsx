import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  User,
  Mail,
  Phone,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthContext } from "@/context/AuthContext";
import api from "@/api/axios";
import defaultAvatar from "@/assets/default-avatar.png";
import SafeAvatar from "@/components/common/SafeAvatar";

const TrouverMedecinPremium = () => {
  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long" });
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    availability: "all",
    experience: "all",
    rating: "all",
  });
  const [medecins, setMedecins] = useState([]);

  // Charger les médecins depuis l'API
  useEffect(() => {
    const fetchMedecins = async () => {
      try {
        const response = await api.get("/medecins");
        setMedecins(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des médecins:", error);
        setLoading(false);
      }
    };

    fetchMedecins();
  }, []);

  // Filtres avancés
  const filteredMedecins = medecins.filter((medecin) => {
    const matchesSearch =
      medecin.nom.toLowerCase().includes(search.toLowerCase()) ||
      medecin.prenom.toLowerCase().includes(search.toLowerCase()) ||
      medecin.specialite.toLowerCase().includes(search.toLowerCase()) ||
      medecin.address?.toLowerCase().includes(search.toLowerCase());

    const matchesSpecialty =
      specialty === "" ||
      medecin.specialite.toLowerCase().includes(specialty.toLowerCase());

    const matchesLocation =
      location === "" ||
      medecin.address?.toLowerCase().includes(location.toLowerCase());

    const matchesFilters =
      (filters.availability === "all" ||
        (filters.availability === "today" &&
          medecin.disponibilite === "Aujourd'hui") ||
        (filters.availability === "tomorrow" &&
          medecin.disponibilite === "Demain")) &&
      (filters.experience === "all" ||
        (filters.experience === "junior" && medecin.annees_experience < 5) ||
        (filters.experience === "mid" &&
          medecin.annees_experience >= 5 &&
          medecin.annees_experience < 10) ||
        (filters.experience === "senior" && medecin.annees_experience >= 10)) &&
      (filters.rating === "all" ||
        (filters.rating === "4+" && medecin.rating >= 4) ||
        (filters.rating === "4.5+" && medecin.rating >= 4.5));

    return (
      matchesSearch && matchesSpecialty && matchesLocation && matchesFilters
    );
  });

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const specialitesUniques = [...new Set(medecins.map((m) => m.specialite))];
  const villesUniques = [
    ...new Set(medecins.map((m) => m.address?.split(",")[0]).filter(Boolean)),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-teal-500 text-white py-24">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.3) 0%, transparent 20%)",
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                Trouvez le Médecin Idéal
              </span>
            </h1>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Accédez à notre réseau exclusif de professionnels de santé
              certifiés et prenez rendez-vous en quelques clics.
            </p>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Button className="bg-white text-blue-600 px-8 py-6 rounded-xl shadow-xl hover:bg-blue-50 text-lg font-semibold flex items-center gap-2">
                Commencer <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Barre de recherche */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white shadow-lg rounded-xl p-6 relative z-20 -mt-12 mx-4 sm:mx-8 md:mx-16 lg:mx-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative col-span-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-blue-400" />
            </div>
            <Input
              type="text"
              placeholder="Nom, spécialité..."
              className="pl-10 h-12 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative col-span-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Stethoscope className="h-5 w-5 text-blue-400" />
            </div>
            <Select onValueChange={setSpecialty}>
              <SelectTrigger className="pl-10 h-12 w-full text-left rounded-lg">
                <SelectValue placeholder="Spécialité" />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-lg">
                {specialitesUniques.map((spec) => (
                  <SelectItem
                    key={spec}
                    value={spec}
                    className="px-4 py-2 hover:bg-blue-50"
                  >
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative col-span-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-blue-400" />
            </div>
            <Select onValueChange={setLocation}>
              <SelectTrigger className="pl-10 h-12 w-full text-left rounded-lg">
                <SelectValue placeholder="Localisation" />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-lg">
                {villesUniques.map((ville) => (
                  <SelectItem
                    key={ville}
                    value={ville}
                    className="px-4 py-2 hover:bg-blue-50"
                  >
                    {ville}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="h-12 flex items-center justify-center gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>Filtres</span>
          </Button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 pt-4 border-t border-gray-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Disponibilité
                  </label>
                  <Select
                    value={filters.availability}
                    onValueChange={(val) =>
                      setFilters({ ...filters, availability: val })
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg shadow-lg">
                      <SelectItem value="all">Toutes disponibilités</SelectItem>
                      <SelectItem value="today">Aujourd'hui</SelectItem>
                      <SelectItem value="tomorrow">Demain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Expérience
                  </label>
                  <Select
                    value={filters.experience}
                    onValueChange={(val) =>
                      setFilters({ ...filters, experience: val })
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg shadow-lg">
                      <SelectItem value="all">Tous niveaux</SelectItem>
                      <SelectItem value="junior">Moins de 5 ans</SelectItem>
                      <SelectItem value="mid">5-10 ans</SelectItem>
                      <SelectItem value="senior">10+ ans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Note minimale
                  </label>
                  <Select
                    value={filters.rating}
                    onValueChange={(val) =>
                      setFilters({ ...filters, rating: val })
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg shadow-lg">
                      <SelectItem value="all">Toutes notes</SelectItem>
                      <SelectItem value="4+">4+ étoiles</SelectItem>
                      <SelectItem value="4.5+">4.5+ étoiles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar avec filtres supplémentaires */}
          <div className="md:w-1/4">
            <motion.div
              className="bg-white rounded-xl shadow-md p-6 sticky top-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-bold text-lg text-blue-600 mb-4">
                Filtrer par
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4" /> Spécialités
                  </h4>
                  <div className="space-y-2">
                    {specialitesUniques.map((spec) => (
                      <div key={spec} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`spec-${spec}`}
                          checked={specialty === spec}
                          onChange={() =>
                            setSpecialty(specialty === spec ? "" : spec)
                          }
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <label
                          htmlFor={`spec-${spec}`}
                          className="ml-2 text-gray-700"
                        >
                          {spec}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Ville
                  </h4>
                  <div className="space-y-2">
                    {villesUniques.map((ville) => (
                      <div key={ville} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`ville-${ville}`}
                          checked={location === ville}
                          onChange={() =>
                            setLocation(location === ville ? "" : ville)
                          }
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <label
                          htmlFor={`ville-${ville}`}
                          className="ml-2 text-gray-700"
                        >
                          {ville}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Liste des médecins */}
          <div className="w-full md:w-3/4 mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-2xl font-bold text-blue-600 break-words"
              >
                {filteredMedecins.length} Médecin
                {filteredMedecins.length !== 1 ? "s" : ""} trouvé
                {filteredMedecins.length !== 1 ? "s" : ""}
              </motion.h2>

              <div className="w-full md:w-auto overflow-x-auto">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="bg-blue-50 min-w-max">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Tous
                    </TabsTrigger>
                    <TabsTrigger
                      value="available"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Disponibles
                    </TabsTrigger>
                    <TabsTrigger
                      value="favorites"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Favoris
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start space-x-4">
                        <Skeleton className="h-20 w-20 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                          <Skeleton className="h-3 w-2/3" />
                          <Skeleton className="h-8 w-full mt-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredMedecins.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-md p-12 text-center"
              >
                <div className="mx-auto max-w-md">
                  <Search className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    Aucun médecin trouvé
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Essayez d'ajuster vos critères de recherche ou de supprimer
                    certains filtres.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                <AnimatePresence>
                  {filteredMedecins.map((medecin) => (
                    <motion.div
                      key={medecin.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                    >
                      <div className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="relative">
                            <SafeAvatar
                              src={medecin?.photo} // peut être null/undefined, c'est géré
                              alt={`Dr. ${medecin?.prenom || ""} ${
                                medecin?.nom || ""
                              }`}
                              size={80}
                              initials={`${medecin?.prenom?.charAt(0) ?? ""}${
                                medecin?.nom?.charAt(0) ?? ""
                              }`}
                            />
                            <button
                              onClick={() => toggleFavorite(medecin.id)}
                              className={`absolute -top-2 -right-2 p-1 rounded-full ${
                                favorites.includes(medecin.id)
                                  ? "text-red-500 bg-white"
                                  : "text-gray-400 bg-white"
                              }`}
                            >
                              <Heart
                                className={`w-5 h-5 ${
                                  favorites.includes(medecin.id)
                                    ? "fill-current"
                                    : ""
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                  Dr. {medecin.prenom} {medecin.nom}
                                </h3>
                                <p className="text-blue-600 font-medium">
                                  {medecin.specialite}
                                </p>
                              </div>
                              <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span className="ml-1 text-sm font-medium">
                                  4.8
                                </span>
                              </div>
                            </div>

                            <div className="mt-2 space-y-1">
                              {/* Adresse */}
                              <p className="flex items-center text-sm text-gray-600">
                                <MapPin className="w-4 h-4 mr-1 text-blue-400" />
                                {medecin.address || "Adresse non renseignée"}
                              </p>

                              {/* Disponibilité et prix */}
                              <p className="flex items-center text-sm text-gray-600 gap-2">
                                <Clock className="w-4 h-4" />
                                {(() => {
                                  const todayLower = today.toLowerCase();
                                  const todayHours =
                                    medecin.working_hours?.find(
                                      (wh) =>
                                        wh.day.toLowerCase() === todayLower
                                    );
                                  return todayHours
                                    ? `Disponible Aujourd'hui: ${todayHours.hours}`
                                    : "Indisponible";
                                })()}
                                •
                                {medecin.consultation_price !== null
                                  ? `${medecin.consultation_price.toLocaleString()} FCFA`
                                  : "Prix non renseigné"}
                              </p>

                              {/* Bio */}
                              {medecin.bio && (
                                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                  {medecin.bio}
                                </p>
                              )}
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              {/* Années d'expérience */}
                              <Badge
                                variant="secondary"
                                className="text-blue-600 bg-blue-50"
                              >
                                {medecin.experience_years || "?"} ans exp.
                              </Badge>

                              {/* Langues parlées */}
                              {medecin.languages &&
                                medecin.languages
                                  .split(",")
                                  .map((langue, index) => (
                                    <Badge key={index} variant="outline">
                                      {langue.trim()}
                                    </Badge>
                                  ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex justify-between items-center">
                          <Button
                            variant="outline"
                            className="border-blue-300 text-blue-600 hover:bg-blue-50"
                            onClick={() =>
                              navigate(`/profil-medecin/${medecin.id}`)
                            }
                          >
                            Voir profil
                          </Button>
                          <Button
                            onClick={() =>
                              navigate(`/profil-medecin/${medecin.id}`)
                            }
                            className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                          >
                            <Calendar className="w-4 h-4" /> Prendre RDV
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à prendre rendez-vous avec un spécialiste ?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Notre équipe est disponible 24h/24 pour vous aider à trouver le
              professionnel de santé qu'il vous faut.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button className="bg-white text-blue-600 px-8 py-4 rounded-lg shadow-lg hover:bg-blue-50 text-lg font-semibold">
                  Trouver un médecin
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  variant="outline"
                  className="border-white text-black px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 text-lg font-semibold"
                >
                  Contactez-nous
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TrouverMedecinPremium;
