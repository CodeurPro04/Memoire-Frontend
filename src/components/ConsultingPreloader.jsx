import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

const MedicalPreloader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenPreloader = sessionStorage.getItem('hasSeenPreloader');

    if (!hasSeenPreloader) {
      setIsLoading(true);
      sessionStorage.setItem('hasSeenPreloader', 'true');

      const animationDuration = 1500;
      const redirectTimer = setTimeout(() => {
        setIsLoading(false);
        navigate('/');
      }, animationDuration);

      const safetyTimer = setTimeout(() => {
        setIsLoading(false);
        navigate('/');
      }, 3000);

      return () => {
        clearTimeout(redirectTimer);
        clearTimeout(safetyTimer);
      };
    }
  }, [navigate]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 to-teal-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Icône médicale animée */}
          <motion.div
            className="mb-10 p-6 bg-white rounded-2xl shadow-xl border border-teal-100"
            initial={{ scale: 0.8, rotate: -15, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 10,
              duration: 0.8
            }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Stethoscope className="h-20 w-20 text-teal-500" />
            </motion.div>
          </motion.div>

          {/* Barre de progression */}
          <div className="w-72 h-2 bg-teal-100 rounded-full overflow-hidden mb-8">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-500 to-sky-500"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{
                duration: 1.8,
                ease: "easeInOut",
                onComplete: () => {
                  setIsLoading(false);
                  navigate('/');
                }
              }}
            />
          </div>

          {/* Texte animé */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <p className="text-gray-700 font-medium">
              Chargement de votre espace santé...
            </p>
          </motion.div>

          {/* Bulles décoratives */}
          <motion.div
            className="absolute inset-0 overflow-hidden z-[-1]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-teal-100 rounded-full"
                style={{
                  width: `${Math.random() * 180 + 50}px`,
                  height: `${Math.random() * 180 + 50}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.15, 0],
                  scale: [0, 1.2, 1.5]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.3,
                  repeatDelay: 8
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MedicalPreloader;
