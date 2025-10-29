import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Stethoscope,
  ArrowRight,
  ArrowLeft,
  Star,
  Clock,
  Shield,
  CheckCircle,
  Calendar,
  MessageCircle,
  Heart,
  Share2,
  Sparkles,
  TrendingUp,
  Award,
  ExternalLink,
  Navigation,
  Search,
} from "lucide-react";
import api from "@/api/axios";
import SafeAvatar from "@/components/common/SafeAvatar";

const ProfilClinique = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clinique, setClinique] = useState(null);
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("apropos");
  const [medecinsRatings, setMedecinsRatings] = useState({});

  // Charger les notes des médecins
  const fetchMedecinsRatings = async (medecinsList) => {
    try {
      const ratingsPromises = medecinsList.map(async (medecin) => {
        try {
          const response = await api.get(
            `/medecins/${medecin.id}/reviews/stats`
          );
          return {
            id: medecin.id,
            average_rating: response.data.average_rating || 0,
            total_reviews: response.data.total_reviews || 0,
          };
        } catch (error) {
          console.error(
            `Erreur chargement notes médecin ${medecin.id}:`,
            error
          );
          return {
            id: medecin.id,
            average_rating: 0,
            total_reviews: 0,
          };
        }
      });

      const ratingsResults = await Promise.all(ratingsPromises);
      const ratingsMap = {};
      ratingsResults.forEach((rating) => {
        ratingsMap[rating.id] = rating;
      });
      setMedecinsRatings(ratingsMap);
    } catch (error) {
      console.error("Erreur lors du chargement des notes:", error);
    }
  };

  // Fonction pour obtenir la note d'un médecin
  const getMedecinRating = (medecinId) => {
    const ratingData = medecinsRatings[medecinId];
    if (!ratingData) return { average: "0.0", total: 0 };

    return {
      average: parseFloat(ratingData.average_rating || 0).toFixed(1),
      total: ratingData.total_reviews || 0,
    };
  };

  useEffect(() => {
    const fetchCliniqueData = async () => {
      try {
        setLoading(true);
        console.log("Chargement de la clinique ID:", id);

        const response = await api.get(`/cliniques/${id}`);
        console.log("Réponse API:", response);
        console.log("Données clinique:", response.data);

        setClinique(response.data);

        if (response.data.medecins) {
          setMedecins(response.data.medecins);
          console.log("👨‍⚕️ Médecins chargés:", response.data.medecins.length);
          // Charger les notes des médecins
          await fetchMedecinsRatings(response.data.medecins);
        } else {
          console.warn("⚠️ Aucun médecin trouvé pour cette clinique");
          setMedecins([]);
        }
      } catch (err) {
        console.error("Erreur détaillée:", err);
        console.error("Status:", err.response?.status);
        console.error("Data erreur:", err.response?.data);

        setError(
          err.response?.data?.message ||
            "Impossible de charger les informations de la clinique"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCliniqueData();
  }, [id]);

  // Calcul des statistiques de la clinique
  const cliniqueStats = {
    totalMedecins: medecins.length,
    satisfactionRate: (() => {
      if (medecins.length === 0) return 0;
      const totalRating = medecins.reduce((sum, medecin) => {
        const rating = getMedecinRating(medecin.id);
        return sum + parseFloat(rating.average);
      }, 0);
      return Math.round((totalRating / medecins.length / 5) * 100);
    })(),
    experienceMoyenne: (() => {
      if (medecins.length === 0) return 0;
      const totalExperience = medecins.reduce((sum, medecin) => {
        return sum + (medecin.experience_years || 0);
      }, 0);
      return Math.round(totalExperience / medecins.length);
    })(),
  };

  // Composant Onglets
  const TabsNavigation = () => (
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-2 mb-8">
      <div className="grid grid-cols-3 gap-2">
        {[
          { id: "apropos", label: "À Propos", icon: Building2 },
          {
            id: "medecins",
            label: `Médecins (${medecins.length})`,
            icon: Users,
          },
          { id: "contact", label: "Contact", icon: Phone },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-slate-700 hover:bg-slate-100/50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  // Composant Carte Médecin
  const MedecinCard = ({ medecin, index }) => {
    const rating = getMedecinRating(medecin.id);

    return (
      <motion.div
        key={medecin.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-green-300 cursor-pointer"
        onClick={() => navigate(`/profil-medecin/${medecin.id}`)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative p-6">
          {/* Header avec photo et info */}
          <div className="flex items-start gap-4 mb-5">
            <div className="relative">
              <SafeAvatar
                src={medecin.photo_profil}
                alt={`Dr. ${medecin.prenom} ${medecin.nom}`}
                size={72}
                initials={`${medecin.prenom?.charAt(0)}${medecin.nom?.charAt(
                  0
                )}`}
                className="rounded-2xl border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">
                Dr. {medecin.prenom} {medecin.nom}
              </h3>
              <p className="text-green-600 font-semibold text-sm mb-2">
                {medecin.specialite}
              </p>
              {medecin.pivot?.fonction && (
                <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-0 text-xs px-3 py-1 font-medium">
                  {medecin.pivot.fonction}
                </Badge>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3 mb-4">
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Award className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-bold text-slate-900">
                  {medecin.experience_years && medecin.experience_years > 0
                    ? `${medecin.experience_years}+`
                    : "Non spécifié"}
                </span>
              </div>
              <span className="text-xs text-slate-500">ans exp.</span>
            </div>

            <div className="w-px h-6 bg-slate-300" />

            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-bold text-slate-900">
                  {rating.average}
                </span>
              </div>
              <span className="text-xs text-slate-500">
                {rating.total > 0 ? `${rating.total} avis` : "Aucun avis"}
              </span>
            </div>

            <div className="w-px h-6 bg-slate-300" />

            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-bold text-slate-900">Dispo</span>
              </div>
              <span className="text-xs text-slate-500">
                {medecin.disponibilite === "Aujourd'hui"
                  ? "Aujourd'hui"
                  : "Sur RDV"}
              </span>
            </div>
          </div>

          {/* Specialités tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge
              variant="outline"
              className="text-xs bg-blue-50 text-blue-700 border-blue-200"
            >
              Consultation
            </Badge>
            <Badge
              variant="outline"
              className="text-xs bg-purple-50 text-purple-700 border-purple-200"
            >
              Suivi
            </Badge>
            {medecin.specialite && (
              <Badge
                variant="outline"
                className="text-xs bg-orange-50 text-orange-700 border-orange-200"
              >
                {medecin.specialite}
              </Badge>
            )}
          </div>

          {/* CTA Button */}
          <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 group/btn">
            <span>Consulter le profil</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-green-200 transition-colors duration-300 pointer-events-none" />
      </motion.div>
    );
  };

  // Contenu des onglets
  const TabContent = () => {
    switch (activeTab) {
      case "apropos":
        return (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
            >
              <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
              <div className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                  À propos de {clinique.nom}
                </h2>
                <p className="text-slate-700 leading-relaxed mb-6">
                  {clinique.description ||
                    "Aucune description disponible pour cette clinique."}
                </p>

                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-purple-100 text-purple-700 border-0 px-4 py-2">
                    <Building2 className="w-4 h-4 mr-2" />
                    {clinique.type_etablissement || "Clinique médicale"}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700 border-0 px-4 py-2">
                    <Users className="w-4 h-4 mr-2" />
                    {cliniqueStats.totalMedecins} médecin
                    {cliniqueStats.totalMedecins !== 1 ? "s" : ""}
                  </Badge>
                  {cliniqueStats.satisfactionRate > 0 && (
                    <Badge className="bg-green-100 text-green-700 border-0 px-4 py-2">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      {cliniqueStats.satisfactionRate}% satisfaction
                    </Badge>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Services et Équipements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
            >
              <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500" />
              <div className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                  Services et Équipements
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800">Services</h3>
                    <div className="space-y-2">
                      {clinique.urgences_24h && (
                        <div className="flex items-center gap-3 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span>Service d'urgences 24h/24</span>
                        </div>
                      )}
                      {clinique.parking_disponible && (
                        <div className="flex items-center gap-3 text-blue-600">
                          <CheckCircle className="w-5 h-5" />
                          <span>Parking gratuit</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-purple-600">
                        <CheckCircle className="w-5 h-5" />
                        <span>Consultations spécialisées</span>
                      </div>
                      <div className="flex items-center gap-3 text-amber-600">
                        <CheckCircle className="w-5 h-5" />
                        <span>Soins ambulatoires</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800">
                      Équipements
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-slate-600">
                        <CheckCircle className="w-5 h-5" />
                        <span>Équipements modernes</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <CheckCircle className="w-5 h-5" />
                        <span>Salles de consultation</span>
                      </div>
                      {clinique.urgences_24h && (
                        <div className="flex items-center gap-3 text-red-600">
                          <CheckCircle className="w-5 h-5" />
                          <span>Équipements d'urgence</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );

      case "medecins":
        return (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
            >
              <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500" />
              <div className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
                  Notre Équipe Médicale ({medecins.length})
                </h2>

                {medecins.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {medecins.map((medecin, index) => (
                      <MedecinCard
                        key={medecin.id}
                        medecin={medecin}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-dashed border-slate-300"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                      <Users className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                      Aucun médecin disponible
                    </h3>
                    <p className="text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
                      Aucun médecin n'est actuellement rattaché à cette
                      clinique. Revenez ultérieurement pour découvrir notre
                      équipe médicale.
                    </p>
                    <Button
                      variant="outline"
                      className="border-2 border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl px-6 py-3"
                      onClick={() => navigate("/trouver-medecin")}
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Trouver un médecin
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
            >
              <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500" />
              <div className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                  Informations de Contact
                </h2>

                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Coordonnées */}
                  <div className="lg:col-span-1 space-y-6">
                    <h3 className="font-semibold text-slate-800 text-lg">
                      Coordonnées
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-purple-300 transition-colors">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Adresse</p>
                          <p className="text-slate-600">
                            {clinique.address || "Non spécifiée"}
                          </p>
                        </div>
                      </div>

                      {clinique.telephone && (
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-green-300 transition-colors">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Phone className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              Téléphone
                            </p>
                            <p className="text-slate-600">
                              {clinique.telephone}
                            </p>
                          </div>
                        </div>
                      )}

                      {clinique.email && (
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Mail className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">Email</p>
                            <p className="text-slate-600">{clinique.email}</p>
                          </div>
                        </div>
                      )}

                      {clinique.site_web && (
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-amber-300 transition-colors">
                          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Globe className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              Site web
                            </p>
                            <a
                              href={clinique.site_web}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {clinique.site_web}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Carte et Horaires */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Carte Google Maps */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-slate-800 text-lg">
                        Localisation
                      </h3>
                      <div
                        className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl border-2 border-slate-300 overflow-hidden group cursor-pointer hover:border-purple-500 transition-all duration-300 h-64"
                        onClick={() => {
                          if (clinique.address) {
                            const address = encodeURIComponent(
                              clinique.address
                            );
                            window.open(
                              `https://www.google.com/maps/search/?api=1&query=${address}`,
                              "_blank"
                            );
                          }
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 opacity-90">
                          <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:20px_20px]" />
                        </div>

                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="relative">
                            <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-2xl animate-pulse" />
                            <div className="absolute inset-0 w-8 h-8 bg-red-500 rounded-full animate-ping" />
                          </div>
                        </div>

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                          <Button className="bg-white/90 backdrop-blur-sm text-slate-900 hover:bg-white border-0 shadow-2xl px-6 py-3 rounded-xl font-semibold group/btn">
                            <MapPin className="w-4 h-4 mr-2" />
                            {clinique.address
                              ? "Voir sur Google Maps"
                              : "Localisation non disponible"}
                            <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </div>

                        {clinique.address && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-white/90 backdrop-blur-sm text-slate-700 border-0 px-3 py-2 font-medium">
                              <MapPin className="w-3 h-3 mr-1" />
                              {clinique.address.split(",")[0]}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Horaires */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-slate-800 text-lg">
                          Horaires d'ouverture
                        </h3>

                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
                          <div className="space-y-3">
                            {[
                              {
                                day: "Lundi - Vendredi",
                                hours: "08:00 - 18:00",
                              },
                              { day: "Samedi", hours: "08:00 - 13:00" },
                              { day: "Dimanche", hours: "Fermé" },
                            ].map((schedule, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center py-2 border-b border-amber-200 last:border-b-0"
                              >
                                <span className="font-medium text-slate-700">
                                  {schedule.day}
                                </span>
                                <span className="text-slate-600">
                                  {schedule.hours}
                                </span>
                              </div>
                            ))}
                          </div>

                          {clinique.urgences_24h && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-center gap-2 text-red-700">
                                <Clock className="w-4 h-4" />
                                <span className="font-semibold">
                                  Urgences 24h/24
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-slate-800 text-lg">
                          Actions rapides
                        </h3>

                        <div className="space-y-3">
                          {clinique.telephone && (
                            <Button
                              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 rounded-xl font-semibold shadow-lg shadow-purple-500/25"
                              onClick={() =>
                                window.open(`tel:${clinique.telephone}`)
                              }
                            >
                              <Phone className="w-4 h-4 mr-2" />
                              Appeler maintenant
                            </Button>
                          )}

                          {clinique.email && (
                            <Button
                              variant="outline"
                              className="w-full h-12 border-2 border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 rounded-xl font-semibold"
                              onClick={() =>
                                window.open(`mailto:${clinique.email}`)
                              }
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Envoyer un email
                            </Button>
                          )}

                          {clinique.address && (
                            <Button
                              variant="outline"
                              className="w-full h-12 border-2 border-slate-200 text-slate-700 hover:border-green-500 hover:text-green-600 rounded-xl font-semibold"
                              onClick={() => {
                                const address = encodeURIComponent(
                                  clinique.address
                                );
                                window.open(
                                  `https://www.google.com/maps/dir/?api=1&destination=${address}`,
                                  "_blank"
                                );
                              }}
                            >
                              <Navigation className="w-4 h-4 mr-2" />
                              Itinéraire
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-12 bg-white rounded-2xl shadow-2xl max-w-md"
        >
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Chargement...
          </h2>
          <p className="text-slate-600">
            Récupération des informations de la clinique
          </p>
        </motion.div>
      </div>
    );
  }

  if (error || !clinique) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-12 bg-white rounded-2xl shadow-2xl max-w-md"
        >
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Clinique non trouvée
          </h2>
          <p className="text-slate-600 mb-6">
            {error || "Vérifiez l'URL ou retournez à la liste des cliniques."}
          </p>
          <Button
            onClick={() => navigate("/trouver-medecin")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-100">
      {/* Header Premium */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-24 pb-24 mb-12">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-600/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        </div>

        {/* Navigation 
        <div className="container mx-auto px-6 py-6 relative z-10">
          <Button
            onClick={() => navigate("/trouver-medecin")}
            variant="ghost"
            className="text-white hover:bg-white/10 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div> */}

        {/* Profile Header */}
        <div className="container mx-auto px-6 pb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-start gap-8"
          >
            {/* Logo */}
            <div className="relative">
              <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white">
                {clinique.photo_profil ? (
                  <img
                    src={clinique.photo_profil}
                    alt={clinique.nom}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <Building2 className="w-16 h-16 text-cyan-600" />
                )}
              </div>
              <div className="absolute -bottom-3 -right-3 w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium text-cyan-200">
                      Établissement vérifié
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {clinique.nom}
                  </h1>
                  <p className="text-2xl text-cyan-300 font-semibold">
                    {clinique.type_etablissement || "Clinique médicale"}
                  </p>
                </div>

                {/* Actions rapides 
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isFavorite ? "text-red-400 fill-current" : "text-white"
                      }`}
                    />
                  </button>
                  <button className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all">
                    <Share2 className="w-5 h-5 text-white" />
                  </button>
                </div> */}
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    <span className="text-2xl font-bold text-white">
                      {cliniqueStats.totalMedecins}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">Médecins</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="text-2xl font-bold text-white">
                      {cliniqueStats.satisfactionRate}%
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">Satisfaction</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="text-2xl font-bold text-white">
                      {cliniqueStats.experienceMoyenne > 0
                        ? `${cliniqueStats.experienceMoyenne}+`
                        : "Non spécifié"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">Exp. moyenne</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    <span className="text-2xl font-bold text-white">100%</span>
                  </div>
                  <p className="text-sm text-slate-300">Certifié</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 80L60 70C120 60 240 40 360 33.3C480 26.7 600 33.3 720 40C840 46.7 960 53.3 1080 56.7C1200 60 1320 60 1380 60L1440 60V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z"
              fill="rgb(248, 250, 252)"
            />
          </svg>
        </div>
      </div>

      {/* Contenu Principal avec Onglets */}
      <div className="container mx-auto px-6 py-12 -mt-8 relative z-20">
        <TabsNavigation />
        <TabContent />
      </div>
    </div>
  );
};

export default ProfilClinique;
