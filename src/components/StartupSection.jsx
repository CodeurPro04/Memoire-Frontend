import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Lightbulb, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const StartupSection = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      icon: <Rocket className="w-12 h-12 text-emerald-400" />,
      titleKey: 'startup.service1.title',
      descriptionKey: 'startup.service1.description',
    },
    {
      id: 2,
      icon: <Lightbulb className="w-12 h-12 text-teal-400" />,
      titleKey: 'startup.service2.title',
      descriptionKey: 'startup.service2.description',
    },
    {
      id: 3,
      icon: <Users className="w-12 h-12 text-cyan-400" />,
      titleKey: 'startup.service3.title',
      descriptionKey: 'startup.service3.description',
    },
    {
      id: 4,
      icon: <TrendingUp className="w-12 h-12 text-emerald-300" />,
      titleKey: 'startup.service4.title',
      descriptionKey: 'startup.service4.description',
    }, 
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 50, filter: "blur(3px)" },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <section id="startup" className="py-24 bg-gradient-to-br from-emerald-900/80 via-gray-900 to-teal-900/80">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400">
              {t('startup.title')}
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t('startup.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="bg-gray-800 rounded-xl p-8 shadow-xl hover:shadow-emerald-500/20 border border-gray-700 hover:border-teal-400/50 transition-all duration-300 transform hover:-translate-y-2 group flex flex-col items-center text-center"
            >
              <div className="mb-6">
                <div className="inline-block p-4 bg-gradient-to-br from-emerald-500/20 to-teal-400/20 rounded-full group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-teal-300 transition-colors duration-300">
                {t(service.titleKey)}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {t(service.descriptionKey)}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="mt-20 text-center"
        >
          <Button
            size="lg"
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
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-white font-semibold text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-emerald-500/30 hover:from-emerald-400 hover:via-teal-300 hover:to-cyan-300 transition-all duration-300 transform hover:scale-[1.02]"
          >
            {i18n.language === 'fr' ? 'Commencer Maintenant' : 'Start Now'}
            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default StartupSection;