import React, { useState, useEffect } from "react";
import { Linkedin, Twitter, Facebook, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isOpen, onClose, title, content }) => {
  // Bloque le défilement quand la modal est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Gère la fermeture avec la touche ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay avec animation */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />

          {/* Modal centrée avec animation */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl border border-gray-700"
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.3,
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex justify-between items-center p-6 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 rounded-t-xl">
                <h2
                  id="modal-title"
                  className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300"
                >
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  aria-label="Fermer la modale"
                >
                  <X className="w-6 h-6 text-gray-300 hover:text-white" />
                </button>
              </div>

              {/* Contenu */}
              <div className="p-6 text-gray-300 prose prose-invert max-w-none">
                {content}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 p-4 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 rounded-b-xl flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-white rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('https://kofgo-consulting.com/api/getcategorie.php') // <-- adapte au bon endpoint
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Erreur de chargement des catégories", err));
  }, []);

  const [modalContent, setModalContent] = useState(null);

  const showModal = (type) => {
    const contentMap = {
      mentions: {
        title: "📑 Mentions Légales",
        content: (
          <div className="space-y-6">
            <p className="text-sm text-gray-400 italic">
              Dernière mise à jour : 02/05/2025
            </p>

            <p className="text-sm">
              Conformément aux articles 6-III et 19 de la loi n°2004-575 du 21
              juin 2004 pour la confiance dans l'économie numérique (LCEN), les
              présentes mentions légales sont portées à la connaissance des
              utilisateurs du site www.kofgo-consulting.com.
            </p>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-emerald-400">
                1. Éditeur du site
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Nom de l'entreprise :</strong> KOF-GO CONSULTING
                </li>
                <li>
                  <strong>Forme juridique :</strong> SARL
                </li>
                <li>
                  <strong>SIRET :</strong> CI-GRDBSM-2023-B-4197
                </li>
                <li>
                  <strong>Siège social :</strong> Lot 1155, Grand-Bassam, Côte
                  d'Ivoire
                </li>
                <li>
                  <strong>Directeur de la publication :</strong> Konan Innocent
                  KOFFI
                </li>
                <li>
                  <strong>Email de contact :</strong>{" "}
                  contact@kofgoconsulting.com
                </li>
                <li>
                  <strong>Téléphone :</strong> +33 7 43 10 12 06
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-emerald-400">
                2. Hébergement
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Hébergeur :</strong> Hostinger International Ltd.
                </li>
                <li>
                  <strong>Adresse :</strong> Larnaca, Chypre
                </li>
                <li>
                  <strong>Téléphone :</strong> +370 645 03378
                </li>
                <li>
                  <strong>Site web :</strong> www.hostinger.com
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-emerald-400">
                3. Propriété intellectuelle
              </h3>
              <p>
                L'ensemble du contenu du site www.kofgo-consulting.com (textes,
                images, graphismes, logo, icônes, etc.) est la propriété
                exclusive de KOF-GO CONSULTING, sauf mention contraire. Toute
                reproduction, représentation, modification, publication ou
                adaptation, totale ou partielle, est interdite sans autorisation
                écrite préalable.
              </p>

              <h3 className="text-lg font-semibold text-emerald-400">
                4. Données personnelles
              </h3>
              <p>
                Les informations recueillies sur ce site sont traitées dans le
                respect du Règlement Général sur la Protection des Données
                (RGPD). Pour plus d'informations, consultez notre Politique de
                confidentialité.
              </p>

              <h3 className="text-lg font-semibold text-emerald-400">
                5. Responsabilité
              </h3>
              <p>
                KOF-GO CONSULTING met en œuvre tous les moyens raisonnables pour
                assurer un contenu fiable et à jour. Toutefois, des erreurs ou
                omissions peuvent survenir. L'utilisateur reconnaît utiliser les
                informations sous sa seule responsabilité.
              </p>

              <h3 className="text-lg font-semibold text-emerald-400">
                6. Liens externes
              </h3>
              <p>
                Le site peut contenir des liens vers d'autres sites. KOF-GO
                CONSULTING ne saurait être tenu responsable du contenu ou des
                pratiques de ces sites tiers.
              </p>

              <h3 className="text-lg font-semibold text-emerald-400">
                7. Droit applicable
              </h3>
              <p>
                Les présentes mentions légales sont régies par le droit
                français. En cas de litige, les tribunaux compétents seront ceux
                du ressort du siège de l'entreprise, sauf disposition légale
                contraire.
              </p>

              <p className="text-center mt-6 font-medium">
                KOF-GO CONSULTING
                <br />
                Conseil. Transformation. Résultats.
              </p>
            </div>
          </div>
        ),
      },
      cgu: {
        title: "⚖️ Conditions Générales d'Utilisation",
        content: (
          <div className="space-y-6">
            <p className="text-sm text-gray-400 italic">
              Dernière mise à jour : 02/05/2025
            </p>

            <p>
              Les présentes Conditions Générales d'Utilisation régissent l'accès
              et l'utilisation du site internet www.kofgo-consulting.com
              (ci-après le "Site"), édité par KOF-GO CONSULTING. Toute
              navigation sur ce site implique l'acceptation pleine et entière
              des présentes CGU.
            </p>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-emerald-400">
                1. Informations légales
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Éditeur :</strong> KOF-GO CONSULTING
                </li>
                <li>
                  <strong>Directeur de la publication :</strong> Konan Innocent
                  KOFFI
                </li>
                <li>
                  <strong>Adresse :</strong> 21 Rue Louise Michel, 78711, France
                </li>
                <li>
                  <strong>Email :</strong> contact@kofgoconsulting.com
                </li>
                <li>
                  <strong>SIRET :</strong> CI-GRDBSM-2023-B-4197
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-emerald-400">
                2. Accès au site
              </h3>
              <p>
                Le site est accessible gratuitement à tout utilisateur disposant
                d'un accès à Internet. Tous les frais liés à l'accès au service
                (matériel informatique, connexion Internet...) sont à la charge
                de l'utilisateur.
              </p>
              <p>
                KOF-GO CONSULTING met tout en œuvre pour assurer l'accessibilité
                du site 24h/24 et 7j/7, mais ne saurait être tenu pour
                responsable en cas d'indisponibilité, notamment pour des raisons
                de maintenance ou de force majeure.
              </p>

              <h3 className="text-lg font-semibold text-emerald-400">
                3. Contenu du site
              </h3>
              <p>
                Le site a pour objet de présenter les activités, offres de
                services et expertises de KOF-GO CONSULTING. Les informations
                diffusées sur le site sont données à titre indicatif. KOF-GO
                CONSULTING se réserve le droit de les modifier ou de les mettre
                à jour sans préavis.
              </p>

              <h3 className="text-lg font-semibold text-emerald-400">
                4. Propriété intellectuelle
              </h3>
              <p>
                Tous les éléments présents sur le site (textes, logos, images,
                graphismes, icônes, structure...) sont protégés par le droit de
                la propriété intellectuelle et restent la propriété exclusive de
                KOF-GO CONSULTING. Toute reproduction, représentation ou
                utilisation, même partielle, sans autorisation écrite préalable
                est strictement interdite.
              </p>

              <h3 className="text-lg font-semibold text-emerald-400">
                5. Données personnelles
              </h3>
              <p>
                L'utilisation du site peut impliquer la collecte de données
                personnelles, dans le respect du Règlement Général sur la
                Protection des Données (RGPD). Pour en savoir plus,
                l'utilisateur est invité à consulter la Politique de
                confidentialité.
              </p>

              <h3 className="text-lg font-semibold text-emerald-400">
                6. Cookies
              </h3>
              <p>
                Le site peut être amené à déposer des cookies pour améliorer
                l'expérience utilisateur. L'utilisateur peut à tout moment gérer
                ses préférences de cookies via le bandeau prévu à cet effet.
              </p>

              <h3 className="text-lg font-semibold text-emerald-400">
                7. Engagements de l'utilisateur
              </h3>
              <p>L'utilisateur s'engage à :</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Utiliser le site conformément aux lois en vigueur</li>
                <li>Ne pas porter atteinte aux droits de tiers</li>
                <li>
                  Ne pas utiliser le site à des fins illégales ou frauduleuses
                </li>
                <li>Ne pas entraver le bon fonctionnement du site</li>
              </ul>

              <h3 className="text-lg font-semibold text-emerald-400">
                8. Responsabilité
              </h3>
              <p>KOF-GO CONSULTING ne saurait être tenu responsable :</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Des erreurs ou omissions dans les contenus du site</li>
                <li>
                  De l'usage qui pourrait en être fait par les utilisateurs
                </li>
                <li>
                  De dommages directs ou indirects liés à l'utilisation du site
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-emerald-400">
                9. Liens hypertextes
              </h3>
              <p>
                Le site peut contenir des liens vers des sites tiers. KOF-GO
                CONSULTING ne contrôle pas ces sites et décline toute
                responsabilité quant à leur contenu ou pratiques.
              </p>

              <h3 className="text-lg font-semibold text-emerald-400">
                10. Droit applicable
              </h3>
              <p>
                Les présentes Conditions Générales d'Utilisation sont régies par
                le droit français. Tout litige relatif à leur interprétation ou
                exécution relève de la compétence des tribunaux du ressort du
                siège social de KOF-GO CONSULTING.
              </p>

              <p className="text-center mt-6 font-medium">
                Merci de votre visite.
                <br />
                KOF-GO CONSULTING – Conseil. Transformation. Résultats.
              </p>
            </div>
          </div>
        ),
      },
      privacy: {
        title: "🔐 Politique de Confidentialité",
        content: (
          <div className="space-y-6">
            <p className="text-sm text-gray-400 italic">
              Dernière mise à jour : 02/05/2025
            </p>

            <p>
              Bienvenue sur le site www.kofgo-consulting.com, propriété de
              KOF-GO CONSULTING, entreprise spécialisée dans le conseil
              stratégique et opérationnel. La protection de vos données
              personnelles est une priorité pour nous.
            </p>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-emerald-400">
                1. Responsable du traitement
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Entreprise :</strong> KOF-GO CONSULTING
                </li>
                <li>
                  <strong>Adresse :</strong> 21 Rue Louise Michel, 78711, France
                </li>
                <li>
                  <strong>Email :</strong> contact@kofgoconsulting.com
                </li>
                <li>
                  <strong>Responsable :</strong> Konan Innocent KOFFI –
                  Directeur Général
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-emerald-400">
                2. Données collectées
              </h3>
              <p>Nous collectons uniquement les données nécessaires :</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Nom, prénom</li>
                <li>Coordonnées (email, téléphone)</li>
                <li>Informations professionnelles (poste, entreprise)</li>
                <li>Détails de votre projet</li>
                <li>Données de navigation (via cookies)</li>
              </ul>

              <h3 className="text-lg font-semibold text-emerald-400">
                3. Finalités du traitement
              </h3>
              <p>Vos données servent à :</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Répondre à vos demandes</li>
                <li>Établir des devis</li>
                <li>Organiser des sessions de conseil</li>
                <li>Améliorer notre site web</li>
                <li>Gérer la relation client</li>
              </ul>

              <h3 className="text-lg font-semibold text-emerald-400">
                4. Sécurité des données
              </h3>
              <p>
                Nous mettons en œuvre des mesures techniques et
                organisationnelles strictes :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Accès restreint aux personnes autorisées</li>
                <li>Protocoles de chiffrement</li>
                <li>Sauvegardes régulières</li>
              </ul>

              <h3 className="text-lg font-semibold text-emerald-400">
                5. Partage des données
              </h3>
              <p>
                Vos données ne sont jamais vendues. Elles peuvent être partagées
                avec :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Prestataires techniques (hébergeur, etc.)</li>
                <li>Partenaires impliqués dans votre projet</li>
                <li>Autorités légales si requis par la loi</li>
              </ul>

              <h3 className="text-lg font-semibold text-emerald-400">
                6. Conservation
              </h3>
              <p>Durées de conservation :</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>3 ans après dernier contact (prospects)</li>
                <li>Durée contractuelle + obligations légales (clients)</li>
              </ul>

              <h3 className="text-lg font-semibold text-emerald-400">
                7. Vos droits
              </h3>
              <p>Conformément au RGPD, vous pouvez :</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Accéder à vos données</li>
                <li>Demander leur rectification</li>
                <li>Demander leur effacement</li>
                <li>Limiter leur traitement</li>
                <li>Vous opposer à leur utilisation</li>
                <li>Demander leur portabilité</li>
              </ul>
              <p className="text-sm text-gray-400 mt-2">
                Pour exercer vos droits : contact@kofgoconsulting.com
              </p>

              <h3 className="text-lg font-semibold text-emerald-400">
                8. Cookies
              </h3>
              <p>
                Nous utilisons des cookies pour améliorer votre expérience. Vous
                pouvez gérer vos préférences via notre bandeau de consentement.
              </p>

              <h3 className="text-lg font-semibold text-emerald-400">
                9. Modifications
              </h3>
              <p>
                Cette politique peut être mise à jour. La date de version est
                indiquée en en-tête.
              </p>

              <p className="text-center mt-6 font-medium">
                KOF-GO CONSULTING
                <br />
                Conseil. Transformation. Résultats.
              </p>
            </div>
          </div>
        ),
      },
    };
    setModalContent(contentMap[type]);
  };

  const closeModal = () => setModalContent(null);

  return (
    <>
      <footer className="bg-white text-black border-t border-gray-800 py-16 font-light">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <img
              src="/logo/logo1.png"
              alt="DocOnline Logo"
              className="w-32 h-32 mb-4"
            />
            <p className="text-sm mb-4">{t("footer.tagline")}</p>
            <div className="flex space-x-5 mt-2">
              {[
                { Icon: Linkedin, href: "https://www.linkedin.com/company/kof-go-consulting/?originalSubdomain=ci" },
                { Icon: Facebook, href: "https://www.facebook.com/profile.php?id=100092527431074#" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="hover:text-sky-400 transition"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sky-400 font-semibold mb-4">
              {t("footer.links.services.title")}
            </h4>
            <ul className="space-y-2 text-sm">
              {["strategy", "digital", "leadership", "innovation","accompagnement"].map(
                (key) => (
                  <li key={key}>
                    <a
                      href="#services"
                      className="hover:text-sky-400 transition"
                    >
                      {t(`footer.links.services.${key}`)}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sky-400 font-semibold mb-4">
              {t("footer.links.company.title")}
            </h4>
            <ul className="space-y-2 text-sm">
              {["about", "team", "careers", "blog"].map((key) => (
                <li key={key}>
                  <a href="#" className="hover:text-sky-400 transition">
                    {t(`footer.links.company.${key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sky-400 font-semibold mb-4">
              {t("footer.links.legal.title")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => showModal("mentions")}
                  className="hover:text-sky-400 transition"
                >
                  {t("footer.links.legal.mentions")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => showModal("privacy")}
                  className="hover:text-sky-400 transition"
                >
                  {t("footer.links.legal.privacy")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => showModal("cgu")}
                  className="hover:text-sky-400 transition"
                >
                  {t("footer.links.legal.cgu")}
                </button>
              </li>
              <li className="pt-3">
                <span className="block">{t("contact.info.addressLine")}</span>
              </li>
              <li>
                <a
                  href={`mailto:${t("contact.info.emailAddress")}`}
                  className="hover:text-sky-400 transition"
                >
                  {t("contact.info.emailAddress")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          &copy; {currentYear} Doc Online . {t("footer.rightsReserved")}
        </div>
      </footer>

      {modalContent && (
        <Modal
          isOpen={!!modalContent}
          onClose={closeModal}
          title={modalContent.title}
          content={modalContent.content}
        />
      )}
    </>
  );
};

export default Footer;
