import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  ArrowRight,
  TrendingUp,
  Lightbulb,
  Zap,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  Globe,
  Users,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const HeroSection = ({ scrollToSection }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const controls = useAnimation();

  // Images premium pour le carrousel
  const slides = [
    {
      id: 1,
      image:
        "/hero1.jpg",
      alt: "Médecin en consultation avec un patient",
    },
    {
      id: 2,
      image:
        "/hero2.jpg",
      alt: "Salle d’hôpital moderne",
    },
    {
      id: 3,
      image:
        "/hero3.jpg",
      alt: "Équipe médicale souriante",
    },
  ];

  // Auto-rotation du carrousel avec animation de fondu
  useEffect(() => {
    const interval = setInterval(async () => {
      await controls.start({ opacity: 0, transition: { duration: 0.5 } });
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      await controls.start({ opacity: 1, transition: { duration: 0.5 } });
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length, controls]);

  const nextSlide = async () => {
    await controls.start({ opacity: 0, transition: { duration: 0.3 } });
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    await controls.start({ opacity: 1, transition: { duration: 0.3 } });
  };

  const prevSlide = async () => {
    await controls.start({ opacity: 0, transition: { duration: 0.3 } });
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    await controls.start({ opacity: 1, transition: { duration: 0.3 } });
  };

  // Statistiques d'entreprise
  const stats = [
    {
      value: "15+",
      label: t("hero.stats.years"),
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      value: "200+",
      label: t("hero.stats.clients"),
      icon: <Users className="w-6 h-6" />,
    },
    {
      value: "50+",
      label: t("hero.stats.projects"),
      icon: <Award className="w-6 h-6" />,
    },
    {
      value: "10+",
      label: t("hero.stats.countries"),
      icon: <Globe className="w-6 h-6" />,
    },
  ];

  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-kofgo-green-700 dark:bg-kofgo-green-700"
    >
      {/* Filtre sombre + dégradé pour lisibilité du texte */}
      <div className="absolute inset-0 bg-black/50 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60 z-[2]" />

      {/* Carrousel d'arrière-plan avec animation contrôlée */}
      <div className="absolute inset-0 overflow-hidden">
        {slides.map((slide, index) => (
          <motion.div
            key={slide.id}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{
              opacity: index === currentSlide ? 1 : 0,
              zIndex: index === currentSlide ? 1 : 0,
              scale: index === currentSlide ? 1 : 1.05,
            }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
          </motion.div>
        ))}
      </div>

      {/* Contrôles du carrousel premium */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30 shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft
          className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white"
          strokeWidth={1.5}
        />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30 shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight
          className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white"
          strokeWidth={1.5}
        />
      </button>

      {/* Indicateurs de diapositives élégants */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-12 h-1.5 rounded-full transition-all duration-500 ${
              index === currentSlide
                ? "bg-white"
                : "bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Éléments animés abstraits */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-kofgo-blue/20 dark:bg-kofgo-blue/30 rounded-full filter blur-[100px] opacity-70"
        animate={{
          x: [0, 40, 0, -40, 0],
          y: [0, -40, 0, 40, 0],
          scale: [1, 1.2, 1, 0.8, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-kofgo-gold/20 dark:bg-kofgo-gold/30 rounded-3xl filter blur-[100px] opacity-70"
        animate={{
          x: [0, -50, 0, 50, 0],
          y: [0, 50, 0, -50, 0],
          scale: [1, 0.8, 1, 1.2, 1],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
          delay: 5,
        }}
      />

      {/* Contenu principal avec animations */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mb-6"
          ></motion.div>

          <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-8 leading-tight text-center">
            <motion.span
              className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-teal-400 drop-shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            >
              {t("hero.title.line1")}
            </motion.span>

            <motion.span
              className="block text-white dark:text-kofgo-gray-light mt-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            >
              {t("hero.title.line2")}
            </motion.span>
          </h3>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-white/90 dark:text-kofgo-gray-light/80 mb-14 max-w-2xl md:max-w-3xl mx-auto leading-relaxed text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <Button
              onClick={() => {
                // 1. Naviguer vers la page
                navigate("/trouver-medecin");

                // 2. Scroll vers la section avec décalage
                setTimeout(() => {
                  const element = document.getElementById("HomeMedecins");
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
              className="group bg-gradient-to-r from-sky-500 to-teal-400 text-white font-medium text-base px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
            >
              <span className="flex items-center">
                {t("hero.cta.explore")}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>

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
              variant="outline"
              className="group border border-white bg-transparent hover:bg-black/40 text-white hover:text-white dark:text-kofgo-gold font-medium text-base px-6 py-3 rounded-lg shadow-md hover:shadow-kofgo-black/30 transition-all duration-300 transform hover:scale-[1.02]"
            >
              {t("hero.cta.quote")}
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Éléments flottants décoratifs */}
      <motion.div
        className="absolute bottom-20 left-12 hidden xl:block"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="p-4 bg-white/10 dark:bg-kofgo-gray/20 backdrop-blur-md rounded-xl border border-white/20 dark:border-kofgo-gray/30 shadow-lg">
          <BarChart2
            className="w-8 h-8 text-white dark:text-sky-400"
            strokeWidth={1.5}
          />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-16 hidden xl:block"
        animate={{
          y: [0, -20, 0],
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <div className="p-4 bg-white/10 dark:bg-kofgo-gray/20 backdrop-blur-md rounded-xl border border-white/20 dark:border-kofgo-gray/30 shadow-lg">
          <Lightbulb
            className="w-8 h-8 text-white dark:text-kofgo-gold"
            strokeWidth={1.5}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
