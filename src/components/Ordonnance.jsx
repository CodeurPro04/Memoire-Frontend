import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  User,
  Pill,
  FileText,
  Calendar,
  AlertTriangle,
  Stethoscope,
  Shield,
  Zap,
  Stamp,
  CreditCard,
  CheckCircle,
  Printer,
  ClipboardCheck,
  PenTool,
} from "lucide-react";

const Ordonnance = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [medicaments, setMedicaments] = useState([]);
  const [formData, setFormData] = useState({
    date_validite: "",
    instructions: "",
    renouvellements: 0,
    avec_cachet: true,
    bon_assurance: false,
    numero_carte_assurance: "",
    organisme_assurance: "",
  });

  // -------------------------------------------------------------
  // COMPONENT STYLE INPUT (STYLE MÉDICAL PROFESSIONNEL)
  // -------------------------------------------------------------
  const InputMedical = ({ label, value, onChange, placeholder, required = false }) => (
    <div className="space-y-2">
      <Label className="text-gray-700 font-medium tracking-wide text-sm flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white border-2 border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-300 rounded-lg py-5 text-base placeholder:text-gray-400"
      />
    </div>
  );

  // -------------------------------------------------------------
  // LOAD APPOINTMENT + DEFAULT DATE
  // -------------------------------------------------------------
  useEffect(() => {
    fetchAppointmentData();

    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 15);
    setFormData((prev) => ({
      ...prev,
      date_validite: defaultDate.toISOString().split("T")[0],
    }));
  }, [appointmentId]);

  const fetchAppointmentData = async () => {
    try {
      const response = await api.get(`/medecin/appointments/${appointmentId}`);
      setAppointment(response.data);
    } catch (error) {
      toast.error("Erreur lors du chargement du rendez-vous");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // MEDICAMENTS FUNCTIONS
  // -------------------------------------------------------------
  const addMedicament = () => {
    setMedicaments((prev) => [
      ...prev,
      {
        id: Date.now(),
        nom: "",
        dosage: "",
        posologie: "",
        duree: "",
        quantite: "",
        instructions: "",
      },
    ]);
  };

  const updateMedicament = (id, field, value) => {
    setMedicaments((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const removeMedicament = (id) => {
    setMedicaments((prev) => prev.filter((m) => m.id !== id));
  };

  const validateForm = () => {
    if (!formData.date_validite) {
      toast.error("La date de validité est obligatoire");
      return false;
    }

    if (medicaments.length === 0) {
      toast.error("Ajoutez au moins un médicament");
      return false;
    }

    for (const med of medicaments) {
      if (
        !med.nom ||
        !med.dosage ||
        !med.posologie ||
        !med.duree ||
        !med.quantite
      ) {
        toast.error("Tous les champs sont obligatoires pour chaque médicament");
        return false;
      }
    }

    if (formData.bon_assurance && !formData.numero_carte_assurance) {
      toast.error("Le numéro de carte d'assurance est requis");
      return false;
    }

    return true;
  };

  // -------------------------------------------------------------
  // SUBMIT
  // -------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);

      const payload = {
        appointment_id: appointmentId,
        patient_id: appointment.patient_id,
        medecin_id: appointment.medecin_id,
        ...formData,
        medicaments,
        date_prescription: new Date().toISOString().split("T")[0],
      };

      await api.post("/medecin/ordonnances", payload);

      toast.success("Ordonnance créée avec succès");
      navigate("/medecin/appointments");
    } catch (error) {
      toast.error("Erreur lors de la création de l'ordonnance");
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------
  // LOADING + ERROR
  // -------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-32 h-32 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-32 h-32 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-32 h-32 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" style={{animationDelay: '0.2s'}}></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-800">Chargement des données médicales</p>
            <p className="text-sm text-gray-600">Préparation de l'interface d'ordonnance...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-rose-50">
        <div className="text-center max-w-lg space-y-8">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <AlertTriangle className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -inset-6 border-4 border-rose-200 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-gray-900">Rendez-vous introuvable</h2>
            <p className="text-gray-600 text-lg">
              Les informations de consultation ne sont pas disponibles ou ont expiré.
            </p>
          </div>
          <Button 
            className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white px-10 py-7 rounded-xl shadow-xl transition-all duration-300 hover:scale-105 text-lg font-semibold"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-6 h-6 mr-3" /> 
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50/30 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER PROFESSIONNEL */}
        <div className="mb-12 space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-3 text-gray-700 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50 px-5 py-4 rounded-xl transition-all duration-300 group border-2"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Retour
            </Button>

            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
                  <Stethoscope className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Ordonnance Médicale
                  </h1>
                  <p className="text-gray-600 mt-2 flex items-center gap-2">
                    <span className="font-medium">Patient :</span>
                    <span className="text-blue-700 font-semibold bg-blue-50 px-3 py-1.5 rounded-lg">
                      {appointment.patient_prenom} {appointment.patient_nom}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="text-sm text-gray-500">
                      Consultation du {new Date(appointment.date).toLocaleDateString("fr-FR")}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-transparent via-blue-200 to-transparent h-0.5" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* SIDEBAR PATIENT - INFORMATIONS ESSENTIELLES */}
          <aside className="lg:col-span-1 space-y-8">
            <Card className="border-2 border-gray-100 shadow-lg rounded-2xl bg-white overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500"></div>
              
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-gray-900">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-700" />
                  </div>
                  <span className="text-lg font-bold">Dossier Patient</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-7">
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs uppercase tracking-wide text-gray-500 font-semibold block mb-2">
                      Identité du patient
                    </Label>
                    <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100">
                      <p className="text-lg font-bold text-gray-900">
                        {appointment.patient_prenom} {appointment.patient_nom}
                      </p>
                      {}
                      <p className="text-sm text-gray-600 mt-1">
                        Phone: {appointment.patient_telephone}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Adresse: {appointment.patient_address}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs uppercase tracking-wide text-gray-500 font-semibold block mb-2">
                      Détails de la consultation
                    </Label>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(appointment.date).toLocaleDateString("fr-FR", {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(appointment.date).toLocaleTimeString("fr-FR", {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0 px-4 py-2 font-semibold text-sm">
                          {appointment.consultation_type}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Type de consultation
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {appointment.patient_allergies && (
                  <div className="bg-gradient-to-br from-rose-50/80 to-pink-50/80 border-2 border-rose-200 rounded-xl p-5 space-y-3">
                    <Label className="text-rose-700 font-bold flex items-center gap-3">
                      <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                      </div>
                      Allergies Signalées
                    </Label>
                    <div className="bg-white/70 p-3 rounded-lg border border-rose-100">
                      <p className="text-sm text-rose-800 font-medium">
                        {appointment.patient_allergies}
                      </p>
                    </div>
                    <p className="text-xs text-rose-600">
                      ⚠️ À prendre en compte dans la prescription
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Statut de l'ordonnance</span>
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                      En cours de rédaction
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SECTION CACHET ET SIGNATURE */}
            <Card className="border-2 border-gray-100 shadow-lg rounded-2xl bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-gray-900">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center">
                    <Stamp className="w-5 h-5 text-purple-700" />
                  </div>
                  <span className="text-base font-bold">Validation Médicale</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-700">
                        Apposer le cachet
                      </Label>
                      <p className="text-xs text-gray-500">
                        Confirme l'authenticité
                      </p>
                    </div>
                    <Switch
                      checked={formData.avec_cachet}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, avec_cachet: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-700">
                        Signature électronique
                      </Label>
                      <p className="text-xs text-gray-500">
                        Dr. {appointment.medecin_nom || "Médecin"}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                      <PenTool className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </div>

                {formData.avec_cachet && (
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-purple-700" />
                      </div>
                      <span className="text-sm font-semibold text-purple-800">
                        Cachet médical activé
                      </span>
                    </div>
                    <p className="text-xs text-purple-700">
                      Un cachet officiel sera apposé automatiquement sur l'ordonnance validée.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* FORMULAIRE PRINCIPAL */}
          <main className="lg:col-span-3 space-y-10">
            <form onSubmit={handleSubmit} className="space-y-10">

              {/* SECTION ASSURANCE */}
              <Card className="border-2 border-gray-100 shadow-xl rounded-2xl bg-white overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100 py-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-gray-900">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-blue-700" />
                      </div>
                      <div>
                        <span className="text-xl font-bold">Couverture Assurance</span>
                        <p className="text-sm text-gray-600 font-normal mt-1">
                          Informations pour la prise en charge
                        </p>
                      </div>
                    </CardTitle>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={formData.bon_assurance}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, bon_assurance: checked })
                          }
                        />
                        <Label className="text-sm font-medium text-gray-700">
                          Générer un bon
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-8">
                  {formData.bon_assurance ? (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-700" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">Bon d'Assurance Activé</h4>
                            <p className="text-sm text-gray-600">
                              Le patient bénéficie d'une prise en charge
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                              Numéro de carte d'assurance *
                            </Label>
                            <Input
                              value={formData.numero_carte_assurance}
                              onChange={(e) =>
                                setFormData({ ...formData, numero_carte_assurance: e.target.value })
                              }
                              placeholder="Ex: 123456789012"
                              className="border-2 border-gray-200 focus:border-green-500 rounded-xl py-5"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                              Organisme d'assurance
                            </Label>
                            <Input
                              value={formData.organisme_assurance}
                              onChange={(e) =>
                                setFormData({ ...formData, organisme_assurance: e.target.value })
                              }
                              placeholder="Ex: CPAM, MSA, Mutuelle..."
                              className="border-2 border-gray-200 focus:border-green-500 rounded-xl py-5"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-white border border-green-100 rounded-xl">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Note :</span> Ce bon permettra au patient de bénéficier 
                            d'une prise en charge par son organisme d'assurance pour les médicaments prescrits.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-10 h-10 text-gray-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">
                        Aucun bon d'assurance demandé
                      </h4>
                      <p className="text-gray-500 max-w-md mx-auto">
                        Activez cette option si le patient souhaite générer un bon pour sa prise en charge.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* INFORMATIONS ORDONNANCE */}
              <Card className="border-2 border-gray-100 shadow-xl rounded-2xl bg-white overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-100 py-6">
                  <CardTitle className="flex items-center gap-3 text-gray-900">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-700" />
                    </div>
                    <div>
                      <span className="text-xl font-bold">Paramètres de l'Ordonnance</span>
                      <p className="text-sm text-gray-600 font-normal mt-1">
                        Définir la validité et les renouvellements
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-gray-700 font-semibold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Date de validité *
                      </Label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={formData.date_validite}
                          onChange={(e) =>
                            setFormData({ ...formData, date_validite: e.target.value })
                          }
                          className="bg-white border-2 border-gray-200 focus:border-blue-600 rounded-xl py-6 text-lg font-medium shadow-sm pl-12"
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        L'ordonnance sera valable jusqu'à cette date
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-gray-700 font-semibold flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-600" />
                        Nombre de renouvellements
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          min="0"
                          max="12"
                          value={formData.renouvellements}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              renouvellements: parseInt(e.target.value) || 0,
                            })
                          }
                          className="bg-white border-2 border-gray-200 focus:border-amber-500 rounded-xl py-6 text-lg font-medium shadow-sm pl-12"
                          placeholder="0"
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Zap className="w-4 h-4 text-amber-600" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Nombre d'autorisations de renouvellement
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* PRESCRIPTION MÉDICALE */}
              <Card className="border-2 border-gray-100 shadow-xl rounded-2xl bg-white overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-gray-100 py-6">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-3 text-gray-900">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center">
                        <Pill className="w-7 h-7 text-cyan-700" />
                      </div>
                      <div>
                        <span className="text-xl font-bold">Prescription Médicale</span>
                        <p className="text-sm text-gray-600 font-normal mt-1">
                          Détail des médicaments et traitements
                        </p>
                      </div>
                    </CardTitle>

                    <Button
                      onClick={addMedicament}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-5 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
                    >
                      <Plus className="w-5 h-5 mr-2" /> 
                      Nouveau Médicament
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-8">
                  {medicaments.length === 0 ? (
                    <div className="text-center py-16 space-y-6">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-blue-200">
                        <Pill className="w-16 h-16 text-blue-300" />
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-2xl font-semibold text-gray-700">
                          Aucun médicament prescrit
                        </h4>
                        <p className="text-gray-500 max-w-md mx-auto text-lg">
                          Commencez par ajouter le premier médicament à la prescription
                        </p>
                      </div>
                      <Button
                        onClick={addMedicament}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-6 px-8 rounded-xl shadow-lg text-lg"
                      >
                        <Plus className="w-6 h-6 mr-3" /> 
                        Ajouter un premier médicament
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {medicaments.map((m, i) => (
                        <div
                          key={m.id}
                          className="border-2 border-gray-100 rounded-2xl p-8 bg-gradient-to-br from-white to-blue-50/30 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-blue-200 group"
                        >
                          <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xl">{i + 1}</span>
                              </div>
                              <div>
                                <h4 className="text-xl font-bold text-gray-900">
                                  Médicament #{i + 1}
                                </h4>
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                  <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    <span>Renseignez tous les champs obligatoires</span>
                                  </span>
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-500 rounded-xl transition-all duration-300 p-3"
                              onClick={() => removeMedicament(m.id)}
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="md:col-span-2 lg:col-span-3">
                              <InputMedical
                                label="Nom du médicament"
                                value={m.nom}
                                placeholder="Ex : Amoxicilline, Paracétamol, Ibuprofène..."
                                onChange={(v) => updateMedicament(m.id, "nom", v)}
                                required={true}
                              />
                            </div>

                            <InputMedical
                              label="Dosage"
                              value={m.dosage}
                              placeholder="500 mg, 1000 UI, 20 mg/ml..."
                              onChange={(v) => updateMedicament(m.id, "dosage", v)}
                              required={true}
                            />

                            <InputMedical
                              label="Posologie"
                              value={m.posologie}
                              placeholder="1 comprimé 3x/jour, 2 pulvérisations matin et soir..."
                              onChange={(v) => updateMedicament(m.id, "posologie", v)}
                              required={true}
                            />

                            <InputMedical
                              label="Durée du traitement"
                              value={m.duree}
                              placeholder="7 jours, 1 mois, 10 jours..."
                              onChange={(v) => updateMedicament(m.id, "duree", v)}
                              required={true}
                            />

                            <InputMedical
                              label="Quantité prescrite"
                              value={m.quantite}
                              placeholder="1 boîte, 30 comprimés, 2 flacons..."
                              onChange={(v) => updateMedicament(m.id, "quantite", v)}
                              required={true}
                            />

                            <div className="md:col-span-2 lg:col-span-3">
                              <div className="space-y-2">
                                <Label className="text-gray-700 font-medium tracking-wide text-sm">
                                  Instructions particulières
                                </Label>
                                <Textarea
                                  value={m.instructions}
                                  placeholder="À prendre après les repas, éviter l'alcool, conservation au frigo, effets secondaires à surveiller..."
                                  onChange={(e) => updateMedicament(m.id, "instructions", e.target.value)}
                                  className="bg-white border-2 border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-300 rounded-xl py-4 text-base placeholder:text-gray-400 min-h-[120px]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* NOTES ET RECOMMANDATIONS */}
              <Card className="border-2 border-gray-100 shadow-xl rounded-2xl bg-white overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-gray-100 py-6">
                  <CardTitle className="flex items-center gap-3 text-gray-900">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-emerald-700" />
                    </div>
                    <div>
                      <span className="text-xl font-bold">Notes & Recommandations</span>
                      <p className="text-sm text-gray-600 font-normal mt-1">
                        Informations complémentaires pour le patient
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-8">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-gray-700 font-semibold text-lg">
                        Instructions médicales complémentaires
                      </Label>
                      <div className="bg-gradient-to-br from-emerald-50/50 to-green-50/50 border-2 border-emerald-100 rounded-xl p-4 mb-4">
                        <p className="text-sm text-emerald-800 flex items-center gap-2">
                          <ClipboardCheck className="w-4 h-4" />
                          Ces informations seront remises au patient avec l'ordonnance
                        </p>
                      </div>
                    </div>
                    
                    <Textarea
                      rows={6}
                      placeholder="Rédigez ici toutes les recommandations importantes : 
• Suivi médical à prévoir
• Effets secondaires à surveiller
• Contre-indications spécifiques
• Conseils hygiéno-diététiques
• Précautions particulières
• Contacts d'urgence en cas de problème..."
                      value={formData.instructions}
                      onChange={(e) =>
                        setFormData({ ...formData, instructions: e.target.value })
                      }
                      className="bg-white border-2 border-gray-200 focus:border-emerald-500 rounded-xl text-base min-h-[250px] shadow-sm focus:ring-2 focus:ring-emerald-100 transition-all duration-300 placeholder:text-gray-400 placeholder:text-sm"
                    />
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4">
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Ces notes apparaîtront en bas de l'ordonnance imprimée
                      </span>
                      <span>{formData.instructions.length} caractères</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ACTIONS FINALES */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-gray-100 rounded-2xl p-8 shadow-xl">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900">Finaliser l'ordonnance</h3>
                    <p className="text-gray-600">
                      {medicaments.length} médicament{medicaments.length > 1 ? 's' : ''} prescrit
                      {medicaments.length > 1 ? 's' : ''} • 
                      {formData.bon_assurance ? ' Avec bon d\'assurance' : ' Sans bon d\'assurance'} • 
                      {formData.avec_cachet ? ' Cachet activé' : ' Sans cachet'}
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <Button
                      variant="outline"
                      onClick={() => navigate(-1)}
                      className="px-8 py-6 rounded-xl border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300 text-base"
                    >
                      Annuler
                    </Button>
                    
                    <Button
                      type="submit"
                      disabled={saving || medicaments.length === 0}
                      className="px-10 py-6 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-800 hover:to-cyan-800 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                    >
                      {saving ? (
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Validation en cours...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Save className="w-6 h-6" />
                          <span>Enregistrer</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
                
                {medicaments.length === 0 && (
                  <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                    <p className="text-amber-800 font-medium flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Vous devez ajouter au moins un médicament avant de valider l'ordonnance.
                    </p>
                  </div>
                )}
              </div>
            </form>
          </main>
        </div>

        {/* FOOTER INFORMATIF */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Champs obligatoires *</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Informations patient</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Cette ordonnance est sécurisée et conforme aux normes médicales</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ordonnance;