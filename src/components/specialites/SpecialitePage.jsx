import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartPulse,
  Brain,
  Activity,
  UserCheck,
  Eye,
  Baby,
  Zap,
  Stethoscope,
  Microscope,
  Bone,
  ArrowRight,
  Search,
  Shield,
  Sparkles,
  BadgeCheck,
  Phone,
  Users,
  Clock,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";

// Mapping des icônes et couleurs par spécialité
const specialtyConfig = {
  Cardiologue: {
    icon: HeartPulse,
    color: "from-red-500 to-rose-500",
    bgColor: "from-red-50 to-rose-50",
    iconBg: "bg-red-100",
    textColor: "text-red-600",
  },
  Neurologue: {
    icon: Brain,
    color: "from-blue-500 to-indigo-500",
    bgColor: "from-blue-50 to-indigo-50",
    iconBg: "bg-blue-100",
    textColor: "text-blue-600",
  },
  Orthopédie: {
    icon: Bone,
    color: "from-amber-500 to-orange-500",
    bgColor: "from-amber-50 to-orange-50",
    iconBg: "bg-amber-100",
    textColor: "text-amber-600",
  },
  Dentisterie: {
    icon: UserCheck,
    color: "from-teal-500 to-cyan-500",
    bgColor: "from-teal-50 to-cyan-50",
    iconBg: "bg-teal-100",
    textColor: "text-teal-600",
  },
  Ophtalmologue: {
    icon: Eye,
    color: "from-indigo-500 to-purple-500",
    bgColor: "from-indigo-50 to-purple-50",
    iconBg: "bg-indigo-100",
    textColor: "text-indigo-600",
  },
  Pédiatre: {
    icon: Baby,
    color: "from-pink-500 to-rose-500",
    bgColor: "from-pink-50 to-rose-50",
    iconBg: "bg-pink-100",
    textColor: "text-pink-600",
  },
  Pneumologue: {
    icon: Activity,
    color: "from-emerald-500 to-green-500",
    bgColor: "from-emerald-50 to-green-50",
    iconBg: "bg-emerald-100",
    textColor: "text-emerald-600",
  },
  Hépatologue: {
    icon: Zap,
    color: "from-purple-500 to-violet-500",
    bgColor: "from-purple-50 to-violet-50",
    iconBg: "bg-purple-100",
    textColor: "text-purple-600",
  },
  Généraliste: {
    icon: Stethoscope,
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-50 to-emerald-50",
    iconBg: "bg-green-100",
    textColor: "text-green-600",
  },
  Dermatologue: {
    icon: HeartPulse,
    color: "from-orange-500 to-amber-500",
    bgColor: "from-orange-50 to-amber-50",
    iconBg: "bg-orange-100",
    textColor: "text-orange-600",
  },
  Gynécologue: {
    icon: HeartPulse,
    color: "from-pink-600 to-rose-600",
    bgColor: "from-pink-50 to-rose-50",
    iconBg: "bg-pink-100",
    textColor: "text-pink-700",
  },
  "Biologie médicale": {
    icon: Microscope,
    color: "from-cyan-500 to-blue-500",
    bgColor: "from-cyan-50 to-blue-50",
    iconBg: "bg-cyan-100",
    textColor: "text-cyan-600",
  },
};

const SpecialitesPage = () => {
  const navigate = useNavigate();
  const [specialites, setSpecialites] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSpecialites = async () => {
      try {
        setLoading(true);
        const response = await api.get("/medecins");
        const medecinsData = response.data;
        setMedecins(medecinsData);

        // Compter le nombre de médecins par spécialité
        const countBySpecialite = medecinsData.reduce((acc, m) => {
          const specialiteName = m.specialite || "Médecine générale";
          if (!acc[specialiteName]) acc[specialiteName] = 0;
          acc[specialiteName]++;
          return acc;
        }, {});

        // Transformer en tableau pour la grille
        const data = Object.keys(countBySpecialite).map((nom, idx) => {
          const config = specialtyConfig[nom] || {
            icon: Stethoscope,
            color: "from-slate-500 to-slate-600",
            bgColor: "from-slate-50 to-slate-100",
            iconBg: "bg-slate-100",
            textColor: "text-slate-600",
          };

          return {
            id: idx + 1,
            nom,
            icon: config.icon,
            color: config.color,
            bgColor: config.bgColor,
            iconBg: config.iconBg,
            textColor: config.textColor,
            description: `Soins spécialisés en ${nom.toLowerCase()}`,
            medecins: countBySpecialite[nom],
          };
        });

        setSpecialites(data);
      } catch (err) {
        console.error("Erreur lors du chargement des spécialités :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialites();
  }, []);

  // Calculer la note moyenne des médecins
  const calculateAverageRating = () => {
    if (medecins.length === 0) return "4.8";

    const totalRating = medecins.reduce((sum, medecin) => {
      return sum + (medecin.average_rating || 4.5);
    }, 0);

    return (totalRating / medecins.length).toFixed(1);
  };

  // Stats dynamiques
  const stats = [
    {
      icon: Stethoscope,
      value: `${specialites.length}+`,
      label: "Spécialités",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      value: `${medecins.length}`,
      label: "Médecins",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Clock,
      value: "24/7",
      label: "Disponible",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Star,
      value: calculateAverageRating(),
      label: "Note moyenne",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const handleSpecialtyClick = (specialty) => {
    navigate(`/trouver-medecin?specialite=${encodeURIComponent(specialty)}`);
  };

  // Filtrer les spécialités en fonction de la recherche
  const filteredSpecialites = specialites.filter((s) =>
    s.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Hero Section Premium */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-blue-600 to-teal-400 dark:bg-green-900/20">
        {/* Animated background */}
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
            {/* Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-400/20 rounded-full px-6 py-3 mb-8"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">
                Excellence médicale garantie
              </span>
              <BadgeCheck className="w-4 h-4 text-cyan-400" />
            </motion.div>

            {/* Titre */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                Nos Spécialités
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-blue-200 bg-clip-text text-transparent">
                Médicales
              </span>
            </h1>

            <p className="text-xl text-white mb-12 max-w-2xl mx-auto leading-relaxed">
              Découvrez notre gamme complète de spécialités médicales et trouvez
              l'expert certifié qu'il vous faut pour vos soins.
            </p>

            {/* Stats Grid */}
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
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 rounded-2xl transition-all duration-300" />
                  <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
                    <div
                      className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-white">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Barre de recherche */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white" />
                <Input
                  type="text"
                  placeholder="Rechercher une spécialité..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-16 pl-14 pr-5 rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-xl text-white placeholder:text-white focus:border-blue-400 focus:bg-white/20 transition-all text-lg"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Wave divider */}
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

      {/* Section Compteur et Recherche */}
      <div className="container mx-auto px-6 -mt-8 relative z-20 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {filteredSpecialites.length} Spécialité
                {filteredSpecialites.length !== 1 ? "s" : ""} disponible
                {filteredSpecialites.length !== 1 ? "s" : ""}
              </h2>
              <p className="text-slate-600 mt-1">
                {medecins.length} médecins experts à votre service
              </p>
            </div>
            <Button
              onClick={() => navigate("/trouver-medecin")}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/25 flex items-center gap-2"
            >
              Voir tous les médecins
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Grid des Spécialités */}
      <div className="container mx-auto px-6 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-slate-200 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-5 bg-slate-200 rounded mb-2 w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-full" />
                  </div>
                </div>
                <div className="h-10 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredSpecialites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Aucune spécialité trouvée
            </h3>
            <p className="text-slate-600 mb-6">
              Essayez un autre terme de recherche
            </p>
            <Button
              onClick={() => setSearchTerm("")}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Voir toutes les spécialités
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredSpecialites.map((specialty, index) => {
                const IconComponent = specialty.icon;
                return (
                  <motion.div
                    key={specialty.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSpecialtyClick(specialty.nom)}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-slate-200 hover:border-blue-200"
                  >
                    {/* Header avec gradient */}
                    <div
                      className={`h-2 bg-gradient-to-r ${specialty.color}`}
                    />

                    <div className="p-6">
                      {/* Icône et titre */}
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className={`p-3 rounded-xl ${specialty.iconBg} shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                        >
                          <IconComponent
                            className={`w-6 h-6 ${specialty.textColor}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {specialty.nom}
                          </h3>
                          <p className="text-sm text-slate-600 line-clamp-2">
                            {specialty.description}
                          </p>
                        </div>
                      </div>

                      {/* Footer avec badge et bouton */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <Badge
                          variant="secondary"
                          className={`${specialty.iconBg} ${specialty.textColor} border-0 font-semibold`}
                        >
                          {specialty.medecins} médecin
                          {specialty.medecins > 1 ? "s" : ""}
                        </Badge>
                        <div className="flex items-center gap-1 text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                          Explorer
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Effet de survol */}
                    <div
                      className={`h-1 bg-gradient-to-r ${specialty.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Section CTA finale */}
      <div className="bg-gradient-to-br from-sky-600 via-blue-600 to-teal-400 dark:bg-green-900/20 text-white py-24 relative overflow-hidden">
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
              <Shield className="w-4 h-4 text-white" />
              <span className="text-sm font-medium">
                Plateforme 100% sécurisée
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Prenez votre santé en main
              </span>
            </h2>

            <p className="text-xl text-white mb-10 max-w-2xl mx-auto leading-relaxed">
              Rejoignez des milliers de patients satisfaits. Consultation
              rapide, médecins certifiés, rendez-vous en ligne 24/7.
            </p>

            {/* Stats finaux dynamiques */}
            <div className="grid grid-cols-3 gap-6 mb-10 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {medecins.length}+
                </div>
                <div className="text-sm text-white">Médecins</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">2K+</div>
                <div className="text-sm text-white">Consultations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">98%</div>
                <div className="text-sm text-white">Satisfaction</div>
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

export default SpecialitesPage;
