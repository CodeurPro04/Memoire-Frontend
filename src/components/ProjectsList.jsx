import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ProjectsList = ({ projects }) => {
  const navigate = useNavigate();

  const goToProject = (slug) => {
    navigate(`/project/${slug}`); // adapte cette route si besoin
  };
  return (
    <div className="space-y-40">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          className="relative"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: index * 0.15 }}
        >
          {/* Project background shape */}
          <div
            className={`absolute inset-0 -z-10 rounded-4xl ${
              index % 2 === 0
                ? "bg-emerald-900/5 dark:bg-emerald-900/10"
                : "bg-gray-900/5 dark:bg-gray-900/10"
            }`}
          ></div>

          <div
            className={`flex flex-col ${
              index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
            } items-center gap-12 lg:gap-24`}
          >
            {/* Project image with parallax effect */}
            <motion.div
              className="flex-1 rounded-xl overflow-hidden shadow-2xl relative h-[400px] lg:h-[500px] w-full"
              whileHover="hover"
              initial="initial"
            >
              <motion.div
                variants={{
                  initial: { scale: 1 },
                  hover: { scale: 1.05 },
                }}
                transition={{ duration: 0.5 }}
                className="h-full w-full"
              >
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              </motion.div>

              {/* Client logo badge */}
              {project.logo && (
                <div className="absolute -bottom-6 left-6 bg-white dark:bg-gray-900 p-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
                  <img
                    src={project.logo}
                    alt={project.client || "Logo client"}
                    className="h-10 object-contain"
                  />
                </div>
              )}
            </motion.div>

            {/* Project content */}
            <div className="flex-1 py-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-full text-sm font-medium">
                  {project.category}
                </span>

                {project.created_at && (
                  <span className="text-sm text-gray-500">
                    {new Date(project.created_at).getFullYear()}
                  </span>
                )}
              </div>

              <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                {project.title}
              </h3>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {project.subtitle}
              </p>

              {project.highlights && project.highlights.length > 0 && (
                <div className="mb-10">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Principaux résultats
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {project.highlights.map((highlight, i) => (
                      <motion.div
                        key={i}
                        className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
                        whileHover={{ y: -5 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                            {highlight.icon}
                          </div>
                          <p className="font-medium">{highlight.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => goToProject(project.slug)}
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-500"
                >
                  Voir l'étude de cas complète
                </Button>
                <Button
                  variant="outline"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-6 py-4 rounded-xl"
                >
                  Télécharger le PDF
                </Button>
              </div>
            </div>
          </div>

          {/* Testimonial floating card */}
          {project.testimonial && (
            <motion.div
              className={`absolute ${
                index % 2 === 0 ? "right-0 -bottom-20" : "left-0 -bottom-20"
              } hidden lg:block w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-800`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-full">
                    <Star className="h-5 w-5 text-emerald-500" />
                  </div>
                </div>
                <div>
                  <blockquote className="italic text-gray-700 dark:text-gray-300 mb-4">
                    "{project.testimonial.quote}"
                  </blockquote>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {project.testimonial.author}
                    </p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                      {project.testimonial.position}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

const ProjectsSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleViewAll = () => {
    navigate("/projects"); // adapte la route selon ton routing
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log("Tentative de récupération des projets...");
        const response = await fetch(
          "https://kofgo-consulting.com/api/realisations_all.php"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        console.log("Réponse texte:", text);

        try {
          const result = JSON.parse(text);
          console.log("Résultat parsé:", result);

          if (result.success && Array.isArray(result.data)) {
            // Formatte les données projet
            const formattedProjects = result.data.map((project) => ({
              id: project.id,
              title: project.title || "Titre non défini",
              subtitle: project.subtitle || "",
              image_url: project.image_url || "/default-project-image.jpg",
              category: project.category_name || "Non catégorisé",
              slug: project.slug || `project-${project.id}`,
              created_at: project.created_at || null,
              // exemple de champs supplémentaires, adapter selon ta source
              logo: project.logo || null,
              client: project.client || "",
              highlights: project.highlights || [], // tableau {icon: JSX, text: string}
              testimonial: project.testimonial || null, // objet {quote, author, position}
            }));

            setProjects(formattedProjects);
          } else {
            throw new Error(result.message || "Structure de données invalide");
          }
        } catch (parseError) {
          throw new Error(`Erreur de parsing JSON: ${parseError.message}`);
        }
      } catch (err) {
        console.error("Erreur complète:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-gray-900">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <p>Chargement des projets...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-gray-900">
        <div className="max-w-screen-xl mx-auto px-4 text-center text-red-400">
          <p>Erreur : {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 bg-kofgo-gray-900">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProjectsList projects={projects} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="mt-20 text-center"
        ></motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
