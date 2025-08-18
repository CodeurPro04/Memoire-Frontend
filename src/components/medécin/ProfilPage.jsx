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

  // Format d'heure par défaut
  const defaultHours = [
    { day: "Lundi", hours: "09:00 - 12:30 | 14:00 - 18:00" },
    { day: "Mardi", hours: "09:00 - 12:30 | 14:00 - 18:00" },
    { day: "Mercredi", hours: "09:00 - 12:30" },
    { day: "Jeudi", hours: "09:00 - 12:30 | 14:00 - 18:00" },
    { day: "Vendredi", hours: "09:00 - 12:30 | 14:00 - 17:00" },
  ];

  useEffect(() => {
    if (role === "medecin") {
      api
        .get("/medecin/profile")
        .then((res) => {
          setMedecin(res.data);
          setFormData(res.data);
          setWorkingHours(res.data.workingHours || defaultHours);
        })
        .catch((err) => console.error("Erreur chargement profil :", err));

      setMessages([
        {
          id: 1,
          from: "Patient A",
          content: "Bonjour docteur, j'ai une question...",
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const updatedData = { ...formData, workingHours };
      const res = await api.put("/medecin/profile", updatedData);
      setMedecin(res.data);
      setEditMode(false);
      toast.success("Profil mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error("Erreur de mise à jour :", error);
    }
  };

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

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

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
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-4 md:px-6 text-white py-16 md:py-28">
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

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold">
              Dr. {medecin.prenom} {medecin.nom}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2 md:mt-3">
              <Badge
                variant="secondary"
                className="bg-white/10 hover:bg-white/20"
              >
                <Award className="w-4 h-4 mr-1" />
                {medecin.annees_experience || 0} ans d'expérience
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/10 hover:bg-white/20"
              >
                <Clock className="w-4 h-4 mr-1" />
                Disponible aujourd'hui
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
                          className="flex justify-between items-center py-2 border-b last:border-b-0"
                        >
                          <span className="font-medium text-gray-700">
                            {item.day}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">{item.hours}</span>
                            {editMode && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeWorkingDay(idx)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

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
                            placeholder="Heures (ex: 09:00-12:00)"
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
                  </CardContent>
                </Card>
              </div>

              {/* Colonne latérale */}
              <div className="space-y-4 md:space-y-6">
                {/* Informations de contact */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-600">
                      <User className="w-5 h-5" /> Informations Personnelles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 md:space-y-4">
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
                          <Mail className="w-5 h-5 text-blue-400" />{" "}
                          {medecin.email}
                        </p>
                      )}
                    </div>

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
                          {medecin.specialite}
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

          {/* Onglet Messages */}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilMedecin;
