// components/Ordonnance.jsx
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
  Plus,
  Trash2,
  User,
  Pill,
  FileText,
  Calendar,
  AlertTriangle
} from 'lucide-react';

const Ordonnance = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [medicaments, setMedicaments] = useState([]);
  const [formData, setFormData] = useState({
    date_validite: '',
    instructions: '',
    renouvellements: 0
  });

  useEffect(() => {
    fetchAppointmentData();
    
    // Définir la date de validité par défaut (15 jours)
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 15);
    setFormData(prev => ({
      ...prev,
      date_validite: defaultDate.toISOString().split('T')[0]
    }));
  }, [appointmentId]);

  const fetchAppointmentData = async () => {
    try {
      const response = await api.get(`/medecin/appointments/${appointmentId}`);
      setAppointment(response.data);
    } catch (error) {
      console.error('Erreur chargement rendez-vous:', error);
      toast.error('Erreur lors du chargement des données du rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  const addMedicament = () => {
    setMedicaments(prev => [...prev, {
      id: Date.now(),
      nom: '',
      dosage: '',
      posologie: '',
      duree: '',
      quantite: '',
      instructions: ''
    }]);
  };

  const updateMedicament = (id, field, value) => {
    setMedicaments(prev => 
      prev.map(med => 
        med.id === id ? { ...med, [field]: value } : med
      )
    );
  };

  const removeMedicament = (id) => {
    setMedicaments(prev => prev.filter(med => med.id !== id));
  };

  const validateForm = () => {
    if (!formData.date_validite) {
      toast.error('La date de validité est obligatoire');
      return false;
    }

    if (medicaments.length === 0) {
      toast.error('Au moins un médicament doit être ajouté');
      return false;
    }

    for (const med of medicaments) {
      if (!med.nom || !med.dosage || !med.posologie || !med.duree || !med.quantite) {
        toast.error('Tous les champs sont obligatoires pour chaque médicament');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSaving(true);
      
      const ordonnanceData = {
        appointment_id: appointmentId,
        patient_id: appointment.patient_id,
        medecin_id: appointment.medecin_id,
        ...formData,
        medicaments: medicaments,
        date_prescription: new Date().toISOString().split('T')[0]
      };

      await api.post('/medecin/ordonnances', ordonnanceData);
      
      toast.success('Ordonnance créée avec succès');
      navigate(`/medecin/appointments`);
      
    } catch (error) {
      console.error('Erreur création ordonnance:', error);
      toast.error('Erreur lors de la création de l\'ordonnance');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
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
              Créer une Ordonnance
            </h1>
            <p className="text-slate-600">
              Pour {appointment.patient_prenom} {appointment.patient_nom}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Informations Patient */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <User className="w-5 h-5 text-blue-500" />
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

                {appointment.patient_allergies && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <Label className="text-sm font-medium text-amber-700">Allergies connues</Label>
                    <p className="text-sm text-amber-600 mt-1">
                      {appointment.patient_allergies}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* En-tête de l'ordonnance */}
                <Card>
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <FileText className="w-5 h-5 text-blue-500" />
                      En-tête de l'Ordonnance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date_validite">
                          Date de validité <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="date_validite"
                          type="date"
                          value={formData.date_validite}
                          onChange={(e) => setFormData(prev => ({ ...prev, date_validite: e.target.value }))}
                          required
                        />
                        <p className="text-xs text-slate-500">
                          Date jusqu'à laquelle l'ordonnance est valable
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="renouvellements">Nombre de renouvellements</Label>
                        <Input
                          id="renouvellements"
                          type="number"
                          min="0"
                          max="12"
                          value={formData.renouvellements}
                          onChange={(e) => setFormData(prev => ({ ...prev, renouvellements: parseInt(e.target.value) || 0 }))}
                        />
                        <p className="text-xs text-slate-500">
                          Nombre de fois où l'ordonnance peut être renouvelée
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Médicaments */}
                <Card>
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2 text-slate-800">
                        <Pill className="w-5 h-5 text-blue-500" />
                        Médicaments Prescrits
                      </CardTitle>
                      <Button
                        type="button"
                        onClick={addMedicament}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter un médicament
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {medicaments.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <Pill className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p>Aucun médicament ajouté</p>
                        <p className="text-sm">Cliquez sur "Ajouter un médicament" pour commencer</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {medicaments.map((medicament, index) => (
                          <div key={medicament.id} className="border border-slate-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-semibold text-slate-800">
                                Médicament #{index + 1}
                              </h4>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeMedicament(medicament.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Nom du médicament *</Label>
                                <Input
                                  value={medicament.nom}
                                  onChange={(e) => updateMedicament(medicament.id, 'nom', e.target.value)}
                                  placeholder="Paracétamol, Amoxicilline..."
                                  required
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Dosage *</Label>
                                <Input
                                  value={medicament.dosage}
                                  onChange={(e) => updateMedicament(medicament.id, 'dosage', e.target.value)}
                                  placeholder="500mg, 1g..."
                                  required
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Posologie *</Label>
                                <Input
                                  value={medicament.posologie}
                                  onChange={(e) => updateMedicament(medicament.id, 'posologie', e.target.value)}
                                  placeholder="1 comprimé 3 fois par jour..."
                                  required
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Durée du traitement *</Label>
                                <Input
                                  value={medicament.duree}
                                  onChange={(e) => updateMedicament(medicament.id, 'duree', e.target.value)}
                                  placeholder="7 jours, 1 mois..."
                                  required
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Quantité *</Label>
                                <Input
                                  value={medicament.quantite}
                                  onChange={(e) => updateMedicament(medicament.id, 'quantite', e.target.value)}
                                  placeholder="20 comprimés, 1 flacon..."
                                  required
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Instructions particulières</Label>
                                <Input
                                  value={medicament.instructions}
                                  onChange={(e) => updateMedicament(medicament.id, 'instructions', e.target.value)}
                                  placeholder="À prendre pendant les repas..."
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Instructions générales */}
                <Card>
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <FileText className="w-5 h-5 text-blue-500" />
                      Instructions Générales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="instructions">Instructions et recommandations</Label>
                      <Textarea
                        id="instructions"
                        value={formData.instructions}
                        onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                        placeholder="Instructions particulières pour le patient concernant la prise des médicaments..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Aperçu */}
                {medicaments.length > 0 && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Aperçu de l'ordonnance
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-700">Nombre de médicaments:</span>
                          <span className="font-semibold">{medicaments.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-green-700">Validité:</span>
                          <span className="font-semibold">
                            jusqu'au {new Date(formData.date_validite).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        {formData.renouvellements > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-green-700">Renouvellements:</span>
                            <span className="font-semibold">{formData.renouvellements} fois</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3">
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
                    disabled={saving || medicaments.length === 0}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Création...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Créer l'ordonnance
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ordonnance;