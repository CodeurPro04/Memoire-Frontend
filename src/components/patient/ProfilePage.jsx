import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "@/context/AuthContext";
import api from "@/api/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MessageSquare,
  Edit,
  Save,
  X,
  Settings,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import defaultAvatar from "@/assets/default-avatar.png";

const ProfilPatient = () => {
  const [loading, setLoading] = useState(true);
  const { role } = useContext(AuthContext);
  const [patient, setPatient] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("profil");
  const [messages, setMessages] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (role === "patient") {
      // Récupération du profil patient
      api
        .get("/patient/profile")
        .then((res) => {
          setPatient(res.data);
          setFormData(res.data);
        })
        .catch((err) => console.error("Erreur chargement profil :", err));

      // Messages fictifs
      setMessages([
        {
          id: 1,
          from: "Dr. Martin",
          content: "Bonjour, votre test est prêt",
          time: "10:30",
          read: false,
        },
        {
          id: 2,
          from: "Dr. Lopez",
          content: "Rendez-vous confirmé",
          time: "Hier",
          read: true,
        },
      ]);

      // Récupération des rendez-vous du patient
      const fetchAppointments = async () => {
        setLoading(true); // démarre le loading
        try {
          const response = await api.get("/patient/appointments");
          setAppointments(response.data);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des rendez-vous :",
            error
          );
        } finally {
          setLoading(false); // stop loading
        }
      };

      fetchAppointments();
    }
  }, [role]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await api.put("/patient/profile", formData);
      setPatient(res.data);
      setEditMode(false);
      toast.success("Profil mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error("Erreur de mise à jour :", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!patient) {
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
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-4 md:px-6 text-white md:py-28 py-28">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="relative group">
            <div className="w-24 h-24 md:w-32 md:h-32 border-4 border-white/90 shadow-xl rounded-full overflow-hidden">
              <img
                src={formData.photo || patient.photo || defaultAvatar}
                alt={`${patient.prenom || ""} ${patient.nom || ""}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = defaultAvatar;
                }}
              />
              {/* Fallback initiales si aucune image ne charge */}
              {!formData.photo && !patient.photo && (
                <div className="w-full h-full bg-white text-blue-600 text-2xl md:text-3xl font-bold flex items-center justify-center">
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
                <Button
                  onClick={triggerFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 bg-black/50 flex items-center justify-center transition-opacity rounded-full"
                  variant="ghost"
                >
                  <Upload className="w-6 h-6 text-white" />
                </Button>
              </>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold">
              {patient.prenom} {patient.nom}
            </h1>
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

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 -mt-8 md:-mt-10">
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white shadow-sm rounded-full overflow-hidden">
            {["profil", "messages", "agenda", "parametres"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="flex items-center gap-2 justify-center py-2 px-4 rounded-full"
              >
                {
                  {
                    profil: (
                      <>
                        <User className="w-4 h-4" /> Profil
                      </>
                    ),
                    messages: (
                      <>
                        <MessageSquare className="w-4 h-4" /> Messages
                      </>
                    ),
                    agenda: (
                      <>
                        <Calendar className="w-4 h-4" /> Rendez-vous
                      </>
                    ),
                    parametres: (
                      <>
                        <Settings className="w-4 h-4" /> Paramètres
                      </>
                    ),
                  }[tab]
                }
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Onglet Profil */}
          <TabsContent value="profil">
            <Card className="border-0 shadow-sm mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <User className="w-5 h-5" /> Informations Personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icon: Mail, label: "Email", name: "email" },
                  { icon: Phone, label: "Téléphone", name: "telephone" },
                  { icon: MapPin, label: "Adresse", name: "address" },
                ].map((field) => (
                  <div
                    key={field.name}
                    className="flex flex-col md:flex-row md:items-center gap-2"
                  >
                    <field.icon className="w-4 h-4 text-blue-600" />
                    <Input
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      readOnly={!editMode}
                    />
                  </div>
                ))}

                {editMode && (
                  <Button className="mt-2 w-full" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" /> Enregistrer
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Messages */}
          <TabsContent value="messages">
            <Card className="border-0 shadow-sm mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <MessageSquare className="w-5 h-5" /> Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {messages.length === 0 ? (
                  <p className="text-gray-600">Aucun message pour le moment.</p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="flex justify-between items-center py-2 border-b last:border-b-0"
                    >
                      <div>
                        <p
                          className={`font-medium ${
                            !msg.read ? "text-gray-800" : "text-gray-500"
                          }`}
                        >
                          {msg.from}
                        </p>
                        <p className="text-gray-600 text-sm truncate">
                          {msg.content}
                        </p>
                      </div>
                      <span className="text-gray-400 text-xs">{msg.time}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agenda">
            <Card className="border-0 shadow-sm mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Calendar className="w-5 h-5" /> Rendez-vous
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-gray-600">Chargement des rendez-vous...</p>
                ) : appointments.length === 0 ? (
                  <p className="text-gray-600">Aucun rendez-vous planifié.</p>
                ) : (
                  <div className="space-y-3">
                    {appointments.map((app) => (
                      <div
                        key={app.id}
                        className="flex justify-between items-center py-2 border-b last:border-b-0"
                      >
                        <div>
                          <p className="font-medium text-gray-700">
                            {app.medecin_id
                              ? `${app.doctor}`
                              : "Médecin supprimé"}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {new Date(app.date).toLocaleDateString("fr-FR")}
                            {app.time ? ` à ${app.time}` : ""} —{" "}
                            <span className="italic">
                              {app.consultation_type}
                            </span>
                          </p>
                        </div>
                        <span className="text-gray-500 text-sm">
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Paramètres */}
          <TabsContent value="parametres">
            <Card className="border-0 shadow-sm mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Settings className="w-5 h-5" /> Paramètres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ici, le patient peut gérer ses préférences de compte et
                  notifications.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilPatient;
