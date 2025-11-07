import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { AuthContext } from "@/context/AuthContext";
import api from "@/api/axios";
import { toast } from "sonner";
import defaultAvatar from "@/assets/default-avatar.png";
import { useToast } from "@/components/ui/use-toast";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Icons
import {
  User,
  Mail,
  Phone,
  MapPin,
  Stethoscope,
  FileText,
  Calendar,
  Clock,
  Award,
  Briefcase,
  Edit,
  Save,
  X,
  Settings,
  Upload,
  Trash2,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  XCircle,
  Sparkles,
  TrendingUp,
  Users,
  Star,
  ThumbsUp,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Key,
  Lock,
  Info,
  ArrowLeft,
  Sun,
  Moon,
  ShieldOff,
} from "lucide-react";

// ============ COMPOSANTS RÉUTILISABLES ============

const LoadingSpinner = ({ message = "Chargement..." }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
    <p className="text-slate-500 text-center">{message}</p>
  </div>
);

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="text-center py-12">
    <Icon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

const StarRating = React.memo(({ rating, readonly = false, size = "md" }) => {
  const starSize = size === "lg" ? "w-8 h-8" : "w-6 h-6";

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="cursor-default"
          disabled={readonly}
        >
          <Star
            className={`${starSize} ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
});

StarRating.displayName = "StarRating";

// ============ COMPOSANT GESTION DES HORAIRES OPTIMISÉ ============

const TimeSlotPicker = ({ value, onChange, disabled }) => {
  const [morningStart, setMorningStart] = useState("09:00");
  const [morningEnd, setMorningEnd] = useState("12:30");
  const [afternoonStart, setAfternoonStart] = useState("14:00");
  const [afternoonEnd, setAfternoonEnd] = useState("18:00");
  const [hasAfternoon, setHasAfternoon] = useState(true);

  // Initialiser les valeurs depuis le format string
  useEffect(() => {
    if (value) {
      const parts = value.split(" | ");
      if (parts[0]) {
        const [start, end] = parts[0].split(" - ");
        if (start && end) {
          setMorningStart(start);
          setMorningEnd(end);
        }
      }
      if (parts[1]) {
        const [start, end] = parts[1].split(" - ");
        if (start && end) {
          setAfternoonStart(start);
          setAfternoonEnd(end);
          setHasAfternoon(true);
        } else {
          setHasAfternoon(false);
        }
      } else {
        setHasAfternoon(false);
      }
    }
  }, [value]);

  // Générer le format string
  const updateValue = useCallback(
    (
      newMorningStart,
      newMorningEnd,
      newAfternoonStart,
      newAfternoonEnd,
      newHasAfternoon
    ) => {
      let newValue = `${newMorningStart} - ${newMorningEnd}`;
      if (newHasAfternoon && newAfternoonStart && newAfternoonEnd) {
        newValue += ` | ${newAfternoonStart} - ${newAfternoonEnd}`;
      }
      onChange(newValue);
    },
    [onChange]
  );

  // Gestionnaires de changement
  const handleMorningStartChange = (e) => {
    const newValue = e.target.value;
    setMorningStart(newValue);
    updateValue(
      newValue,
      morningEnd,
      afternoonStart,
      afternoonEnd,
      hasAfternoon
    );
  };

  const handleMorningEndChange = (e) => {
    const newValue = e.target.value;
    setMorningEnd(newValue);
    updateValue(
      morningStart,
      newValue,
      afternoonStart,
      afternoonEnd,
      hasAfternoon
    );
  };

  const handleAfternoonStartChange = (e) => {
    const newValue = e.target.value;
    setAfternoonStart(newValue);
    updateValue(morningStart, morningEnd, newValue, afternoonEnd, hasAfternoon);
  };

  const handleAfternoonEndChange = (e) => {
    const newValue = e.target.value;
    setAfternoonEnd(newValue);
    updateValue(
      morningStart,
      morningEnd,
      afternoonStart,
      newValue,
      hasAfternoon
    );
  };

  const handleHasAfternoonChange = (newValue) => {
    setHasAfternoon(newValue);
    updateValue(
      morningStart,
      morningEnd,
      afternoonStart,
      afternoonEnd,
      newValue
    );
  };

  // Options d'heures
  const timeOptions = [];
  for (let hour = 7; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      timeOptions.push(time);
    }
  }

  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
      {/* Créneau du matin */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Sun className="w-5 h-5 text-amber-500" />
          <span className="font-semibold text-slate-700">Matin</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-600 mb-1 block">Début</label>
            <select
              value={morningStart}
              onChange={handleMorningStartChange}
              disabled={disabled}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {timeOptions.map((time) => (
                <option key={`morning-start-${time}`} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-600 mb-1 block">Fin</label>
            <select
              value={morningEnd}
              onChange={handleMorningEndChange}
              disabled={disabled}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {timeOptions.map((time) => (
                <option key={`morning-end-${time}`} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Créneau de l'après-midi */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Moon className="w-5 h-5 text-blue-500" />
          <span className="font-semibold text-slate-700">Après-midi</span>
          <button
            type="button"
            onClick={() => handleHasAfternoonChange(!hasAfternoon)}
            disabled={disabled}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              hasAfternoon
                ? "bg-green-500 border-green-500"
                : "bg-white border-slate-400"
            }`}
          >
            {hasAfternoon && <CheckCircle2 className="w-3 h-3 text-white" />}
          </button>
        </div>

        {hasAfternoon && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-600 mb-1 block">Début</label>
              <select
                value={afternoonStart}
                onChange={handleAfternoonStartChange}
                disabled={disabled}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {timeOptions.map((time) => (
                  <option key={`afternoon-start-${time}`} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-600 mb-1 block">Fin</label>
              <select
                value={afternoonEnd}
                onChange={handleAfternoonEndChange}
                disabled={disabled}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {timeOptions.map((time) => (
                  <option key={`afternoon-end-${time}`} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Aperçu */}
      <div className="pt-3 border-t border-slate-200">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="font-medium">Aperçu :</span>
          <span className="font-mono bg-white px-2 py-1 rounded border">
            {morningStart} - {morningEnd}
            {hasAfternoon && ` | ${afternoonStart} - ${afternoonEnd}`}
          </span>
        </div>
      </div>
    </div>
  );
};

const WorkingHoursManager = React.memo(
  ({ workingHours, setWorkingHours, editMode }) => {
    const [localHours, setLocalHours] = useState([]);

    // Jours de la semaine standards avec horaires par défaut
    const daysOfWeek = [
      { id: "monday", label: "Lundi", defaultHours: "" },
      { id: "tuesday", label: "Mardi", defaultHours: "" },
      { id: "wednesday", label: "Mercredi", defaultHours: "" },
      { id: "thursday", label: "Jeudi", defaultHours: "" },
      { id: "friday", label: "Vendredi", defaultHours: "" },
      { id: "saturday", label: "Samedi", defaultHours: "" },
      { id: "sunday", label: "Dimanche", defaultHours: "" },
    ];

    // Initialiser les horaires une seule fois
    useEffect(() => {
      if (workingHours && workingHours.length > 0) {
        setLocalHours(workingHours);
      } else {
        const defaultHours = daysOfWeek.map((day) => ({
          day: day.label,
          hours: day.defaultHours,
          enabled: !!day.defaultHours,
        }));
        setLocalHours(defaultHours);
      }
    }, [workingHours]);

    // Mettre à jour les horaires parent de manière optimisée
    useEffect(() => {
      if (localHours.length > 0) {
        setWorkingHours(localHours);
      }
    }, [localHours, setWorkingHours]);

    const handleHoursChange = useCallback((index, newHours) => {
      setLocalHours((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], hours: newHours };
        return updated;
      });
    }, []);

    const toggleDay = useCallback(
      (index) => {
        setLocalHours((prev) => {
          const updated = [...prev];
          const currentDay = updated[index];

          if (currentDay.enabled) {
            updated[index] = { ...currentDay, hours: "", enabled: false };
          } else {
            const defaultDay = daysOfWeek.find(
              (d) => d.label === currentDay.day
            );
            updated[index] = {
              ...currentDay,
              hours: defaultDay?.defaultHours || "09:00 - 17:00",
              enabled: true,
            };
          }
          return updated;
        });
      },
      [daysOfWeek]
    );

    const hasWorkingHours = localHours.some(
      (day) => day.enabled && day.hours.trim()
    );

    if (!hasWorkingHours && !editMode) {
      return (
        <div className="text-center py-12 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200">
          <div className="w-20 h-20 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
            <Clock className="w-10 h-10 text-amber-500" />
          </div>
          <h3 className="text-2xl font-bold text-amber-900 mb-3">
            Aucun horaire de consultation configuré
          </h3>
          <p className="text-amber-700 mb-6 max-w-md mx-auto text-lg">
            Les patients ne peuvent pas prendre rendez-vous tant que vous n'avez
            pas défini vos horaires de consultation.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="grid gap-3">
          {localHours.map((day, index) => (
            <div
              key={day.day}
              className={`flex items-start justify-between p-5 rounded-xl transition-all duration-200 ${
                day.enabled
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-sm"
                  : "bg-slate-100/80 border-2 border-slate-200"
              }`}
            >
              <div className="flex items-start gap-4 flex-1">
                {editMode && (
                  <button
                    onClick={() => toggleDay(index)}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 transform hover:scale-110 mt-1 ${
                      day.enabled
                        ? "bg-green-500 border-green-500 shadow-lg"
                        : "bg-white border-slate-400 hover:border-slate-600"
                    }`}
                  >
                    {day.enabled && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </button>
                )}

                <div className="flex-1">
                  <span
                    className={`font-bold text-lg block mb-3 ${
                      day.enabled ? "text-green-900" : "text-slate-500"
                    }`}
                  >
                    {day.day}
                  </span>

                  {editMode && day.enabled ? (
                    <TimeSlotPicker
                      value={day.hours}
                      onChange={(newHours) =>
                        handleHoursChange(index, newHours)
                      }
                      disabled={!day.enabled}
                    />
                  ) : (
                    <span
                      className={`text-lg font-medium block ${
                        day.enabled && day.hours
                          ? "text-green-800"
                          : "text-slate-500"
                      }`}
                    >
                      {day.enabled && day.hours ? (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-600" />
                          {day.hours}
                        </div>
                      ) : (
                        "Fermé"
                      )}
                    </span>
                  )}
                </div>
              </div>

              {!editMode && (
                <Badge
                  className={
                    day.enabled
                      ? "bg-green-100 text-green-800 text-sm px-3 py-1 border border-green-200"
                      : "bg-slate-200 text-slate-600 text-sm px-3 py-1"
                  }
                >
                  {day.enabled ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Ouvert
                    </>
                  ) : (
                    "Fermé"
                  )}
                </Badge>
              )}
            </div>
          ))}
        </div>

        {editMode && (
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200 mt-6">
            <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-3 text-lg">
              <Info className="w-5 h-5 text-blue-500" />
              Guide de configuration des horaires
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div>
                    <span className="font-semibold">Activation des jours</span>
                    <p className="text-blue-700 mt-1">
                      Cliquez sur le cercle vert pour activer ou désactiver un
                      jour de consultation
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div>
                    <span className="font-semibold">Créneaux horaires</span>
                    <p className="text-blue-700 mt-1">
                      Définissez les horaires du matin et de l'après-midi avec
                      les sélecteurs
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <div>
                    <span className="font-semibold">Après-midi optionnel</span>
                    <p className="text-blue-700 mt-1">
                      Activez/désactivez le créneau de l'après-midi selon vos
                      disponibilités
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">4</span>
                  </div>
                  <div>
                    <span className="font-semibold">
                      Sauvegarde automatique
                    </span>
                    <p className="text-blue-700 mt-1">
                      Les modifications sont sauvegardées automatiquement quand
                      vous cliquez sur "Enregistrer"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

WorkingHoursManager.displayName = "WorkingHoursManager";

// ============ COMPOSANT CARTE DE RENDEZ-VOUS ============

const AppointmentCard = React.memo(({ appointment, onConfirm, onReject }) => {
  const statusConfig = useMemo(
    () => ({
      en_attente: {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        badge: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        label: "En attente",
      },
      confirmé: {
        bg: "bg-green-50",
        border: "border-green-200",
        badge: "bg-green-100 text-green-800",
        icon: CheckCircle2,
        label: "Confirmé",
      },
      refusé: {
        bg: "bg-red-50",
        border: "border-red-200",
        badge: "bg-red-100 text-red-800",
        icon: XCircle,
        label: "Refusé",
      },
    }),
    []
  );

  const config = statusConfig[appointment.status] || statusConfig["en_attente"];
  const StatusIcon = config.icon;

  return (
    <div
      className={`${config.bg} ${config.border} border-2 p-6 rounded-2xl hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {appointment.patient?.charAt(0) || "P"}
            </div>
            <div>
              <p className="font-bold text-slate-800 text-lg">
                {appointment.patient || "Patient"}
              </p>
              <Badge className={config.badge}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {config.label}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-4 h-4 text-blue-500" />
              {appointment.telephone || "Non renseigné"}
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4 text-red-500" />
              {appointment.address || "Non renseignée"}
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4 text-purple-500" />
              {new Date(appointment.date).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-4 h-4 text-green-500" />
              {appointment.time}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Stethoscope className="w-4 h-4 text-cyan-500" />
            <span className="text-slate-600">
              Type: {appointment.consultation_type}
            </span>
          </div>
        </div>

        {appointment.status === "en_attente" && (
          <div className="flex md:flex-col gap-2">
            <Button
              onClick={() => onConfirm(appointment.id)}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Confirmer
            </Button>
            <Button
              onClick={() => onReject(appointment.id)}
              className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Refuser
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});

AppointmentCard.displayName = "AppointmentCard";

// ============ MODALES ============

const ChangePasswordDialog = ({ open, onOpenChange, onPasswordChange }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      setLoading(true);
      await onPasswordChange(currentPassword, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      onOpenChange(false);
      toast.success("Mot de passe modifié avec succès");
    } catch (error) {
      // L'erreur est gérée dans le composant parent
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        onOpenChange(newOpen);
        if (!newOpen) resetForm();
      }}
    >
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-white to-slate-50/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
          <DialogHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              <Key className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-white">
              Modifier le mot de passe
            </DialogTitle>
            <DialogDescription className="text-white text-base mt-2">
              Pour votre sécurité, choisissez un mot de passe fort et unique
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              Mot de passe actuel
            </label>
            <div className="relative group">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Entrez votre mot de passe actuel"
                required
                className="pr-12 h-12 border-slate-300/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 rounded-xl bg-white/50 backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Lock className="w-4 h-4 text-green-500" />
              Nouveau mot de passe
            </label>
            <div className="relative group">
              <Input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Créez votre nouveau mot de passe"
                required
                className="pr-12 h-12 border-slate-300/80 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 rounded-xl bg-white/50 backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Minimum 6 caractères
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-amber-500" />
              Confirmer le mot de passe
            </label>
            <div className="relative group">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Retapez votre nouveau mot de passe"
                required
                className="pr-12 h-12 border-slate-300/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 rounded-xl bg-white/50 backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {newPassword &&
              confirmPassword &&
              newPassword !== confirmPassword && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  Les mots de passe ne correspondent pas
                </p>
              )}
          </div>

          {newPassword && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">
                  Sécurité du mot de passe
                </span>
                <span
                  className={`text-xs font-semibold ${
                    newPassword.length >= 8
                      ? "text-green-600"
                      : newPassword.length >= 6
                      ? "text-amber-600"
                      : "text-red-600"
                  }`}
                >
                  {newPassword.length >= 8
                    ? "Fort"
                    : newPassword.length >= 6
                    ? "Moyen"
                    : "Faible"}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    newPassword.length >= 8
                      ? "bg-green-500 w-full"
                      : newPassword.length >= 6
                      ? "bg-amber-500 w-2/3"
                      : "bg-red-500 w-1/3"
                  }`}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-0 pt-4 border-t border-slate-200/60">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
              disabled={loading}
              className="flex-1 h-12 border-slate-300/80 text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-300"
            >
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={
                loading ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword
              }
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Modification...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const DeleteAccountDialog = ({ open, onOpenChange, onDeleteAccount }) => {
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
      return;
    }

    if (confirmText !== "SUPPRIMER MON COMPTE") {
      toast.error(
        "Veuillez taper exactement 'SUPPRIMER MON COMPTE' pour confirmer"
      );
      return;
    }

    try {
      setLoading(true);
      await onDeleteAccount();
      onOpenChange(false);
    } catch (error) {
      // L'erreur est gérée dans le composant parent
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setConfirmText("");
    setStep(1);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        onOpenChange(newOpen);
        if (!newOpen) resetForm();
      }}
    >
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-white to-slate-50/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6 text-white">
          <DialogHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-white">
              {step === 1 ? "Supprimer votre compte" : "Dernière confirmation"}
            </DialogTitle>
            <DialogDescription className="text-white text-base mt-2">
              {step === 1
                ? "Cette action est irréversible. Veuillez lire attentivement les conséquences."
                : "Dernière étape avant la suppression définitive."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {step === 1 ? (
            <>
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-900 mb-3 text-lg">
                      Attention ! Action irréversible
                    </h4>
                    <div className="space-y-3 text-sm text-red-800">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-red-600 text-xs font-bold">
                            !
                          </span>
                        </div>
                        <span className="font-medium">
                          Tous vos rendez-vous seront immédiatement annulés
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-red-600 text-xs font-bold">
                            !
                          </span>
                        </div>
                        <span className="font-medium">
                          Vos données personnelles seront définitivement
                          effacées
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-red-600 text-xs font-bold">
                            !
                          </span>
                        </div>
                        <span className="font-medium">
                          Vos avis et notes seront supprimés
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-red-600 text-xs font-bold">
                            !
                          </span>
                        </div>
                        <span className="font-medium">
                          Cette action ne peut pas être annulée
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <p className="text-sm text-amber-800">
                    <strong>Conseil :</strong> Si vous avez des préoccupations,
                    contactez d'abord notre support avant de supprimer votre
                    compte.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-900 mb-3 text-lg">
                      Dernière confirmation requise
                    </h4>
                    <p className="text-red-800 text-sm mb-4">
                      Pour confirmer la suppression définitive de votre compte,
                      veuillez taper exactement :
                    </p>
                    <div className="bg-white border border-red-300 rounded-xl p-4 text-center">
                      <code className="text-red-600 font-mono font-bold text-lg tracking-wider">
                        SUPPRIMER MON COMPTE
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Edit className="w-4 h-4 text-red-500" />
                  Tapez la phrase de confirmation
                </label>
                <Input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="SUPPRIMER MON COMPTE"
                  className="h-12 border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 rounded-xl text-center font-mono tracking-wider"
                  required
                />
                {confirmText && confirmText !== "SUPPRIMER MON COMPTE" && (
                  <p className="text-xs text-red-500 flex items-center gap-1 justify-center">
                    <XCircle className="w-3 h-3" />
                    La phrase ne correspond pas exactement
                  </p>
                )}
                {confirmText === "SUPPRIMER MON COMPTE" && (
                  <p className="text-xs text-green-600 flex items-center gap-1 justify-center">
                    <CheckCircle className="w-3 h-3" />
                    Phrase correcte - Vous pouvez procéder à la suppression
                  </p>
                )}
              </div>
            </>
          )}

          <DialogFooter
            className={`flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200/60 ${
              step === 2 ? "sm:justify-between" : "sm:justify-end"
            }`}
          >
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                disabled={loading}
                className="flex-1 h-12 border-slate-300/80 text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            )}
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  resetForm();
                }}
                disabled={loading}
                className="flex-1 h-12 border-slate-300/80 text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-300"
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={
                  loading ||
                  (step === 2 && confirmText !== "SUPPRIMER MON COMPTE")
                }
                className="flex-1 h-12 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Suppression...
                  </>
                ) : step === 1 ? (
                  <>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Continuer
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer définitivement
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ============ COMPOSANT PRINCIPAL OPTIMISÉ ============

const ProfilMedecin = () => {
  const { role } = useContext(AuthContext);
  const { toast } = useToast();

  // États
  const [medecin, setMedecin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profil");
  const [workingHours, setWorkingHours] = useState([]);

  // États pour les modales
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    address: "",
    specialite: "",
    experience_years: "",
    languages: "",
    professional_background: "",
    consultation_price: "",
    insurance_accepted: "",
    bio: "",
    photo_profil: "",
  });

  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);

  const fileInputRef = useRef(null);

  // Fonction utilitaire pour construire l'URL de l'image
  const getImageUrl = useCallback((photoProfil, photoUrl) => {
    console.log("🔍 Debug image:", { photoProfil, photoUrl });

    // Si l'API retourne une URL complète (photo_url), l'utiliser en priorité
    if (photoUrl) {
      console.log("✅ Utilisation photo_url:", photoUrl);
      return photoUrl;
    }

    // Si on a un chemin en base (photos/medecins/xxx.jpg)
    if (photoProfil) {
      // Construire l'URL complète vers le fichier dans assets
      const baseUrl = "http://localhost:8000"; // Votre URL Laravel

      // Le chemin est relatif au dossier public/assets/images/
      const fullUrl = `${baseUrl}/assets/images/${photoProfil}`;

      console.log("🔧 URL construite:", fullUrl);
      return fullUrl;
    }

    // Fallback vers l'avatar par défaut
    console.log("🚨 Aucune image trouvée, utilisation avatar par défaut");
    return defaultAvatar;
  }, []);

  // Fonction pour déterminer si le médecin est ouvert actuellement
  const getCurrentAvailability = useCallback(() => {
    if (!workingHours || workingHours.length === 0) {
      return {
        isOpen: false,
        status: "Fermé",
        badgeColor: "bg-red-500/20 text-red-200 border-red-300/30",
      };
    }

    const now = new Date();
    const today = now.toLocaleDateString("fr-FR", { weekday: "long" });
    const currentTime = now.toTimeString().slice(0, 5); // Format HH:MM

    const todaySchedule = workingHours.find(
      (day) => day.day.toLowerCase() === today.toLowerCase() && day.enabled
    );

    if (!todaySchedule || !todaySchedule.hours) {
      return {
        isOpen: false,
        status: "Fermé",
        badgeColor: "bg-red-500/20 text-red-200 border-red-300/30",
      };
    }

    // Vérifier si l'heure actuelle est dans les créneaux horaires
    const timeSlots = todaySchedule.hours.split(" | ");

    for (const slot of timeSlots) {
      const [start, end] = slot.split(" - ");
      if (currentTime >= start && currentTime <= end) {
        return {
          isOpen: true,
          status: "Ouvert maintenant",
          badgeColor: "bg-green-500/20 text-green-200 border-green-300/30",
        };
      }
    }

    return {
      isOpen: false,
      status: "Fermé aujourd'hui",
      badgeColor: "bg-red-500/20 text-red-200 border-red-300/30",
    };
  }, [workingHours]);

  // Chargement des données
  const fetchAllData = useCallback(async () => {
    if (role !== "medecin") return;

    try {
      setLoading(true);

      const [profilResponse, rdvsResponse] = await Promise.all([
        api.get("/medecin/profile"),
        api.get("/medecin/appointments"),
      ]);

      const profil = profilResponse.data;
      setMedecin(profil);

      setFormData({
        nom: profil.nom || "",
        prenom: profil.prenom || "",
        email: profil.email || "",
        telephone: profil.telephone || "",
        address: profil.address || "",
        specialite: profil.specialite || "",
        experience_years: profil.experience_years || "",
        languages: Array.isArray(profil.languages)
          ? profil.languages.join(", ")
          : profil.languages || "",
        professional_background: profil.professional_background || "",
        consultation_price: profil.consultation_price || "",
        insurance_accepted: profil.insurance_accepted ? "1" : "0",
        bio: profil.bio || "",
        photo_profil: profil.photo_profil || "",
      });

      // Initialiser les horaires de travail
      if (
        profil.working_hours &&
        Array.isArray(profil.working_hours) &&
        profil.working_hours.length > 0
      ) {
        setWorkingHours(profil.working_hours);
      }

      setAppointments(rdvsResponse.data);
    } catch (err) {
      console.error("Erreur chargement données :", err);
      toast.error("Erreur lors du chargement du profil");
    } finally {
      setLoading(false);
    }
  }, [role]);

  const fetchReviews = useCallback(async () => {
    if (!medecin?.id) return;

    try {
      const [reviewsResponse, statsResponse] = await Promise.all([
        api.get(`/medecins/${medecin.id}/reviews`),
        api.get(`/medecins/${medecin.id}/reviews/stats`),
      ]);
      setReviews(reviewsResponse.data);
      setReviewStats(statsResponse.data);
    } catch (error) {
      console.error("Erreur lors du chargement des avis:", error);
    }
  }, [medecin?.id]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    if (medecin?.id) {
      fetchReviews();
    }
  }, [medecin?.id, fetchReviews]);

  // Gestionnaires d'événements
  const handleSave = useCallback(async () => {
    try {
      setSaving(true);

      const updateData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        address: formData.address,
        specialite: formData.specialite,
        experience_years: formData.experience_years
          ? parseInt(formData.experience_years)
          : null,
        languages: formData.languages,
        professional_background: formData.professional_background,
        consultation_price: formData.consultation_price
          ? parseInt(formData.consultation_price)
          : null,
        insurance_accepted: formData.insurance_accepted === "1" ? 1 : 0,
        bio: formData.bio,
        working_hours: workingHours,
      };

      const profileRes = await api.put("/medecin/profile", updateData);
      const updatedMedecin = profileRes.data;

      setMedecin(updatedMedecin);
      setEditMode(false);
      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès !",
        variant: "default",
      });

      await fetchAllData();
    } catch (error) {
      console.error("Erreur de mise à jour :", error);
      const errorMessage =
        error.response?.data?.message ||
        "Erreur lors de la mise à jour du profil";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }, [formData, workingHours, fetchAllData]);

  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    //Vérification côté frontend : max 5 Mo
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image doit faire moins de 5 Mo",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadingPhoto(true);

      const formDataUpload = new FormData();
      formDataUpload.append("photo_profil", file);

      const response = await api.post(
        "/medecin/profile/photo",
        formDataUpload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const newPhotoUrl = response.data.photo_url;
      const newPhotoPath = response.data.photo_profil;

      //Mise à jour des états
      setMedecin((prev) => ({
        ...prev,
        photo_profil: newPhotoPath,
        photo_url: newPhotoUrl,
      }));

      setFormData((prev) => ({
        ...prev,
        photo_profil: newPhotoPath,
      }));

      toast({
        title: "Succès",
        description: "Photo de profil mise à jour avec succès !",
        variant: "default",
      });
    } catch (error) {
      console.error("Erreur upload photo:", error);

      //Gestion précise des erreurs backend Laravel
      if (error.response?.status === 422) {
        const msg =
          error.response?.data?.message ||
          "Le fichier est invalide ou trop volumineux.";
        toast({
          title: "Erreur",
          description: msg,
          variant: "destructive",
        });
      } else if (error.response?.status === 413) {
        // Cas où le serveur refuse carrément le fichier trop gros
        toast({
          title: "Erreur",
          description:
            "Le fichier dépasse la taille maximale autorisée (5 Mo).",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Erreur lors du téléchargement de la photo.",
          variant: "destructive",
        });
      }
    } finally {
      setUploadingPhoto(false);
    }
  }, []);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleConfirmAppointment = useCallback(async (appointmentId) => {
    try {
      await api.patch(`/medecin/appointments/${appointmentId}/confirm`);

      setAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId ? { ...app, status: "confirmé" } : app
        )
      );

      toast({
        title: "Succès",
        description: "Rendez-vous confirmé avec succès",
        variant: "default",
      });
    } catch (error) {
      console.error("Erreur confirmation rendez-vous:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la confirmation du rendez-vous",
        variant: "destructive",
      });
    }
  }, []);

  const handleRejectAppointment = useCallback(async (appointmentId) => {
    try {
      await api.patch(`/medecin/appointments/${appointmentId}/reject`, {
        reason: "Rendez-vous refusé par le médecin",
      });

      setAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId ? { ...app, status: "refusé" } : app
        )
      );

      toast({
        title: "Succès",
        description: "Rendez-vous refusé",
        variant: "default",
      });
    } catch (error) {
      console.error("Erreur refus rendez-vous:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors du refus du rendez-vous",
        variant: "destructive",
      });
    }
  }, []);

  const handlePasswordChange = useCallback(
    async (currentPassword, newPassword) => {
      try {
        await api.put("/medecin/profile/password", {
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: newPassword,
        });

        toast({
          title: "Succès",
          description: "Mot de passe modifié avec succès",
          variant: "default",
        });
        return true;
      } catch (error) {
        console.error("Erreur modification mot de passe:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Erreur lors de la modification du mot de passe";
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
        throw error;
      }
    },
    []
  );

  const handleAccountDelete = useCallback(async () => {
    try {
      await api.delete("/medecin/profile");

      toast({
        title: "Succès",
        description: "Compte supprimé avec succès",
        variant: "default",
      });
      window.location.href = "/";
      return true;
    } catch (error) {
      console.error("Erreur suppression compte:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Erreur lors de la suppression du compte";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  }, []);

  // Calculs mémoïsés
  const stats = useMemo(() => {
    const currentMonthAppointments = appointments.filter((app) => {
      if (!app.date) return false;
      const appointmentDate = new Date(app.date);
      const currentDate = new Date();
      return (
        appointmentDate.getMonth() === currentDate.getMonth() &&
        appointmentDate.getFullYear() === currentDate.getFullYear() &&
        app.status === "confirmé"
      );
    });

    const upcomingAppointments = appointments.filter((app) => {
      if (!app.date) return false;
      const appointmentDate = new Date(app.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return appointmentDate >= today && app.status === "confirmé";
    });

    return {
      patientsThisMonth: currentMonthAppointments.length,
      upcomingAppointments: upcomingAppointments.length,
      averageRating: reviewStats?.average_rating
        ? parseFloat(reviewStats.average_rating).toFixed(1)
        : "0.0",
      satisfactionRate: reviewStats?.average_rating
        ? Math.min(Math.round((reviewStats.average_rating / 5) * 100), 100)
        : 0,
      totalReviews: reviewStats?.total_reviews || 0,
    };
  }, [appointments, reviewStats]);

  const availability = useMemo(
    () => getCurrentAvailability(),
    [getCurrentAvailability]
  );

  // Composants d'onglets
  const AgendaContent = () => (
    <Card className="glass-card border-0 shadow-xl">
      <CardHeader className="border-b border-slate-200/50">
        <CardTitle className="flex items-center gap-3 text-slate-800">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-600 via-blue-600 to-teal-400 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          Mes Rendez-vous ({appointments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {appointments.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="Aucun rendez-vous planifié"
            description="Vos rendez-vous apparaîtront ici une fois que les patients auront pris rendez-vous."
          />
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onConfirm={handleConfirmAppointment}
                onReject={handleRejectAppointment}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const AvisContent = () => (
    <Card className="glass-card border-0 shadow-xl">
      <CardHeader className="border-b border-slate-200/50">
        <CardTitle className="flex items-center gap-3 text-slate-800">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
            <ThumbsUp className="w-5 h-5 text-white" />
          </div>
          Avis des Patients ({stats.totalReviews})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {reviews.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="Aucun avis pour le moment"
            description="Les avis de vos patients apparaîtront ici."
          />
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                <h3 className="font-semibold text-slate-800 mb-4">
                  Note moyenne
                </h3>
                <div className="flex items-center gap-6">
                  <div className="text-5xl font-bold text-amber-600">
                    {stats.averageRating}
                  </div>
                  <div>
                    <StarRating
                      rating={Math.round(parseFloat(stats.averageRating))}
                      readonly
                      size="lg"
                    />
                    <p className="text-slate-600 text-sm mt-2">
                      Sur {stats.totalReviews} avis
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-4">
                  Détail des notes
                </h3>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const keyMap = {
                      5: "five_stars",
                      4: "four_stars",
                      3: "three_stars",
                      2: "two_stars",
                      1: "one_stars",
                    };
                    const count = reviewStats?.[keyMap[stars]] || 0;
                    const totalReviews = stats.totalReviews;
                    const percentage =
                      totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                    return (
                      <div
                        key={stars}
                        className="flex items-center gap-3 group"
                      >
                        <div className="flex items-center gap-2 w-20">
                          <span className="text-sm font-medium text-slate-700">
                            {stars}
                          </span>
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        </div>
                        <div className="flex-1 relative">
                          <div className="bg-slate-200 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-amber-400 to-amber-500 h-3 rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 w-16 justify-end">
                          <span className="text-sm text-slate-600 font-medium">
                            {count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-amber-200 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-semibold">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {review.patient?.prenom}{" "}
                          {review.patient?.nom?.charAt(0)}.
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={review.rating} readonly />
                          <span className="text-sm text-slate-500">
                            {new Date(review.created_at).toLocaleDateString(
                              "fr-FR"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-slate-700 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  const ParametresContent = () => (
    <Card className="glass-card border-0 shadow-xl">
      <CardHeader className="border-b border-slate-200/50">
        <CardTitle className="flex items-center gap-3 text-slate-800">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-700 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          Paramètres du compte
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl">
            <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              Sécurité et confidentialité
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              Gérez vos paramètres de sécurité et de confidentialité
            </p>
            <Button
              onClick={() => setChangePasswordOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
            >
              <Key className="w-4 h-4 mr-2" />
              Modifier le mot de passe
            </Button>
          </div>
          {/* Danger Zone 
          <div className="p-6 bg-red-50 border-2 border-red-200 rounded-2xl">
            <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Zone de danger
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              Actions irréversibles concernant votre compte
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => setDeleteAccountOpen(true)}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700 w-full justify-start"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer définitivement le compte
              </Button>
            </div>
          </div>*/}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 animate-ping opacity-20"></div>
          </div>
          <p className="text-slate-600 font-medium">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!medecin) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Profil non trouvé
          </h2>
          <p className="text-slate-600">
            Impossible de charger les informations du profil.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
      `}</style>

      {/* Header Hero */}
      <div className="relative bg-gradient-to-br from-sky-600 via-blue-600 to-teal-400 px-4 md:px-6 py-20 md:py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/50 shadow-2xl backdrop-blur-xl bg-white/10">
                <img
                  src={getImageUrl(medecin.photo_profil, medecin.photo_url)}
                  alt={`${medecin.prenom} ${medecin.nom}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = defaultAvatar;
                  }}
                />
                {!medecin.photo_profil && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-4xl font-bold flex items-center justify-center">
                    {medecin.prenom?.charAt(0)}
                    {medecin.nom?.charAt(0)}
                  </div>
                )}
              </div>

              {editMode && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingPhoto}
                  />
                  <button
                    onClick={triggerFileInput}
                    disabled={uploadingPhoto}
                    className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 bg-black/60 flex items-center justify-center transition-opacity rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingPhoto ? (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : (
                      <Upload className="w-8 h-8 text-white" />
                    )}
                  </button>
                </>
              )}

              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-4 py-1.5 bg-white rounded-full shadow-lg flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-slate-700">
                  {medecin.specialite || "Spécialité non définie"}
                </span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-3">
                  Dr. {medecin.prenom} {medecin.nom}
                </h1>
                <p className="text-cyan-100 text-lg">{medecin.specialite}</p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 px-4 py-2 text-sm">
                  <Award className="w-4 h-4 mr-2" />
                  {medecin.experience_years > 0
                    ? `${medecin.experience_years} ans d'expérience`
                    : "Expérience non spécifiée"}
                </Badge>

                <Badge
                  className={`${availability.badgeColor} backdrop-blur-md border px-4 py-2 text-sm`}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  {availability.status}
                </Badge>

                <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 px-4 py-2 text-sm">
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Assurances{" "}
                  {medecin.insurance_accepted === 1
                    ? "acceptées"
                    : "non acceptées"}
                </Badge>
              </div>
            </div>

            <Button
              onClick={() => setEditMode(!editMode)}
              disabled={saving || uploadingPhoto}
              className={`${
                editMode
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-white/20 hover:bg-white/30"
              } backdrop-blur-md border border-white/30 text-white shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50`}
            >
              {editMode ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 py-8 -mt-16 relative z-10">
        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {stats.patientsThisMonth}
              </p>
              <p className="text-sm text-slate-600 mt-1">Patients/mois</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                {stats.averageRating}
              </p>
              <p className="text-sm text-slate-600 mt-1">Note moyenne</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {stats.satisfactionRate}%
              </p>
              <p className="text-sm text-slate-600 mt-1">Satisfaction</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {stats.upcomingAppointments}
              </p>
              <p className="text-sm text-slate-600 mt-1">RDV à venir</p>
            </CardContent>
          </Card>
        </div>

        {/* Onglets */}
        <div className="glass-card border-0 shadow-lg rounded-2xl p-1.5 mb-8">
          <div className="grid grid-cols-5 gap-2">
            <button
              onClick={() => setActiveTab("profil")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "profil"
                  ? "bg-gradient-to-r from-sky-600 via-blue-600 to-teal-400 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profil</span>
            </button>
            <button
              onClick={() => setActiveTab("horaires")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "horaires"
                  ? "bg-gradient-to-r from-sky-600 via-blue-600 to-teal-400 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Horaires</span>
            </button>
            <button
              onClick={() => setActiveTab("agenda")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "agenda"
                  ? "bg-gradient-to-r from-sky-600 via-blue-600 to-teal-400 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Agenda</span>
            </button>
            <button
              onClick={() => setActiveTab("avis")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "avis"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span className="hidden sm:inline">Avis</span>
            </button>
            <button
              onClick={() => setActiveTab("parametres")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "parametres"
                  ? "bg-gradient-to-r from-sky-600 via-blue-600 to-teal-400 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Paramètres</span>
            </button>
          </div>
        </div>

        {/* Contenu des onglets */}
        {activeTab === "profil" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Biographie */}
              <Card className="glass-card border-0 shadow-xl">
                <CardHeader className="border-b border-slate-200/50">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    Biographie Professionnelle
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {editMode ? (
                    <Textarea
                      name="bio"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      placeholder="Décrivez votre parcours, spécialités et approche médicale..."
                      className="min-h-[150px] border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                      {medecin.bio || "Aucune biographie renseignée"}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-card border-0 shadow-xl">
                <CardHeader className="border-b border-slate-200/50">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    Expérience Professionnelle
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {editMode ? (
                    <Textarea
                      name="experience"
                      value={formData.professional_background}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          professional_background: e.target.value,
                        }))
                      }
                      placeholder="Décrivez votre expérience professionnelle..."
                      className="min-h-[150px] border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                      {medecin.professional_background ||
                        "Aucune expérience professionnelle renseignée"}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Colonne latérale */}
            <div className="space-y-6">
              <Card className="glass-card border-0 shadow-xl">
                <CardHeader className="border-b border-slate-200/50">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    Informations
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {/* Email */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                      Email
                    </label>
                    {editMode ? (
                      <Input
                        name="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="border-slate-300"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-500" />
                        <span className="text-slate-700">{medecin.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                      Téléphone
                    </label>
                    {editMode ? (
                      <Input
                        name="telephone"
                        value={formData.telephone}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            telephone: e.target.value,
                          }))
                        }
                        className="border-slate-300"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Phone className="w-5 h-5 text-green-500" />
                        <span className="text-slate-700">
                          {medecin.telephone || "Non renseigné"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Adresse */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                      Adresse
                    </label>
                    {editMode ? (
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        className="border-slate-300"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-red-500" />
                        <span className="text-slate-700">
                          {medecin.address || "Non renseignée"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Spécialité */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                      Spécialité
                    </label>
                    {editMode ? (
                      <Input
                        name="specialite"
                        value={formData.specialite}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            specialite: e.target.value,
                          }))
                        }
                        className="border-slate-300"
                        disabled
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Stethoscope className="w-5 h-5 text-cyan-500" />
                        <span className="text-slate-700">
                          {medecin.specialite || "Non renseignée"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Prix */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                      Prix consultation
                    </label>
                    {editMode ? (
                      <Input
                        name="consultation_price"
                        value={formData.consultation_price}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            consultation_price: e.target.value,
                          }))
                        }
                        type="number"
                        min={0}
                        className="border-slate-300"
                        placeholder="Prix en FCFA"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <CreditCard className="w-5 h-5 text-amber-500" />
                        <span className="text-slate-700">
                          {medecin.consultation_price !== null
                            ? `${medecin.consultation_price} FCFA`
                            : "Non renseigné"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Expérience */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                      Expérience
                    </label>
                    {editMode ? (
                      <Input
                        name="experience_years"
                        value={formData.experience_years}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            experience_years: e.target.value,
                          }))
                        }
                        type="number"
                        min={0}
                        className="border-slate-300"
                        placeholder="Nombre d'années"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Award className="w-5 h-5 text-purple-500" />
                        <span className="text-slate-700">
                          {medecin.experience_years || 0} ans
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Assurance acceptée */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                      Assurance
                    </label>

                    {editMode ? (
                      <select
                        name="insurance_accepted"
                        value={formData.insurance_accepted}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            insurance_accepted: e.target.value,
                          }))
                        }
                        className="w-full border border-slate-300 rounded-lg p-2 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="1">Acceptées</option>
                        <option value="0">Non acceptées</option>
                      </select>
                    ) : (
                      <Badge
                        className={`px-4 py-2 text-sm border-white/30 backdrop-blur-md ${
                          medecin.insurance_accepted === 1
                            ? "bg-green-500/20 text-green-700 border-green-300"
                            : "bg-red-500/20 text-red-700 border-red-300"
                        }`}
                      >
                        {medecin.insurance_accepted === 1 ? (
                          <>
                            <ShieldCheck className="w-4 h-4 mr-2" />
                            Assurances acceptées
                          </>
                        ) : (
                          <>
                            <ShieldOff className="w-4 h-4 mr-2" />
                            Assurances non acceptées
                          </>
                        )}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "horaires" && (
          <Card className="glass-card border-0 shadow-xl">
            <CardHeader className="border-b border-slate-200/50">
              <CardTitle className="flex items-center gap-3 text-slate-800">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-600 via-blue-600 to-teal-400 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                Gestion des Horaires de Consultation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <WorkingHoursManager
                workingHours={workingHours}
                setWorkingHours={setWorkingHours}
                editMode={editMode}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === "agenda" && <AgendaContent />}

        {activeTab === "avis" && <AvisContent />}

        {activeTab === "parametres" && <ParametresContent />}

        {editMode && activeTab !== "horaires" && (
          <div className="flex justify-end gap-3 mt-8">
            <Button
              variant="outline"
              onClick={() => {
                setEditMode(false);
                setFormData({
                  nom: medecin.nom || "",
                  prenom: medecin.prenom || "",
                  email: medecin.email || "",
                  telephone: medecin.telephone || "",
                  address: medecin.address || "",
                  specialite: medecin.specialite || "",
                  experience_years: medecin.experience_years || "",
                  languages: Array.isArray(medecin.languages)
                    ? medecin.languages.join(", ")
                    : medecin.languages || "",
                  professional_background:
                    medecin.professional_background || "",
                  consultation_price: medecin.consultation_price || "",
                  insurance_accepted: medecin.insurance_accepted ? "1" : "0",
                  bio: medecin.bio || "",
                  photo_profil: medecin.photo_profil || "",
                });
              }}
              disabled={saving}
              className="border-slate-300 hover:bg-slate-50"
            >
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer les modifications
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Modales */}
      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
        onPasswordChange={handlePasswordChange}
      />

      <DeleteAccountDialog
        open={deleteAccountOpen}
        onOpenChange={setDeleteAccountOpen}
        onDeleteAccount={handleAccountDelete}
      />
    </div>
  );
};

export default ProfilMedecin;
