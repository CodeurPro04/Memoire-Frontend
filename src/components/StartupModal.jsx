import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const StartupModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const hasSeenToday = () => {
    const lastShown = localStorage.getItem("startup_modal_last_shown");
    if (!lastShown) return false;
    return new Date().toDateString() === lastShown;
  };

  useEffect(() => {
    if (!hasSeenToday()) {
      setTimeout(() => {
        setIsOpen(true);
        setTimeout(() => setIsVisible(true), 100);
      }, 1000);
      localStorage.setItem(
        "startup_modal_last_shown",
        new Date().toDateString()
      );
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 500);
  };

  const handleRedirect = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsOpen(false);
      navigate("/trouver-medecin");
    }, 500);
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      rotateX: 5,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.8,
        delay: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -20,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.6,
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          exit="exit"
        >
          {/* Enhanced backdrop with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-cyan-900/95 backdrop-blur-xl" />

          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-1/4 -left-20 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"
              animate={floatingAnimation}
            />
            <motion.div
              className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-r from-teal-400/15 to-emerald-400/15 rounded-full blur-3xl"
              animate={{
                ...floatingAnimation,
                transition: { ...floatingAnimation.transition, delay: 2 },
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-900/50 to-slate-900" />
          </div>

          <motion.div
            className="relative bg-gradient-to-br from-white to-slate-50/95 rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full border border-white/20 backdrop-blur-sm"
            variants={modalVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            exit="exit"
          >
            {/* Enhanced decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -right-32 -top-32 w-80 h-80 bg-gradient-to-r from-cyan-200/40 to-blue-200/40 rounded-full blur-2xl" />
              <div className="absolute -left-32 -bottom-32 w-80 h-80 bg-gradient-to-r from-teal-200/30 to-emerald-200/30 rounded-full blur-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-white/30" />
            </div>

            {/* Enhanced close button */}
            <motion.button
              onClick={handleClose}
              className="absolute top-6 right-6 z-20 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/20 text-white hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
              aria-label="Fermer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
            </motion.button>

            {/* Enhanced content grid */}
            <div className="grid lg:grid-cols-2 min-h-[600px]">
              {/* Enhanced image section */}
              <div className="relative hidden lg:block overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-400/10 to-teal-400/10 z-10" />
                <motion.img
                  src="/logo/modalmeetmed.jpg"
                  alt="Espace startup professionnel Meetmed"
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
              </div>

              {/* Enhanced text section */}
              <motion.div
                className="p-8 md:p-12 relative z-10 flex flex-col justify-center"
                variants={contentVariants}
              >
                <div className="flex justify-center mb-8">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img
                      src="/logo/meetmed2.png"
                      alt="Logo Meetmed"
                      className="h-24 md:h-28 drop-shadow-2xl"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-logo.png";
                      }}
                    />
                  </motion.div>
                </div>

                <motion.h2
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 drop-shadow-lg">
                    Meetmed
                  </span>
                  <br />
                  <span className="text-2xl md:text-3xl bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent mt-2 block">
                    Votre santé, notre priorité
                  </span>
                </motion.h2>

                <motion.p
                  className="text-slate-600 text-center text-lg mb-10 leading-relaxed font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  Découvrez notre plateforme médicale d'exception.
                  <span className="block text-cyan-600 font-semibold mt-2">
                    Consultez vos médecins en ligne dès maintenant !
                  </span>
                </motion.p>

                <motion.div
                  className="flex flex-col space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <motion.button
                    onClick={handleRedirect}
                    className="group relative bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 hover:from-cyan-600 hover:via-teal-500 hover:to-cyan-500 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative flex items-center justify-center gap-2">
                      Explorer nos Docteurs
                      <svg
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </motion.button>

                  <motion.button
                    onClick={handleClose}
                    className="text-slate-500 hover:text-slate-700 font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:bg-slate-100/50 backdrop-blur-sm"
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    Découvrir plus tard
                  </motion.button>
                </motion.div>

                {/* Trust indicators */}
                <motion.div
                  className="flex justify-center items-center gap-6 mt-10 pt-8 border-t border-slate-200/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-500">24/7</div>
                    <div className="text-sm text-slate-500">Disponible</div>
                  </div>
                  <div className="w-px h-8 bg-slate-300/50" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">✓</div>
                    <div className="text-sm text-slate-500">Certifié</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StartupModal;
