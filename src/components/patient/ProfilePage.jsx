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
  const [appointments, setAppointments] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (role === "patient") {
      const fetchProfileAndAppointments = async () => {
        try {
          setLoading(true);
          // Profil
          const profileRes = await api.get("/patient/profile");
          setPatient(profileRes.data);
          setFormData(profileRes.data);

          // Rendez-vous
          const appointmentsRes = await api.get("/patient/appointments");
          setAppointments(appointmentsRes.data);
        } catch (error) {
          console.error("Erreur chargement profil ou rendez-vous :", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProfileAndAppointments();
    }
  }, [role]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const res = await api.put("/patient/profile", formData);
      setPatient(res.data);
      setEditMode(false);
      toast.success("Profil mis à jour avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil");
      console.error(error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData({ ...formData, photo: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  if (loading || !patient) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-200"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-6 py-24 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="relative group">
            <div className="w-28 h-28 md:w-32 md:h-32 border-4 border-white shadow-lg rounded-full overflow-hidden">
              <img
                src={formData.photo || patient.photo || defaultAvatar}
                alt={`${patient.prenom} ${patient.nom}`}
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = defaultAvatar)}
              />
              {!formData.photo && !patient.photo && (
                <div className="w-full h-full bg-white text-blue-600 text-3xl font-bold flex items-center justify-center">
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
                  className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 bg-black/50 flex items-center justify-center rounded-full transition-opacity"
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
            <p className="text-white/90 text-sm">{patient.email}</p>
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
      <div className="max-w-6xl mx-auto px-4 py-8 -mt-10">
        <Tabs
          defaultValue={activeTab}
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white shadow-sm rounded-full overflow-hidden">
            {[
              { key: "profil", icon: User, label: "Profil" },
              { key: "agenda", icon: Calendar, label: "Rendez-vous" },
              { key: "messages", icon: MessageSquare, label: "Messages" },
              { key: "parametres", icon: Settings, label: "Paramètres" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="flex items-center gap-2 justify-center py-2 px-4 rounded-full"
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
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

          {/* Onglet Rendez-vous */}
          <TabsContent value="agenda">
            <Card className="border-0 shadow-sm mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Calendar className="w-5 h-5" /> Rendez-vous
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <p className="text-gray-600">Aucun rendez-vous planifié.</p>
                ) : (
                  <div className="space-y-3">
                    {appointments.map((app) => {
                      const statusNormalized = app.status?.trim().toLowerCase();
                      let statusBg = "bg-gray-200 text-gray-700";
                      if (statusNormalized === "confirmé")
                        statusBg = "bg-green-100 text-green-800";
                      else if (statusNormalized === "en attente")
                        statusBg = "bg-yellow-100 text-yellow-800";
                      else if (statusNormalized === "annulé")
                        statusBg = "bg-red-100 text-red-800";

                      return (
                        <div
                          key={app.id}
                          className="flex justify-between items-center py-3 px-4 border rounded-lg shadow-sm bg-white"
                        >
                          <div>
                            <p className="font-medium text-gray-700">
                              {app.medecin_id
                                ? `${app.doctor}`
                                : "Médecin supprimé"}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {new Date(
                                app.date + "T" + app.time
                              ).toLocaleString("fr-FR", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              —{" "}
                              <span className="italic">
                                {app.consultation_type}
                              </span>
                            </p>
                          </div>
                          <span
                            className={`text-sm font-semibold px-3 py-1 rounded-full ${statusBg}`}
                          >
                            {app.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilPatient;
