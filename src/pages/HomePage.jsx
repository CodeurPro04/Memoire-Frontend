import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import RealisationsSection from '@/components/RealisationsSection';
import StartupSection from '@/components/StartupSection';
import BlogSection from '@/components/BlogSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import StartupModal from '@/components/StartupModal';
import ConsultingPreloader from '@/components/ConsultingPreloader';

const PartnersSection = () => {
  const { t } = useTranslation();
  
  const partners = [
    { name: "Hôpital Central", logo: "/partners/hopital-central.png" },
    { name: "Clinique Saint-Luc", logo: "/partners/logo-saint-luc.webp" },
    { name: "Institut Cardio", logo: "/partners/institut-cardio.png" },
    { name: "Centre de Santé Alpha", logo: "/partners/centre-sante-alpha.png" },
    { name: "Laboratoire BioLab", logo: "/partners/laboratoire-biolab.png" },
    { name: "Université Médicale", logo: "/partners/universite-medicale.svg" },
    { name: "Clinique Vita", logo: "/partners/clinique-vita.png" },
    { name: "SantéPlus", logo: "/partners/santeplus.png" },
  ];

  const itemWidth = 192;
  const gap = 24;
  const totalWidth = (itemWidth + gap * 2) * partners.length;
  const scrollDuration = 50;

  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-sky-800 to-sky-600 z-0"></div>
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="inline-block mb-4 text-sky-300 font-medium tracking-widest text-sm">
            {t('partners.subtitle')}
          </span>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-teal-400">
              {t('partners.title')}
            </span>
          </h2>
        </motion.div>

        <div className="relative h-48 overflow-hidden">
          <motion.div
            className="absolute left-0 right-0 flex items-center h-full"
            animate={{ x: [-totalWidth, 0] }}
            transition={{ duration: scrollDuration, ease: "linear", repeat: Infinity }}
          >
            {[...partners, ...partners].map((partner, i) => (
              <motion.div
                key={`partner-${i}`}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                className="mx-6 flex-shrink-0"
                style={{ width: `${itemWidth}px` }}
              >
                <div className="relative bg-gradient-to-br from-sky-600 via-sky-800 to-sky-600 p-6 rounded-2xl border border-sky-800/30 hover:border-sky-400/50 transition-all duration-300 h-32 w-full flex items-center justify-center backdrop-blur-sm shadow-lg hover:shadow-sky-500/20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                  <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    className="relative max-h-16 max-w-32 object-contain filter grayscale hover:grayscale-0 transition-all duration-500 brightness-0 invert hover:brightness-100 hover:invert-0"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: "circOut", delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-24 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent"
        />
      </div>
    </section>
  );
};

const HomePage = () => {
  return (
    <>
      <ConsultingPreloader />
      <StartupModal />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <PartnersSection />
        <TestimonialsSection />
        <div id="NewsLetter"><ContactSection /></div>
      </motion.div>
    </>
  );
};

export default HomePage;
