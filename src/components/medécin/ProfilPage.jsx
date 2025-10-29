import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { AuthContext } from "@/context/AuthContext";
import api from "@/api/axios";
import { toast } from "sonner";
import defaultAvatar from "@/assets/default-avatar.png";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
  Plus,
  Trash2,
  ShieldCheck,
  Globe,
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
} from "lucide-react";

// Composant Star Rating réutilisable
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

const ProfilMedecin = () => {
  const { role, user, token } = useContext(AuthContext);
  const [medecin, setMedecin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
  const [workingHours, setWorkingHours] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profil");
  const [newDay, setNewDay] = useState("");
  const [newHours, setNewHours] = useState("");
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [missingFields, setMissingFields] = useState([]);
  const fileInputRef = useRef(null);

  // États pour les avis
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long" });

  const defaultHours = [
    { day: "Lundi", hours: "09:00 - 12:30 | 14:00 - 18:00" },
    { day: "Mardi", hours: "09:00 - 12:30 | 14:00 - 18:00" },
    { day: "Mercredi", hours: "09:00 - 12:30" },
    { day: "Jeudi", hours: "09:00 - 12:30 | 14:00 - 18:00" },
    { day: "Vendredi", hours: "09:00 - 12:30 | 14:00 - 17:00" },
  ];

  // Calculer le pourcentage de complétion du profil
  const calculateProfileCompletion = useCallback((medecinData) => {
    const fields = [
      { key: "specialite", weight: 15 },
      { key: "bio", weight: 10 },
      { key: "address", weight: 10 },
      { key: "telephone", weight: 10 },
      { key: "experience_years", weight: 10 },
      { key: "languages", weight: 10 },
      { key: "professional_background", weight: 10 },
      { key: "consultation_price", weight: 10 },
      { key: "working_hours", weight: 15 },
    ];

    let completion = 0;
    const missing = [];

    fields.forEach((field) => {
      const value = medecinData[field.key];
      if (
        value &&
        (typeof value === "string"
          ? value.trim() !== ""
          : Array.isArray(value)
          ? value.length > 0
          : value !== null && value !== undefined && value !== "")
      ) {
        completion += field.weight;
      } else {
        missing.push(field.key);
      }
    });

    // Ajouter le pourcentage de base pour les champs obligatoires
    completion += 10; // Pour l'email qui est toujours présent

    setProfileCompletion(Math.min(completion, 100));
    setMissingFields(missing);
  }, []);

  // Charger les données du médecin
  const fetchMedecinData = useCallback(async () => {
    if (role !== "medecin") return;

    try {
      setLoading(true);
      const [profilResponse, rdvsResponse] = await Promise.all([
        api.get("/medecin/profile"),
        api.get("/medecin/appointments"),
      ]);

      const profil = profilResponse.data;
      setMedecin(profil);

      // Mettre à jour formData avec les données actuelles
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

      setWorkingHours(profil.working_hours || defaultHours);
      setAppointments(rdvsResponse.data);

      // Calculer la complétion du profil
      calculateProfileCompletion(profil);
    } catch (err) {
      console.error("❌ Erreur chargement données :", err);
      toast.error("Erreur lors du chargement du profil");
    } finally {
      setLoading(false);
    }
  }, [role, calculateProfileCompletion]);

  // Charger les avis et statistiques
  const fetchReviews = useCallback(async () => {
    if (!medecin?.id) return;

    try {
      setLoadingReviews(true);
      const [reviewsResponse, statsResponse] = await Promise.all([
        api.get(`/medecins/${medecin.id}/reviews`),
        api.get(`/medecins/${medecin.id}/reviews/stats`),
      ]);
      setReviews(reviewsResponse.data);
      setReviewStats(statsResponse.data);
    } catch (error) {
      console.error("Erreur lors du chargement des avis:", error);
    } finally {
      setLoadingReviews(false);
    }
  }, [medecin?.id]);

  // Effet principal pour charger les données
  useEffect(() => {
    fetchMedecinData();
  }, [fetchMedecinData]);

  // Charger les avis quand le médecin est disponible
  useEffect(() => {
    if (medecin?.id) {
      fetchReviews();
    }
  }, [medecin?.id, fetchReviews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fonction pour confirmer un rendez-vous
  const handleConfirmAppointment = async (appointmentId) => {
    try {
      const response = await api.patch(
        `/medecin/appointments/${appointmentId}/confirm`
      );

      // Mettre à jour l'état local
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId ? { ...app, status: "confirmé" } : app
        )
      );

      toast.success("Rendez-vous confirmé avec succès");
    } catch (error) {
      console.error("Erreur confirmation rendez-vous:", error);
      toast.error("Erreur lors de la confirmation du rendez-vous");
    }
  };

  // Fonction pour refuser un rendez-vous
  const handleRejectAppointment = async (appointmentId) => {
    try {
      const response = await api.patch(
        `/medecin/appointments/${appointmentId}/reject`,
        {
          reason: "Rendez-vous refusé par le médecin",
        }
      );

      // Mettre à jour l'état local
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId ? { ...app, status: "refusé" } : app
        )
      );

      toast.success("Rendez-vous refusé");
    } catch (error) {
      console.error("Erreur refus rendez-vous:", error);
      toast.error("Erreur lors du refus du rendez-vous");
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Préparer les données pour l'API
      const updateData = {
        ...formData,
        insurance_accepted: formData.insurance_accepted === "1" ? 1 : 0,
        experience_years: formData.experience_years
          ? parseInt(formData.experience_years)
          : null,
        consultation_price: formData.consultation_price
          ? parseInt(formData.consultation_price)
          : null,
      };

      // Envoyer les mises à jour en parallèle
      const [profileRes, hoursRes] = await Promise.all([
        api.put("/medecin/profile", updateData),
        api.put("/medecin/working-hours", {
          working_hours: workingHours,
        }),
      ]);

      // Mettre à jour l'état local avec les nouvelles données
      const updatedMedecin = {
        ...profileRes.data,
        working_hours: hoursRes.data.working_hours,
      };

      setMedecin(updatedMedecin);
      calculateProfileCompletion(updatedMedecin);

      setEditMode(false);
      toast.success("✅ Profil mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur de mise à jour :", error);
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier la taille du fichier (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'image doit faire moins de 2MB");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("photo_profil", file);

      const response = await api.post("/medecin/profile/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMedecin((prev) => ({
        ...prev,
        photo_profil: response.data.photo_profil,
      }));
      toast.success("Photo de profil mise à jour");
    } catch (error) {
      console.error("Erreur upload photo:", error);
      toast.error("Erreur lors du téléchargement de la photo");
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const addWorkingDay = () => {
    if (newDay && newHours) {
      const updatedHours = [...workingHours, { day: newDay, hours: newHours }];
      setWorkingHours(updatedHours);
      setNewDay("");
      setNewHours("");
    }
  };

  const removeWorkingDay = (index) => {
    setWorkingHours((prev) => prev.filter((_, i) => i !== index));
  };

  // Composant pour l'alerte de profil incomplet
  const ProfileCompletionAlert = () => {
    if (profileCompletion >= 100) return null;

    const getFieldLabel = (field) => {
      const labels = {
        specialite: "Spécialité",
        bio: "Biographie",
        address: "Adresse",
        telephone: "Téléphone",
        experience_years: "Années d'expérience",
        languages: "Langues parlées",
        professional_background: "Parcours professionnel",
        consultation_price: "Prix de consultation",
        working_hours: "Horaires de travail",
      };
      return labels[field] || field;
    };

    return (
      <div className="mb-6">
        <Card className="border-amber-200 bg-amber-50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 mb-2">
                  Complétez votre profil pour améliorer votre visibilité
                </h3>
                <p className="text-amber-700 text-sm mb-4">
                  Votre profil est complété à {profileCompletion}%. Les patients
                  préfèrent les profils complets.
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-amber-800">
                    <span>Progression du profil</span>
                    <span>{profileCompletion}%</span>
                  </div>
                  <Progress
                    value={profileCompletion}
                    className="h-2 bg-amber-200"
                  >
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </Progress>
                </div>

                {missingFields.length > 0 && (
                  <div>
                    <p className="text-amber-700 text-sm font-medium mb-2">
                      Informations manquantes :
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {missingFields.map((field) => (
                        <Badge
                          key={field}
                          variant="outline"
                          className="bg-white text-amber-700 border-amber-300"
                        >
                          {getFieldLabel(field)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => setEditMode(true)}
                  className="mt-4 bg-amber-500 hover:bg-amber-600 text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Compléter mon profil
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Composant pour l'onglet Avis
  const AvisContent = () => (
    <Card className="glass-card border-0 shadow-xl">
      <CardHeader className="border-b border-slate-200/50">
        <CardTitle className="flex items-center gap-3 text-slate-800">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
            <ThumbsUp className="w-5 h-5 text-white" />
          </div>
          Avis des Patients ({reviewStats?.total_reviews || 0})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {loadingReviews ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
            <p className="text-slate-500 mt-4">Chargement des avis...</p>
          </div>
        ) : (
          <>
            {/* Statistiques des avis */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                <h3 className="font-semibold text-slate-800 mb-4">
                  Note moyenne
                </h3>
                <div className="flex items-center gap-6">
                  <div className="text-5xl font-bold text-amber-600">
                    {reviewStats?.average_rating
                      ? parseFloat(reviewStats.average_rating).toFixed(1)
                      : "0.0"}
                  </div>
                  <div>
                    <StarRating
                      rating={Math.round(reviewStats?.average_rating || 0)}
                      readonly
                      size="lg"
                    />
                    <p className="text-slate-600 text-sm mt-2">
                      Sur {reviewStats?.total_reviews || 0} avis
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
                    const totalReviews = reviewStats?.total_reviews || 0;
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

            {/* Liste des avis */}
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
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
                ))
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-dashed border-slate-300">
                  <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Aucun avis pour le moment
                  </h3>
                  <p className="text-slate-600">
                    Les avis de vos patients apparaîtront ici.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  // Composant pour l'onglet Agenda
  const AgendaContent = () => (
    <Card className="glass-card border-0 shadow-xl">
      <CardHeader className="border-b border-slate-200/50">
        <CardTitle className="flex items-center gap-3 text-slate-800">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          Mes Rendez-vous ({appointments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Aucun rendez-vous planifié</p>
          </div>
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

  // Composant Carte de Rendez-vous
  const AppointmentCard = ({ appointment, onConfirm, onReject }) => {
    const statusConfig = {
      en_attente: {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        badge: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      },
      confirmé: {
        bg: "bg-green-50",
        border: "border-green-200",
        badge: "bg-green-100 text-green-800",
        icon: CheckCircle2,
      },
      refusé: {
        bg: "bg-red-50",
        border: "border-red-200",
        badge: "bg-red-100 text-red-800",
        icon: XCircle,
      },
    };

    const config =
      statusConfig[appointment.status] || statusConfig["en_attente"];
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
                  {appointment.status === "en_attente"
                    ? "En attente"
                    : appointment.status === "confirmé"
                    ? "Confirmé"
                    : "Refusé"}
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
  };

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
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Photo de profil */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition"></div>
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/50 shadow-2xl backdrop-blur-xl bg-white/10">
                <img
                  src={medecin.photo_profil || defaultAvatar}
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
                  />
                  <button
                    onClick={triggerFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 bg-black/60 flex items-center justify-center transition-opacity rounded-full cursor-pointer"
                  >
                    <Upload className="w-8 h-8 text-white" />
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

            {/* Informations principales */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-3">
                  Dr. {medecin.prenom} {medecin.nom}
                  {profileCompletion >= 100 && (
                    <Sparkles className="w-6 h-6 text-yellow-300" />
                  )}
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

                <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 px-4 py-2 text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  {(() => {
                    const todayLower = today.toLowerCase();
                    const todayHours = medecin.working_hours?.find(
                      (wh) => wh.day.toLowerCase() === todayLower
                    );
                    return todayHours ? `Ouvert aujourd'hui` : "Fermé";
                  })()}
                </Badge>

                <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 px-4 py-2 text-sm">
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Assurances{" "}
                  {medecin.insurance_accepted === 1
                    ? "acceptées"
                    : "non acceptées"}
                </Badge>

                {/* Badge de complétion du profil */}
                <Badge
                  className={`${
                    profileCompletion >= 100
                      ? "bg-green-500/20 text-green-200 border-green-300/30"
                      : "bg-amber-500/20 text-amber-200 border-amber-300/30"
                  } backdrop-blur-md border px-4 py-2 text-sm`}
                >
                  {profileCompletion >= 100 ? (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 mr-2" />
                  )}
                  Profil{" "}
                  {profileCompletion >= 100
                    ? "complet"
                    : `${profileCompletion}%`}
                </Badge>
              </div>

              {medecin.languages && (
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {(Array.isArray(medecin.languages)
                    ? medecin.languages
                    : medecin.languages.split(",")
                  ).map((langue, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm"
                    >
                      <Globe className="w-3 h-3 inline mr-1" />
                      {langue.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={() => setEditMode(!editMode)}
              disabled={saving}
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
        {/* Alerte de profil incomplet */}
        <ProfileCompletionAlert />

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Patients ce mois-ci */}
          <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {(() => {
                  const currentMonthAppointments = appointments.filter(
                    (app) => {
                      if (!app.date) return false;
                      const appointmentDate = new Date(app.date);
                      const currentDate = new Date();
                      return (
                        appointmentDate.getMonth() === currentDate.getMonth() &&
                        appointmentDate.getFullYear() ===
                          currentDate.getFullYear() &&
                        app.status === "confirmé"
                      );
                    }
                  );
                  return currentMonthAppointments.length;
                })()}
              </p>
              <p className="text-sm text-slate-600 mt-1">Patients/mois</p>
            </CardContent>
          </Card>

          {/* Note moyenne */}
          <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                {reviewStats?.average_rating
                  ? parseFloat(reviewStats.average_rating).toFixed(1)
                  : "0.0"}
              </p>
              <p className="text-sm text-slate-600 mt-1">Note moyenne</p>
              {reviewStats?.total_reviews > 0 && (
                <p className="text-xs text-slate-500 mt-1">
                  ({reviewStats.total_reviews} avis)
                </p>
              )}
            </CardContent>
          </Card>

          {/* Taux de satisfaction */}
          <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {reviewStats?.average_rating
                  ? Math.min(
                      Math.round((reviewStats.average_rating / 5) * 100),
                      100
                    )
                  : "0"}
                %
              </p>
              <p className="text-sm text-slate-600 mt-1">Satisfaction</p>
            </CardContent>
          </Card>

          {/* Rendez-vous à venir */}
          <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {
                  appointments.filter((app) => {
                    if (!app.date) return false;
                    const appointmentDate = new Date(app.date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return (
                      appointmentDate >= today && app.status === "confirmé"
                    );
                  }).length
                }
              </p>
              <p className="text-sm text-slate-600 mt-1">RDV à venir</p>
            </CardContent>
          </Card>
        </div>

        {/* Onglets personnalisés */}
        <div className="glass-card border-0 shadow-lg rounded-2xl p-1.5 mb-8">
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setActiveTab("profil")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "profil"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
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
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
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
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
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
            {/* Colonne principale */}
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
                      onChange={handleChange}
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

              {/* Horaires */}
              <Card className="glass-card border-0 shadow-xl">
                <CardHeader className="border-b border-slate-200/50">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    Horaires de Consultation
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {workingHours.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        {editMode ? (
                          <>
                            <Input
                              value={item.day}
                              onChange={(e) => {
                                const updated = [...workingHours];
                                updated[idx].day = e.target.value;
                                setWorkingHours(updated);
                              }}
                              className="w-32 mr-3"
                            />
                            <Input
                              value={item.hours}
                              onChange={(e) => {
                                const updated = [...workingHours];
                                updated[idx].hours = e.target.value;
                                setWorkingHours(updated);
                              }}
                              className="flex-1 mr-3"
                              placeholder="Ex: 09:00 - 12:30 | 14:00 - 18:00"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeWorkingDay(idx)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <span className="font-semibold text-slate-700 min-w-[100px]">
                              {item.day}
                            </span>
                            <span className="text-slate-600">{item.hours}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {editMode && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                      <h4 className="font-semibold text-slate-800 mb-3">
                        Ajouter un nouveau créneau
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          value={newDay}
                          onChange={(e) => setNewDay(e.target.value)}
                          placeholder="Jour (ex: Lundi)"
                          className="border-blue-300"
                        />
                        <Input
                          value={newHours}
                          onChange={(e) => setNewHours(e.target.value)}
                          placeholder="Heures (ex: 09:00 - 12:30)"
                          className="border-blue-300"
                        />
                        <Button
                          onClick={addWorkingDay}
                          disabled={!newDay || !newHours}
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Ajouter
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        Format recommandé : 09:00 - 12:30 | 14:00 - 18:00
                      </p>
                    </div>
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
                        onChange={handleChange}
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
                        onChange={handleChange}
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
                        onChange={handleChange}
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

                  {/* Prix */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                      Prix consultation
                    </label>
                    {editMode ? (
                      <Input
                        name="consultation_price"
                        value={formData.consultation_price}
                        onChange={handleChange}
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
                        onChange={handleChange}
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

                  {/* Langues */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                      Langues parlées
                    </label>
                    {editMode ? (
                      <Input
                        name="languages"
                        value={formData.languages}
                        onChange={handleChange}
                        placeholder="Ex: Français, Anglais"
                        className="border-slate-300"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Globe className="w-5 h-5 text-cyan-500" />
                        <span className="text-slate-700">
                          {medecin.languages || "Non renseignées"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Parcours */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                      Parcours professionnel
                    </label>
                    {editMode ? (
                      <Textarea
                        name="professional_background"
                        value={formData.professional_background}
                        onChange={handleChange}
                        className="border-slate-300"
                        placeholder="Expérience clinique et formations"
                      />
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Briefcase className="w-5 h-5 text-blue-500 mt-1" />
                          <span className="text-slate-700 whitespace-pre-line flex-1">
                            {medecin.professional_background || "Non renseigné"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Assurances */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                      Assurances acceptées
                    </label>
                    {editMode ? (
                      <select
                        name="insurance_accepted"
                        value={formData.insurance_accepted}
                        onChange={handleChange}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="1">Oui</option>
                        <option value="0">Non</option>
                      </select>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <ShieldCheck
                          className={`w-5 h-5 ${
                            medecin.insurance_accepted === 1
                              ? "text-green-500"
                              : "text-slate-400"
                          }`}
                        />
                        <span className="text-slate-700">
                          {medecin.insurance_accepted === 1 ? "Oui" : "Non"}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "profil" && editMode && (
          <div className="flex justify-end gap-3 mt-8">
            <Button
              variant="outline"
              onClick={() => setEditMode(false)}
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

        {/* Onglet Agenda */}
        {activeTab === "agenda" && <AgendaContent />}

        {activeTab === "avis" && <AvisContent />}

        {/* Onglet Paramètres */}
        {activeTab === "parametres" && (
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
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                    Modifier le mot de passe
                  </Button>
                </div>

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
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700 w-full justify-start"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Désactiver le compte temporairement
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700 w-full justify-start"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Supprimer définitivement le compte
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfilMedecin;
