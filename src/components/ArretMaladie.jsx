// components/ArretMaladie.jsx
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
  Calendar,
  User,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Shield,
  Bed,
  Clock,
  RefreshCw,
  ClipboardCheck,
  FileSignature,
  Thermometer,
  HeartPulse,
  Briefcase,
} from "lucide-react";

const ArretMaladie = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [formData, setFormData] = useState({
    date_debut: "",
    date_fin: "",
    duree_jours: "",
    motif: "",
    diagnostic: "",
    recommandations: "",
    renouvelable: false,
    date_visite_controle: "",
    avec_signature: true,
    motif_code: "",
    travail_adapte: false,
  });

  // -------------------------------------------------------------
  // COMPONENT STYLE INPUT (STYLE MÉDICAL PROFESSIONNEL)
  // -------------------------------------------------------------
  const InputMedical = ({
    label,
    value,
    onChange,
    placeholder,
    required = false,
    type = "text",
    icon: Icon,
  }) => (
    <div className="space-y-2">
      <Label className="text-gray-700 font-medium tracking-wide text-sm flex items-center gap-1">
        {Icon && <Icon className="w-4 h-4 text-amber-600" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-300 rounded-lg py-5 text-base placeholder:text-gray-400"
      />
    </div>
  );

  useEffect(() => {
    fetchAppointmentData();
  }, [appointmentId]);

  const fetchAppointmentData = async () => {
    try {
      const response = await api.get(`/medecin/appointments/${appointmentId}`);
      setAppointment(response.data);

      const appointmentDate = new Date(response.data.date);
      const defaultEndDate = new Date(appointmentDate);
      defaultEndDate.setDate(appointmentDate.getDate() + 14);

      setFormData((prev) => ({
        ...prev,
        date_debut: appointmentDate.toISOString().split("T")[0],
        date_fin: defaultEndDate.toISOString().split("T")[0],
        duree_jours: "15",
      }));
    } catch (error) {
      console.error("Erreur chargement rendez-vous:", error);
      toast.error("Erreur lors du chargement des données du rendez-vous");
    } finally {
      setLoading(false);
    }
  };

  const calculateDuree = (startDate, endDate) => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  };

  const handleInputChange = (field, value) => {
    const newData = { ...formData, [field]: value };

    if (field === "date_debut" || field === "date_fin") {
      const duree = calculateDuree(newData.date_debut, newData.date_fin);
      newData.duree_jours = duree > 0 ? duree.toString() : "";
    }

    if (field === "date_debut" && newData.date_fin) {
      const start = new Date(value);
      const end = new Date(newData.date_fin);
      if (end <= start) {
        const newEnd = new Date(start);
        newEnd.setDate(start.getDate() + 14);
        newData.date_fin = newEnd.toISOString().split("T")[0];
        newData.duree_jours = "15";
      }
    }

    setFormData(newData);
  };

  const validateForm = () => {
    if (!formData.date_debut) {
      toast.error("La date de début est obligatoire");
      return false;
    }
    if (!formData.date_fin) {
      toast.error("La date de fin est obligatoire");
      return false;
    }
    if (!formData.motif) {
      toast.error("Le motif est obligatoire");
      return false;
    }
    if (!formData.diagnostic) {
      toast.error("Le diagnostic est obligatoire");
      return false;
    }

    const start = new Date(formData.date_debut);
    const end = new Date(formData.date_fin);
    if (end <= start) {
      toast.error("La date de fin doit être après la date de début");
      return false;
    }

    const duree = calculateDuree(formData.date_debut, formData.date_fin);
    if (duree > 365) {
      toast.error("La durée ne peut excéder 365 jours");
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
        statut: "actif",
        date_creation: new Date().toISOString().split("T")[0],
      };

      await api.post("/medecin/arrets-maladie", arretMaladieData);

      toast.success("Arrêt de maladie créé avec succès");
      navigate(`/medecin/appointments`);
    } catch (error) {
      console.error("Erreur création arrêt maladie:", error);
      toast.error("Erreur lors de la création de l'arrêt de maladie");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-amber-50">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-32 h-32 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-32 h-32 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            <div
              className="absolute top-0 left-0 w-32 h-32 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-800">
              Chargement du dossier médical
            </p>
            <p className="text-sm text-gray-600">
              Préparation de l'arrêt maladie...
            </p>
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
            <h2 className="text-3xl font-bold text-gray-900">
              Rendez-vous introuvable
            </h2>
            <p className="text-gray-600 text-lg">
              Les informations de consultation ne sont pas disponibles ou ont
              expiré.
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

  const motifsCodes = [
    { code: "AT", label: "Accident du Travail" },
    { code: "MP", label: "Maladie Professionnelle" },
    { code: "MCO", label: "Maladie Courante" },
    { code: "MT", label: "Maternité" },
    { code: "APA", label: "Accident de Parcours" },
    { code: "CC", label: "Congé de Convalescence" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-amber-50/30 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER PROFESSIONNEL */}
        <div className="mb-12 space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center gap-3 text-gray-700 hover:text-amber-700 hover:border-amber-300 hover:bg-amber-50 px-5 py-4 rounded-xl transition-all duration-300 group border-2"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Retour
            </Button>

            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bed className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Arrêt de Maladie
                  </h1>
                  <p className="text-gray-600 mt-2 flex items-center gap-2">
                    <span className="font-medium">Pour :</span>
                    <span className="text-amber-700 font-semibold bg-amber-50 px-3 py-1.5 rounded-lg">
                      {appointment.patient_prenom} {appointment.patient_nom}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="text-sm text-gray-500">
                      Consultation du{" "}
                      {new Date(appointment.date).toLocaleDateString("fr-FR")}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-transparent via-amber-200 to-transparent h-0.5" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* SIDEBAR PATIENT - INFORMATIONS ESSENTIELLES */}
          <aside className="lg:col-span-1 space-y-8">
            <Card className="border-2 border-gray-100 shadow-lg rounded-2xl bg-white overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500"></div>

              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-gray-900">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-amber-700" />
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
                    <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-100">
                      <p className="text-lg font-bold text-gray-900">
                        {appointment.patient_prenom} {appointment.patient_nom}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        ID: {appointment.patient_id}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs uppercase tracking-wide text-gray-500 font-semibold block mb-2">
                      Détails de la consultation
                    </Label>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(appointment.date).toLocaleDateString(
                              "fr-FR",
                              {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(appointment.date).toLocaleTimeString(
                              "fr-FR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0 px-4 py-2 font-semibold text-sm">
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
                      ⚠️ À prendre en compte dans l'arrêt
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Statut de l'arrêt
                    </span>
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                      En cours de rédaction
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SECTION VALIDATION MÉDICALE */}
            <Card className="border-2 border-gray-100 shadow-lg rounded-2xl bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-gray-900">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg flex items-center justify-center">
                    <FileSignature className="w-5 h-5 text-emerald-700" />
                  </div>
                  <span className="text-base font-bold">
                    Validation Médicale
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-700">
                        Signature médicale
                      </Label>
                      <p className="text-xs text-gray-500">
                        Dr. {appointment.medecin_nom || "Médecin"}
                      </p>
                    </div>
                    <Switch
                      checked={formData.avec_signature}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, avec_signature: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-700">
                        Cachet officiel
                      </Label>
                      <p className="text-xs text-gray-500">Cachet du cabinet</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>
                </div>

                {formData.avec_signature && (
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-200 to-green-200 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      </div>
                      <span className="text-sm font-semibold text-emerald-800">
                        Signature médicale activée
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700">
                      La signature électronique sera apposée automatiquement.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* APERÇU RAPIDE */}
            {formData.date_debut && formData.date_fin && (
              <Card className="border-2 border-gray-100 shadow-lg rounded-2xl bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-gray-900">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                      <ClipboardCheck className="w-5 h-5 text-blue-700" />
                    </div>
                    <span className="text-base font-bold">Aperçu</span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Période</span>
                      <span className="font-semibold text-gray-900">
                        {calculateDuree(formData.date_debut, formData.date_fin)}{" "}
                        jours
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Du</span>
                      <span className="font-medium text-gray-800">
                        {new Date(formData.date_debut).toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Au</span>
                      <span className="font-medium text-gray-800">
                        {new Date(formData.date_fin).toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Type</span>
                      <Badge
                        className={
                          formData.renouvelable
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {formData.renouvelable ? "Renouvelable" : "Standard"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </aside>

          {/* FORMULAIRE PRINCIPAL */}
          <main className="lg:col-span-3 space-y-10">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* SECTION PÉRIODE D'ARRÊT */}
              <Card className="border-2 border-gray-100 shadow-xl rounded-2xl bg-white overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-gray-100 py-6">
                  <CardTitle className="flex items-center gap-3 text-gray-900">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-amber-700" />
                    </div>
                    <div>
                      <span className="text-xl font-bold">Période d'Arrêt</span>
                      <p className="text-sm text-gray-600 font-normal mt-1">
                        Définissez les dates de début et de fin
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <Label className="text-gray-700 font-semibold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-amber-600" />
                        Date de début *
                      </Label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={formData.date_debut}
                          onChange={(e) =>
                            handleInputChange("date_debut", e.target.value)
                          }
                          className="bg-white border-2 border-gray-200 focus:border-amber-600 rounded-xl py-6 text-lg font-medium shadow-sm pl-12"
                          required
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-amber-600" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Date à laquelle l'arrêt prend effet
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-gray-700 font-semibold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-amber-600" />
                        Date de fin *
                      </Label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={formData.date_fin}
                          onChange={(e) =>
                            handleInputChange("date_fin", e.target.value)
                          }
                          min={formData.date_debut}
                          className="bg-white border-2 border-gray-200 focus:border-amber-600 rounded-xl py-6 text-lg font-medium shadow-sm pl-12"
                          required
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-amber-600" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Date de reprise du travail
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-gray-700 font-semibold flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        Durée (jours)
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          min="1"
                          max="365"
                          value={formData.duree_jours}
                          readOnly
                          className="bg-gray-50 border-2 border-gray-200 rounded-xl py-6 text-lg font-medium shadow-sm pl-12 text-gray-700"
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Calculé automatiquement
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION MOTIF ET DIAGNOSTIC */}
              <Card className="border-2 border-gray-100 shadow-xl rounded-2xl bg-white overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-gray-100 py-6">
                  <CardTitle className="flex items-center gap-3 text-gray-900">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-orange-700" />
                    </div>
                    <div>
                      <span className="text-xl font-bold">
                        Motif & Diagnostic
                      </span>
                      <p className="text-sm text-gray-600 font-normal mt-1">
                        Informations médicales détaillées
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-gray-700 font-semibold flex items-center gap-2">
                        <Thermometer className="w-5 h-5 text-orange-600" />
                        Code motif *
                      </Label>
                      <div className="relative">
                        <select
                          value={formData.motif_code}
                          onChange={(e) =>
                            handleInputChange("motif_code", e.target.value)
                          }
                          className="w-full bg-white border-2 border-gray-200 focus:border-orange-600 rounded-xl py-5 px-4 text-base focus:ring-2 focus:ring-orange-100 transition-all duration-300 appearance-none"
                        >
                          <option value="">Sélectionnez un motif</option>
                          {motifsCodes.map((motif) => (
                            <option key={motif.code} value={motif.code}>
                              {motif.code} - {motif.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Thermometer className="w-4 h-4 text-orange-600" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Classification médicale standard
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-gray-700">
                            Arrêt renouvelable
                          </Label>
                          <p className="text-xs text-gray-500">
                            Peut être prolongé si nécessaire
                          </p>
                        </div>
                        <Switch
                          checked={formData.renouvelable}
                          onCheckedChange={(checked) =>
                            handleInputChange("renouvelable", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-gray-700">
                            Travail adapté possible
                          </Label>
                          <p className="text-xs text-gray-500">
                            Reprise progressive envisageable
                          </p>
                        </div>
                        <Switch
                          checked={formData.travail_adapte}
                          onCheckedChange={(checked) =>
                            handleInputChange("travail_adapte", checked)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-gray-700 font-semibold flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-red-600" />
                      Motif de l'arrêt *
                    </Label>
                    <Textarea
                      value={formData.motif}
                      onChange={(e) =>
                        handleInputChange("motif", e.target.value)
                      }
                      placeholder="Décrivez en détail le motif de l'arrêt de travail (symptômes, limitations fonctionnelles, etc.)..."
                      className="bg-white border-2 border-gray-200 focus:border-red-500 rounded-xl text-base min-h-[120px] shadow-sm focus:ring-2 focus:ring-red-100 transition-all duration-300 placeholder:text-gray-400"
                      required
                    />
                    <p className="text-sm text-gray-500">
                      Description précise et complète
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-gray-700 font-semibold flex items-center gap-2">
                      <HeartPulse className="w-5 h-5 text-emerald-600" />
                      Diagnostic médical *
                    </Label>
                    <Textarea
                      value={formData.diagnostic}
                      onChange={(e) =>
                        handleInputChange("diagnostic", e.target.value)
                      }
                      placeholder="Indiquez le diagnostic médical précis, codes CIM-10 si disponibles..."
                      className="bg-white border-2 border-gray-200 focus:border-emerald-500 rounded-xl text-base min-h-[120px] shadow-sm focus:ring-2 focus:ring-emerald-100 transition-all duration-300 placeholder:text-gray-400"
                      required
                    />
                    <p className="text-sm text-gray-500">
                      Diagnostic officiel avec précision médicale
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION RECOMMANDATIONS ET SUIVI */}
              <Card className="border-2 border-gray-100 shadow-xl rounded-2xl bg-white overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-gray-100 py-6">
                  <CardTitle className="flex items-center gap-3 text-gray-900">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center">
                      <ClipboardCheck className="w-6 h-6 text-emerald-700" />
                    </div>
                    <div>
                      <span className="text-xl font-bold">
                        Recommandations & Suivi
                      </span>
                      <p className="text-sm text-gray-600 font-normal mt-1">
                        Instructions pour le patient et suivi médical
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-8 space-y-8">
                  <div className="space-y-3">
                    <Label className="text-gray-700 font-semibold flex items-center gap-2">
                      <Shield className="w-5 h-5 text-emerald-600" />
                      Recommandations médicales
                    </Label>
                    <Textarea
                      value={formData.recommandations}
                      onChange={(e) =>
                        handleInputChange("recommandations", e.target.value)
                      }
                      placeholder="Indiquez les recommandations spécifiques pour le patient :
• Traitement à suivre
• Examens complémentaires nécessaires
• Restrictions particulières
• Précautions à prendre
• Conseils hygiéno-diététiques..."
                      className="bg-white border-2 border-gray-200 focus:border-emerald-500 rounded-xl text-base min-h-[150px] shadow-sm focus:ring-2 focus:ring-emerald-100 transition-all duration-300 placeholder:text-gray-400 placeholder:text-sm"
                    />
                    <p className="text-sm text-gray-500">
                      Ces instructions seront remises au patient
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-gray-700 font-semibold flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 text-blue-600" />
                      Date de visite de contrôle
                    </Label>
                    <div className="relative">
                      <Input
                        type="date"
                        value={formData.date_visite_controle}
                        onChange={(e) =>
                          handleInputChange(
                            "date_visite_controle",
                            e.target.value
                          )
                        }
                        min={formData.date_fin}
                        className="bg-white border-2 border-gray-200 focus:border-blue-600 rounded-xl py-6 text-lg font-medium shadow-sm pl-12"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <RefreshCw className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Date recommandée pour une visite de contrôle
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-blue-700" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">
                          Informations importantes
                        </h4>
                        <p className="text-sm text-gray-600">
                          Rappel des obligations légales
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm text-gray-700">
                      <p className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>
                          Le patient doit transmettre l'arrêt à son employeur
                          sous 48h
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>
                          L'arrêt doit être envoyé à la Sécurité Sociale sous
                          48h
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>
                          En cas d'absence prolongée, des visites de contrôle
                          peuvent être requises
                        </span>
                      </p>
                      <p className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>La durée maximale continue est de 365 jours</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ACTIONS FINALES */}
              <div className="bg-gradient-to-r from-gray-50 to-amber-50 border-2 border-gray-100 rounded-2xl p-8 shadow-xl">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      Finaliser l'arrêt de maladie
                    </h3>
                    <p className="text-gray-600">
                      Durée : {formData.duree_jours || "0"} jour(s) •
                      {formData.renouvelable
                        ? " Renouvelable"
                        : " Non renouvelable"}{" "}
                      •
                      {formData.avec_signature
                        ? " Signature activée"
                        : " Sans signature"}
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
                      disabled={
                        saving ||
                        !formData.date_debut ||
                        !formData.date_fin ||
                        !formData.motif ||
                        !formData.diagnostic
                      }
                      className="px-10 py-6 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-base"
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

                {(!formData.date_debut ||
                  !formData.date_fin ||
                  !formData.motif ||
                  !formData.diagnostic) && (
                  <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                    <p className="text-amber-800 font-medium flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Tous les champs obligatoires (*) doivent être renseignés
                      avant validation.
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
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Champs obligatoires *</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span>Informations patient</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>
                Document médical officiel - Conservation 10 ans minimum
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArretMaladie;
