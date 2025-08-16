import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Composant séparé pour la carte de réalisation
const ProjectCard = ({ project, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const descRef = useRef(null);
  const [needsExpand, setNeedsExpand] = useState(false);

  useEffect(() => {
    if (descRef.current) {
      setNeedsExpand(
        descRef.current.scrollHeight > descRef.current.clientHeight
      );
    }
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.15,
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="flex flex-col bg-gray-900 rounded-xl shadow-xl overflow-hidden border border-gray-800 hover:border-emerald-500/50 transition-all duration-300 group h-full"
    >
      <div className="relative h-56 flex-shrink-0">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          alt={project.title}
          src={project.image_url}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <span className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {project.category_name}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div>
          <h3 className="text-2xl font-bold mb-3 text-white">
            {project.title}
          </h3>
          <div
            ref={descRef}
            className={`text-gray-400 text-sm mb-4 leading-relaxed ${
              !isExpanded ? "line-clamp-4" : ""
            }`}
          >
            {project.subtitle}
          </div>
        </div>

        <div className="mt-auto space-y-3">
          {needsExpand && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-emerald-400 text-sm font-medium hover:underline"
            >
              {isExpanded ? "Voir moins" : "Voir plus"}
            </button>
          )}

          <Button className="w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:opacity-90 transition-opacity">
            Voir le Projet <Eye className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const RealisationPage = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://kofgo-consulting.com/api/realisations.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setProjects(data.data);
        } else {
          setProjects([]);
          console.warn("Données reçues non valides :", data);
        }
      })
      .catch((err) => {
        console.error("Erreur chargement réalisations :", err);
        setProjects([]);
      });
  }, []);

  return (
    <section
      id="realisations"
      className="relative py-32 bg-gradient-to-br from-white via-slate-100 to-slate-200 dark:from-black dark:via-neutral-900 dark:to-neutral-800 overflow-hidden"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 drop-shadow-lg">
              Nos Réalisations
            </span>
          </h2>
          <p className="text-xl text-kofgo-gray-300 max-w-3xl mx-auto">
            Des résultats concrets pour nos clients.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">
              Chargement des réalisations...
            </p>
          ) : (
            projects.map((project, index) => (
              <ProjectCard
                key={project.id || index}
                project={project}
                index={index}
              />
            ))
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="mt-20 text-center"
        >
          <Button
            variant="outline"
            onClick={() => {
              navigate("/startup#FormProjects");
              setTimeout(() => {
                const element = document.getElementById("FormProjects");
                if (element) {
                  const offset = 120;
                  const elementPosition =
                    element.getBoundingClientRect().top + window.pageYOffset;
                  window.scrollTo({
                    top: elementPosition - offset,
                    behavior: "smooth",
                  });
                }
              }, 100);
            }}
            className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 hover:text-black/70 font-semibold text-lg px-10 py-4 rounded-xl hover:shadow-emerald-500/30"
          >
            Discutons de Votre Projet <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default RealisationPage;
