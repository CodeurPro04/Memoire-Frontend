import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "@/context/AuthContext";
import api from "@/api/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  MessageSquare,
  Edit,
  Save,
  X,
  Settings,
  Activity,
  Upload,
  Plus,
  Trash2,
  ShieldCheck,
  Globe,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import defaultAvatar from "@/assets/default-avatar.png";

const ProfilMedecin = () => {
  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long" });
  const [appointments, setAppointments] = useState([]);
  const { role } = useContext(AuthContext);
  const [medecin, setMedecin] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("profil");
  const [messages, setMessages] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);
  const [newDay, setNewDay] = useState("");
  const [newHours, setNewHours] = useState("");
  const fileInputRef = useRef(null);

  // Horaires par défaut si aucun horaire n'est défini
  const defaultHours = [
    { day: "Lundi", hours: "09:00 - 12:30 | 14:00 - 18:00" },
    { day: "Mardi", hours: "09:00 - 12:30 | 14:00 - 18:00" },
    { day: "Mercredi", hours: "09:00 - 12:30" },
    { day: "Jeudi", hours: "09:00 - 12:30 | 14:00 - 18:00" },
    { day: "Vendredi", hours: "09:00 - 12:30 | 14:00 - 17:00" },
  ];

  useEffect(() => {
    if (role === "medecin") {
      // Récupération profil médecin
      api
        .get("/medecin/profile")
        .then((res) => {
          setMedecin(res.data);
          setFormData(res.data);

          // ⚡ Correction : backend renvoie working_hours
          const horaires = res.data.working_hours || defaultHours;
          setWorkingHours(horaires);
        })
        .catch((err) => console.error("Erreur chargement profil :", err));

      // Récupération rendez-vous
      api
        .get("/medecin/appointments")
        .then((res) => setAppointments(res.data))
        .catch((err) => console.error("Erreur chargement rendez-vous :", err));

      // Messages mock
      setMessages([
        {
          id: 1,
          from: "Patient A",
          content: "Bonjour docteur...",
          time: "10:30",
          read: false,
        },
        {
          id: 2,
          from: "Patient B",
          content: "Résultats d'analyse",
          time: "Hier",
          read: true,
        },
        {
          id: 3,
          from: "Patient C",
          content: "Disponibilité pour consultation",
          time: "15/06",
          read: false,
        },
      ]);
    }
  }, [role]);

  // Mise à jour des champs du formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gestion du statut d'un rendez-vous
  const handleStatusChange = (id, status) => {
    const route =
      status === "confirmé"
        ? `/medecin/appointments/${id}/confirm`
        : `/medecin/appointments/${id}/reject`;

    api
      .patch(route)
      .then(() => {
        setAppointments((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status } : app))
        );
        toast.success(`Rendez-vous ${status}`);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Erreur lors de la mise à jour du rendez-vous");
      });
  };

  const handleSave = async () => {
    try {
      // Sauvegarde du profil général (email, téléphone, etc.)
      const profileRes = await api.put("/medecin/profile", formData);

      // Sauvegarde des horaires
      const hoursRes = await api.put("/medecin/working-hours", {
        working_hours: workingHours,
      });

      // Mettre à jour les states avec les réponses du backend
      setMedecin({
        ...profileRes.data,
        workingHours: hoursRes.data.working_hours,
      });
      setFormData({
        ...formData,
        workingHours: hoursRes.data.working_hours,
      });

      setEditMode(false);
      toast.success("Profil et horaires mis à jour !");
    } catch (error) {
      console.error("Erreur de mise à jour :", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  // Gestion de l'image de profil
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();

  // Ajout et suppression d'horaires
  const addWorkingDay = () => {
    if (newDay && newHours) {
      setWorkingHours([...workingHours, { day: newDay, hours: newHours }]);
      setNewDay("");
      setNewHours("");
    }
  };

  const removeWorkingDay = (index) => {
    const updatedHours = [...workingHours];
    updatedHours.splice(index, 1);
    setWorkingHours(updatedHours);
  };

  // Loader tant que le profil n'est pas chargé
  if (!medecin) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-200"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec photo de profil */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-4 md:px-6 text-white md:py-28 py-28">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="relative group">
            <div className="w-24 h-24 md:w-32 md:h-32 border-4 border-white/90 shadow-xl rounded-full overflow-hidden">
              <img
                src={formData.photo || medecin.photo || defaultAvatar}
                alt={`${medecin.prenom || ""} ${medecin.nom || ""}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = defaultAvatar;
                }}
              />
              {/* Fallback initiales si aucune image ne charge */}
              {!formData.photo && !medecin.photo && (
                <div className="w-full h-full bg-white text-blue-600 text-2xl md:text-3xl font-bold flex items-center justify-center">
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
                <Button
                  onClick={triggerFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 bg-black/50 flex items-center justify-center transition-opacity rounded-full"
                  variant="ghost"
                >
                  <Upload className="w-6 h-6 text-white" />
                </Button>
              </>
            )}
            <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white text-blue-600 hover:bg-white/90">
              <Briefcase className="w-4 h-4 mr-1" />
              {medecin.specialite}
            </Badge>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            {/* Nom complet */}
            <h1 className="text-2xl md:text-3xl font-bold text-white dark:text-white">
              Dr. {medecin.prenom} {medecin.nom}
            </h1>

            {/* Badges d'informations */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
              {/* Années d'expérience */}
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 flex items-center gap-1 px-3 py-1 rounded-full"
              >
                <Award className="w-4 h-4" />
                {medecin.experience_years || 0} ans d'expérience
              </Badge>

              {/* Disponibilité */}
              <Badge
                variant="secondary"
                className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                  medecin.working_hours?.length > 0
                    ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                }`}
              >
                <Clock className="w-4 h-4" />
                {(() => {
                  const todayLower = today.toLowerCase();
                  const todayHours = medecin.working_hours?.find(
                    (wh) => wh.day.toLowerCase() === todayLower
                  );
                  return todayHours
                    ? `Disponible Aujourd'hui: ${todayHours.hours}`
                    : "Indisponible";
                })()}
              </Badge>
            </div>

            {/* Langues parlées et assurances */}
            <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
              {medecin.languages &&
                medecin.languages.split(",").map((langue, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 flex items-center gap-1 px-3 py-1 rounded-full"
                  >
                    {langue.trim()}
                  </Badge>
                ))}

              {/* Badge Assurances acceptées */}
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 flex items-center gap-1 px-3 py-1 rounded-full"
              >
                <ShieldCheck className="w-4 h-4" />
                Assurances acceptées : {medecin.insurance_accepted === 1 ? "Oui" : "Non"}
              </Badge>
            </div>
          </div>

          <Button
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? (
              <X className="w-4 h-4 mr-2" />
            ) : (
              <Edit className="w-4 h-4 mr-2" />
            )}
            {editMode ? "Annuler" : "Modifier"}
          </Button>
        </div>
      </div>

      {/* Contenu principal avec onglets */}
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 -mt-8 md:-mt-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="profil" className="flex items-center gap-2">
              <User className="w-4 h-4" /> Profil
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Messages{" "}
              {messages.filter((m) => !m.read).length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {messages.filter((m) => !m.read).length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="agenda" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Agenda
            </TabsTrigger>
            <TabsTrigger value="parametres" className="flex items-center gap-2">
              <Settings className="w-4 h-4" /> Paramètres
            </TabsTrigger>
          </TabsList>

          {/* Onglet Profil */}
          <TabsContent value="profil" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Colonne principale */}
              <div className="lg:col-span-2 space-y-4 md:space-y-6">
                {/* Biographie */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-600">
                      <FileText className="w-5 h-5" /> Biographie
                      Professionnelle
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editMode ? (
                      <Textarea
                        name="bio"
                        value={formData.bio || ""}
                        onChange={handleChange}
                        placeholder="Décrivez votre parcours, spécialités et approche médicale..."
                        className="min-h-[150px]"
                      />
                    ) : (
                      <p className="text-gray-700 whitespace-pre-line">
                        {medecin.bio || "Aucune biographie renseignée"}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <TabsContent value="agenda" className="mt-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-blue-50 rounded-t-lg">
                      <CardTitle className="flex items-center gap-2 text-blue-700 text-lg font-semibold">
                        <Calendar className="w-5 h-5" /> Mes Rendez-vous
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {appointments.length === 0 ? (
                        <p className="text-gray-500 italic text-center">
                          Aucun rendez-vous pour le moment.
                        </p>
                      ) : (
                        appointments.map((app) => {
                          const statusColor =
                            app.status === "en attente"
                              ? "bg-yellow-100 text-yellow-800"
                              : app.status === "confirmé"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800";

                          return (
                            <div
                              key={app.id}
                              className="p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                            >
                              <div className="flex-1 space-y-1">
                                <p>
                                  <strong>Patient :</strong> {app.patient}
                                </p>
                                <p>
                                  <strong>Téléphone :</strong>{" "}
                                  {app.phone || "Non renseigné"}
                                </p>
                                <p>
                                  <strong>Adresse :</strong>{" "}
                                  {app.address || "Non renseignée"}
                                </p>
                                <p>
                                  <strong>Date :</strong>{" "}
                                  {new Date(app.date).toLocaleString("fr-FR", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                                <p>
                                  <strong>Type :</strong>{" "}
                                  {app.consultation_type}
                                </p>
                                <p>
                                  <strong>Status :</strong>{" "}
                                  <Badge className={statusColor}>
                                    {app.status}
                                  </Badge>
                                </p>
                              </div>

                              {app.status === "en attente" && (
                                <div className="flex gap-2 mt-2 md:mt-0">
                                  <Button
                                    className="bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
                                    onClick={() =>
                                      handleStatusChange(app.id, "confirmé")
                                    }
                                  >
                                    Confirmer
                                  </Button>
                                  <Button
                                    className="bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
                                    onClick={() =>
                                      handleStatusChange(app.id, "refusé")
                                    }
                                  >
                                    Refuser
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Horaires de consultation */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-600">
                      <Clock className="w-5 h-5" /> Horaires de Consultation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {workingHours.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center py-2 border-b last:border-b-0 gap-3"
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
                                placeholder="Jour (ex: Lundi)"
                                className="md:col-span-1 w-32"
                              />
                              <Input
                                value={item.hours}
                                onChange={(e) => {
                                  const updated = [...workingHours];
                                  updated[idx].hours = e.target.value;
                                  setWorkingHours(updated);
                                }}
                                placeholder="Heures (ex: 09:00 - 12:00)"
                                className="md:col-span-1 flex-1"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeWorkingDay(idx)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <span className="font-medium text-gray-700">
                                {item.day}
                              </span>
                              <span className="text-gray-600">
                                {item.hours}
                              </span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Ajout d’un nouvel horaire */}
                    {editMode && (
                      <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <Input
                            value={newDay}
                            onChange={(e) => setNewDay(e.target.value)}
                            placeholder="Jour (ex: Lundi)"
                            className="md:col-span-1"
                          />
                          <Input
                            value={newHours}
                            onChange={(e) => setNewHours(e.target.value)}
                            placeholder="Heures (ex: 09:00 - 12:00)"
                            className="md:col-span-1"
                          />
                          <Button
                            onClick={addWorkingDay}
                            className="md:col-span-1"
                            disabled={!newDay || !newHours}
                          >
                            <Plus className="w-4 h-4 mr-2" /> Ajouter
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500">
                          Format recommandé : 09:00 - 12:00 | 14:00 - 18:00
                        </p>
                      </div>
                    )}

                    {/* Boutons principaux pour tout le profil */}
                    {editMode && (
                      <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setEditMode(false)}
                          className="border-gray-300"
                        >
                          Annuler
                        </Button>
                        <Button
                          onClick={handleSave} // ici on sauvegarde tout, y compris workingHours
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Save className="w-4 h-4 mr-2" /> Enregistrer
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Colonne latérale */}
              <div className="space-y-4 md:space-y-6">
                {/* Informations de contact et professionnelles */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-600">
                      <User className="w-5 h-5" /> Informations Personnelles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 md:space-y-4">
                    {/* Email */}
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-1 block">
                        Email
                      </label>
                      {editMode ? (
                        <Input
                          name="email"
                          value={formData.email || ""}
                          onChange={handleChange}
                          className="bg-gray-50"
                        />
                      ) : (
                        <p className="flex items-center gap-2 text-gray-700">
                          <Mail className="w-5 h-5 text-blue-400" />
                          {medecin.email || "Non renseigné"}
                        </p>
                      )}
                    </div>

                    {/* Téléphone */}
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-1 block">
                        Téléphone
                      </label>
                      {editMode ? (
                        <Input
                          name="telephone"
                          value={formData.telephone || ""}
                          onChange={handleChange}
                          className="bg-gray-50"
                        />
                      ) : (
                        <p className="flex items-center gap-2 text-gray-700">
                          <Phone className="w-5 h-5 text-blue-400" />
                          {medecin.telephone || "Non renseigné"}
                        </p>
                      )}
                    </div>

                    {/* Adresse */}
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-1 block">
                        Adresse
                      </label>
                      {editMode ? (
                        <Input
                          name="address"
                          value={formData.address || ""}
                          onChange={handleChange}
                          className="bg-gray-50"
                        />
                      ) : (
                        <p className="flex items-center gap-2 text-gray-700">
                          <MapPin className="w-5 h-5 text-blue-400" />
                          {medecin.address || "Non renseignée"}
                        </p>
                      )}
                    </div>

                    {/* Spécialité */}
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-1 block">
                        Spécialité
                      </label>
                      {editMode ? (
                        <Input
                          name="specialite"
                          value={formData.specialite || ""}
                          onChange={handleChange}
                          className="bg-gray-50"
                        />
                      ) : (
                        <p className="flex items-center gap-2 text-gray-700">
                          <Stethoscope className="w-5 h-5 text-blue-400" />
                          {medecin.specialite || "Non renseignée"}
                        </p>
                      )}
                    </div>

                    {/* Années d'expérience */}
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-1 block">
                        Années d'expérience
                      </label>
                      {editMode ? (
                        <Input
                          name="years_experience"
                          value={formData.years_experience || ""}
                          onChange={handleChange}
                          className="bg-gray-50"
                          type="number"
                          min={0}
                        />
                      ) : (
                        <p className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-5 h-5 text-blue-400" />
                          {medecin.experience_years || "Non renseigné"}
                        </p>
                      )}
                    </div>

                    {/* Langues */}
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-1 block">
                        Langues parlées
                      </label>
                      {editMode ? (
                        <Input
                          name="languages"
                          value={formData.languages || ""}
                          onChange={handleChange}
                          className="bg-gray-50"
                          placeholder="Ex: Français, Anglais"
                        />
                      ) : (
                        <p className="flex items-center gap-2 text-gray-700">
                          <Globe className="w-5 h-5 text-blue-400" />
                          {medecin.languages || "Non renseigné"}
                        </p>
                      )}
                    </div>

                    {/* Parcours professionnel */}
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-1 block">
                        Parcours Professionnel
                      </label>
                      {editMode ? (
                        <Textarea
                          name="professional_background"
                          value={formData.professional_background || ""}
                          onChange={handleChange}
                          className="bg-gray-50"
                          placeholder="Expérience clinique et formations"
                        />
                      ) : (
                        <p className="flex items-start gap-2 text-gray-700 whitespace-pre-line">
                          <Briefcase className="w-5 h-5 text-blue-400 mt-1" />
                          {medecin.professional_background || "Non renseigné"}
                        </p>
                      )}
                    </div>

                    {/* Prix consultation */}
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-1 block">
                        Prix consultation standard
                      </label>
                      {editMode ? (
                        <Input
                          name="consultation_price"
                          value={formData.consultation_price || ""}
                          onChange={handleChange}
                          className="bg-gray-50"
                          type="number"
                          min={0}
                        />
                      ) : (
                        <p className="flex items-center gap-2 text-gray-700">
                          <CreditCard className="w-5 h-5 text-blue-400" />
                          {medecin.consultation_price !== null
                            ? `${medecin.consultation_price} FCFA`
                            : "Non renseigné"}
                        </p>
                      )}
                    </div>

                    {/* Assurances acceptées */}
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-1 block">
                        Assurances acceptées
                      </label>

                      {editMode ? (
                        <select
                          name="insurance_accepted"
                          value={formData.insurance_accepted ? "oui" : "non"}
                          onChange={(e) => {
                            const value = e.target.value === "oui" ? 1 : 0;
                            setFormData({
                              ...formData,
                              insurance_accepted: value,
                            });
                          }}
                          className="bg-gray-50 w-full p-2 border rounded"
                        >
                          <option value="oui">Oui</option>
                          <option value="non">Non</option>
                        </select>
                      ) : (
                        <p className="flex items-center gap-2 text-gray-700">
                          <ShieldCheck className="w-5 h-5 text-blue-400" />
                          {medecin.insurance_accepted === 1
                            ? "Oui"
                            : medecin.insurance_accepted === 0
                            ? "Non"
                            : "Non renseigné"}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Statistiques */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-600">
                      <Activity className="w-5 h-5" /> Statistiques
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <p className="text-xl md:text-2xl font-bold text-blue-600">
                          42
                        </p>
                        <p className="text-xs md:text-sm text-gray-600">
                          Patients/mois
                        </p>
                      </div>
                      <div className="bg-teal-50 p-3 rounded-lg text-center">
                        <p className="text-xl md:text-2xl font-bold text-teal-600">
                          4.8
                        </p>
                        <p className="text-xs md:text-sm text-gray-600">
                          Note moyenne
                        </p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg text-center">
                        <p className="text-xl md:text-2xl font-bold text-purple-600">
                          96%
                        </p>
                        <p className="text-xs md:text-sm text-gray-600">
                          Satisfaction
                        </p>
                      </div>
                      <div className="bg-amber-50 p-3 rounded-lg text-center">
                        <p className="text-xl md:text-2xl font-bold text-amber-600">
                          10
                        </p>
                        <p className="text-xs md:text-sm text-gray-600">
                          Ans expérience
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {editMode && (
              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setEditMode(false)}
                  className="border-gray-300"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" /> Enregistrer
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Onglet Messages 
          <TabsContent value="messages" className="mt-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <MessageSquare className="w-5 h-5" />
                  Boîte de réception ({
                    messages.filter((m) => !m.read).length
                  }{" "}
                  non lus)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        message.read
                          ? "bg-white hover:bg-gray-50 border-gray-200"
                          : "bg-blue-50 border-blue-200"
                      }`}
                      onClick={() => {
                        if (!message.read) {
                          setMessages(
                            messages.map((m) =>
                              m.id === message.id ? { ...m, read: true } : m
                            )
                          );
                        }
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <h3
                          className={`font-medium ${
                            message.read ? "text-gray-800" : "text-blue-800"
                          }`}
                        >
                          {message.from}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {message.time}
                        </span>
                      </div>
                      <p
                        className={`mt-1 text-sm ${
                          message.read ? "text-gray-600" : "text-blue-600"
                        }`}
                      >
                        {message.content}
                      </p>
                      {!message.read && (
                        <div className="mt-2 w-2 h-2 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilMedecin;
