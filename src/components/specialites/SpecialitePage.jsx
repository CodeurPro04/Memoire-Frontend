import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  HeartPulse,
  Brain,
  Activity,
  UserCheck,
  Eye,
  Baby,
  Zap,
  Stethoscope,
  Microscope,
  Bone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";

// Mapping des icônes par spécialité
const iconMap = {
  Cardiologue: <HeartPulse className="h-6 w-6 text-red-500" />,
  Neurologue: <Brain className="h-6 w-6 text-blue-500" />,
  Orthopédie: <Bone className="h-6 w-6 text-amber-500" />,
  Dentisterie: <UserCheck className="h-6 w-6 text-teal-500" />,
  Ophtalmologue: <Eye className="h-6 w-6 text-indigo-500" />,
  Pédiatre: <Baby className="h-6 w-6 text-pink-500" />,
  Pneumologue: <Activity className="h-6 w-6 text-emerald-500" />,
  Hépatologue: <Zap className="h-6 w-6 text-purple-500" />,
  Généraliste: <Stethoscope className="h-6 w-6 text-green-500" />,
  Dermatologue: <HeartPulse className="h-6 w-6 text-orange-500" />, // exemple couleur différente
  Gynécologue: <HeartPulse className="h-6 w-6 text-pink-600" />, // exemple couleur différente
  "Biologie médicale": <Microscope className="h-6 w-6 text-cyan-500" />,
};

const SpecialitesPage = () => {
  const navigate = useNavigate();
  const [specialites, setSpecialites] = useState([]);

  useEffect(() => {
    const fetchSpecialites = async () => {
      try {
        const response = await api.get("/medecins");
        const medecins = response.data;

        // Compter le nombre de médecins par spécialité
        const countBySpecialite = medecins.reduce((acc, m) => {
          const specialiteName = m.specialite || "Médecine générale"; // fallback
          if (!acc[specialiteName]) acc[specialiteName] = 0;
          acc[specialiteName]++;
          return acc;
        }, {});

        // Transformer en tableau pour la grille
        const data = Object.keys(countBySpecialite).map((nom, idx) => ({
          id: idx + 1,
          nom,
          icon: iconMap[nom] || (
            <Stethoscope className="h-6 w-6 text-gray-500" />
          ),
          description: `Soins spécialisés en ${nom}`,
          medecins: countBySpecialite[nom],
          bgColor: "bg-gray-50", // tu peux personnaliser couleur par spécialité si tu veux
        }));

        setSpecialites(data);
      } catch (err) {
        console.error("Erreur lors du chargement des spécialités :", err);
      }
    };

    fetchSpecialites();
  }, []);

  const handleSpecialtyClick = (specialty) => {
    navigate(`/trouver-medecin?specialite=${encodeURIComponent(specialty)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-teal-500 text-white py-28 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Nos Spécialités Médicales
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              Découvrez notre gamme complète de spécialités médicales et trouvez
              l'expert qu'il vous faut.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {specialites.map((s) => (
            <motion.div
              key={s.id}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className={`${s.bgColor} rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer`}
              onClick={() => handleSpecialtyClick(s.nom)}
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-lg bg-white shadow-sm flex items-center justify-center">
                    {s.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{s.nom}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {s.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <Badge variant="outline" className="text-gray-700">
                    {s.medecins} médecin{s.medecins > 1 ? "s" : ""}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:bg-sky-700 hover:text-white"
                  >
                    Voir les experts
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ===== CTA FINAL ===== */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à prendre rendez-vous avec un spécialiste ?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Notre équipe est disponible 24h/24 pour vous aider à trouver le
              professionnel de santé qu'il vous faut.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button className="bg-white text-blue-600 px-8 py-4 rounded-lg shadow-lg hover:bg-blue-50 text-lg font-semibold">
                  Trouver un médecin
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  variant="outline"
                  className="border-white text-black px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 text-lg font-semibold"
                >
                  Contactez-nous
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SpecialitesPage;
