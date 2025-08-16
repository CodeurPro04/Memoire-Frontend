import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import {
  Hammer,
  Building,
  Wrench,
  Layers,
  Lightbulb,
  Users,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Building2, Landmark, Smile, Globe, Award } from "lucide-react";
import PremiumServices from "@/components/PremiumServices";
import { LineChart, Brain, SearchCheck } from "lucide-react";
import CountUp from "react-countup";
import { useNavigate } from "react-router-dom";

// Composant AnimatedText pour les titres
const AnimatedText = ({ text, className }) => {
  const letters = text.split("");

  return (
    <div className={`flex flex-wrap ${className}`}>
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

const stats = [
  {
    value: 150,
    suffix: "+",
    label: "Projets réalisés",
    icon: <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto" />,
  },
  {
    value: 95,
    suffix: "%",
    label: "Clients satisfaits",
    icon: <Users className="h-8 w-8 text-emerald-500 mx-auto" />,
  },
  {
    value: 12,
    label: "Pays d’intervention",
    icon: <Globe className="h-8 w-8 text-emerald-500 mx-auto" />,
  },
  {
    value: 25,
    label: "Partenaires stratégiques",
    icon: <Award className="h-8 w-8 text-emerald-500 mx-auto" />,
  },
];

const steps = [
  {
    step: "1",
    title: "Diagnostic",
    description:
      "Analyse approfondie de votre situation et identification des leviers de performance.",
    icon: (
      <LineChart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
    ),
  },
  {
    step: "2",
    title: "Conception",
    description:
      "Élaboration de solutions sur mesure adaptées à vos enjeux spécifiques.",
    icon: <Brain className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
  },
  {
    step: "3",
    title: "Mise en œuvre",
    description: "Déploiement opérationnel avec un accompagnement pas à pas.",
    icon: <Hammer className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
  },
  {
    step: "4",
    title: "Suivi",
    description:
      "Évaluation des résultats et ajustements pour une performance durable.",
    icon: (
      <SearchCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
    ),
  },
];

const premiumServices = [
  {
    icon: <Hammer size={48} className="text-emerald-500 mb-6" />,
    title: "Conseil en Stratégie d'Entreprise",
    description:
      "Nous collaborons avec vous pour définir et mettre en œuvre des stratégies gagnantes qui alignent vos objectifs à long terme avec les réalités du marché.",
    highlights: [
      "Diagnostic Stratégique",
      "Planification Stratégique",
      "Développement d’Affaires",
      "Optimisation des Modèles Économiques",
      "Stratégies de Croissance et d'Internationalisation",
    ],
    image:
      "https://img.freepik.com/photos-premium/hommes-affaires-discutent_1134901-140843.jpg?uid=R36722598&ga=GA1.1.1540057430.1738812532&semt=ais_hybrid&w=740",
  },
  {
    icon: <Building size={48} className="text-emerald-500 mb-6" />,
    title: "Marketing Digital & Communication",
    description:
      "Nous concevons et déployons des stratégies digitales intégrées pour accroître votre visibilité, générer des leads et fidéliser vos clients.",
    highlights: [
      "Stratégie digitale omnicanale",
      "Campagnes publicitaires performantes",
      "Création de contenu et social media",
      "Analyse et optimisation continue",
    ],
    image:
      "https://img.freepik.com/photos-gratuite/femme-active-debout-contre-mur-aide-son-smartphone_53876-96952.jpg?uid=R36722598&ga=GA1.1.1540057430.1738812532&semt=ais_hybrid&w=740",
  },
  {
    icon: <Wrench size={48} className="text-emerald-500 mb-6" />,
    title: "Comptabilité & Gestion Financière",
    description:
      "Nous optimisons votre gestion financière pour améliorer votre performance et préparer l'avenir de votre entreprise.",
    highlights: [
      "Audit et diagnostic financier",
      "Optimisation de la trésorerie",
      "Reporting et tableaux de bord",
      "Accompagnement fiscal stratégique",
    ],
    image:
      "https://img.freepik.com/photos-gratuite/groupe-analyse-gens-affaires-graphique-du-rapport-marketing-specialistes-jeunes-discutent-idees-affaires-pour-nouveau-demarrage-numerique-projet_1150-1820.jpg?uid=R36722598&ga=GA1.1.1540057430.1738812532&semt=ais_hybrid&w=740",
  },
  {
    icon: <Layers size={48} className="text-emerald-500 mb-6" />,
    title: "Transformation Numérique",
    description:
      "À l'ère du numérique, nous vous aidons à intégrer les technologies digitales pour rester compétitifs, optimiser vos opérations et améliorer l'expérience client.",
    highlights: [
      "Audit Digital",
      "Élaboration de Stratégies Digitales",
      "Création d'application mobile et logiciel",
      "Optimisation des Processus Métiers par le Digital",
      "Formation et Support",
    ],
    image:
      "https://img.freepik.com/photos-gratuite/support-technique-supervise-reseau-neuronal-ia_482257-75857.jpg?uid=R36722598&ga=GA1.1.1540057430.1738812532&semt=ais_hybrid&w=740",
  },
  {
    icon: <Lightbulb size={48} className="text-emerald-500 mb-6" />,
    title: "Accompagnement à la transformation organisationnelle",
    description:
      "Le changement peut être difficile. Nous facilitons la transition en aidant vos équipes à adopter de nouvelles méthodes de travail, de nouvelles technologies et de nouvelles cultures d'entreprise.",
    highlights: [
      "Analyse d'Impact du Changement",
      "Élaboration de Plans de Communication",
      "Sensibilisation et Adhésion",
      "Formation et Développement des Compétences",
      "Soutien Post-Implémentation",
    ],
    image:
      "https://img.freepik.com/photos-gratuite/personnes-au-bureau-pendant-journee-travail_23-2150690161.jpg?uid=R36722598&ga=GA1.1.1540057430.1738812532&semt=ais_hybrid&w=740",
  },
  {
    icon: <Layers size={48} className="text-emerald-500 mb-6" />,
    title: "Incubation de projet",
    description:
      "Accompagnement des porteurs de projet de l’idée à la concrétisation.",
    highlights: [
      "Validation du business model",
      "Cadrage stratégique",
      "Structuration de l’offre",
      "Mise en réseau",
      "Développement progressif",
      "Accompagnement personnalisé",
    ],
    image:
      "https://img.freepik.com/premium-photo/cool-black-businesswoman-planning-marketing-strategy_53876-157031.jpg?uid=R36722598&ga=GA1.1.1540057430.1738812532&semt=ais_hybrid&w=740",
  },
  {
    icon: <Lightbulb size={48} className="text-emerald-500 mb-6" />,
    title: "Montage de dossier de financement",
    description:
      "Nous aidons les entrepreneurs, entreprises et porteurs de projets à accéder au financement en construisant des dossiers solides, convaincants et adaptés aux exigences des financeurs.",
    highlights: [
      "Rédaction et constitution de dossiers complets et bancables",
      "Adaptés aux exigences des investisseurs",
      "Banques ou bailleurs",
      "Conseils sur les stratégies de levée de fonds",
      "Mise en conformité",
      "Simulations financières et valorisation des projets",
    ],
    image:
      "https://img.freepik.com/free-photo/stock-market-exchange-economics-investment-graph_53876-21258.jpg?uid=R36722598&ga=GA1.1.1540057430.1738812532&semt=ais_hybrid&w=740",
  },
  {
    icon: <Layers size={48} className="text-emerald-500 mb-6" />,
    title: "Gestion de projet & appui opérationnel",
    description:
      "Nous accompagnons les entreprises et organisations dans la structuration, le déploiement et la réussite de leurs projets à fort impact, grâce à une gestion rigoureuse et orientée résultats.",
    highlights: [
      "Conception",
      "planification et pilotage de projets à impact",
      "Optimisation des processus internes",
      "structuration organisationnelle et suivi d’activités",
    ],
    image:
      "https://img.freepik.com/premium-photo/mature-businessman-working-creative-office-reading-notes-glass-board_867394-1746.jpg?uid=R36722598&ga=GA1.1.1540057430.1738812532&semt=ais_hybrid&w=740",
  },
];

const ServiceCard = ({ service, index }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 hover:shadow-emerald-500/20 transition-all duration-300 border border-gray-200 dark:border-gray-800 overflow-hidden group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.6, type: "spring" }}
      viewport={{ once: true, margin: "-100px" }}
      whileHover={{ y: -10 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10">
        <div className="flex justify-center">
          <div className="p-4 bg-gray-900/5 dark:bg-white/5 rounded-full">
            {service.icon}
          </div>
        </div>

        <h3 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          {service.title}
        </h3>

        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          {service.description}
        </p>

        <div className="space-y-3 mb-6">
          {service.highlights.map((highlight, i) => (
            <div key={i} className="flex items-start">
              <ChevronRight
                className="text-emerald-500 mt-1 mr-2 flex-shrink-0"
                size={18}
              />
              <span className="text-gray-700 dark:text-gray-300">
                {highlight}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
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
            className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 transform hover:scale-[1.02]"
          >
            En savoir plus
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const ServicesPage = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden">
      <section
        className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden"
        id="HomeService"
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
              src="/expertise.mp4"
              type="video/mp4"
            />
            Votre navigateur ne prend pas en charge les vidéos HTML5.
          </video>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-emerald-900/30"></div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <AnimatedText
            text="Nos Services"
            className="text-2xl md:text-7xl lg:text-8xl font-bold mb-6 text-white justify-center drop-shadow-lg"
          />
          <motion.p
            className="text-2xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Des solutions sur mesure pour répondre à vos défis stratégiques et
            opérationnels.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          ></motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto relative overflow-hidden">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-5xl mx-auto mt-6 drop-shadow-lg">
            Nos{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 drop-shadow-lg">
              Domaines d'Expertise
            </span>
          </h2>
          <br />
          <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Des solutions complètes pour votre entreprise.
          </p>
        </motion.div>
        <PremiumServices services={premiumServices} />
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 p-12 mb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://img.freepik.com/photos-gratuite/vue-dessus-presentation-statistiques-fleche_23-2149023759.jpg?uid=R36722598&ga=GA1.1.1540057430.1738812532&semt=ais_hybrid&w=740')] opacity-10"></div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Kof Go en{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 drop-shadow-lg">
                Chiffres
              </span>
            </h2>
            <p className="text-xl text-emerald-200 max-w-3xl mx-auto">
              Des résultats qui témoignent de notre engagement et de notre
              expertise.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((item, i) => (
              <motion.div
                key={i}
                className="bg-white/5 p-8 rounded-xl border border-white/10 backdrop-blur-sm text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="mb-2">{item.icon}</div>
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 mb-2">
                  <CountUp
                    end={parseFloat(item.value)}
                    duration={2}
                    suffix={item.suffix || ""}
                  />
                </div>
                <div className="text-gray-300">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Processus Premium V2 */}
      <section className="mb-32 px-4" id="Proces">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg">
            Notre{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 drop-shadow-lg">
              Processus d’Intervention
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Une démarche en quatre temps pour transformer vos défis en résultats
            durables.
          </p>
        </motion.div>

        <div className="relative flex flex-col md:flex-row items-center justify-center gap-12 max-w-6xl mx-auto">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              className="relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full md:w-64 shadow-xl group transition-all duration-300 hover:ring-2 hover:ring-emerald-400"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Ligne animée entre les étapes */}
              {i < steps.length - 1 && (
                <motion.div
                  className="hidden md:block absolute top-1/2 right-[-36px] h-1 origin-left bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  transition={{
                    delay: i * 0.4 + 0.4, // Décalage légèrement après la carte
                    duration: 0.5,
                  }}
                  viewport={{ once: true }}
                  style={{ width: "5rem" }}
                />
              )}

              <div className="w-14 h-14 mb-4 flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 backdrop-blur-md shadow-inner text-2xl">
                {item.icon}
              </div>

              <div className="mb-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                Étape {item.step}
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
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

export default ServicesPage;
