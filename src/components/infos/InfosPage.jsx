import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Stethoscope,
  CalendarCheck,
  UserPlus,
  ShieldCheck,
  Smartphone,
  Clock,
  HeartPulse,
  BookOpen,
  ArrowRight,
  Sparkles,
  BadgeCheck,
  Shield,
  Star,
  Users,
  Zap,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";

const InfoPage = () => {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState({
    medecinsCount: 0,
    consultationsCount: 0,
    averageRating: "4.8",
    patientsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Récupérer les médecins pour compter le nombre
        const medecinsResponse = await api.get("/medecins");
        const medecinsCount = medecinsResponse.data.length;

        // Calculer la note moyenne
        const totalRating = medecinsResponse.data.reduce((sum, medecin) => {
          return sum + (medecin.average_rating || 4.5);
        }, 0);
        const averageRating =
          medecinsCount > 0 ? (totalRating / medecinsCount).toFixed(1) : "4.8";

        // Pour les consultations et patients, on peut utiliser des données simulées
        // ou appeler des endpoints spécifiques si disponibles
        const consultationsCount = Math.floor(medecinsCount * 100); // Estimation
        const patientsCount = Math.floor(medecinsCount * 20); // Estimation

        setStatsData({
          medecinsCount,
          consultationsCount: consultationsCount,
          averageRating,
          patientsCount,
        });
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
        // Valeurs par défaut en cas d'erreur
        setStatsData({
          medecinsCount: 500,
          consultationsCount: 50000,
          averageRating: "4.8",
          patientsCount: 10000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const features = [
    {
      icon: UserPlus,
      title: "Inscription Simple",
      description:
        "Créez votre compte en moins de 2 minutes et accédez à tous nos services.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      icon: Stethoscope,
      title: "Recherche Avancée",
      description:
        "Trouvez le médecin idéal par spécialité, localisation ou disponibilité.",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      textColor: "text-emerald-600",
    },
    {
      icon: CalendarCheck,
      title: "Rendez-vous en Ligne",
      description:
        "Prenez rendez-vous 24h/24 et recevez une confirmation instantanée.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      icon: ShieldCheck,
      title: "Sécurité des Données",
      description:
        "Vos informations sont cryptées et protégées conformément aux normes.",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
      iconBg: "bg-amber-100",
      textColor: "text-amber-600",
    },
  ];

  const steps = [
    {
      step: "1",
      icon: BookOpen,
      title: "Consultez les profils",
      content:
        "Parcourez les profils vérifiés de nos professionnels de santé certifiés.",
      color: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      step: "2",
      icon: HeartPulse,
      title: "Choisissez votre spécialiste",
      content:
        "Sélectionnez en fonction des spécialités, notes et disponibilités.",
      color: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-100",
      textColor: "text-emerald-600",
    },
    {
      step: "3",
      icon: CalendarCheck,
      title: "Planifiez votre consultation",
      content: "Choisissez un créneau qui correspond à vos disponibilités.",
      color: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      step: "4",
      icon: Smartphone,
      title: "Confirmation immédiate",
      content:
        "Recevez votre confirmation par email et SMS avec tous les détails.",
      color: "from-amber-500 to-orange-500",
      iconBg: "bg-amber-100",
      textColor: "text-amber-600",
    },
  ];

  // Stats dynamiques
  const stats = [
    {
      icon: Users,
      value: `${statsData.medecinsCount}+`,
      label: "Médecins certifiés",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: CheckCircle,
      value: `${(statsData.consultationsCount / 1000).toFixed(0)}K+`,
      label: "Consultations",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Star,
      value: statsData.averageRating,
      label: "Note moyenne",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Zap,
      value: "24/7",
      label: "Support disponible",
      color: "from-purple-500 to-pink-500",
    },
  ];

  // Stats pour la section CTA finale
  const finalStats = [
    {
      value: "10K+",
      label: "Patients actifs",
    },
    {
      value: `${statsData.medecinsCount}+`,
      label: "Médecins",
    },
    {
      value: "98%",
      label: "Satisfaction",
    },
  ];

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

        {/* Decorative animated circles */}
        <motion.div
          className="absolute -top-32 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

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
                Comment ça marche
              </span>
              <BadgeCheck className="w-4 h-4 text-cyan-400" />
            </motion.div>

            {/* Titre */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                Votre santé,
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-blue-200 bg-clip-text text-transparent">
                simplifiée
              </span>
            </h1>

            <p className="text-xl text-white mb-12 max-w-2xl mx-auto leading-relaxed">
              Découvrez comment notre plateforme révolutionne votre accès aux
              soins médicaux avec une expérience simple et sécurisée.
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

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                onClick={() => navigate("/trouver-medecin")}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl text-white font-semibold shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 mx-auto"
              >
                Découvrir maintenant
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
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

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-blue-100 text-blue-600 border-0 px-4 py-2 rounded-full font-semibold">
            Nos Avantages
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Une expérience médicale repensée
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Nous combinons technologie et expertise médicale pour vous offrir un
            service inégalé.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-blue-200"
              >
                {/* Header gradient */}
                <div className={`h-2 bg-gradient-to-r ${feature.color}`} />

                <div className="p-8 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-6 rounded-2xl ${feature.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className={`w-8 h-8 ${feature.textColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Footer line */}
                <div
                  className={`h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-b from-slate-50 to-blue-50/50 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-purple-100 text-purple-600 border-0 px-4 py-2 rounded-full font-semibold">
              Guide Pratique
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              En seulement 4 étapes
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Votre parcours vers des soins de qualité n'a jamais été aussi
              simple et rapide.
            </p>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            {/* Ligne de connexion verticale pour mobile / desktop */}
            <div className="hidden lg:block absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-cyan-200 transform -translate-x-1/2" />

            <div className="space-y-8 lg:space-y-16">
              {steps.map((step, idx) => {
                const IconComponent = step.icon;
                const isEven = idx % 2 === 0;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className={`relative lg:flex ${
                      isEven ? "lg:justify-end" : "lg:justify-start"
                    }`}
                  >
                    {/* Point de connexion */}
                    <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                      <div
                        className={`w-4 h-4 rounded-full bg-gradient-to-br ${step.color} border-4 border-white shadow-lg`}
                      />
                    </div>

                    <div className="max-w-md lg:max-w-lg">
                      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 group">
                        {/* Header gradient */}
                        <div className={`h-2 bg-gradient-to-r ${step.color}`} />

                        <div className="p-8">
                          {/* Number badge */}
                          <div className="flex items-center gap-4 mb-6">
                            <div
                              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
                            >
                              {step.step}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {step.title}
                            </h3>
                          </div>

                          {/* Icon et contenu */}
                          <div className="flex items-start gap-4">
                            <div
                              className={`flex-shrink-0 w-12 h-12 rounded-xl ${step.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                            >
                              <IconComponent
                                className={`w-6 h-6 ${step.textColor}`}
                              />
                            </div>
                            <p className="text-slate-600 leading-relaxed pt-2">
                              {step.content}
                            </p>
                          </div>
                        </div>

                        {/* Footer line */}
                        <div
                          className={`h-1 bg-gradient-to-r ${step.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section Premium */}
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
                Rejoignez-nous aujourd'hui
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Prêt à prendre en main votre santé ?
              </span>
            </h2>

            <p className="text-xl text-white mb-10 max-w-2xl mx-auto leading-relaxed">
              Rejoignez les milliers de patients qui simplifient déjà leur
              parcours médical avec notre plateforme.
            </p>

            {/* Stats mini dynamiques */}
            <div className="grid grid-cols-3 gap-6 mb-10 max-w-2xl mx-auto">
              {finalStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white">{stat.label}</div>
                </div>
              ))}
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
                onClick={() => navigate("/specialites")}
                className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white font-semibold hover:bg-white/20 transition-all duration-300"
              >
                Voir les spécialités
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
