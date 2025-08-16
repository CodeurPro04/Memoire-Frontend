import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Star,
  Trophy,
  Award,
  Zap,
  BarChart2,
  Globe,
  Users,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectsList from "@/components/ProjectsList";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

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

const RealisationPage = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios
      .get("https://kofgo-consulting.com/api/realisations_all.php")
      .then((res) => {
        if (res.data.success) {
          setProjects(res.data.projects);
        }
      })
      .catch((err) => console.error("Erreur récupération projets :", err));
  }, []);
  const navigate = useNavigate();
  return (
    <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            className="w-full h-full object-cover opacity-70 dark:opacity-50"
            autoPlay
            muted
            loop
            playsInline
          >
            <source
              src="/realisation.mp4"
              type="video/mp4"
            />
            Votre navigateur ne prend pas en charge les vidéos HTML5.
          </video>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-emerald-900/30"></div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <AnimatedText
            text="Nos Réalisations"
            className="text-2xl md:text-7xl lg:text-8xl font-bold mb-6 text-white justify-center drop-shadow-lg"
          />
          <motion.p
            className="text-2xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Des résultats concrets pour nos clients.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          ></motion.div>
        </div>
      </section>

      {/* Projects Showcase */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto relative overflow-hidden">
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 drop-shadow-lg">
              Études de Cas
            </span>{" "}
            Sélectionnées
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Une curation de nos missions les plus emblématiques et leurs impacts
            transformationnels
          </p>
        </motion.div>

        <ProjectsList projects={projects} />
      </section>

      {/* Stats & Recognition Section */}
      <section className="max-w-7xl mx-auto mb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Impact Stats */}
          <motion.div
            className="bg-gradient-to-br from-gray-900 to-emerald-900 rounded-4xl p-12 text-white relative overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-10">
                Notre Impact en Chiffres
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    value: "200+",
                    label: "Clients Satisfaits",
                    icon: <Users className="h-8 w-8 text-emerald-400" />,
                  },
                  {
                    value: "200M€",
                    label: "Valeur Créée",
                    icon: <BarChart2 className="h-8 w-8 text-emerald-400" />,
                  },
                  {
                    value: "12",
                    label: "Pays d'Intervention",
                    icon: <Globe className="h-8 w-8 text-emerald-400" />,
                  },
                  {
                    value: "98%",
                    label: "Taux de Réussite",
                    icon: <CheckCircle className="h-8 w-8 text-emerald-400" />,
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm"
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-500/10 rounded-lg">
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-emerald-200">{stat.label}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Awards & Recognition */}
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-4xl p-12 border border-gray-200 dark:border-gray-800 shadow-lg"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold mb-10">Reconnaissances & Prix</h3>

            <div className="space-y-8">
              {[
                {
                  title: "Meilleur Cabinet de Conseil Africain",
                  organization: "Africa Business Awards",
                  year: "2023",
                  icon: <Trophy className="h-8 w-8 text-emerald-500" />,
                },
                {
                  title: "Prix de l'Innovation Digitale",
                  organization: "Digital Africa Summit",
                  year: "2022",
                  icon: <Zap className="h-8 w-8 text-emerald-500" />,
                },
                {
                  title: "Excellence en Transformation Client",
                  organization: "Customer Experience Forum",
                  year: "2021",
                  icon: <Award className="h-8 w-8 text-emerald-500" />,
                },
              ].map((award, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-6 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <div className="p-4 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl">
                    {award.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">{award.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {award.organization} • {award.year}
                    </p>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-full">
                        Excellence
                      </span>
                      <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-full">
                        Innovation
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Client Portfolio Premium */}
      <section className="max-w-7xl mx-auto px-4 mb-40">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
            Ils Nous Ont{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 drop-shadow-lg">
              Fait Confiance
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Des partenariats solides avec des entreprises innovantes et
            ambitieuses.
          </p>
        </motion.div>

        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 auto-rows-fr">
            {[
              "https://img.freepik.com/photos-gratuite/beau-jeune-afro-americain-tshirt-polo-rose_176420-32115.jpg",
              "https://img.freepik.com/photos-gratuite/portrait-gros-plan-jeune-homme-afro-americain-professionnel-prospere-sweat-capuche-rouge-poitrine-bras-croises_176420-33867.jpg",
              "https://img.freepik.com/photos-gratuite/homme-souriant-coup-moyen-pret-voyager_23-2149380154.jpg",
              "https://img.freepik.com/psd-gratuit/femme-heureuse-dansant-isolee_23-2151728316.jpg",
              "https://img.freepik.com/photos-premium/sticker-femme-afro-americaine-heureuse-fond-transparent_53876-1044456.jpg",
              "https://img.freepik.com/photos-gratuite/bel-homme-utilisant-smartphone-moderne-exterieur_23-2149073851.jpg",
              "https://img.freepik.com/photos-premium/portrait-sourire-debout-bras-croises-cuisine-maison_107420-14064.jpg",
              "https://img.freepik.com/photos-premium/charmant-homme-afro-americain-souriant-chapeau_33839-4336.jpg",
            ].map((logo, i) => (
              <motion.div
                key={i}
                className="rounded-xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="overflow-hidden group">
                  <img
                    src={logo}
                    alt={`Client ${i + 1}`}
                    className="w-full h-40 object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Immersive CTA */}
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
            <span className="text-emerald-400 drop-shadow-lg">
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

export default RealisationPage;
