import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  Zap,
  ArrowRight,
  ChevronRight,
  Lightbulb,
  Users,
  Mail,
  Phone,
  Clock,
  BarChart2,
  CheckCircle,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layers, Brush, Send, PlayCircle, UserCheck } from "lucide-react";
import { Target, Quote } from "lucide-react";
import {
  Globe,
  Smartphone,
  Pizza,
  ShoppingCart,
  Leaf,
  GraduationCap,
  Palette,
  HeartPulse,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// Composant AnimatedText pour les titres
const AnimatedText = ({ text, className }) => {
  const letters = text.split("");

  return (
    <div className={`flex ${className}`}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03, duration: 0.5 }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </div>
  );
};

const StartupPage = () => {
  // États pour chaque champ
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [objectif, setObjectif] = useState("");
  const [description, setDescription] = useState("");
  const [besoin, setBesoin] = useState("");

  // Etats UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(
        "https://kofgo-consulting.com/api/saveProject.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullname,
            email,
            phone,
            objectif,
            description,
            besoin,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        // Reset form
        setFullname("");
        setEmail("");
        setPhone("");
        setObjectif("");
        setDescription("");
        setBesoin("");
      } else {
        setError(result.message || "Erreur serveur inconnue");
      }
    } catch (err) {
      setError("Erreur réseau ou serveur.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const services = [
    {
      icon: <Lightbulb size={28} className="text-emerald-500" />,
      title: "Diagnostic gratuit",
      description:
        "Analyse rapide de votre projet pour en évaluer la faisabilité",
    },
    {
      icon: <Layers size={28} className="text-teal-500" />,
      title: "Business Model & Business Plan",
      description:
        "Structuration claire de votre projet avec prévisions financières",
    },
    {
      icon: <Brush size={28} className="text-cyan-500" />,
      title: "Identité de marque",
      description: "Création de votre nom, logo, charte graphique et slogan",
    },
    {
      icon: <Send size={28} className="text-sky-500" />,
      title: "Stratégie marketing digital",
      description: "Plan d’acquisition clients par réseaux sociaux et contenus",
    },
    {
      icon: <PlayCircle size={28} className="text-indigo-500" />,
      title: "Plan d'action opérationnel",
      description: "Feuille de route pragmatique pour démarrer efficacement",
    },
    {
      icon: <UserCheck size={28} className="text-purple-500" />,
      title: "Accompagnement personnalisé",
      description: "Coaching individuel sur 3 à 6 mois",
    },
  ];

  const expertises = [
    {
      icon: <Smartphone size={28} className="text-cyan-500" />,
      title: "Start-ups digitales",
      description: "Applications mobiles, plateformes web, IA appliquée",
    },
    {
      icon: <Pizza size={28} className="text-orange-400" />,
      title: "Snacking & Food Business",
      description: "Snacking innovant, concepts alimentaires durables",
    },
    {
      icon: <ShoppingCart size={28} className="text-emerald-500" />,
      title: "E-commerce & solutions en ligne",
      description: "Solutions en ligne et marketplaces spécialisées",
    },
    {
      icon: <Leaf size={28} className="text-lime-500" />,
      title: "Projets durables & Green business",
      description: "Agroécologie, recyclage, énergie propre",
    },
    {
      icon: <GraduationCap size={28} className="text-indigo-500" />,
      title: "Éducation & Services Innovants",
      description: "E-learning, coaching, soutien scolaire",
    },
    {
      icon: <Palette size={28} className="text-pink-500" />,
      title: "Mode, artisanat & économie créative",
      description: "Mode africaine, artisanat premium, design",
    },
    {
      icon: <HeartPulse size={28} className="text-red-500" />,
      title: "Santé connectée & Bien-être",
      description: "Solutions de santé numérique et bien-être global",
    },
    {
      icon: <Globe size={28} className="text-sky-500" />,
      title: "Économie créative",
      description: "Mode africaine, artisanat premium, design",
    },
  ];

  const launchDate = new Date("October 1, 2025 00:00:00").getTime();
  const navigate = useNavigate();

  // States pour le countdown
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: days.toString().padStart(2, "0"),
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [launchDate]);

  return (
    <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* Hero Section */}
      <section
        className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden"
        id="HomeStartup"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            className="w-full h-full object-cover opacity-70 dark:opacity-50"
            autoPlay
            muted
            loop
            playsInline
          >
            <source
              src="/startup.mp4"
              type="video/mp4"
            />
            Votre navigateur ne prend pas en charge les vidéos HTML5.
          </video>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-emerald-900/30"></div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <AnimatedText
            text="Start-Up"
            className="text-2xl md:text-7xl lg:text-8xl font-bold mb-6 text-white justify-center drop-shadow-lg"
          />
          <motion.p
            className="text-2xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            De l'idée à l'impact : construisons ensemble les entreprises de
            demain.
            <br />
            <br />
            <Button
              size="lg"
              onClick={() => {
                // 1. Naviguer vers la page
                navigate("/startup#FormProjects");

                // 2. Scroll vers la section avec décalage
                setTimeout(() => {
                  const element = document.getElementById("FormProjects");
                  if (element) {
                    // Calcul de la position avec décalage
                    const offset = 120; // Ajustez cette valeur selon vos besoins
                    const elementPosition =
                      element.getBoundingClientRect().top + window.pageYOffset;

                    window.scrollTo({
                      top: elementPosition - offset,
                      behavior: "smooth",
                    });
                  }
                }, 100);
              }}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:scale-[1.02]"
            >
              Déposer mon projet
            </Button>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          ></motion.div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="relative py-28 px-6 bg-gray-50 dark:bg-gray-900 overflow-hidden">
        {/* Image de fond */}
        <div className="absolute inset-0">
          <img
            src="https://img.freepik.com/photos-gratuite/resume-fond-cercle-lumineux_1122-717.jpg?uid=R36722598&ga=GA1.1.1540057430.1738812532&semt=ais_hybrid&w=740"
            alt="Accompagnement KOF-GO"
            className="w-full h-full object-cover opacity-20 dark:opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-emerald-50 dark:from-gray-900 dark:to-black/70" />
        </div>

        <div className="relative max-w-7xl mx-auto z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight drop-shadow-lg">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 drop-shadow-lg">
                Pourquoi choisir
              </span>{" "}
              KOF-GO CONSULTING ?
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Une approche personnalisée et orientée résultats pour accompagner
              les entrepreneurs africains
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-10 w-10 text-emerald-500" />,
                title: "Accompagnement humain et sur-mesure",
                description:
                  "Un coaching centré sur votre personnalité et votre ambition",
                features: [
                  "Mentorat expert",
                  "Prototypage rapide",
                  "Tests utilisateurs",
                ],
                image:
                  "https://images.unsplash.com/photo-1573497491208-6b1acb260507",
              },
              {
                icon: <Users className="h-10 w-10 text-emerald-500" />,
                title: "Une expertise multisectorielle reconnue",
                description:
                  "Nos consultants maîtrisent divers domaines pour mieux vous servir",
                features: [
                  "Rencontres stratégiques",
                  "Demo Days",
                  "Réseau alumni",
                ],
                image:
                  "https://img.freepik.com/photos-premium/vue-angle-eleve-personnes-travaillant-table_1048944-9030820.jpg?uid=R36722598&ga=GA1.1.1540057430.1738812532&semt=ais_hybrid&w=740",
              },
              {
                icon: <BarChart2 className="h-10 w-10 text-emerald-500" />,
                title: "Un regard stratégique international",
                description:
                  "Nous adaptons des méthodes éprouvées à votre environnement",
                features: [
                  "KPI tracking",
                  "Levée de fonds",
                  "Internationalisation",
                ],
                image:
                  "https://img.freepik.com/photos-premium/homme-affaires-recherche-travers-jumelles_13339-128605.jpg?uid=R36722598&ga=GA1.1.1540057430.1738812532&semt=ais_hybrid&w=740",
              },
              {
                icon: <Zap className="h-10 w-10 text-emerald-500" />,
                title: "Sensibilité aux réalités africaines",
                description:
                  "Un conseil enraciné dans la culture locale et ouvert sur le monde",
                features: [
                  "Mentorat expert",
                  "Prototypage rapide",
                  "Tests utilisateurs",
                ],
                image:
                  "https://images.unsplash.com/photo-1573164574572-cb89e39749b4",
              },
              {
                icon: <Users className="h-10 w-10 text-emerald-500" />,
                title: "Un écosystème d'experts",
                description:
                  "Un accès à des spécialistes, investisseurs et partenaires",
                features: [
                  "Rencontres stratégiques",
                  "Demo Days",
                  "Réseau alumni",
                ],
                image:
                  "https://img.freepik.com/photos-premium/concept-croissance-entreprise-profit-developpement-succes_117255-1662.jpg?uid=R36722598&ga=GA1.1.1540057430.1738812532&semt=ais_hybrid&w=740",
              },
              {
                icon: <BarChart2 className="h-10 w-10 text-emerald-500" />,
                title: "Réseau d'experts",
                description:
                  "Accès à notre écosystème de partenaires et investisseurs",
                features: [
                  "KPI tracking",
                  "Levée de fonds",
                  "Internationalisation",
                ],
                image:
                  "https://img.freepik.com/photos-gratuite/communication-globale_53876-89014.jpg?uid=R36722598&ga=GA1.1.1540057430.1738812532&semt=ais_hybrid&w=740",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition hover:-translate-y-2 duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                {/* Image de carte */}
                <div className="mb-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-40 object-cover rounded-xl shadow-sm transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* Titre + icône */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {item.title}
                  </h3>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {item.description}
                </p>
                <ul className="space-y-2">
                  {item.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 mt-1 text-emerald-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-32 px-6 bg-gray-50 dark:bg-gray-900 overflow-hidden">
        {/* Halo lumineux en arrière-plan */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-[60vw] h-[60vw] bg-gradient-to-br from-teal-300/20 to-cyan-400/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Titre */}
          <motion.div
            className="text-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 drop-shadow-lg">
              Nos services dédiés aux{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-cyan-400 text-transparent bg-clip-text drop-shadow-lg">
                Start-Up
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Des solutions concrètes pour chaque étape de votre parcours
            </p>
          </motion.div>

          {/* Liste de services */}
          <div className="grid sm:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-5 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition duration-300"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 p-3 rounded-xl">
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-28 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
              Tendances{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 drop-shadow-lg">
                d'Entrepreneuriat 2025
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Les secteurs porteurs pour vos projets.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {[
              {
                name: "Green Business et Solutions Durables",
                description:
                  "Les consommateurs recherchent de plus en plus des produits responsables, éthiques et respectueux de l’environnement. Créer une entreprise tournée vers l’économie verte, le recyclage, ou l’agroécologie est une opportunité majeure.",
                results: ["+35% croissance"],
                logo: "https://cdn-icons-png.flaticon.com/512/4577/4577204.png",
                image:
                  "https://img.freepik.com/photos-gratuite/objectifs-developpement-durable-nature-morte_23-2150196699.jpg?uid=R36722598&ga=GA1.1.1540057430.1738812532&semt=ais_hybrid&w=740",
              },
              {
                name: "Agrobusiness Moderne",
                description:
                  "Valoriser les ressources locales, innover dans la transformation agroalimentaire ou développer des chaînes courtes pour nourrir durablement nos villes, voilà l'avenir.",
                results: [" +28% demande"],
                logo: "https://media.istockphoto.com/id/866393210/fr/vectoriel/ic%C3%B4ne-de-ferme.jpg?s=612x612&w=0&k=20&c=jpekS_TJw4cDhfBMuXoPhxv12cSk3vcnsersEbwDchI=",
                image:
                  "https://img.freepik.com/photos-gratuite/ouvrier-agricole-afro-americain-joyeux-tenant-caisse-pleine-legumes-verts-murs-locaux-ecologiques-provenant-recolte-durable-ferme-serre-bio-permaculture-entrepreneuriale_482257-64585.jpg?uid=R36722598&ga=GA1.1.1540057430.1738812532&semt=ais_hybrid&w=740",
              },
              {
                name: "FinTech Inclusive",
                description:
                  "Simplifier l’accès aux services financiers (paiement mobile, micro-crédit, épargne intelligente) est un secteur en forte expansion, notamment dans les économies africaines en croissance.",
                results: ["+40% en Afrique"],
                logo: "https://cdn-icons-png.flaticon.com/512/4577/4577204.png",
                image:
                  "https://img.freepik.com/photos-premium/png-ligne-facile-investir-collage-fond-transparent_53876-997067.jpg?uid=R36722598&ga=GA1.1.1540057430.1738812532&semt=ais_hybrid&w=740",
              },
              {
                name: "Services Digitaux et Plateformes Innovantes",
                description:
                  "Applications mobiles, solutions e-commerce locales, plateformes éducatives, services à la demande : le digital simplifie la vie quotidienne et crée de nouveaux marchés en Afrique.",
                results: [" +45% adoption"],
                logo: "https://media.istockphoto.com/id/866393210/fr/vectoriel/ic%C3%B4ne-de-ferme.jpg?s=612x612&w=0&k=20&c=jpekS_TJw4cDhfBMuXoPhxv12cSk3vcnsersEbwDchI=",
                image:
                  "https://img.freepik.com/photos-gratuite/representations-ui-ux-smartphone_23-2150201875.jpg?uid=R36722598&ga=GA1.1.1540057430.1738812532&semt=ais_hybrid&w=740",
              },
              {
                name: "Artisanat Premium et Mode Africaine",
                description:
                  "Mettre en lumière la richesse de la culture locale à travers des produits haut de gamme et connectés aux tendances internationales (mode éthique, artisanat design, décoration intérieure).",
                results: ["+45% croissance"],
                logo: "https://cdn-icons-png.flaticon.com/512/4577/4577204.png",
                image:
                  "https://img.freepik.com/photos-gratuite/deux-femmes-couturieres-africaines-ont-concu-nouvelle-robe-rouge-mannequin-au-bureau-tailleur_627829-4465.jpg?uid=R36722598&ga=GA1.1.1540057430.1738812532&semt=ais_hybrid&w=740",
              },
              {
                name: "FoodTech et Nouveaux Concepts Alimentaires",
                description:
                  "Créer des concepts de restauration rapide locale, de snacking sain, ou encore de dark kitchens (restaurants virtuels) répond aux nouvelles habitudes de consommation.",
                results: ["  +45% adoption"],
                logo: "https://media.istockphoto.com/id/866393210/fr/vectoriel/ic%C3%B4ne-de-ferme.jpg?s=612x612&w=0&k=20&c=jpekS_TJw4cDhfBMuXoPhxv12cSk3vcnsersEbwDchI=",
                image:
                  "https://img.freepik.com/photos-gratuite/chef-utilisant-technologie-ar-dans-son-metier_23-2151137480.jpg?uid=R36722598&ga=GA1.1.1540057430.1738812532&semt=ais_hybrid&w=740",
              },
            ].map((story, index) => (
              <motion.div
                key={index}
                className="relative group overflow-hidden rounded-3xl h-[500px]"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent p-8 flex flex-col justify-end">
                  <div className="mb-4">
                    <img src={story.logo} alt={story.name} className="h-12" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3">
                    {story.name}
                  </h3>
                  <p className="text-gray-300 mb-6">{story.description}</p>
                  <ul className="space-y-2 mb-6">
                    {story.results.map((result, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-white"
                      >
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                        {result}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="outline"
                    className="w-fit border-white text-black hover:bg-white/10 hover:text-white"
                  >
                    En savoir plus
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-32 px-6 bg-white dark:bg-gray-950">
        {/* Halo lumineux */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[50%] w-[50vw] h-[50vw] bg-gradient-to-br from-teal-400/10 to-purple-400/10 rounded-full blur-[120px] -translate-x-1/2" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            className="text-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 drop-shadow-lg">
              Nos domaines{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-500 drop-shadow-lg">
                d’expertise
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Nous accompagnons les start-ups dans les secteurs les plus
              innovants
            </p>
          </motion.div>

          {/* Expertise Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-10">
            {expertises.map((item, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative py-28 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 overflow-hidden"
        id="FormProjects"
      >
        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-emerald-100/30 dark:bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900 dark:text-white mb-6 drop-shadow-lg">
              Vous avez une idée de projet ?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
              Toute idée mérite une chance. Partagez-la avec nous pour
              bénéficier d’un accompagnement expert et humain.
            </p>

            <ul className="space-y-6 mb-12">
              {[
                {
                  label: "Diagnostic gratuit",
                  desc: "Analyse personnalisée de votre idée",
                },
                {
                  label: "Accompagnement sur-mesure",
                  desc: "Étapes claires et adaptées à vos besoins",
                },
                {
                  label: "Devis transparent",
                  desc: "Sans engagement. 100% confiance.",
                },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-800 p-2 rounded-xl shadow-md">
                    <Target className="w-5 h-5 text-emerald-600 dark:text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-base">
                      {item.label}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border-l-4 border-emerald-500 relative">
              <Quote className="text-emerald-500 w-6 h-6 mb-3" />
              <p className="italic text-gray-700 dark:text-gray-300 mb-2 drop-shadow-lg">
                "Grâce à KOF-GO, notre start-up a pu structurer son offre et
                trouver ses premiers clients en 3 mois seulement !"
              </p>
              <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                Alex D.
              </p>
              <p className="text-sm text-gray-500">
                Fondatrice de AgroTech Solutions
              </p>
            </div>

            <div className="mt-10 text-center italic text-emerald-700 dark:text-emerald-400 text-sm drop-shadow-lg">
              “Un projet non lancé est un rêve perdu. Donnez vie à votre
              ambition aujourd'hui.”
            </div>
          </motion.div>

          {/* Right Side – Form Premium */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800"
          >
            <h3 className="text-3xl font-semibold text-center text-gray-900 dark:text-white mb-3 drop-shadow-lg">
              🚀 Déposer votre idée
            </h3>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
              15 minutes pour initier votre succès
            </p>
            {success && (
              <div className="mb-4 max-w-md mx-auto p-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-center font-semibold shadow-lg animate-pulse">
                🎉 Votre idée a été soumise avec succès !
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nom & Prénom"
                  className="w-full rounded-xl px-4 py-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Adresse Email"
                  className="w-full rounded-xl px-4 py-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <input
                type="tel"
                placeholder="Numéro de téléphone"
                className="w-full rounded-xl px-4 py-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <select
                className="w-full rounded-xl px-4 py-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                value={objectif}
                onChange={(e) => setObjectif(e.target.value)}
                required
              >
                <option value="" disabled>
                  Objectif visé
                </option>
                <option value="Structurer mon idée">Structurer mon idée</option>
                <option value="Lancer ma startup">Lancer ma startup</option>
                <option value="Accélérer ma croissance">
                  Accélérer ma croissance
                </option>
              </select>

              <textarea
                rows={4}
                placeholder="Décrivez brièvement votre projet (5 lignes)"
                className="w-full rounded-xl px-4 py-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Votre principal besoin immédiat"
                className="w-full rounded-xl px-4 py-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                value={besoin}
                onChange={(e) => setBesoin(e.target.value)}
                required
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl rounded-xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:scale-[1.02]"
              >
                Déposer mon projet →
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Incubator Section */}
      <section className="py-28 bg-gray-900 text-white relative overflow-hidden">
        {/* Effets de fond futuristes */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-[conic-gradient(from_90deg_at_50%_50%,#05966900_0%,#05966910_25%,#05966900_50%)] animate-spin-slow opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block relative mb-6">
                <span className="absolute -inset-2 bg-emerald-500/20 rounded-xl blur-md"></span>
                <span className="relative z-10 inline-block px-4 py-1.5 text-xs font-medium tracking-wider text-emerald-400 uppercase rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  Bientôt disponible
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight drop-shadow-lg">
                Incubateur{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 drop-shadow-lg">
                  KOF-GO CONSULTING
                </span>
              </h2>

              <p className="text-xl text-gray-300 mb-8">
                Restez connectés : bientôt, nous lancerons notre programme
                d'incubation Start-Up pour vous former, vous accompagner et
                propulser vos projets vers le succès.
              </p>

              {/* Compte à rebours */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4 text-emerald-400">
                  Lancement dans :
                </h3>
                <div className="grid grid-cols-4 gap-3 max-w-md">
                  {/* Jours */}
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700/50">
                    <div className="text-3xl font-bold font-mono text-emerald-400">
                      {timeLeft.days}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">JOURS</div>
                  </div>
                  {/* Heures */}
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700/50">
                    <div className="text-3xl font-bold font-mono text-teal-400">
                      {timeLeft.hours}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">HEURES</div>
                  </div>
                  {/* Minutes */}
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700/50">
                    <div className="text-3xl font-bold font-mono text-cyan-400">
                      {timeLeft.minutes}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">MINUTES</div>
                  </div>
                  {/* Secondes */}
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-700/50">
                    <div className="text-3xl font-bold font-mono text-white">
                      {timeLeft.seconds}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">SECONDES</div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 mb-10">
                {[
                  "Espace de coworking haut de gamme",
                  "Accès à nos labs technologiques",
                  "Mentorat individuel hebdomadaire",
                  "Ateliers avec experts sectoriels",
                  "Réseau d'investisseurs partenaires",
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="p-2 bg-emerald-500/10 rounded-full">
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    </div>
                    <span className="text-lg">{item}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => {
                    // 1. Naviguer vers la page
                    navigate("/#NewsLetter");
                    // 2. Scroll vers la section avec décalage
                    setTimeout(() => {
                      const element = document.getElementById("NewsLetter");
                      if (element) {
                        // Calcul de la position avec décalage
                        window.scrollTo({
                          top: elementPosition - offset,
                          behavior: "smooth",
                        });
                      }
                    }, 100);
                  }}
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Être informé du lancement
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="relative h-[500px] rounded-3xl overflow-hidden group"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Notre incubateur"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent flex items-end p-10">
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 group-hover:bg-white/10 transition-all duration-300">
                  <h3 className="text-xl font-bold mb-2">KofGo Consulting</h3>
                  <p className="text-gray-300">
                    Vous accompagner à chaque étape pour donner vie à vos
                    ambitions avec méthode, rigueur et audace.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Script pour le compte à rebours */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
      // Date de lancement (1er octobre 2025)
      const launchDate = new Date("October 1, 2025 00:00:00").getTime();
      
      function updateCountdown() {
        const now = new Date().getTime();
        const distance = launchDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById("days").textContent = days.toString().padStart(2, '0');
        document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
        document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
      }
      
      updateCountdown();
      setInterval(updateCountdown, 1000);
    `,
          }}
        />
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden py-20 px-8 text-center">
        <div className="absolute inset-0 bg-[url('/construction-cta.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-emerald-900/90"></div>

        <motion.div
          className="relative z-10 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
            Prêt à concrétiser{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 drop-shadow-lg">
              votre vision
            </span>{" "}
            ?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Notre équipe d'experts est à votre disposition pour discuter de
            votre projet et vous proposer des solutions sur-mesure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                // 1. Naviguer vers la page
                navigate("/contact#HomeContact");

                // 2. Scroll vers la section avec décalage
                setTimeout(() => {
                  const element = document.getElementById("HomeContact");
                  if (element) {
                    // Calcul de la position avec décalage
                    const offset = 120; // Ajustez cette valeur selon vos besoins
                    const elementPosition =
                      element.getBoundingClientRect().top + window.pageYOffset;

                    window.scrollTo({
                      top: elementPosition - offset,
                      behavior: "smooth",
                    });
                  }
                }, 100);
              }}
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-500"
            >
              Contactez-nous
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                // 1. Naviguer vers la page
                navigate("/startup#HomeStartup");

                // 2. Scroll vers la section avec décalage
                setTimeout(() => {
                  const element = document.getElementById("HomeStartup");
                  if (element) {
                    // Calcul de la position avec décalage
                    const offset = 120; // Ajustez cette valeur selon vos besoins
                    const elementPosition =
                      element.getBoundingClientRect().top + window.pageYOffset;

                    window.scrollTo({
                      top: elementPosition - offset,
                      behavior: "smooth",
                    });
                  }
                }, 100);
              }}
              className="text-black border-white hover:bg-white/10 hover:text-white"
            >
              Explorer notre espace Start-up
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default StartupPage;
