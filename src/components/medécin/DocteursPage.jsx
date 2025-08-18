import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const TrouverMedecinPremium = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
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

  // Données premium avec plus d'informations
  const medecins = [
    {
      id: 1,
      nom: "Charles Kouassi",
      specialite: "Cardiologie",
      sousSpecialite: "Cardiologie Interventionnelle",
      ville: "Abidjan, Plateau",
      quartier: "Angré 8ème Tranche",
      image: "/medécin/med1.jpg",
      experience: 12,
      rating: 4.9,
      reviews: 128,
      languages: ["Français", "Anglais"],
      disponibilite: "Aujourd'hui",
      prix: 25000,
      bio: "Cardiologue expérimentée avec une spécialisation en interventions coronariennes. Diplômée de l'Université de Paris VI.",
      education: "MD, PhD Cardiologie",
      hospital: "CHU de Cocody",
    },
    {
      id: 2,
      nom: "Jean Koné",
      specialite: "Dentisterie",
      sousSpecialite: "Orthodontie",
      ville: "Abidjan, Cocody",
      quartier: "Riviera Golf",
      image: "/medécin/med2.jpg",
      experience: 8,
      rating: 4.7,
      reviews: 86,
      languages: ["Français", "Espagnol"],
      disponibilite: "Demain",
      prix: 18000,
      bio: "Orthodontiste spécialisé dans les traitements invisalign pour adultes et adolescents. Approche douce et personnalisée.",
      education: "DDS, MSc Orthodontie",
      hospital: "Clinique Odontologique des 2 Plateaux",
    },
    {
      id: 3,
      nom: "Awa Diabaté",
      specialite: "Pédiatrie",
      sousSpecialite: "Néonatologie",
      ville: "Yamoussoukro",
      quartier: "Kouassi N'Daw",
      image: "/medécin/med3.jpg",
      experience: 15,
      rating: 4.8,
      reviews: 215,
      languages: ["Français", "Baoulé"],
      disponibilite: "Aujourd'hui",
      prix: 20000,
      bio: "Pédiatre néonatologiste avec une expertise en soins intensifs néonatals. Passionnée par la santé infantile.",
      education: "MD, Pédiatrie",
      hospital: "Hôpital Mère-Enfant de Yamoussoukro",
    },
    {
      id: 4,
      nom: "Kwame N'Guessan",
      specialite: "Dermatologie",
      sousSpecialite: "Dermatologie Esthétique",
      ville: "Abidjan, Marcory",
      quartier: "Zone 4",
      image: "/medécin/med4.jpg",
      experience: 10,
      rating: 4.5,
      reviews: 92,
      languages: ["Français", "Anglais"],
      disponibilite: "Cette semaine",
      prix: 30000,
      bio: "Dermatologue esthétique spécialisé dans les traitements anti-âge et les soins de la peau noire.",
      education: "MD, Dermatologie",
      hospital: "Institut de Dermatologie d'Abidjan",
    },
    {
      id: 5,
      nom: "Alex Bamba",
      specialite: "Gynécologie",
      sousSpecialite: "Obstétrique",
      ville: "Bouaké",
      quartier: "Air France",
      image: "/medécin/med5.jpg",
      experience: 18,
      rating: 4.9,
      reviews: 187,
      languages: ["Français", "Dioula"],
      disponibilite: "Demain",
      prix: 22000,
      bio: "Gynécologue-obstétricienne avec une approche holistique de la santé féminine à toutes les étapes de la vie.",
      education: "MD, Gynécologie-Obstétrique",
      hospital: "Centre Hospitalier Régional de Bouaké",
    },
    {
      id: 6,
      nom: "Yves Aké",
      specialite: "Chirurgie",
      sousSpecialite: "Chirurgie Orthopédique",
      ville: "Abidjan, Treichville",
      quartier: "Port-Bouët",
      image: "/medécin/med6.jpg",
      experience: 14,
      rating: 4.6,
      reviews: 156,
      languages: ["Français", "Anglais"],
      disponibilite: "Cette semaine",
      prix: 35000,
      bio: "Chirurgien orthopédiste spécialisé dans les prothèses articulaires et la chirurgie du sport.",
      education: "MD, Chirurgie Orthopédique",
      hospital: "Clinique Internationale d'Orthopédie",
    },
  ];

  // Simuler le chargement
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Filtres avancés
  const filteredMedecins = medecins.filter((m) => {
    const matchesSearch =
      m.nom.toLowerCase().includes(search.toLowerCase()) ||
      m.specialite.toLowerCase().includes(search.toLowerCase()) ||
      m.ville.toLowerCase().includes(search.toLowerCase()) ||
      m.quartier.toLowerCase().includes(search.toLowerCase());

    const matchesSpecialty =
      specialty === "" ||
      m.specialite.toLowerCase().includes(specialty.toLowerCase()) ||
      m.sousSpecialite.toLowerCase().includes(specialty.toLowerCase());

    const matchesLocation =
      location === "" ||
      m.ville.toLowerCase().includes(location.toLowerCase()) ||
      m.quartier.toLowerCase().includes(location.toLowerCase());

    const matchesFilters =
      (filters.availability === "all" ||
        (filters.availability === "today" &&
          m.disponibilite === "Aujourd'hui") ||
        (filters.availability === "tomorrow" &&
          m.disponibilite === "Demain")) &&
      (filters.experience === "all" ||
        (filters.experience === "junior" && m.experience < 5) ||
        (filters.experience === "mid" &&
          m.experience >= 5 &&
          m.experience < 10) ||
        (filters.experience === "senior" && m.experience >= 10)) &&
      (filters.rating === "all" ||
        (filters.rating === "4+" && m.rating >= 4) ||
        (filters.rating === "4.5+" && m.rating >= 4.5));

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
  const villesUniques = [...new Set(medecins.map((m) => m.ville))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ===== HERO SECTION ANIMÉE ===== */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-teal-500 text-white py-24">
        {/* Animation de fond */}
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

      {/* ===== BARRE DE RECHERCHE AVANCÉE ===== */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white shadow-lg rounded-xl p-6 relative z-20 -mt-12 mx-4 sm:mx-8 md:mx-16 lg:mx-20"
      >
        {/* Ligne principale des champs de recherche */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Champ de recherche texte */}
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

          {/* Sélecteur de spécialité */}
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

          {/* Sélecteur de localisation */}
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

          {/* Bouton Filtres */}
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="h-12 flex items-center justify-center gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>Filtres</span>
          </Button>
        </div>

        {/* Section des filtres avancés */}
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
                {/* Filtre Disponibilité */}
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

                {/* Filtre Expérience */}
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

                {/* Filtre Note minimale */}
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

      {/* ===== CONTENU PRINCIPAL ===== */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* SIDEBAR (pour filtres supplémentaires) */}
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
                    <MapPin className="w-4 h-4" /> Villes
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

          {/* LISTE DES MEDECINS */}
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
                            <img
                              src={medecin.image}
                              alt={medecin.nom}
                              className="w-20 h-20 rounded-full object-cover border-2 border-blue-100 shadow-md"
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
                                  Dr. {medecin.nom}
                                </h3>
                                <p className="text-blue-600 font-medium">
                                  {medecin.specialite}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {medecin.sousSpecialite}
                                </p>
                              </div>
                              <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="ml-1 text-sm font-medium">
                                  {medecin.rating}
                                </span>
                              </div>
                            </div>

                            <div className="mt-2 space-y-1">
                              <p className="flex items-center text-sm text-gray-600">
                                <MapPin className="w-4 h-4 mr-1 text-blue-400" />
                                {medecin.quartier}, {medecin.ville}
                              </p>
                              <p className="flex items-center text-sm text-gray-600">
                                <Clock className="w-4 h-4 mr-1 text-blue-400" />
                                {medecin.disponibilite} •{" "}
                                {medecin.prix.toLocaleString()} FCFA
                              </p>
                              <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                {medecin.bio}
                              </p>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              <Badge
                                variant="secondary"
                                className="text-blue-600 bg-blue-50"
                              >
                                {medecin.experience} ans exp.
                              </Badge>
                              {medecin.languages.map((lang) => (
                                <Badge key={lang} variant="outline">
                                  {lang}
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
                              alert(`Prendre rendez-vous avec ${medecin.nom}`)
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

      {/* ===== CTA FINAL ===== */}
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
