import React from "react";
import { motion } from "framer-motion";
import {
  HeartPulse,
  Brain,
  Activity, // remplacement pour Pneumologie
  UserCheck, // remplacement pour Dentisterie
  Eye,
  Baby,
  Zap, // remplacement pour Hépatologie
  Stethoscope,
  Microscope,
  Bone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const SpecialitesPage = () => {
  const navigate = useNavigate();

  const specialites = [
    {
      id: 1,
      nom: "Cardiologie",
      icon: <HeartPulse className="h-6 w-6 text-red-500" />,
      description: "Soins du cœur et du système cardiovasculaire",
      medecins: 24,
      bgColor: "bg-red-50",
    },
    {
      id: 2,
      nom: "Neurologie",
      icon: <Brain className="h-6 w-6 text-blue-500" />,
      description: "Troubles du système nerveux et du cerveau",
      medecins: 18,
      bgColor: "bg-blue-50",
    },
    {
      id: 3,
      nom: "Orthopédie",
      icon: <Bone className="h-6 w-6 text-amber-500" />,
      description: "Problèmes musculo-squelettiques et traumatologie",
      medecins: 32,
      bgColor: "bg-amber-50",
    },
    {
      id: 4,
      nom: "Dentisterie",
      icon: <UserCheck className="h-6 w-6 text-teal-500" />,
      description: "Soins dentaires et bucco-dentaires",
      medecins: 28,
      bgColor: "bg-teal-50",
    },
    {
      id: 5,
      nom: "Ophtalmologie",
      icon: <Eye className="h-6 w-6 text-indigo-500" />,
      description: "Santé oculaire et correction visuelle",
      medecins: 17,
      bgColor: "bg-indigo-50",
    },
    {
      id: 6,
      nom: "Pédiatrie",
      icon: <Baby className="h-6 w-6 text-pink-500" />,
      description: "Soins médicaux pour enfants et adolescents",
      medecins: 35,
      bgColor: "bg-pink-50",
    },
    {
      id: 7,
      nom: "Pneumologie",
      icon: <Activity className="h-6 w-6 text-emerald-500" />,
      description: "Maladies respiratoires et pulmonaires",
      medecins: 14,
      bgColor: "bg-emerald-50",
    },
    {
      id: 8,
      nom: "Hépatologie",
      icon: <Zap className="h-6 w-6 text-purple-500" />,
      description: "Troubles du foie et des voies biliaires",
      medecins: 9,
      bgColor: "bg-purple-50",
    },
    {
      id: 9,
      nom: "Médecine générale",
      icon: <Stethoscope className="h-6 w-6 text-green-500" />,
      description: "Soins primaires et suivi médical global",
      medecins: 42,
      bgColor: "bg-green-50",
    },
    {
      id: 10,
      nom: "Biologie médicale",
      icon: <Microscope className="h-6 w-6 text-cyan-500" />,
      description: "Analyses médicales et diagnostics biologiques",
      medecins: 12,
      bgColor: "bg-cyan-50",
    },
  ];

  const handleSpecialtyClick = (specialty) => {
    navigate(`/trouver-medecin?specialite=${encodeURIComponent(specialty)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-teal-500 text-white py-24 overflow-hidden">
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
    </div>
  );
};

export default SpecialitesPage;
