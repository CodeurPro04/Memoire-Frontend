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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Settings,
  Upload,
  Activity,
  Heart,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Stethoscope,
  Loader2,
  Droplet,
  Key,
  LogOut,
  Lock,
  Info,
  ArrowLeft,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import defaultAvatar from "@/assets/default-avatar.png";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Composant de chargement réutilisable
const LoadingSpinner = ({ message = "Chargement..." }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
    <p className="text-slate-500 text-center">{message}</p>
  </div>
);

// Composant de carte vide réutilisable
const EmptyState = ({
  icon: Icon,
  title,
  description,
  buttonText,
  onButtonClick,
}) => (
  <div className="text-center py-12">
    <Icon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 mb-6 max-w-md mx-auto">{description}</p>
    {buttonText && onButtonClick && (
      <Button
        onClick={onButtonClick}
        className="bg-gradient-to-r from-sky-600 via-blue-600 to-teal-400 hover:from-blue-600 hover:to-cyan-600 text-white"
      >
        {buttonText}
      </Button>
    )}
  </div>
);

// Composant de statistiques réutilisable
const StatCard = ({ icon: Icon, value, label, gradientFrom, gradientTo }) => (
  <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
    <CardContent className="p-6 text-center">
      <div
        className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl flex items-center justify-center`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p
        className={`text-3xl font-bold bg-gradient-to-r ${gradientFrom
          .replace("from-", "from-")
          .replace("to-", "to-")} bg-clip-text text-transparent`}
      >
        {value}
      </p>
      <p className="text-sm text-slate-600 mt-1">{label}</p>
    </CardContent>
  </Card>
);

// ============ MODALES POUR LES PARAMÈTRES ============

const ChangePasswordDialog = ({ open, onOpenChange, onPasswordChange }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await onPasswordChange(currentPassword, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      onOpenChange(false);
      toast({
        title: "Succès",
        description: "Mot de passe modifié avec succès",
        variant: "default",
      });
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
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
      return;
    }

    if (confirmText !== "SUPPRIMER MON COMPTE") {
      toast({
        title: "Erreur",
        description: "Veuillez taper exactement 'SUPPRIMER MON COMPTE' pour confirmer",
        variant: "destructive",
      });
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
                          Vos favoris et historiques seront supprimés
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

const ProfilPatient = () => {
  const [loading, setLoading] = useState(true);
  const { role, isAuthenticated } = useContext(AuthContext);
  const [patient, setPatient] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("profil");
  const [appointments, setAppointments] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [cancellingAppointment, setCancellingAppointment] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showVih, setShowVih] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const { toast } = useToast();

  // États pour les modales
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Configuration des statuts des rendez-vous (memoïsé)
  const statusConfig = useMemo(
    () => ({
      en_attente: {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        badge: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        label: "En attente",
      },
      "en attente": {
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
      annulé: {
        bg: "bg-red-50",
        border: "border-red-200",
        badge: "bg-red-100 text-red-800",
        icon: XCircle,
        label: "Annulé",
      },
      refusé: {
        bg: "bg-gray-50",
        border: "border-gray-200",
        badge: "bg-gray-100 text-gray-800",
        icon: AlertCircle,
        label: "Refusé",
      },
    }),
    []
  );

  // Chargement initial de TOUTES les données
  const fetchAllData = useCallback(async () => {
    if (role !== "patient") return;

    try {
      setLoading(true);

      const [profileRes, appointmentsRes, favoritesRes] = await Promise.all([
        api.get("/patient/profile"),
        api.get("/patient/appointments"),
        api.get("/favorites"),
      ]);

      setPatient(profileRes.data);
      setFormData(profileRes.data);
      setAppointments(appointmentsRes.data);
      setFavorites(favoritesRes.data);
    } catch (error) {
      console.error("Erreur chargement des données :", error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [role, toast]);

  // Chargement initial
  useEffect(() => {
    if (role === "patient") {
      fetchAllData();
    }
  }, [role, fetchAllData]);

  // Recharger les données quand on revient sur l'onglet profil
  useEffect(() => {
    if (activeTab === "profil" && isAuthenticated && role === "patient") {
      // Recharger les données importantes
      fetchAppointments();
      fetchFavorites();
    }
  }, [activeTab, isAuthenticated, role]);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoadingAppointments(true);
      const response = await api.get("/patient/appointments");
      setAppointments(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des rendez-vous:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des rendez-vous",
        variant: "destructive",
      });
    } finally {
      setLoadingAppointments(false);
    }
  }, [toast]);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoadingFavorites(true);
      const response = await api.get("/favorites");
      setFavorites(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des favoris",
        variant: "destructive",
      });
    } finally {
      setLoadingFavorites(false);
    }
  }, [toast]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      
      // Préparer les données pour l'envoi
      const dataToSend = {
        nom: formData.nom || "",
        prenom: formData.prenom || "",
        email: formData.email || "",
        telephone: formData.telephone || "",
        address: formData.address || "",
        groupe_sanguin: formData.groupe_sanguin || "",
        serologie_vih: formData.serologie_vih || "",
        antecedents_medicaux: formData.antecedents_medicaux || "",
        allergies: formData.allergies || "",
        traitements_chroniques: formData.traitements_chroniques || "",
      };

      console.log("📤 Données envoyées:", dataToSend);

      const response = await api.put("/patient/profile", dataToSend);

      console.log("✅ Réponse du serveur:", response.data);

      setPatient(response.data);
      setFormData(response.data);
      setEditMode(false);

      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès !",
        variant: "default",
      });

      // Recharger les données
      await fetchAllData();
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour:", error);
      
      let errorMessage = "Erreur lors de la mise à jour du profil";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Gestion des erreurs de validation Laravel
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors).flat().join(', ');
      } else if (error.response?.status === 422) {
        errorMessage = "Données invalides. Veuillez vérifier les informations saisies.";
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }, [formData, fetchAllData, toast]);

  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérification côté frontend : max 5 Mo
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
        "/patient/profile/photo",
        formDataUpload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const newPhotoUrl = response.data.photo_url;
      const newPhotoPath = response.data.photo_profil;

      // Mise à jour des états
      setPatient((prev) => ({
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

      // Gestion précise des erreurs backend Laravel
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
  }, [toast]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Fonction utilitaire pour construire l'URL de l'image
  const getImageUrl = useCallback((photoProfil, photoUrl) => {
    // Si l'API retourne une URL complète (photo_url), l'utiliser en priorité
    if (photoUrl) {
      return photoUrl;
    }

    // Si on a un chemin en base (photos/patients/xxx.jpg)
    if (photoProfil) {
      // Construire l'URL complète vers le fichier dans ASSETS/IMAGES
      const baseUrl = "http://localhost:8000";
      const fullUrl = `${baseUrl}/assets/images/${photoProfil}`;
      return fullUrl;
    }

    // Fallback vers l'avatar par défaut
    return defaultAvatar;
  }, []);

  // Fonction pour retirer un médecin des favoris
  const removeFromFavorites = useCallback(
    async (medecinId) => {
      try {
        await api.delete(`/favorites/${medecinId}`);
        setFavorites((prev) =>
          prev.filter((medecin) => medecin.id !== medecinId)
        );
        toast({
          title: "Succès",
          description: "Médecin retiré des favoris",
          variant: "default",
        });
      } catch (error) {
        console.error("Erreur lors de la suppression du favori:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression du favori",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  // Fonction pour annuler un rendez-vous
  const cancelAppointment = useCallback(
    async (appointment) => {
      if (!appointment.can_cancel) {
        toast({
          title: "Erreur",
          description: "Impossible d'annuler ce rendez-vous",
          variant: "destructive",
        });
        return;
      }

      setCancellingAppointment(appointment.id);

      try {
        await api.delete(`/appointments/${appointment.id}/cancel`);
        toast({
          title: "Succès",
          description: "Rendez-vous annulé avec succès",
          variant: "default",
        });
        setAppointments((prev) =>
          prev.filter((app) => app.id !== appointment.id)
        );
      } catch (error) {
        console.error("Erreur lors de l'annulation du rendez-vous:", error);
        const errorMessage =
          error.response?.data?.error ||
          "Erreur lors de l'annulation du rendez-vous";
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setCancellingAppointment(null);
      }
    },
    [toast]
  );

  // Gestionnaire pour changer le mot de passe
  const handlePasswordChange = useCallback(
    async (currentPassword, newPassword) => {
      try {
        await api.put("/patient/profile/password", {
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
    [toast]
  );

  // Gestionnaire pour supprimer le compte
  const handleAccountDelete = useCallback(async () => {
    try {
      await api.delete("/patient/profile");

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
  }, [toast]);

  // Calcul des statistiques (memoïsé)
  const appointmentStats = useMemo(
    () => ({
      total: appointments.length,
      confirmed: appointments.filter(
        (a) => a.status === "confirmé" || a.status === "confirmé"
      ).length,
      pending: appointments.filter(
        (a) => a.status === "en_attente" || a.status === "en attente"
      ).length,
      cancelled: appointments.filter(
        (a) => a.status === "annulé" || a.status === "refusé"
      ).length,
    }),
    [appointments]
  );

  // Prochain rendez-vous (memoïsé)
  const nextAppointment = useMemo(
    () =>
      appointments.find(
        (a) => a.status === "confirmé" || a.status === "confirmé"
      ),
    [appointments]
  );

  if (loading || !patient) {
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
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Photo de profil */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-600 via-blue-600 to-teal-400 rounded-full blur opacity-75 group-hover:opacity-100 transition"></div>
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/50 shadow-2xl backdrop-blur-xl bg-white/10">
                <img
                  src={getImageUrl(patient.photo_profil, patient.photo_url)}
                  alt={`Photo de profil de ${patient.prenom} ${patient.nom}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = defaultAvatar;
                  }}
                />
                {!patient.photo_profil && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-4xl font-bold flex items-center justify-center">
                    {patient.prenom?.charAt(0)}
                    {patient.nom?.charAt(0)}
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
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-slate-700">
                  Patient
                </span>
              </div>
            </div>

            {/* Informations principales */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-3">
                  {patient.prenom} {patient.nom}
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </h1>
                <p className="text-cyan-100 text-lg">{patient.email}</p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 px-4 py-2 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  {appointmentStats.total} RDV
                </Badge>

                <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 px-4 py-2 text-sm">
                  <Heart className="w-4 h-4 mr-2" />
                  {favorites.length} Favoris
                </Badge>
              </div>
            </div>

            <Button
              onClick={() => setEditMode(!editMode)}
              className={`${
                editMode
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-white/20 hover:bg-white/30"
              } backdrop-blur-md border border-white/30 text-white shadow-lg transition-all duration-300 hover:scale-105`}
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard
            icon={Calendar}
            value={appointmentStats.total}
            label="Total RDV"
            gradientFrom="from-blue-500"
            gradientTo="to-cyan-500"
          />
          <StatCard
            icon={CheckCircle2}
            value={appointmentStats.confirmed}
            label="Confirmés"
            gradientFrom="from-green-500"
            gradientTo="to-emerald-500"
          />
          <StatCard
            icon={Clock}
            value={appointmentStats.pending}
            label="En attente"
            gradientFrom="from-amber-500"
            gradientTo="to-yellow-500"
          />
          <StatCard
            icon={XCircle}
            value={appointmentStats.cancelled}
            label="Annulés"
            gradientFrom="from-red-500"
            gradientTo="to-pink-500"
          />
          <StatCard
            icon={Heart}
            value={favorites.length}
            label="Favoris"
            gradientFrom="from-purple-500"
            gradientTo="to-pink-500"
          />
        </div>

        {/* Onglets personnalisés */}
        <div className="glass-card border-0 shadow-lg rounded-2xl p-1.5 mb-8">
          <div className="grid grid-cols-4 gap-2">
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
              onClick={() => setActiveTab("agenda")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "agenda"
                  ? "bg-gradient-to-r from-sky-600 via-blue-600 to-teal-400 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Rendez-vous</span>
            </button>
            <button
              onClick={() => setActiveTab("favoris")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "favoris"
                  ? "bg-gradient-to-r from-red-500 to-red-500 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Favoris</span>
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
            <div className="lg:col-span-2">
              <Card className="glass-card border-0 shadow-xl">
                <CardHeader className="border-b border-slate-200/50">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    Informations Personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-6">
                  {/* Nom */}
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Nom
                    </label>
                    {editMode ? (
                      <Input
                        name="nom"
                        value={formData.nom || ""}
                        onChange={handleChange}
                        className="border-slate-300"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <User className="w-5 h-5 text-blue-500" />
                        <span className="text-slate-700 break-all">
                          {patient.nom}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Prénom */}
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Prénom
                    </label>
                    {editMode ? (
                      <Input
                        name="prenom"
                        value={formData.prenom || ""}
                        onChange={handleChange}
                        className="border-slate-300"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <User className="w-5 h-5 text-blue-500" />
                        <span className="text-slate-700 break-all">
                          {patient.prenom}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Email
                    </label>
                    {editMode ? (
                      <Input
                        name="email"
                        value={formData.email || ""}
                        onChange={handleChange}
                        className="border-slate-300"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-500" />
                        <span className="text-slate-700 break-all">
                          {patient.email}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Téléphone */}
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Téléphone
                    </label>
                    {editMode ? (
                      <Input
                        name="telephone"
                        value={formData.telephone || ""}
                        onChange={handleChange}
                        className="border-slate-300"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Phone className="w-5 h-5 text-green-500" />
                        <span className="text-slate-700">
                          {patient.telephone || "Non renseigné"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Groupe sanguin */}
                  <div className="flex flex-col md:col-span-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Groupe sanguin
                    </label>
                    {editMode ? (
                      <select
                        name="groupe_sanguin"
                        value={formData.groupe_sanguin || ""}
                        onChange={handleChange}
                        className="w-full border border-slate-300 rounded-md p-2 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="">Sélectionner un groupe sanguin</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="inconnu">inconnu</option>
                      </select>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Droplet className="w-5 h-5 text-red-500" />
                        <span className="text-slate-700">
                          {patient.groupe_sanguin || "Non renseigné"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Sérologie VIH (masquable)
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Sérologie VIH
                    </label>
                    {editMode ? (
                      <select
                        name="serologie_vih"
                        value={formData.serologie_vih || ""}
                        onChange={handleChange}
                        className="w-full border border-slate-300 rounded-md p-2 text-slate-700 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                      >
                        <option value="">Sélectionner le statut</option>
                        <option value="positif">Positif</option>
                        <option value="negatif">Négatif</option>
                        <option value="inconnu">Inconnu</option>
                      </select>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Activity className="w-5 h-5 text-pink-500" />
                          <span className="text-slate-700">
                            {showVih
                              ? patient.serologie_vih || "Non renseignée"
                              : "•••••••"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowVih(!showVih)}
                          className="text-slate-500 hover:text-slate-700 transition"
                        >
                          {showVih ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div> */}

                  {/* Antécédents médicaux */}
                  <div className="flex flex-col md:col-span-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Antécédents médicaux
                    </label>
                    {editMode ? (
                      <textarea
                        name="antecedents_medicaux"
                        value={formData.antecedents_medicaux || ""}
                        onChange={handleChange}
                        rows="3"
                        className="w-full border border-slate-300 rounded-md p-2 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Décrire les antécédents médicaux..."
                      />
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg text-slate-700">
                        {patient.antecedents_medicaux ||
                          "Aucun antécédent renseigné"}
                      </div>
                    )}
                  </div>

                  {/* Allergies */}
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Allergies
                    </label>
                    {editMode ? (
                      <textarea
                        name="allergies"
                        value={formData.allergies || ""}
                        onChange={handleChange}
                        rows="2"
                        className="w-full border border-slate-300 rounded-md p-2 text-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        placeholder="Lister les allergies éventuelles..."
                      />
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg text-slate-700">
                        {patient.allergies || "Aucune allergie renseignée"}
                      </div>
                    )}
                  </div>

                  {/* Traitements chroniques */}
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Traitements chroniques
                    </label>
                    {editMode ? (
                      <textarea
                        name="traitements_chroniques"
                        value={formData.traitements_chroniques || ""}
                        onChange={handleChange}
                        rows="2"
                        className="w-full border border-slate-300 rounded-md p-2 text-slate-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        placeholder="Lister les traitements chroniques..."
                      />
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg text-slate-700">
                        {patient.traitements_chroniques ||
                          "Aucun traitement renseigné"}
                      </div>
                    )}
                  </div>

                  {/* Adresse */}
                  <div className="flex flex-col md:col-span-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Adresse
                    </label>
                    {editMode ? (
                      <Input
                        name="address"
                        value={formData.address || ""}
                        onChange={handleChange}
                        className="border-slate-300"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-red-500" />
                        <span className="text-slate-700">
                          {patient.address || "Non renseignée"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bouton de sauvegarde */}
                  {editMode && (
                    <div className="md:col-span-2">
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Enregistrement...
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
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="glass-card border-0 shadow-xl">
                <CardHeader className="border-b border-slate-200/50">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    Activité récente
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">
                          {appointmentStats.confirmed} RDV confirmés
                        </p>
                        <p className="text-xs text-slate-600">Statut actuel</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                      <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">
                          {appointmentStats.pending} RDV en attente
                        </p>
                        <p className="text-xs text-slate-600">
                          En attente de confirmation
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">
                          Prochain RDV
                        </p>
                        <p className="text-xs text-slate-600">
                          {nextAppointment
                            ? `Avec ${nextAppointment.medecin}`
                            : "Aucun RDV confirmé"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "agenda" && (
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
              {loadingAppointments ? (
                <LoadingSpinner message="Chargement des rendez-vous..." />
              ) : appointments.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="Aucun rendez-vous planifié"
                  description="Vous n'avez pas encore de rendez-vous de planifié."
                  buttonText="Prendre un rendez-vous"
                  onButtonClick={() => navigate("/trouver-medecin")}
                />
              ) : (
                <div className="space-y-4">
                  {appointments.map((app) => {
                    const statusNormalized = app.status?.trim().toLowerCase();
                    const config = statusConfig[statusNormalized] || {
                      bg: "bg-gray-50",
                      border: "border-gray-200",
                      badge: "bg-gray-100 text-gray-800",
                      icon: AlertCircle,
                      label: app.status,
                    };
                    const StatusIcon = config.icon;

                    return (
                      <div
                        key={app.id}
                        className={`${config.bg} ${config.border} border-2 p-6 rounded-2xl hover:shadow-lg transition-all duration-300`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                {app.medecin?.charAt(0) || "D"}
                              </div>
                              <div>
                                <p className="font-bold text-slate-800 text-lg">
                                  {app.medecin || "Médecin supprimé"}
                                </p>
                                <Badge className={config.badge}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {config.label}
                                </Badge>
                              </div>
                            </div>

                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2 text-slate-600">
                                <Calendar className="w-4 h-4 text-purple-500" />
                                {new Date(
                                  app.date + "T" + app.time
                                ).toLocaleDateString("fr-FR", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </div>
                              <div className="flex items-center gap-2 text-slate-600">
                                <Clock className="w-4 h-4 text-green-500" />
                                {new Date(
                                  app.date + "T" + app.time
                                ).toLocaleTimeString("fr-FR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                              <div className="flex items-center gap-2 text-slate-600">
                                <FileText className="w-4 h-4 text-blue-500" />
                                <span className="italic">
                                  {app.consultation_type}
                                </span>
                              </div>
                              {app.specialite && (
                                <div className="flex items-center gap-2 text-slate-600">
                                  <Stethoscope className="w-4 h-4 text-cyan-500" />
                                  <span>{app.specialite}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            {(app.status === "en_attente" ||
                              app.status === "en attente" ||
                              app.status === "confirmé" ||
                              app.status === "confirmé") &&
                              app.can_cancel !== false && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => cancelAppointment(app)}
                                  disabled={cancellingAppointment === app.id}
                                  className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
                                >
                                  {cancellingAppointment === app.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <XCircle className="w-4 h-4" />
                                  )}
                                  {cancellingAppointment === app.id
                                    ? "Annulation..."
                                    : "Annuler"}
                                </Button>
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "favoris" && (
          <Card className="glass-card border-0 shadow-xl">
            <CardHeader className="border-b border-slate-200/50">
              <CardTitle className="flex items-center gap-3 text-slate-800">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                Mes Médecins Favoris ({favorites.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {loadingFavorites ? (
                <LoadingSpinner message="Chargement des favoris..." />
              ) : favorites.length === 0 ? (
                <EmptyState
                  icon={Heart}
                  title="Aucun médecin favori"
                  description="Ajoutez des médecins à vos favoris pour les retrouver facilement ici."
                  buttonText="Trouver un médecin"
                  onButtonClick={() => navigate("/trouver-medecin")}
                />
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {favorites.map((medecin) => (
                    <div
                      key={medecin.id}
                      className="bg-white rounded-2xl border border-slate-200 transition-all duration-300 overflow-hidden group"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                              {medecin.photo_profil ? (
                                <img
                                  src={
                                    medecin.photo_profil
                                      ? `/assets/images/${medecin.photo_profil}`
                                      : defaultAvatar
                                  }
                                  alt={`Dr. ${medecin?.prenom || ""} ${
                                    medecin?.nom || ""
                                  }`}
                                  size={96}
                                  initials={`${
                                    medecin?.prenom?.charAt(0) ?? ""
                                  }${medecin?.nom?.charAt(0) ?? ""}`}
                                  className="rounded-2xl border-4 border-white shadow-xl"
                                />
                              ) : (
                                `${medecin.prenom?.charAt(
                                  0
                                )}${medecin.nom?.charAt(0)}`
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900 text-lg">
                                Dr. {medecin.prenom} {medecin.nom}
                              </h3>
                              <p className="text-blue-600 font-semibold text-sm">
                                {medecin.specialite}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromFavorites(medecin.id)}
                            className="text-red-500 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100"
                            title="Retirer des favoris"
                          >
                            <Heart className="w-5 h-5 fill-current" />
                          </button>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            <span className="truncate">
                              {medecin.address || "Adresse non renseignée"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <Stethoscope className="w-4 h-4 text-green-500" />
                            <span>
                              {medecin.experience_years || 0} ans d'expérience
                            </span>
                          </div>

                          {medecin.telephone && (
                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                              <Phone className="w-4 h-4 text-cyan-500" />
                              <span>{medecin.telephone}</span>
                            </div>
                          )}
                        </div>
                                                <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                            onClick={() =>
                              navigate(`/medecin/${medecin.id}`)
                            }
                          >
                            Voir profil
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
                            onClick={() =>
                              navigate("/prendre-rendezvous", {
                                state: { medecinId: medecin.id },
                              })
                            }
                          >
                            Prendre RDV
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "parametres" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sécurité */}
            <Card className="glass-card border-0 shadow-xl">
              <CardHeader className="border-b border-slate-200/50">
                <CardTitle className="flex items-center gap-3 text-slate-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  Sécurité du compte
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-slate-800">
                        Mot de passe
                      </p>
                      <p className="text-sm text-slate-600">
                        Dernière modification il y a 3 mois
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setChangePasswordOpen(true)}
                    variant="outline"
                    size="sm"
                  >
                    Modifier
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="font-medium text-slate-800">
                        Adresse email
                      </p>
                      <p className="text-sm text-slate-600">
                        {patient.email}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-300">
                    Vérifiée
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Actions critiques */}
            <Card className="glass-card border-0 shadow-xl">
              <CardHeader className="border-b border-slate-200/50">
                <CardTitle className="flex items-center gap-3 text-slate-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  Actions critiques
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Trash2 className="w-5 h-5 text-red-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-red-900 mb-2">
                        Supprimer le compte
                      </p>
                      <p className="text-sm text-red-700 mb-3">
                        Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                      </p>
                      <Button
                        onClick={() => setDeleteAccountOpen(true)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer mon compte
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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

export default ProfilPatient;