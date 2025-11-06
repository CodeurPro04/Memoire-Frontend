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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import defaultAvatar from "@/assets/default-avatar.png";
import { useNavigate } from "react-router-dom";

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
        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
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

      // Charger toutes les données en parallèle
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
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  }, [role]);

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
      toast.error("Erreur lors du chargement des rendez-vous");
    } finally {
      setLoadingAppointments(false);
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoadingFavorites(true);
      const response = await api.get("/favorites");
      setFavorites(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error);
      toast.error("Erreur lors du chargement des favoris");
    } finally {
      setLoadingFavorites(false);
    }
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      const res = await api.put("/patient/profile", formData);

      // Mise à jour IMMÉDIATE de toutes les données
      setPatient(res.data);
      setFormData(res.data);

      setEditMode(false);
      toast.success("Profil mis à jour avec succès !");

      // Recharger les données pour s'assurer que tout est synchronisé
      await fetchAllData();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil");
      console.error(error);
    } finally {
      setSaving(false);
    }
  }, [formData, fetchAllData]);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto = reader.result;
        // Mise à jour IMMÉDIATE de l'image
        setFormData((prev) => ({ ...prev, photo: newPhoto }));
        setPatient((prev) => (prev ? { ...prev, photo: newPhoto } : null));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Fonction pour retirer un médecin des favoris
  const removeFromFavorites = useCallback(async (medecinId) => {
    try {
      await api.delete(`/favorites/${medecinId}`);
      // Mise à jour IMMÉDIATE de l'état local
      setFavorites((prev) =>
        prev.filter((medecin) => medecin.id !== medecinId)
      );
      toast.success("Médecin retiré des favoris");
    } catch (error) {
      console.error("Erreur lors de la suppression du favori:", error);
      toast.error("Erreur lors de la suppression du favori");
    }
  }, []);

  // Fonction pour annuler un rendez-vous
  const cancelAppointment = useCallback(async (appointment) => {
    if (!appointment.can_cancel) {
      toast.error("Impossible d'annuler ce rendez-vous");
      return;
    }

    setCancellingAppointment(appointment.id);

    try {
      await api.delete(`/appointments/${appointment.id}/cancel`);
      toast.success("Rendez-vous annulé avec succès");
      // Mise à jour IMMÉDIATE de l'état local
      setAppointments((prev) =>
        prev.filter((app) => app.id !== appointment.id)
      );
    } catch (error) {
      console.error("Erreur lors de l'annulation du rendez-vous:", error);
      const errorMessage =
        error.response?.data?.error ||
        "Erreur lors de l'annulation du rendez-vous";
      toast.error(errorMessage);
    } finally {
      setCancellingAppointment(null);
    }
  }, []);

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
                  src={formData.photo || patient.photo || defaultAvatar}
                  alt={`${patient.prenom} ${patient.nom}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = defaultAvatar;
                  }}
                />
                {!formData.photo && !patient.photo && (
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
              <span className="hidden sm:inline">Rendez-vous</span>
            </button>
            <button
              onClick={() => setActiveTab("favoris")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "favoris"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
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
                <CardContent className="pt-6 space-y-4">
                  {/* Email */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
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
                        <span className="text-slate-700">{patient.email}</span>
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

                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                      Groupe sanguin
                    </label>
                    {editMode ? (
                      <Input
                        name="groupe_sanguin"
                        value={formData.groupe_sanguin || ""}
                        onChange={handleChange}
                        className="border-slate-300"
                        disabled
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Droplet className="w-5 h-5 text-red-500" />
                        <span className="text-slate-700">
                          {patient.groupe_sanguin || "Non renseigné"}
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

                  {editMode && (
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
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
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
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
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
                      className="bg-white rounded-2xl border border-slate-200 hover:border-amber-200 transition-all duration-300 overflow-hidden group"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                              {medecin.photo_profil ? (
                                <img
                                  src={medecin.photo_profil}
                                  alt={`Dr. ${medecin.prenom} ${medecin.nom}`}
                                  className="w-full h-full rounded-xl object-cover"
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

                        {medecin.consultation_price && (
                          <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-3 mb-4">
                            <span className="text-slate-600 text-sm font-medium">
                              Consultation
                            </span>
                            <span className="text-lg font-bold text-slate-900">
                              {medecin.consultation_price.toLocaleString()} FCFA
                            </span>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1 border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-600"
                            onClick={() =>
                              navigate(`/profil-medecin/${medecin.id}`)
                            }
                          >
                            Voir profil
                          </Button>
                          <Button
                            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                            onClick={() =>
                              navigate(`/profil-medecin/${medecin.id}`)
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

export default ProfilPatient;
