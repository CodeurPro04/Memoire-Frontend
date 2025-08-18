import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const StartupModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const hasSeenToday = () => {
    const lastShown = localStorage.getItem("startup_modal_last_shown");
    if (!lastShown) return false;
    return new Date().toDateString() === lastShown;
  };

  useEffect(() => {
    if (!hasSeenToday()) {
      setIsOpen(true);
      localStorage.setItem(
        "startup_modal_last_shown",
        new Date().toDateString()
      );
    }
  }, []);

  const handleClose = () => setIsOpen(false);
  const handleRedirect = () => {
    setIsOpen(false);
    navigate("/trouver-medecin");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="relative bg-white rounded-xl shadow-2xl overflow-hidden max-w-2xl w-full mx-4 border border-gray-100"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-50 rounded-full opacity-40"></div>
              <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-50 rounded-full opacity-40"></div>
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fermer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
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

            {/* Content grid layout */}
            <div className="grid md:grid-cols-2">
              {/* Image section */}
              <div className="hidden md:block bg-gradient-to-br from-emerald-100 to-blue-100">
                <img
                  src="https://img.freepik.com/photos-premium/couple-affaires-afro-americain-femme-europeenne-qui-assis-dans-salle-specialement-designee-aide-documents-papier-tablet-pc-parler-leur-projet-entreprise-leur_141188-3537.jpg?uid=R36722598&ga=GA1.1.1540057430.1738812532&semt=ais_hybrid&w=740" // Remplacez par votre image
                  alt="Espace startup professionnel"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text section */}
              <div className="p-8 md:p-10 relative z-10">
                <div className="flex justify-center mb-8">
                  <motion.img
                    src="/logo/logo1.png"
                    alt="Logo KOFGO"
                    className="h-20 md:h-24 transition-all duration-300 hover:scale-105"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.2,
                      type: "spring",
                      stiffness: 100,
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-logo.png"; // Fallback image
                    }}
                  />
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4 drop-shadow-lg">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 drop-shadow-lg">
                    DocOnline
                  </span>{" "}
                  <br />
                  Votre santé notre priorité
                </h2>

                <p className="text-gray-600 text-center mb-8 leading-relaxed">
                  Découvrez notre écosystème dédié aux docteurs. Consultez vos medcins désormais en ligne !
                </p>

                <div className="flex flex-col space-y-3">
                  <button
                    onClick={handleRedirect}
                    className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    Explorer nos Docteurs
                  </button>

                  <button
                    onClick={handleClose}
                    className="text-gray-500 hover:text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Découvrir plus tard
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StartupModal;
