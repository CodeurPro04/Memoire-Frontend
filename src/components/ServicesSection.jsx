import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Stethoscope,
  HeartPulse,
  Users,
  Activity,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const servicesData = [
  {
    icon: <Stethoscope className="w-12 h-12 text-gray-700" />,
    titleKey: "services.consultation.title",
    descriptionKey: "services.consultation.description",
    featuresKey: [
      "services.consultation.feature1",
      "services.consultation.feature2",
      "services.consultation.feature3",
      "services.consultation.feature4",
    ],
  },
  {
    icon: <HeartPulse className="w-12 h-12 text-red-500" />,
    titleKey: "services.cardiology.title",
    descriptionKey: "services.cardiology.description",
    featuresKey: [
      "services.cardiology.feature1",
      "services.cardiology.feature2",
      "services.cardiology.feature3",
      "services.cardiology.feature4",
    ],
  },
  {
    icon: <Users className="w-12 h-12 text-blue-500" />,
    titleKey: "services.generalCare.title",
    descriptionKey: "services.generalCare.description",
    featuresKey: [
      "services.generalCare.feature1",
      "services.generalCare.feature2",
      "services.generalCare.feature3",
    ],
  },
];

const ServiceCard = ({ icon, titleKey, descriptionKey, featuresKey, index }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="bg-white dark:bg-neutral-900 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-neutral-700 hover:shadow-sky-500/30 transition-all duration-300 transform hover:-translate-y-2 group"
    >
      <div className="mb-6 text-center">
        <div className="inline-block p-4 bg-gradient-to-r from-sky-500 to-teal-400 rounded-full group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-4 text-center text-sky-500 to-teal-400">
        {t(titleKey)}
      </h3>
      <p className="text-gray-600 mb-6 text-center text-sm leading-relaxed">
        {t(descriptionKey)}
      </p>
      <ul className="space-y-3">
        {featuresKey.map((feature, idx) => (
          <li key={idx} className="flex items-start text-sm text-gray-700">
            <CheckCircle className="w-5 h-5 text-sky-500 mr-3 mt-0.5 flex-shrink-0" />
            <span>{t(feature)}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

const ServicesSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section id="services" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-teal-400 drop-shadow-lg">
              {t("services.mainTitle")}
            </span>
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            {t("services.mainSubtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {servicesData.map((service, index) => (
            <ServiceCard key={index} {...service} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="mt-20 text-center space-y-6"
        >
          <p className="text-lg text-gray-700 dark:text-gray-300">
            {t("services.ctaText")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate("/contact#HomeContact")}
              className="bg-gradient-to-r from-sky-500 to-teal-400 text-white font-semibold text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-sky-500/30 transition-all duration-300 transform hover:scale-[1.02]"
            >
              {t("services.contactButton")}
            </Button>
            <Button
              size="lg"
              onClick={() => navigate("/services#HomeService")}
              variant="outline"
              className="border-sky-500 text-sky-500 hover:bg-emerald-100/20 font-semibold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              {t("services.learnMoreButton")}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
