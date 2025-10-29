import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  MessageCircle,
  Shield,
  FileText,
  Users,
  Stethoscope,
} from "lucide-react";

const FooterPremium = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { name: "Trouver un médecin", href: "/trouver-medecin", icon: Stethoscope },
    { name: "Comment ça marche", href: "/comment-ca-marche", icon: Users },
    { name: "Spécilités", href: "/specialites", icon: FileText },
    { name: "Contact", href: "/contact", icon: MessageCircle },
  ];

  const legalLinks = [
    { name: "Mentions légales", href: "#" },
    { name: "Confidentialité", href: "#" },
    { name: "CGU", href: "#" },
    { name: "Cookies", href: "#" },
  ];

  return (
    <>
      {/* Footer Principal */}
      <footer className="bg-slate-900 text-slate-400 relative overflow-hidden">
        {/* Background décoratif */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950" />
          <div className="absolute inset-0 bg-grid-slate-800/[0.02] bg-[size:60px_60px]" />
        </div>

        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Colonne 1 - Logo et description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-24 h-24 flex items-center justify-center">
                  <img
                    src="/logo/meetmed2.png"
                    alt="Meetmed Logo"
                    className="w-20 h-20 object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-white">Meetmed</span>
              </div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Votre plateforme de confiance pour des consultations médicales
                en ligne sécurisées avec les meilleurs professionnels de santé.
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Shield className="w-4 h-4" />
                <span>Plateforme 100% sécurisée et certifiée</span>
              </div>
            </motion.div>

            {/* Colonne 2 - Liens rapides */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="text-white font-semibold mb-6 text-lg">
                Navigation
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <a
                      href={link.href}
                      className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-300 group"
                    >
                      <link.icon className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Colonne 3 - Légal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-white font-semibold mb-6 text-lg">Légal</h4>
              <ul className="space-y-3">
                {legalLinks.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <a
                      href={link.href}
                      className="text-slate-400 hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Colonne 4 - Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-white font-semibold mb-6 text-lg">Contact</h4>
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                    <Mail className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <a
                      href="mailto:contact@meetmed.com"
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      contact@meetmed.com
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                    <Phone className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Téléphone</p>
                    <a
                      href="tel:+2250700000000"
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      +225 07 00 00 00 00
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                    <MapPin className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Adresse</p>
                    <p className="text-slate-300">Abidjan, Côte d'Ivoire</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Section de copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 pt-8 border-t border-slate-800"
          >
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <div className="text-center lg:text-left">
                <p className="text-sm text-slate-500 flex items-center justify-center lg:justify-start gap-2">
                  © {currentYear} Meetmed.
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-slate-500">Tous droits réservés</span>
                  </div>
                </p>
              </div>

              {/* Bouton back to top */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToTop}
                className="w-12 h-12 bg-slate-800 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 group"
                aria-label="Retour en haut"
              >
                <ArrowUp className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default FooterPremium;
