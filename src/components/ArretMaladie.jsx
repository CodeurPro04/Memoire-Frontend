// components/ArretMaladie.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Save,
  Calendar,
  User,
  FileText,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

const ArretMaladie = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [formData, setFormData] = useState({
    date_debut: '',
    date_fin: '',
    duree_jours: '',
    motif: '',
    diagnostic: '',
    recommandations: '',
    renouvelable: false,
    date_visite_controle: ''
  });

  useEffect(() => {
    fetchAppointmentData();
  }, [appointmentId]);

  const fetchAppointmentData = async () => {
    try {
      const response = await api.get(`/medecin/appointments/${appointmentId}`);
      setAppointment(response.data);
      
      // Pré-remplir la date de début avec la date du rendez-vous
      const appointmentDate = new Date(response.data.date);
      setFormData(prev => ({
        ...prev,
        date_debut: appointmentDate.toISOString().split('T')[0]
      }));
    } catch (error) {
      console.error('Erreur chargement rendez-vous:', error);
      toast.error('Erreur lors du chargement des données du rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  const calculateDuree = () => {
    if (formData.date_debut && formData.date_fin) {
      const start = new Date(formData.date_debut);
      const end = new Date(formData.date_fin);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setFormData(prev => ({ ...prev, duree_jours: diffDays.toString() }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.date_debut) {
      toast.error('La date de début est obligatoire');
      return false;
    }
    if (!formData.date_fin) {
      toast.error('La date de fin est obligatoire');
      return false;
    }
    if (!formData.motif) {
      toast.error('Le motif est obligatoire');
      return false;
    }
    if (!formData.diagnostic) {
      toast.error('Le diagnostic est obligatoire');
      return false;
    }
    
    const start = new Date(formData.date_debut);
    const end = new Date(formData.date_fin);
    if (end <= start) {
      toast.error('La date de fin doit être après la date de début');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSaving(true);
      
      const arretMaladieData = {
        appointment_id: appointmentId,
        patient_id: appointment.patient_id,
        medecin_id: appointment.medecin_id,
        ...formData,
        duree_jours: parseInt(formData.duree_jours),
        statut: 'actif'
      };

      await api.post('/medecin/arrets-maladie', arretMaladieData);
      
      toast.success('Arrêt de maladie créé avec succès');
      navigate(`/medecin/appointments`);
      
    } catch (error) {
      console.error('Erreur création arrêt maladie:', error);
      toast.error('Erreur lors de la création de l\'arrêt de maladie');
    } finally {
      setSaving(false);
    }
  };

  const getApercuDateFin = () => {
    if (formData.date_debut && formData.duree_jours) {
      const start = new Date(formData.date_debut);
      const end = new Date(start);
      end.setDate(start.getDate() + parseInt(formData.duree_jours) - 1);
      return end.toISOString().split('T')[0];
    }
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Rendez-vous non trouvé</h2>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Créer un Arrêt de Maladie
            </h1>
            <p className="text-slate-600">
              Pour {appointment.patient_prenom} {appointment.patient_nom}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations Patient */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <User className="w-5 h-5 text-orange-500" />
                  Informations Patient
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label className="text-sm font-medium text-slate-500">Patient</Label>
                  <p className="font-semibold text-slate-800">
                    {appointment.patient_prenom} {appointment.patient_nom}
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-slate-500">Date de consultation</Label>
                  <p className="font-semibold text-slate-800">
                    {new Date(appointment.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-slate-500">Type de consultation</Label>
                  <Badge variant="outline" className="mt-1">
                    {appointment.consultation_type}
                  </Badge>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-slate-500">Médecin prescripteur</Label>
                  <p className="font-semibold text-slate-800">
                    Dr. Vous-même
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <FileText className="w-5 h-5 text-orange-500" />
                    Détails de l'Arrêt de Maladie
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Période */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date_debut">
                        Date de début <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="date_debut"
                        type="date"
                        value={formData.date_debut}
                        onChange={(e) => handleInputChange('date_debut', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="date_fin">
                        Date de fin <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="date_fin"
                        type="date"
                        value={formData.date_fin}
                        onChange={(e) => {
                          handleInputChange('date_fin', e.target.value);
                          calculateDuree();
                        }}
                        min={formData.date_debut}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="duree_jours">Durée (jours)</Label>
                      <Input
                        id="duree_jours"
                        type="number"
                        min="1"
                        value={formData.duree_jours}
                        onChange={(e) => handleInputChange('duree_jours', e.target.value)}
                        placeholder="Calculé automatiquement"
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Motif et Diagnostic */}
                  <div className="space-y-2">
                    <Label htmlFor="motif">
                      Motif de l'arrêt <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="motif"
                      value={formData.motif}
                      onChange={(e) => handleInputChange('motif', e.target.value)}
                      placeholder="Décrivez le motif de l'arrêt de travail..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diagnostic">
                      Diagnostic <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="diagnostic"
                      value={formData.diagnostic}
                      onChange={(e) => handleInputChange('diagnostic', e.target.value)}
                      placeholder="Indiquez le diagnostic médical..."
                      rows={3}
                      required
                    />
                  </div>

                  {/* Recommandations */}
                  <div className="space-y-2">
                    <Label htmlFor="recommandations">Recommandations</Label>
                    <Textarea
                      id="recommandations"
                      value={formData.recommandations}
                      onChange={(e) => handleInputChange('recommandations', e.target.value)}
                      placeholder="Recommandations particulières pour le patient..."
                      rows={3}
                    />
                  </div>

                  {/* Options supplémentaires */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="renouvelable"
                          checked={formData.renouvelable}
                          onChange={(e) => handleInputChange('renouvelable', e.target.checked)}
                          className="rounded border-slate-300"
                        />
                        <Label htmlFor="renouvelable" className="text-sm">
                          Arrêt renouvelable
                        </Label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="date_visite_controle">Date de visite de contrôle</Label>
                      <Input
                        id="date_visite_controle"
                        type="date"
                        value={formData.date_visite_controle}
                        onChange={(e) => handleInputChange('date_visite_controle', e.target.value)}
                        min={formData.date_fin}
                      />
                    </div>
                  </div>

                  {/* Aperçu */}
                  {formData.date_debut && formData.date_fin && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="pt-4">
                        <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Aperçu de l'arrêt
                        </h4>
                        <div className="text-sm text-blue-700 space-y-1">
                          <p>
                            <strong>Période:</strong> du {new Date(formData.date_debut).toLocaleDateString('fr-FR')} au {new Date(formData.date_fin).toLocaleDateString('fr-FR')}
                          </p>
                          <p>
                            <strong>Durée:</strong> {formData.duree_jours} jour(s)
                          </p>
                          <p>
                            <strong>Statut:</strong> {formData.renouvelable ? 'Renouvelable' : 'Standard'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={saving}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Création...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Créer l'arrêt de maladie
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArretMaladie;