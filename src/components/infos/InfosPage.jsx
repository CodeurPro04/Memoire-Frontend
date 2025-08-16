import React from "react";
import { motion } from "framer-motion";
import {
  Stethoscope,
  CalendarCheck,
  UserPlus,
  ShieldCheck,
  Smartphone,
  Clock,
  HeartPulse,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const InfoPage = () => {
  const features = [
    {
      icon: <UserPlus className="w-12 h-12 text-blue-600" />,
      title: "Inscription Simple",
      description:
        "Créez votre compte en moins de 2 minutes et accédez à tous nos services.",
    },
    {
      icon: <Stethoscope className="w-12 h-12 text-green-600" />,
      title: "Recherche Avancée",
      description:
        "Trouvez le médecin idéal par spécialité, localisation ou disponibilité.",
    },
    {
      icon: <CalendarCheck className="w-12 h-12 text-purple-600" />,
      title: "Rendez-vous en Ligne",
      description:
        "Prenez rendez-vous 24h/24 et recevez une confirmation instantanée.",
    },
    {
      icon: <ShieldCheck className="w-12 h-12 text-amber-600" />,
      title: "Sécurité des Données",
      description:
        "Vos informations médicales sont cryptées et protégées conformément aux normes.",
    },
  ];

  const steps = [
    {
      step: "1",
      icon: <BookOpen className="w-6 h-6" />,
      title: "Consultez les profils",
      content: "Parcourez les profils vérifiés de nos professionnels de santé.",
    },
    {
      step: "2",
      icon: <HeartPulse className="w-6 h-6" />,
      title: "Choisissez votre spécialiste",
      content:
        "Sélectionnez en fonction des spécialités, notes et disponibilités.",
    },
    {
      step: "3",
      icon: <CalendarCheck className="w-6 h-6" />,
      title: "Planifiez votre consultation",
      content: "Choisissez un créneau qui correspond à vos disponibilités.",
    },
    {
      step: "4",
      icon: <Smartphone className="w-6 h-6" />,
      title: "Confirmation immédiate",
      content: "Recevez votre confirmation par email et SMS avec les détails.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-teal-500 text-white py-24 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Badge
              variant="outline"
              className="mb-4 bg-white/20 border-white text-white px-4 py-2 rounded-full font-semibold"
            >
              Comment ça marche
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Votre santé, simplifiée
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto drop-shadow-sm">
              Découvrez comment notre plateforme révolutionne votre accès aux
              soins médicaux.
            </p>
          </motion.div>
        </div>
        {/* Decorative circles */}
        <motion.div
          className="absolute -top-32 -left-32 w-64 h-64 bg-white/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/10 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Une expérience médicale repensée
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nous combinons technologie et expertise médicale pour vous offrir un
            service inégalé.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-10 text-center hover:shadow-2xl transition-all"
            >
              <div className="flex justify-center mb-6">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-blue-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              En seulement 4 étapes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Votre parcours vers des soins de qualité n'a jamais été aussi
              simple.
            </p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute left-1/2 top-0 h-full w-1 bg-blue-200 transform -translate-x-1/2" />

            <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-20 lg:gap-y-20">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`relative lg:flex ${
                    idx % 2 === 0 ? "lg:justify-end" : "lg:justify-start"
                  }`}
                >
                  <div className="max-w-lg p-8 bg-white rounded-2xl shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold mr-4">
                        {step.step}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                    <div className="flex items-start mt-2">
                      <div className="mr-4 pt-1">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600">
                          {step.icon}
                        </div>
                      </div>
                      <p className="text-gray-600">{step.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-blue-600 to-teal-500 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prêt à prendre en main votre santé ?
            </h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto">
              Rejoignez les milliers de patients qui simplifient déjà leur
              parcours médical.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-xl font-semibold shadow-lg"
              >
                Commencer maintenant
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-black hover:bg-white/10 px-8 py-4 text-xl font-semibold hover:text-white"
              >
                En savoir plus
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
