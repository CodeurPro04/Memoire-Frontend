import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  User,
  ChevronRight,
  ArrowRight,
  Shield,
  Sparkles,
  BadgeCheck,
  Calendar,
  MessageCircle,
  Star,
  Users,
  Zap,
  Award,
  Globe,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Dialog } from "@headlessui/react";
import { toast } from "@/components/ui/use-toast";
import MapSection from "@/components/MapSection";
import axios from "axios";
import api from "@/api/axios";

const ContactPagePremium = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [statsData, setStatsData] = useState({
    medecinsCount: 0,
    consultationsCount: 0,
    satisfactionRate: "98%",
    responseTime: "< 24h",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Récupérer les médecins pour compter le nombre
        const medecinsResponse = await api.get("/medecins");
        const medecinsCount = medecinsResponse.data.length;

        // Estimation du nombre de consultations basé sur le nombre de médecins
        const consultationsCount = Math.floor(medecinsCount * 100);

        setStatsData({
          medecinsCount,
          consultationsCount,
          satisfactionRate: "98%",
          responseTime: "< 24h",
        });
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
        // Valeurs par défaut en cas d'erreur
        setStatsData({
          medecinsCount: 500,
          consultationsCount: 50000,
          satisfactionRate: "98%",
          responseTime: "< 24h",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (value) => {
    setFormData((prev) => ({ ...prev, subject: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Message envoyé",
          description:
            "Merci pour votre message. Nous vous répondrons très bientôt.",
          variant: "default",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setIsSubmitted(true);
      } else {
        toast({
          title: "Erreur",
          description:
            result.message ||
            "Une erreur est survenue lors de l'envoi du message.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur d'envoi :", error);
      toast({
        title: "Erreur réseau",
        description:
          "Impossible de contacter le serveur. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    }
  };

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios
      .get("")
      .then((res) => {
        if (res.data.success) setCategories(res.data.categories);
      })
      .catch((err) =>
        console.error("Erreur lors de la récupération des catégories", err)
      );
  }, []);

  // Stats dynamiques
  const stats = [
    {
      icon: Users,
      value: `${(statsData.medecinsCount * 20).toLocaleString()}+`,
      label: "Patients satisfaits",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: CheckCircle,
      value: statsData.satisfactionRate,
      label: "Taux de réponse",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Zap,
      value: statsData.responseTime,
      label: "Temps de réponse",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Award,
      value: `${statsData.medecinsCount}+`,
      label: "Experts disponibles",
      color: "from-purple-500 to-pink-500",
    },
  ];

  // Stats pour la section CTA finale
  const finalStats = [
    {
      value: `${statsData.medecinsCount}+`,
      label: "Médecins",
    },
    {
      value: `${(statsData.consultationsCount / 1000).toFixed(0)}K+`,
      label: "Consultations",
    },
    {
      value: statsData.satisfactionRate,
      label: "Satisfaction",
    },
  ];

  // Composant Select personnalisé qui fonctionne comme un bouton
  const CustomSelect = () => {
    const options = [
      { value: "Cardiologie", label: "Cardiologie" },
      { value: "Dermatologie", label: "Dermatologie" },
      { value: "Médecine générale", label: "Médecine générale" },
      { value: "Autre", label: "Autre" },
    ];

    const selectedOption = options.find(
      (opt) => opt.value === formData.subject
    );

    return (
      <div className="relative">
        {/* Bouton du sélecteur */}
        <button
          type="button"
          onClick={() => setIsSelectOpen(!isSelectOpen)}
          className="w-full h-14 px-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-white text-left font-normal hover:bg-slate-50 transition-all duration-200 flex items-center justify-between group"
        >
          <span
            className={selectedOption ? "text-slate-900" : "text-slate-500"}
          >
            {selectedOption ? selectedOption.label : "Sélectionnez un sujet"}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
              isSelectOpen ? "rotate-180" : ""
            } group-hover:text-slate-600`}
          />
        </button>

        {/* Menu déroulant */}
        {isSelectOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl shadow-slate-900/20 border-2 border-slate-200 overflow-hidden"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  handleSubjectChange(option.value);
                  setIsSelectOpen(false);
                }}
                className={`w-full px-4 py-4 text-left hover:bg-blue-50 transition-colors duration-200 border-b border-slate-100 last:border-b-0 ${
                  formData.subject === option.value
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Hero Section Ultra Premium */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-blue-600 to-teal-400 dark:bg-green-900/20">
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
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-blue-200">
                Support 24h/24 - 7j/7
              </span>
              <BadgeCheck className="w-4 h-4 text-cyan-400" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                Contactez
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-blue-200 bg-clip-text text-transparent">
                Meetmed
              </span>
            </h1>

            <p className="text-xl text-white mb-12 max-w-2xl mx-auto leading-relaxed">
              Notre équipe d'experts est à votre écoute pour répondre à toutes
              vos questions médicales. Assistance rapide et personnalisée.
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
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="rgb(248, 250, 252)"
            />
          </svg>
        </div>
      </div>

      {/* Contact Grid Premium */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Contact Form Premium */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200 overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                  Envoyez-nous un message
                </h2>
                <p className="text-slate-600">
                  Notre équipe vous répond dans les plus brefs délais
                </p>
              </div>

              <AnimatePresence>
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 mb-8 flex items-start gap-4"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-emerald-900 mb-1 text-lg">
                        Message envoyé avec succès !
                      </h3>
                      <p className="text-emerald-700">
                        Nous vous recontacterons dans les plus brefs délais.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          Nom complet
                        </label>
                        <Input
                          type="text"
                          name="name"
                          placeholder="Nom et Prénom*"
                          value={formData.name}
                          onChange={handleChange}
                          className="h-14 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-600" />
                          Email
                        </label>
                        <Input
                          type="email"
                          name="email"
                          placeholder="Email*"
                          value={formData.email}
                          onChange={handleChange}
                          className="h-14 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-600" />
                          Téléphone
                        </label>
                        <Input
                          type="tel"
                          name="phone"
                          placeholder="Numéro de téléphone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="h-14 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Sujet
                        </label>
                        <CustomSelect />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        placeholder="Votre message*"
                        rows="6"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 resize-none outline-none transition-all"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center justify-center gap-2 group"
                    >
                      Envoyer le message
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Contact Info Premium */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Coordonnées */}
            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">
                Nos coordonnées
              </h3>

              <div className="space-y-6">
                {[
                  {
                    icon: Mail,
                    title: "Email",
                    content: "contact@meetmed.com",
                    subtitle: "Réponse sous 24h",
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    icon: Phone,
                    title: "Téléphones",
                    content: "+225 07 00 00 00 43\n+33 7 00 00 00 43",
                    subtitle: "Lun-Ven : 8h-18h",
                    color: "from-emerald-500 to-teal-500",
                  },
                  {
                    icon: MapPin,
                    title: "Nos bureaux",
                    content:
                      "Rue des Entrepreneurs, Plateau\nAbidjan, Côte d'Ivoire",
                    color: "from-purple-500 to-pink-500",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4 group hover:bg-slate-50/50 p-4 rounded-2xl transition-all duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 mt-1`}
                    >
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-2">
                        {item.title}
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line mb-2">
                        {item.content}
                      </p>
                      <p className="text-sm text-slate-500">{item.subtitle}</p>
                      {item.title === "Nos bureaux" && (
                        <a
                          href="https://maps.app.goo.gl/VrLfGmPhzx4KLj6x7"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 text-sm font-medium mt-2"
                        >
                          Voir sur la carte
                          <ChevronRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Map Section */}
      <MapSection />

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

      {/* Modal Rendez-vous Premium */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          aria-hidden="true"
        />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-3xl shadow-2xl shadow-slate-900/20 max-w-md w-full mx-auto overflow-hidden border border-slate-200">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <Dialog.Title className="text-2xl font-bold text-slate-900">
                  Prendre un rendez-vous
                </Dialog.Title>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-xl"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nom complet
                    </label>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Votre nom"
                      required
                      className="h-12 rounded-xl border-2 border-slate-200 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email@gmail.com"
                      required
                      className="h-12 rounded-xl border-2 border-slate-200 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Téléphone
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="00 00 00 00 43"
                      required
                      className="h-12 rounded-xl border-2 border-slate-200 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Date
                      </label>
                      <Input
                        type="date"
                        name="date"
                        required
                        className="h-12 rounded-xl border-2 border-slate-200 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Heure
                      </label>
                      <Input
                        type="time"
                        name="time"
                        required
                        className="h-12 rounded-xl border-2 border-slate-200 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Message (optionnel)
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      placeholder="Décrivez votre demande..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 resize-none outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-3 border-2 border-slate-200 text-white rounded-xl font-semibold bg-red-600 hover:border-red-800 hover:bg-red-800 transition-all"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/25"
                  >
                    Confirmer le rendez-vous
                  </Button>
                </div>
              </form>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ContactPagePremium;
