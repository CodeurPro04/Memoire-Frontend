import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const PremiumServices = ({ services }) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-20">
      {services.map((service, index) => {
        const isEven = index % 2 === 0;
        return (
          <motion.div
            key={index}
            className={`flex flex-col md:flex-row items-center gap-10 ${
              isEven ? "" : "md:flex-row-reverse"
            } bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            {/* Image */}
            <div className="w-full md:w-1/2 h-80">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Contenu */}
            <div className="w-full md:w-1/2 p-6 md:p-10">
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-2xl md:text-3xl font-bold text-kofgo-green mb-4 drop-shadow-lg">
                {service.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
                {service.description}
              </p>

              {/* Liste avec icônes */}
              <ul className="space-y-3 mb-6">
                {service.highlights.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="text-emerald-500 mt-1" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>

              <button
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
                        element.getBoundingClientRect().top +
                        window.pageYOffset;

                      window.scrollTo({
                        top: elementPosition - offset,
                        behavior: "smooth",
                      });
                    }
                  }, 100);
                }}
                className="relative overflow-hidden group px-8 sm:px-14 py-3 sm:py-4 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-500"
              >
                En savoir plus
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PremiumServices;
