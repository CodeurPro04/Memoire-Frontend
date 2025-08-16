import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, BarChart2, PieChart, Users, Globe, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  {
    icon: <Briefcase size={36} className="text-kofgo-blue mb-4" />,
    title: "Stratégie & Gouvernance",
    description:
      "Alignement stratégique, gouvernance corporative et pilotage de la performance à l'échelle de votre organisation.",
  },
  {
    icon: <BarChart2 size={36} className="text-kofgo-blue mb-4" />,
    title: "Analyse & Performance",
    description:
      "Pilotage financier, audit opérationnel, optimisation des processus pour améliorer vos résultats.",
  },
  {
    icon: <PieChart size={36} className="text-kofgo-blue mb-4" />,
    title: "Études de Marché",
    description:
      "Études sectorielles, benchmarking, due diligence et positionnement stratégique sur les marchés cibles.",
  },
  {
    icon: <Users size={36} className="text-kofgo-blue mb-4" />,
    title: "Transformation RH",
    description:
      "Gestion des talents, organisation, plans de formation et accompagnement au changement.",
  },
  {
    icon: <TrendingUp size={36} className="text-kofgo-blue mb-4" />,
    title: "Levée de Fonds & Finance",
    description:
      "Structuration financière, business plan, levée de capitaux et due diligence.",
  },
  {
    icon: <Globe size={36} className="text-kofgo-blue mb-4" />,
    title: "Expansion Internationale",
    description:
      "Stratégie d’implantation, conformité OHADA, accompagnement réglementaire et bureaucratique.",
  },
];

const ServicesPage = () => (
  <div className="pt-32 px-6 md:px-20 lg:px-32 bg-background text-foreground">
    {/* En-tête */}
    <motion.div
      className="text-center mb-16"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <h1 className="text-5xl font-bold mb-4">Nos Services Premium</h1>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
        Des solutions sur mesure pour accompagner vos ambitions. Diagnostique, stratégie, implementation et suivi.
      </p>
    </motion.div>

    {/* Grille de services */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-24">
      {services.map((svc, idx) => (
        <motion.div
          key={svc.title}
          className="bg-white dark:bg-kofgo-gray-dark rounded-2xl shadow-md p-8 hover:shadow-xl transition"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center">{svc.icon}</div>
          <h3 className="text-2xl font-semibold text-center mb-3">{svc.title}</h3>
          <p className="text-center text-muted-foreground">{svc.description}</p>
        </motion.div>
      ))}
    </div>

    {/* Études de cas */}
    <motion.section
      className="max-w-5xl mx-auto mb-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-semibold text-center mb-8">Cas clients marquants</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2].map(num => (
          <div key={num} className="p-6 border rounded-lg hover:shadow-lg transition">
            <h3 className="text-2xl font-medium mb-2">Projet Example #{num}</h3>
            <p className="text-muted-foreground mb-4">
              Description synthétique du contexte client, défi relevé, et impact mesurable (ROI, gains).
            </p>
            <Button variant="outline">Voir le cas complet</Button>
          </div>
        ))}
      </div>
    </motion.section>

    {/* Témoignages */}
    <motion.section
      className="bg-gray-100 dark:bg-kofgo-gray-dark rounded-3xl py-16 px-8 mb-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-semibold text-center mb-8">Témoignages Clients</h2>
      <div className="space-y-8 max-w-3xl mx-auto">
        {[1,2].map(i => (
          <blockquote key={i} className="italic text-center text-lg text-muted-foreground">
            “KofGo Consulting a transformé notre stratégie, générant +35 % de croissance en 6 mois.” <br/>
            <span className="font-semibold">– Client Satisfait #{i}</span>
          </blockquote>
        ))}
      </div>
    </motion.section>

    {/* Offres & packs */}
    <motion.section
      className="max-w-4xl mx-auto mb-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-semibold text-center mb-8">Nos Formules</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {['Essentiel', 'Premium'].map((pack, idx) => (
          <div key={pack} className={`p-6 rounded-2xl border ${idx === 1 ? 'border-kofgo-blue shadow-lg' : 'border-gray-300'}`}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold">{pack}</span>
              {idx === 1 && <span className="text-sm bg-kofgo-blue text-white px-2 py-1 rounded">Best-seller</span>}
            </div>
            <ul className="mb-4 text-muted-foreground space-y-2">
              <li>Diagnostic & stratégie</li>
              <li>Plan opérationnel</li>
              {idx === 1 && <li>Pilotage hebdo</li>}
              <li>Reporting & KPIs</li>
              {idx === 1 && <li>Support 24/7</li>}
            </ul>
            <Button variant={idx === 1 ? 'primary' : 'outline'} fullWidth>
              Je choisis {pack}
            </Button>
          </div>
        ))}
      </div>
    </motion.section>

    {/* CTA final */}
    <motion.section
      className="bg-kofgo-blue text-white rounded-3xl py-16 px-8 text-center mb-32"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-bold mb-4">Prêt à propulser votre entreprise ?</h2>
      <p className="text-lg mb-6">
        Contactez-nous pour une session découverte offerte et bâtissons ensemble votre feuille de route gagnante.
      </p>
      <Button size="lg" variant="secondary">
        Demander une consultation
      </Button>
    </motion.section>
  </div>
);

export default ServicesPage;
