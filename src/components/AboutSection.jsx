import React from "react";
import { motion } from "framer-motion";
import { Stethoscope, HeartPulse, Users, Building2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";

const AboutSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const stats = [
    {
      value: 10,
      labelKey: "about.stats.yearsExperience",
      withPlus: true,
      icon: <Stethoscope className="w-7 h-7 text-sky-500" />,
    },
    {
      value: 500,
      labelKey: "about.stats.patientsServed",
      withPlus: true,
      icon: <HeartPulse className="w-7 h-7 text-rose-500" />,
    },
    {
      value: 95,
      labelKey: "about.stats.satisfactionRate",
      icon: <Users className="w-7 h-7 text-emerald-500" />,
    },
    {
      value: 25,
      labelKey: "about.stats.partnerClinics",
      icon: <Building2 className="w-7 h-7 text-indigo-500" />,
    },
  ];

  return (
    <section
      id="apropos"
      className="relative py-32 bg-gradient-to-br from-white via-blue-50 to-sky-100 dark:from-black dark:via-neutral-900 dark:to-neutral-800 overflow-hidden"
    >
      {/* Effet de lumière d’ambiance */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-sky-300/20 blur-3xl opacity-70 dark:bg-sky-400/10" />

      <div className="relative max-w-screen-xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 items-center gap-20">
        {/* Texte principal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-5xl font-extrabold leading-tight mb-6 text-gray-900 dark:text-white">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-teal-400 drop-shadow-lg">
              Trouvez un médecin facilement
            </span>
            <span className="block text-gray-700 dark:text-neutral-300 mt-2">
              Votre santé, notre priorité
            </span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-neutral-400 mb-6 leading-relaxed">
            Nous mettons en relation les patients avec des médecins qualifiés et des cliniques partenaires.
          </p>
          <p className="text-lg text-gray-600 dark:text-neutral-500 mb-10 leading-relaxed">
            Grâce à notre application, vous pouvez trouver, réserver et consulter des médecins spécialisés près de chez vous.
          </p>

          <Button
            onClick={() => navigate("/trouver-medecin")}
            className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-sky-500 to-teal-400 text-white shadow-xl hover:scale-105 transition-all duration-300 flex items-center"
          >
            Rechercher un médecin
            <TrendingUp className="ml-3 w-5 h-5" />
          </Button>
        </motion.div>

        {/* Bloc stats + image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative space-y-8"
        >
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => {
              const { ref, inView } = useInView({ triggerOnce: true });
              return (
                <motion.div
                  key={index}
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.2 }}
                  className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl p-6 shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <div className="flex justify-center mb-3">{stat.icon}</div>
                  <div className="text-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-teal-400">
                    {inView ? (
                      <>
                        <CountUp end={stat.value} duration={2} />
                        {stat.withPlus && "+"}
                      </>
                    ) : stat.withPlus ? (
                      "0+"
                    ) : (
                      "0"
                    )}
                  </div>

                  <div className="text-center text-sm text-gray-500 dark:text-neutral-400 mt-1">
                    {t(stat.labelKey)}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.img
            src="/doctors-team.jpg"
            alt="Équipe de médecins"
            className="rounded-2xl shadow-2xl object-cover aspect-video w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
