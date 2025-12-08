// components/DossierMedical.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Calendar,
  FileText,
  Activity,
  AlertCircle,
  Pill,
  Stethoscope,
  ArrowLeft,
  Download,
  Printer,
  Share2,
  Heart,
  Droplets,
  Scale,
  Thermometer,
  Eye
} from 'lucide-react';

const DossierMedical = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [antecedents, setAntecedents] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [ordonnances, setOrdonnances] = useState([]);
  const [examens, setExamens] = useState([]);

  const fetchDossierMedical = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/medecin/dossier-medical/${patientId}`);
      const data = response.data;
      
      setPatient(data.patient);
      setAntecedents(data.antecedents || []);
      setConsultations(data.consultations || []);
      setOrdonnances(data.ordonnances || []);
      setExamens(data.examens || []);
    } catch (error) {
      console.error('Erreur chargement dossier médical:', error);
      toast.error('Erreur lors du chargement du dossier médical');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchDossierMedical();
  }, [fetchDossierMedical]);

  const calculateAge = (dateNaissance) => {
    if (!dateNaissance) return 'Non renseigné';
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} ans`;
  };

  const exportPDF = () => {
    toast.info('Fonctionnalité d\'export PDF en cours de développement');
  };

  const printDossier = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement du dossier médical...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Dossier non trouvé</h2>
          <p className="text-slate-600 mb-4">Le dossier médical demandé n'a pas été trouvé.</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 print:bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 print:mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="print:hidden"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Dossier Médical
              </h1>
              <p className="text-slate-600">
                Patient: {patient.prenom} {patient.nom}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 print:hidden">
            <Button variant="outline" onClick={exportPDF}>
              <Download className="w-4 h-4 mr-2" />
              Exporter PDF
            </Button>
            <Button variant="outline" onClick={printDossier}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
            <Button>
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
          </div>
        </div>

        {/* Informations Patient */}
        <Card className="mb-8 print:shadow-none print:border">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 print:bg-white">
            <CardTitle className="flex items-center gap-3 text-slate-800">
              <User className="w-5 h-5 text-blue-500" />
              Informations Patient
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">Nom complet</label>
                <p className="text-lg font-semibold text-slate-800">
                  {patient.prenom} {patient.nom}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">Date de naissance</label>
                <p className="text-lg font-semibold text-slate-800">
                  {patient.date_naissance ? new Date(patient.date_naissance).toLocaleDateString('fr-FR') : 'Non renseignée'}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">Âge</label>
                <p className="text-lg font-semibold text-slate-800">
                  {calculateAge(patient.date_naissance)}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">Groupe sanguin</label>
                <p className="text-lg font-semibold text-slate-800">
                  {patient.groupe_sanguin || 'Non renseigné'}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">Téléphone</label>
                <p className="text-lg font-semibold text-slate-800">
                  {patient.telephone || 'Non renseigné'}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">Email</label>
                <p className="text-lg font-semibold text-slate-800">
                  {patient.email || 'Non renseigné'}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500">Adresse</label>
                <p className="text-lg font-semibold text-slate-800">
                  {patient.address || 'Non renseignée'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Onglets */}
        <Tabs defaultValue="antecedents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 print:hidden">
            <TabsTrigger value="antecedents" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Antécédents
            </TabsTrigger>
            <TabsTrigger value="consultations" className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              Consultations
            </TabsTrigger>
            <TabsTrigger value="ordonnances" className="flex items-center gap-2">
              <Pill className="w-4 h-4" />
              Ordonnances
            </TabsTrigger>
            <TabsTrigger value="examens" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Examens
            </TabsTrigger>
          </TabsList>

          {/* Antécédents */}
          <TabsContent value="antecedents">
            <Card className="print:shadow-none print:border">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 print:bg-white">
                <CardTitle className="flex items-center gap-3 text-slate-800">
                  <Activity className="w-5 h-5 text-amber-500" />
                  Antécédents Médicaux
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {antecedents.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>Aucun antécédent médical enregistré</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {antecedents.map((antecedent, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-slate-800">{antecedent.type}</h4>
                          <Badge variant="outline">
                            {new Date(antecedent.date_diagnostic).toLocaleDateString('fr-FR')}
                          </Badge>
                        </div>
                        <p className="text-slate-600 mb-2">{antecedent.description}</p>
                        {antecedent.traitement && (
                          <p className="text-sm text-slate-500">
                            <strong>Traitement:</strong> {antecedent.traitement}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Consultations */}
          <TabsContent value="consultations">
            <Card className="print:shadow-none print:border">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 print:bg-white">
                <CardTitle className="flex items-center gap-3 text-slate-800">
                  <Stethoscope className="w-5 h-5 text-green-500" />
                  Historique des Consultations
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {consultations.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>Aucune consultation enregistrée</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {consultations.map((consultation) => (
                      <div key={consultation.id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-slate-800">
                              Consultation du {new Date(consultation.date).toLocaleDateString('fr-FR')}
                            </h4>
                            <p className="text-slate-600">{consultation.type}</p>
                          </div>
                          <Badge>
                            {consultation.statut}
                          </Badge>
                        </div>
                        
                        {consultation.motif && (
                          <div className="mb-3">
                            <strong className="text-slate-700">Motif:</strong>
                            <p className="text-slate-600">{consultation.motif}</p>
                          </div>
                        )}
                        
                        {consultation.diagnostic && (
                          <div className="mb-3">
                            <strong className="text-slate-700">Diagnostic:</strong>
                            <p className="text-slate-600">{consultation.diagnostic}</p>
                          </div>
                        )}
                        
                        {consultation.traitement && (
                          <div>
                            <strong className="text-slate-700">Traitement prescrit:</strong>
                            <p className="text-slate-600">{consultation.traitement}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ordonnances */}
          <TabsContent value="ordonnances">
            <Card className="print:shadow-none print:border">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 print:bg-white">
                <CardTitle className="flex items-center gap-3 text-slate-800">
                  <Pill className="w-5 h-5 text-blue-500" />
                  Ordonnances
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {ordonnances.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>Aucune ordonnance enregistrée</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {ordonnances.map((ordonnance) => (
                      <div key={ordonnance.id} className="border border-slate-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-slate-800 text-lg">
                              Ordonnance du {new Date(ordonnance.date_prescription).toLocaleDateString('fr-FR')}
                            </h4>
                            <p className="text-slate-600">Par Dr. {ordonnance.medecin_prenom} {ordonnance.medecin_nom}</p>
                          </div>
                          <Badge variant="outline">
                            Valide jusqu'au {new Date(ordonnance.date_validite).toLocaleDateString('fr-FR')}
                          </Badge>
                        </div>
                        
                        {ordonnance.medicaments && ordonnance.medicaments.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-semibold text-slate-700 mb-2">Médicaments prescrits:</h5>
                            <div className="space-y-2">
                              {ordonnance.medicaments.map((medicament, index) => (
                                <div key={index} className="flex justify-between items-center py-2 border-b border-slate-100">
                                  <div>
                                    <p className="font-medium text-slate-800">{medicament.nom}</p>
                                    <p className="text-sm text-slate-600">
                                      {medicament.posologie} - {medicament.duree}
                                    </p>
                                  </div>
                                  <Badge variant="secondary">
                                    {medicament.quantite}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {ordonnance.instructions && (
                          <div>
                            <h5 className="font-semibold text-slate-700 mb-2">Instructions:</h5>
                            <p className="text-slate-600">{ordonnance.instructions}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Examens */}
          <TabsContent value="examens">
            <Card className="print:shadow-none print:border">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 print:bg-white">
                <CardTitle className="flex items-center gap-3 text-slate-800">
                  <FileText className="w-5 h-5 text-purple-500" />
                  Examens et Résultats
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {examens.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>Aucun examen enregistré</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {examens.map((examen) => (
                      <div key={examen.id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-slate-800">{examen.type}</h4>
                            <p className="text-slate-600">
                              Prescrit le {new Date(examen.date_prescription).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <Badge variant={examen.statut === 'terminé' ? 'default' : 'secondary'}>
                            {examen.statut}
                          </Badge>
                        </div>
                        
                        {examen.resultat && (
                          <div className="mb-3">
                            <strong className="text-slate-700">Résultat:</strong>
                            <p className="text-slate-600">{examen.resultat}</p>
                          </div>
                        )}
                        
                        {examen.observations && (
                          <div>
                            <strong className="text-slate-700">Observations:</strong>
                            <p className="text-slate-600">{examen.observations}</p>
                          </div>
                        )}
                        
                        {examen.fichier_joint && (
                          <div className="mt-3">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              Voir le fichier joint
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Styles pour l'impression */}
      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:bg-white {
            background: white !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border {
            border: 1px solid #e2e8f0 !important;
          }
          .print\\:mb-4 {
            margin-bottom: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DossierMedical;