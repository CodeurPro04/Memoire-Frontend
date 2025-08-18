import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  User,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MapSection from "@/components/MapSection";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { toast } from "@/components/ui/use-toast";

const ContactPage = () => {
  const [isOpen, setIsOpen] = useState(false); // ✅ définis ici
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://kofgo-consulting.com/api/contact.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      console.log("Réponse API :", result);

      if (result.success) {
        toast({
          title: "Message envoyé ✅",
          description:
            "Merci pour votre message. Nous vous répondrons très bientôt.",
          variant: "default",
        });

        // Réinitialise le formulaire
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
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
      console.error("Erreur d’envoi :", error);
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
      .get("https://www.kofgo-consulting.com/api/get_categories.php") // Adapte l'URL si besoin
      .then((res) => {
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des catégories", err);
      });
  }, []);

  const handleRdvSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://www.kofgo-consulting.com/api/rendezvous.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      console.log("Réponse API :", result);

      if (result.success) {
        toast({
          title: "Rendez-vous confirmé 🎉",
          description:
            "Merci d'avoir pris rendez-vous avec nous. Nous vous contacterons bientôt.",
          variant: "default",
        });
        setIsOpen(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: "",
          time: "",
          message: "",
        });
      } else {
        toast({
          title: "Erreur",
          description:
            result.message ||
            "Une erreur est survenue lors de la prise de rendez-vous.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur d’envoi :", error);
      toast({
        title: "Erreur réseau",
        description:
          "Impossible de contacter le serveur. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* Hero Section with Animated Background */}
      <section
        className="relative py-32 px-6 bg-gradient-to-r from-blue-600 to-teal-500 text-white overflow-hidden"
        id="HomeContact"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            className="w-full h-full object-cover opacity-45 dark:opacity-50"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/contact.mov" type="video/mp4" />
            Votre navigateur ne prend pas en charge les vidéos HTML5.
          </video>
        </div>
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-emerald-400/10"
              style={{
                width: Math.random() * 20 + 10,
                height: Math.random() * 20 + 10,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 100 - 50],
                x: [0, Math.random() * 100 - 50],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Contactez{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-teal-400 to-cyan-400 drop-shadow-lg">
              DocOnline
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Nous sommes à votre écoute pour répondre à vos questions
          </motion.p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="relative py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-8 drop-shadow-lg">
                Envoyez-nous un message
              </h2>

              {isSubmitted ? (
                <motion.div
                  className="bg-emerald-50 dark:bg-emerald-900/20 text-sky-600 dark:text-sky-400 p-6 rounded-xl mb-8 flex items-start gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CheckCircle className="h-6 w-6 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">
                      Message envoyé avec succès !
                    </h3>
                    <p>Nous vous recontacterons dans les plus brefs délais.</p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 font-medium">
                      Nom complet
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Nom et Prenom*"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block mb-2 font-medium">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email*"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block mb-2 font-medium">
                      Téléphone (optionnel)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="Numero de telephone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block mb-2 font-medium">
                      Sujet
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionnez un sujet</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={`${cat.name}`}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block mb-2 font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Message*"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:border-transparent"
                      required
                    ></textarea>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-sky-500 via-sky-400 to-teal-400 hover:bg-sky-700 py-6 text-lg font-medium transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Envoyer le message
                    <Send className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
              <h3 className="text-2xl font-bold mb-6 drop-shadow-lg">
                Nos coordonnées
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-sky-100 dark:bg-emerald-900/20 rounded-full mt-1">
                    <Mail className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Email</h4>
                    <a
                      href="mailto:contact@kofgo-consulting.com"
                      className="text-sky-600 dark:text-sky-400 hover:underline"
                    >
                      contact@doconline.com
                    </a>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Réponse sous 24h
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-sky-100 dark:bg-sky-900/20 rounded-full mt-1">
                    <Phone className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Téléphones</h4>
                    <a
                      href="tel:+225 07 04 84 28 43"
                      className="text-sky-600 dark:text-sky-400 hover:underline"
                    >
                      Côte d'Ivoire: +225 07 00 00 00 43 <br />
                      France/International: +33 7 00 00 00 43
                    </a>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Lun-Ven : 8h-18h
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-sky-100 dark:bg-sky-900/20 rounded-full mt-1">
                    <MapPin className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Nos bureaux</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      Rue des Entrepreneurs, Plateau
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      Abidjan, Côte d'Ivoire
                    </p>
                    <br />
                    <p className="text-gray-700 dark:text-gray-300">
                      21 Rue Louise Michel 78711 Mantes-la-Jolie
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      Paris, France
                    </p>
                    <a
                      href="https://maps.app.goo.gl/VrLfGmPhzx4KLj6x7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-600 dark:text-sky-400 p-0 h-auto mt-2 inline-flex items-center text-sm hover:underline"
                    >
                      Voir sur la carte
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-sky-800 p-8">
              <h3 className="text-2xl font-bold mb-6 drop-shadow-lg">
                Horaires d'ouverture
              </h3>

              <div className="space-y-4">
                {[
                  {
                    day: "Lundi - Vendredi",
                    hours: "8h00 - 18h00",
                    current: true,
                  },
                  { day: "Samedi", hours: "9h00 - 13h00", current: false },
                  { day: "Dimanche", hours: "Fermé", current: false },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className={`flex justify-between items-center p-3 rounded-lg ${
                      item.current ? "bg-sky-50 dark:bg-sky-900/20" : ""
                    }`}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                      <span className="font-medium">{item.day}</span>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {item.hours}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-sky-500 via-sky-400 to-teal-400 rounded-3xl shadow-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4 drop-shadow-lg">
                Vous préférez un rendez-vous ?
              </h3>
              <p className="mb-6">
                Planifiez une consultation en ligne avec l'un de nos experts.
              </p>
              <Button
                className="bg-white text-sky-600 hover:bg-gray-100 w-full py-6 text-lg font-medium transition-all duration-300 transform hover:scale-[1.02]"
                onClick={() => setIsOpen(true)}
              >
                Prendre rendez-vous
              </Button>
            </div>

            {/* Modale */}
            <Dialog
              open={isOpen}
              onClose={() => setIsOpen(false)}
              className="fixed z-50 inset-0 overflow-y-auto"
            >
              {/* Overlay avec animation */}
              <div className="fixed inset-0 transition-opacity">
                <div
                  className="absolute inset-0 bg-black bg-opacity-50"
                  onClick={() => setIsOpen(false)}
                ></div>
              </div>

              {/* Contenu du modal avec animations */}
              <div className="flex items-center justify-center min-h-screen px-4">
                <Dialog.Panel className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:p-8">
                  {/* En-tête */}
                  <div className="flex justify-between items-start">
                    <Dialog.Title className="text-2xl font-bold text-gray-800">
                      Prendre un rendez-vous
                    </Dialog.Title>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <svg
                        className="h-6 w-6"
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

                  {/* Formulaire */}
                  <form onSubmit={handleRdvSubmit} className="mt-6 space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Nom complet
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          placeholder="Votre nom"
                          required
                          onChange={handleChange}
                          value={formData.name}
                          className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="Email@gmail.com"
                          required
                          onChange={handleChange}
                          value={formData.email}
                          className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          placeholder="00 00 00 00 43"
                          required
                          onChange={handleChange}
                          value={formData.phone}
                          className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="date"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Date
                          </label>
                          <input
                            type="date"
                            id="date"
                            name="date"
                            required
                            onChange={handleChange}
                            value={formData.date}
                            className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="time"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Heure
                          </label>
                          <input
                            type="time"
                            id="time"
                            name="time"
                            required
                            onChange={handleChange}
                            value={formData.time}
                            className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Message (optionnel)
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={3}
                          placeholder="Décrivez votre demande..."
                          onChange={handleChange}
                          value={formData.message}
                          className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                        ></textarea>
                      </div>
                    </div>

                    {/* Boutons */}
                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-sky-500 via-sky-400 to-teal-400 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition"
                      >
                        Confirmer le rendez-vous
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </div>
            </Dialog>
          </motion.div>
        </div>
      </section>

      {/* Team Contact 
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6 drop-shadow-lg">
              Contactez nos{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 drop-shadow-lg">
                experts
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Notre équipe pluridisciplinaire est à votre disposition
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                name: "Konan KOFFI",
                role: "Directeur Consulting",
                email: "innocent.koffi@kofgo-consulting.com",
                phone: "+33 7 43 10 12 06",
                photo: "https://kofgo-consulting.com/dgkoffi.png",
              },
              {
                name: "Richard TAGO",
                role: "Responsable Financier",
                email: "tago.richard@kofgo-consulting.com",
                phone: "+225 48 34 68 88",
                photo:
                  "https://media.licdn.com/dms/image/v2/D4E03AQGsNhrC9-x9EA/profile-displayphoto-crop_800_800/B4EZfSRSV1HsAI-/0/1751579437932?e=1757548800&v=beta&t=-C1B_JunUMUfFmXmjc7HZ5SnGp_OVBBlJCgXJc_xFNU",
              },
              {
                name: "Suzanne KOFFI",
                role: "Experte en marketing digital et en design",
                email: "suzanne.koffi@kofgo-consulting.com",
                phone: "+233 53 846 7083",
                photo:
                  "https://media.licdn.com/dms/image/v2/D5603AQE2NfYmFrroCg/profile-displayphoto-shrink_800_800/B56Zai.HpzHgAc-/0/1746490916362?e=1755129600&v=beta&t=pW-gB7-p8LkkmUI1OesK5LgzEYCq7XfhF8AaSRybvXs",
              },
              {
                name: "Cedrick KONATE",
                role: "Développeur full-stack",
                email: "cedrick.konate@kofgo-consulting.com",
                phone: "+225 07 57 24 25 91",
                photo: "/cedrick.png",
              },
            ].map((person, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col h-[500px]"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -10 }}
              >
                {/* Image 
                <div className="h-[200px] w-full overflow-hidden flex-shrink-0">
                  <img
                    src={person.photo}
                    alt={person.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Contenu qui prend tout le reste 
                <div className="p-6 flex flex-col flex-grow">
                  {/* Haut 
                  <div>
                    <h3 className="text-xl font-bold mb-1">{person.name}</h3>
                    <p className="text-emerald-600 dark:text-emerald-400 mb-4">
                      {person.role}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <a
                          href={`mailto:${
                            person.email
                          }?subject=${encodeURIComponent(
                            "Contact depuis le site"
                          )}&body=${encodeURIComponent(
                            `Bonjour ${person.name.split(" ")[0]},`
                          )}`}
                          className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 hover:underline break-all"
                        >
                          {person.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <a
                          href={`tel:${person.phone}`}
                          className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 hover:underline"
                        >
                          {person.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Bouton toujours collé en bas 
                  <a
                    href={`mailto:${person.email}?subject=${encodeURIComponent(
                      "Contact depuis le site"
                    )}&body=${encodeURIComponent(
                      `Bonjour ${person.name.split(" ")[0]},`
                    )}`}
                    className="mt-auto h-11 w-full border border-emerald-600 text-emerald-600 text-center flex items-center justify-center rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-sm"
                  >
                    Contacter {person.name.split(" ")[0]}
                  </a>
                </div>
              </motion.div>
            ))}
            
          </div>
        </div>
      </section>
*/}
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
      <MapSection />
    </div>
  );
};

export default ContactPage;
