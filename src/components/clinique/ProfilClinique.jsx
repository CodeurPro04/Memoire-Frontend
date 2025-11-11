import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { AuthContext } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { useToast } from "@/components/ui/use-toast";
import defaultAvatar from "@/assets/default-avatar.png";

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
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  Edit,
  Save,
  X,
  Settings,
  Plus,
  Trash2,
  ShieldCheck,
  AlertCircle,
  Car,
  Stethoscope,
  UserPlus,
  Search,
  CheckCircle,
  Star,
  Award,
  Calendar,
  Eye,
  MessageSquare,
  XCircle,
  Upload,
  Loader2,
  Camera,
  EyeOff,
  Key,
  Lock,
  Info,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

// ============ COMPOSANTS MODALES RÉUTILISABLES ============

const ChangePasswordDialog = ({ open, onOpenChange, onPasswordChange }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les nouveaux mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Erreur",
        description: "Le nouveau mot de passe doit contenir au moins 6 caractères",
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
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
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
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Mot de passe actuel
            </label>
            <div className="relative group">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Entrez votre mot de passe actuel"
                required
                className="pr-12 h-12 border-slate-300/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 rounded-xl bg-white/50 backdrop-blur-sm"
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
              className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
                          Tous vos médecins seront détachés de votre clinique
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
                          Votre établissement sera retiré de la plateforme
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

// Composant SafeAvatar pour les cliniques (identique aux médecins)
const SafeAvatar = ({
  src,
  alt,
  size = 96,
  initials,
  className = "",
  fallback = defaultAvatar,
}) => {
  const [imgError, setImgError] = useState(false);

  const handleError = () => {
    setImgError(true);
  };

  if (imgError || !src) {
    return (
      <div
        className={`bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold ${className}`}
        style={{ width: size, height: size }}
      >
        {initials ? (
          <span className="text-lg">{initials}</span>
        ) : (
          <Building2 className="w-8 h-8" />
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={handleError}
      className={`object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

// Composant Star Rating
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

const ProfilClinique = () => {
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [clinique, setClinique] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    address: "",
    description: "",
    type_etablissement: "",
    urgences_24h: false,
    parking_disponible: false,
    site_web: "",
  });
  const [medecins, setMedecins] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profil");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  // États pour les modales
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  // État pour l'ajout de médecins
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [searchMedecin, setSearchMedecin] = useState("");
  const [medecinsList, setMedecinsList] = useState([]);
  const [selectedMedecin, setSelectedMedecin] = useState(null);
  const [fonction, setFonction] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // États pour les notes des médecins
  const [medecinsRatings, setMedecinsRatings] = useState({});
  const [loadingRatings, setLoadingRatings] = useState(false);

  // État pour l'aperçu de l'image
  const [imagePreview, setImagePreview] = useState(null);

  // Fonction pour construire l'URL de l'image
  const getImageUrl = useCallback((photoProfil) => {
    if (!photoProfil) return null;

    const baseUrl = "http://localhost:8000";
    return `${baseUrl}/assets/images/${photoProfil}?t=${new Date().getTime()}`;
  }, []);

  // Fonction pour uploader la photo avec aperçu immédiat
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

    // Aperçu immédiat de l'image
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    try {
      setUploadingPhoto(true);

      const formDataUpload = new FormData();
      formDataUpload.append("photo_profil", file);

      const response = await api.post(
        "/clinique/profile/photo",
        formDataUpload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const newPhotoUrl = response.data.photo_url;
      const newPhotoPath = response.data.photo_profil;

      // Mise à jour immédiate des états avec cache-busting
      setClinique((prev) => ({
        ...prev,
        photo_profil: newPhotoPath,
        photo_url: newPhotoUrl,
      }));

      // Réinitialiser l'aperçu après succès
      setImagePreview(null);

      toast({
        title: "Succès",
        description: "Photo de profil mise à jour avec succès !",
        variant: "default",
      });
    } catch (error) {
      console.error("Erreur upload photo:", error);
      // Réinitialiser l'aperçu en cas d'erreur
      setImagePreview(null);

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
          description: "Le fichier dépasse la taille maximale autorisée (5 Mo).",
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

  // Charger les données du profil
  const fetchProfileData = useCallback(async () => {
    if (role !== "clinique") return;

    try {
      const { data: profil } = await api.get("/clinique/profile");
      setClinique(profil);

      setFormData({
        nom: profil.nom || "",
        email: profil.email || "",
        telephone: profil.telephone || "",
        address: profil.address || "",
        description: profil.description || "",
        type_etablissement: profil.type_etablissement || "",
        urgences_24h: profil.urgences_24h || false,
        parking_disponible: profil.parking_disponible || false,
        site_web: profil.site_web || "",
      });

      const medecinsData = profil.medecins || [];
      setMedecins(medecinsData);

      // Charger les notes des médecins
      if (medecinsData.length > 0) {
        await fetchMedecinsRatings(medecinsData);
      }
    } catch (err) {
      console.error("❌ Erreur chargement données :", err);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement du profil",
        variant: "destructive",
      });
    }
  }, [role, toast]);

  // Charger les notes des médecins
  const fetchMedecinsRatings = useCallback(async (medecinsList) => {
    if (!medecinsList.length) return;

    setLoadingRatings(true);
    try {
      const ratingsPromises = medecinsList.map(async (medecin) => {
        try {
          const response = await api.get(
            `/medecins/${medecin.id}/reviews/stats`
          );
          return {
            id: medecin.id,
            average_rating: response.data.average_rating || 0,
            total_reviews: response.data.total_reviews || 0,
          };
        } catch (error) {
          console.error(
            `Erreur chargement notes médecin ${medecin.id}:`,
            error
          );
          return {
            id: medecin.id,
            average_rating: 0,
            total_reviews: 0,
          };
        }
      });

      const ratingsResults = await Promise.all(ratingsPromises);
      const ratingsMap = {};
      ratingsResults.forEach((rating) => {
        ratingsMap[rating.id] = rating;
      });
      setMedecinsRatings(ratingsMap);
    } catch (error) {
      console.error("Erreur lors du chargement des notes:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des notes des médecins",
        variant: "destructive",
      });
    } finally {
      setLoadingRatings(false);
    }
  }, [toast]);

  // Fonction pour obtenir la note d'un médecin
  const getMedecinRating = (medecinId) => {
    const ratingData = medecinsRatings[medecinId];
    if (!ratingData) return { average: "0.0", total: 0 };

    return {
      average: parseFloat(ratingData.average_rating || 0).toFixed(1),
      total: ratingData.total_reviews || 0,
    };
  };

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Recherche dynamique des médecins avec debounce
  const searchMedecins = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) {
      setMedecinsList([]);
      return;
    }

    setSearchLoading(true);
    try {
      const { data } = await api.get(
        `/medecins?search=${encodeURIComponent(searchTerm)}`
      );

      const filteredResults = Array.isArray(data)
        ? data.filter((medecin) => {
            const fullName =
              `Dr. ${medecin.prenom} ${medecin.nom}`.toLowerCase();
            const searchLower = searchTerm.toLowerCase();

            return (
              fullName.includes(searchLower) ||
              medecin.prenom?.toLowerCase().includes(searchLower) ||
              medecin.nom?.toLowerCase().includes(searchLower) ||
              medecin.specialite?.toLowerCase().includes(searchLower) ||
              medecin.email?.toLowerCase().includes(searchLower)
            );
          })
        : [];

      setMedecinsList(filteredResults);
    } catch (err) {
      console.error("Erreur recherche médecins:", err);
      toast({
        title: "Erreur",
        description: "Erreur lors de la recherche",
        variant: "destructive",
      });
      setMedecinsList([]);
    } finally {
      setSearchLoading(false);
    }
  }, [toast]);

  // Gestion du changement de recherche avec debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchMedecin(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const newTimeout = setTimeout(() => {
      searchMedecins(value);
    }, 500);
    setSearchTimeout(newTimeout);
  };

  // Nettoyer le timeout à la destruction du composant
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Réinitialiser la recherche quand on ferme le modal
  const handleCloseModal = () => {
    setShowAddDoctor(false);
    setSelectedMedecin(null);
    setSearchMedecin("");
    setFonction("");
    setMedecinsList([]);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
  };

  // Ajouter un médecin
  const handleAddMedecin = async () => {
    if (!selectedMedecin) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un médecin",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data } = await api.post("/clinique/medecins/add", {
        medecin_id: selectedMedecin.id,
        fonction: fonction,
      });

      setClinique(data.clinique);
      const newMedecins = data.clinique.medecins || [];
      setMedecins(newMedecins);

      // Recharger les notes pour le nouveau médecin
      if (newMedecins.length > 0) {
        await fetchMedecinsRatings(newMedecins);
      }

      handleCloseModal();
      toast({
        title: "Succès",
        description: "Médecin ajouté avec succès à votre clinique",
        variant: "default",
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erreur lors de l'ajout du médecin";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Retirer un médecin
  const handleRemoveMedecin = async (medecinId) => {
    if (!confirm("Êtes-vous sûr de vouloir retirer ce médecin ?")) return;

    try {
      const { data } = await api.delete(`/clinique/medecins/${medecinId}`);
      setClinique(data.clinique);
      setMedecins(data.clinique.medecins || []);
      toast({
        title: "Succès",
        description: "Médecin retiré avec succès",
        variant: "default",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  // Voir les avis d'un médecin
  const handleViewReviews = (medecinId) => {
    navigate(`/profil-medecin/${medecinId}?tab=avis`);
  };

  // Voir le profil d'un médecin
  const handleViewProfile = (medecinId) => {
    navigate(`/profil-medecin/${medecinId}`);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data } = await api.put("/clinique/profile", formData);
      setClinique(data.clinique);
      setEditMode(false);
      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès !",
        variant: "default",
      });
    } catch (error) {
      console.error("Erreur de mise à jour :", error);
      const errorMessage = error.response?.data?.message || "Erreur lors de la mise à jour du profil";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Annuler les modifications
  const handleCancel = () => {
    setEditMode(false);
    setImagePreview(null);
    // Recharger les données originales
    if (clinique) {
      setFormData({
        nom: clinique.nom || "",
        email: clinique.email || "",
        telephone: clinique.telephone || "",
        address: clinique.address || "",
        description: clinique.description || "",
        type_etablissement: clinique.type_etablissement || "",
        urgences_24h: clinique.urgences_24h || false,
        parking_disponible: clinique.parking_disponible || false,
        site_web: clinique.site_web || "",
      });
    }
  };

  // Gestionnaire pour le changement de mot de passe
  const handlePasswordChange = useCallback(
    async (currentPassword, newPassword) => {
      try {
        await api.put("/clinique/profile/password", {
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

  // Gestionnaire pour la suppression de compte
  const handleAccountDelete = useCallback(async () => {
    try {
      await api.delete("/clinique/profile");

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

  // Composant Carte Médecin amélioré avec SafeAvatar
  const MedecinCard = ({ medecin }) => {
    const rating = getMedecinRating(medecin.id);
    const [showRatingDetails, setShowRatingDetails] = useState(false);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-6 rounded-2xl hover:shadow-lg transition-all relative group"
        onMouseEnter={() => setShowRatingDetails(true)}
        onMouseLeave={() => setShowRatingDetails(false)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative">
              <SafeAvatar
                src={
                  medecin.photo_profil
                    ? `/assets/images/${medecin.photo_profil}`
                    : null
                }
                alt={`Dr. ${medecin.prenom} ${medecin.nom}`}
                size={64}
                initials={`${medecin.prenom?.charAt(0) || ""}${
                  medecin.nom?.charAt(0) || ""
                }`}
                className="rounded-xl"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-800 text-lg mb-1">
                Dr. {medecin.prenom} {medecin.nom}
              </h3>
              <p className="text-emerald-600 font-semibold text-sm mb-2">
                {medecin.specialite}
              </p>
              {medecin.pivot?.fonction && (
                <Badge className="bg-teal-100 text-teal-700 border-0 text-xs">
                  {medecin.pivot.fonction}
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRemoveMedecin(medecin.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center bg-white rounded-lg p-2">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold text-slate-900">
                {medecin.experience_years && medecin.experience_years > 0
                  ? `${medecin.experience_years}+`
                  : "Non spécifié"}
              </span>
            </div>
            <span className="text-xs text-slate-500">ans exp.</span>
          </div>

          <div className="text-center bg-white rounded-lg p-2">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-bold text-slate-900">
                {rating.average}
              </span>
            </div>
            <span className="text-xs text-slate-500">
              {rating.total > 0 ? `${rating.total} avis` : "Aucun avis"}
            </span>
          </div>

          <div className="text-center bg-white rounded-lg p-2">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-bold text-slate-900">
                {medecin.disponibilite === "Aujourd'hui" ? "Dispo" : "Sur RDV"}
              </span>
            </div>
            <span className="text-xs text-slate-500">aujourd'hui</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewProfile(medecin.id)}
            className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400"
          >
            <Eye className="w-4 h-4 mr-2" />
            Voir profil
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewReviews(medecin.id)}
            className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
            disabled={rating.total === 0}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Voir avis
          </Button>
        </div>
      </motion.div>
    );
  };

  if (!clinique) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 animate-ping opacity-20"></div>
          </div>
          <p className="text-slate-600 font-medium">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header Hero */}
      <div className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500 px-4 md:px-6 py-20 md:py-32 overflow-hidden">
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

        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Logo clinique - VERSION AMÉLIORÉE AVEC SafeAvatar */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition"></div>

              <div className="relative">
                {/* Aperçu immédiat OU SafeAvatar pour l'image existante */}
                {imagePreview ? (
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-white/50 shadow-2xl backdrop-blur-xl bg-white/10">
                    <img
                      src={imagePreview}
                      alt="Aperçu de l'image"
                      className="w-full h-full object-cover"
                    />
                    {uploadingPhoto && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative inline-block">
                    <SafeAvatar
                      src={
                        clinique.photo_profil
                          ? `/assets/images/${clinique.photo_profil}`
                          : null
                      }
                      alt={clinique.nom}
                      size={128}
                      initials={clinique.nom?.charAt(0) || "C"}
                      className="rounded-2xl border-4 border-white/50 shadow-2xl backdrop-blur-xl"
                    />

                    {/* Indicateur de chargement */}
                    {uploadingPhoto && (
                      <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                )}

                {/* Badge vérifié */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center border-4 border-white">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>

                {/* Bouton d'upload amélioré */}
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
                      className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed border-4 border-white"
                      title="Changer la photo"
                    >
                      {uploadingPhoto ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Camera className="w-5 h-5" />
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Informations principales */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-3">
                  {clinique.nom}
                  <CheckCircle className="w-6 h-6 text-teal-300" />
                </h1>
                <p className="text-teal-100 text-lg">
                  {clinique.type_etablissement || "Établissement médical"}
                </p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 px-4 py-2 text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  {medecins.length} médecin{medecins.length > 1 ? "s" : ""}
                </Badge>

                {clinique.urgences_24h && (
                  <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 px-4 py-2 text-sm">
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Urgences 24h/24
                  </Badge>
                )}

                {clinique.parking_disponible && (
                  <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 px-4 py-2 text-sm">
                    <Car className="w-4 h-4 mr-2" />
                    Parking
                  </Badge>
                )}
              </div>
            </div>

            <Button
              onClick={() => (editMode ? handleCancel() : setEditMode(true))}
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
        {/* Onglets */}
        <div className="bg-white/70 backdrop-blur-md border-0 shadow-lg rounded-2xl p-1.5 mb-8">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveTab("profil")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "profil"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Profil</span>
            </button>
            <button
              onClick={() => setActiveTab("medecins")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "medecins"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span className="hidden sm:inline">
                Médecins ({medecins.length})
              </span>
            </button>
            <button
              onClick={() => setActiveTab("parametres")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "parametres"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Paramètres</span>
            </button>
          </div>
        </div>

        {/* Onglet Profil */}
        {activeTab === "profil" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card className="bg-white/70 backdrop-blur-md border-0 shadow-xl">
                <CardHeader className="border-b border-slate-200/50">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    À propos
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {editMode ? (
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Décrivez votre établissement, vos services et équipements..."
                      className="min-h-[150px] resize-vertical"
                    />
                  ) : (
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                      {clinique.description || "Aucune description"}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Informations */}
            <div className="space-y-6">
              <Card className="bg-white/70 backdrop-blur-md border-0 shadow-xl">
                <CardHeader className="border-b border-slate-200/50">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Settings className="w-5 h-5 text-white" />
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
                        onChange={handleChange}
                        placeholder="email@exemple.com"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Mail className="w-5 h-5 text-emerald-500" />
                        <span className="text-slate-700">{clinique.email}</span>
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
                        onChange={handleChange}
                        placeholder="+33 1 23 45 67 89"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Phone className="w-5 h-5 text-green-500" />
                        <span className="text-slate-700">
                          {clinique.telephone}
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
                        onChange={handleChange}
                        placeholder="123 Rue de l'exemple, 75000 Paris"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-red-500" />
                        <span className="text-slate-700">
                          {clinique.address}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Site web */}
                  {(editMode || clinique.site_web) && (
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                        Site web
                      </label>
                      {editMode ? (
                        <Input
                          name="site_web"
                          value={formData.site_web}
                          onChange={handleChange}
                          placeholder="https://www.exemple.com"
                        />
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <Globe className="w-5 h-5 text-blue-500" />
                          <a
                            href={clinique.site_web}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {clinique.site_web}
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Type établissement */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                      Type d'établissement
                    </label>
                    {editMode ? (
                      <Input
                        name="type_etablissement"
                        value={formData.type_etablissement}
                        onChange={handleChange}
                        placeholder="Clinique privée, Hôpital public..."
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Building2 className="w-5 h-5 text-teal-500" />
                        <span className="text-slate-700">
                          {clinique.type_etablissement}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Options */}
                  {editMode && (
                    <div className="space-y-3 pt-2">
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          name="urgences_24h"
                          checked={formData.urgences_24h}
                          onChange={handleChange}
                          className="w-5 h-5 text-emerald-500 rounded focus:ring-2 focus:ring-emerald-500"
                        />
                        <div>
                          <span className="text-slate-700 font-medium">
                            Urgences 24h/24
                          </span>
                          <p className="text-xs text-slate-500">
                            Service d'urgence disponible 24h/24 et 7j/7
                          </p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          name="parking_disponible"
                          checked={formData.parking_disponible}
                          onChange={handleChange}
                          className="w-5 h-5 text-emerald-500 rounded focus:ring-2 focus:ring-emerald-500"
                        />
                        <div>
                          <span className="text-slate-700 font-medium">
                            Parking disponible
                          </span>
                          <p className="text-xs text-slate-500">
                            Parking gratuit ou payant pour les patients
                          </p>
                        </div>
                      </label>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "profil" && editMode && (
          <div className="flex justify-end gap-3 mt-8">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-slate-300 hover:bg-slate-50"
            >
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        )}

        {/* Onglet Médecins */}
        {activeTab === "medecins" && (
          <div className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-md border-0 shadow-xl">
              <CardHeader className="border-b border-slate-200/50">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-white" />
                    </div>
                    Équipe médicale ({medecins.length})
                  </CardTitle>
                  <Button
                    onClick={() => setShowAddDoctor(true)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Ajouter un médecin
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {loadingRatings && (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center gap-2 text-slate-500">
                      <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      Chargement des notes...
                    </div>
                  </div>
                )}

                {medecins.length === 0 ? (
                  <div className="text-center py-12">
                    <Stethoscope className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Aucun médecin enregistré</p>
                    <Button
                      onClick={() => setShowAddDoctor(true)}
                      className="mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Ajouter votre premier médecin
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {medecins.map((medecin) => (
                      <MedecinCard key={medecin.id} medecin={medecin} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Modal Ajout médecin */}
            {showAddDoctor && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                      <UserPlus className="w-6 h-6 text-emerald-500" />
                      Ajouter un médecin
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCloseModal}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Rechercher un médecin par nom, prénom ou spécialité
                      </label>
                      <div className="relative">
                        <Input
                          value={searchMedecin}
                          onChange={handleSearchChange}
                          placeholder="Ex: Dr. Dupont, Cardiologie..."
                          className="pr-10"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {searchLoading ? (
                            <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Search className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Tapez au moins 2 caractères pour lancer la recherche
                      </p>
                    </div>

                    {medecinsList.length > 0 && (
                      <div>
                        <p className="text-sm text-slate-600 mb-2">
                          {medecinsList.length} médecin(s) trouvé(s)
                        </p>
                        <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-lg">
                          {medecinsList.map((med) => (
                            <div
                              key={med.id}
                              onClick={() => setSelectedMedecin(med)}
                              className={`p-4 cursor-pointer hover:bg-emerald-50 transition-colors border-b border-slate-100 last:border-b-0 ${
                                selectedMedecin?.id === med.id
                                  ? "bg-emerald-100 border-l-4 border-emerald-500"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                  {med.prenom?.charAt(0)}
                                  {med.nom?.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-slate-800 truncate">
                                    Dr. {med.prenom} {med.nom}
                                  </p>
                                  <p className="text-sm text-emerald-600 truncate">
                                    {med.specialite}
                                  </p>
                                  {med.email && (
                                    <p className="text-xs text-slate-500 mt-1 truncate">
                                      {med.email}
                                    </p>
                                  )}
                                </div>
                                {selectedMedecin?.id === med.id && (
                                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchMedecin &&
                      searchMedecin.length >= 2 &&
                      medecinsList.length === 0 &&
                      !searchLoading && (
                        <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
                          <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                          <p className="font-medium">Aucun médecin trouvé</p>
                          <p className="text-sm mt-1">
                            Vérifiez l'orthographe ou essayez d'autres termes
                          </p>
                        </div>
                      )}

                    {selectedMedecin && (
                      <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-lg">
                        <p className="text-sm font-semibold text-slate-700 mb-2">
                          Médecin sélectionné :
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold">
                            {selectedMedecin.prenom?.charAt(0)}
                            {selectedMedecin.nom?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">
                              Dr. {selectedMedecin.prenom} {selectedMedecin.nom}
                            </p>
                            <p className="text-sm text-emerald-600">
                              {selectedMedecin.specialite}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Fonction dans la clinique (optionnel)
                      </label>
                      <Input
                        value={fonction}
                        onChange={(e) => setFonction(e.target.value)}
                        placeholder="Ex: Chef de service, Médecin attaché, Cardiologue..."
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Cette information sera visible sur le profil public
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={handleCloseModal}
                        className="flex-1 border-slate-300 hover:bg-slate-50"
                      >
                        Annuler
                      </Button>
                      <Button
                        onClick={handleAddMedecin}
                        disabled={!selectedMedecin}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {selectedMedecin ? "Ajouter" : "Sélectionnez"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        )}

        {/* Onglet Paramètres */}
        {activeTab === "parametres" && (
          <Card className="bg-white/70 backdrop-blur-md border-0 shadow-xl">
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

export default ProfilClinique;