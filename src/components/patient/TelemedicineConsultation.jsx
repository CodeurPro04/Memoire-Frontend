// src/components/patient/TelemedicineConsultation.jsx

import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Phone, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
  Clock, 
  User, 
  Calendar,
  AlertCircle,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { AuthContext } from '@/context/AuthContext';
import api from '@/api/axios';
import { useToast } from '@/components/ui/use-toast';

const TelemedicineConsultation = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { user, role, token } = useContext(AuthContext);
  const { toast } = useToast();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [canStart, setCanStart] = useState(false);
  const [duration, setDuration] = useState(0);
  const [appointment, setAppointment] = useState(null);
  
  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);
  const durationIntervalRef = useRef(null);

  // Charger la session au montage
  useEffect(() => {
    loadSession();
  }, [appointmentId]);

  // Nettoyer à la destruction
  useEffect(() => {
    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  const loadSession = async () => {
    try {
      setLoading(true);
      
      const endpoint = role === 'patient' 
        ? `/patient/telemedicine/appointments/${appointmentId}/session`
        : `/medecin/telemedicine/appointments/${appointmentId}/session`;

      const response = await api.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSession(response.data.session);
      setAppointment(response.data.appointment);
      setCanStart(response.data.can_start);
    } catch (error) {
      console.error('Erreur chargement session:', error);
      toast({
        title: "Erreur",
        description: error.response?.data?.error || "Impossible de charger la session",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startCall = async () => {
    if (!session) return;

    try {
      const endpoint = role === 'patient'
        ? `/patient/telemedicine/sessions/${session.id}/start`
        : `/medecin/telemedicine/sessions/${session.id}/start`;

      await api.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Charger Jitsi
      if (!window.JitsiMeetExternalAPI) {
        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;
        script.onload = () => initializeJitsi();
        document.body.appendChild(script);
      } else {
        initializeJitsi();
      }
    } catch (error) {
      console.error('Erreur démarrage appel:', error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer l'appel",
        variant: "destructive"
      });
    }
  };

  const initializeJitsi = () => {
    if (!jitsiContainerRef.current) return;

    const displayName = role === 'patient'
      ? `${user.prenom} ${user.nom}`
      : `Dr. ${user.prenom} ${user.nom}`;

    const options = {
      roomName: session.room_id,
      width: '100%',
      height: 600,
      parentNode: jitsiContainerRef.current,
      userInfo: {
        displayName: displayName,
      },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        enableWelcomePage: false,
        prejoinPageEnabled: false,
        disableDeepLinking: true,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone',
          'camera',
          'closedcaptions',
          'desktop',
          'fullscreen',
          'fodeviceselection',
          'hangup',
          'chat',
          'settings',
          'videoquality',
          'filmstrip',
          'tileview',
        ],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
      },
    };

    const api = new window.JitsiMeetExternalAPI('meet.jit.si', options);
    jitsiApiRef.current = api;
    setInCall(true);

    // Compteur de durée
    durationIntervalRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    // Écouter la fin de l'appel
    api.addEventListener('videoConferenceLeft', () => {
      endCall();
    });
  };

  const endCall = async () => {
    try {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }

      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }

      const endpoint = role === 'patient'
        ? `/patient/telemedicine/sessions/${session.id}/end`
        : `/medecin/telemedicine/sessions/${session.id}/end`;

      await api.post(endpoint, {
        notes: 'Consultation terminée',
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setInCall(false);
      setDuration(0);

      toast({
        title: "Consultation terminée",
        description: "La téléconsultation s'est terminée avec succès",
        variant: "default"
      });

      // Rediriger vers les rendez-vous
      setTimeout(() => {
        navigate(role === 'patient' ? '/patient/rendez-vous' : '/medecin/profil');
      }, 2000);

    } catch (error) {
      console.error('Erreur fin appel:', error);
    }
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-600">Chargement de la consultation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Bouton retour */}
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        {!inCall ? (
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <CardTitle className="flex items-center gap-3">
                <Video className="w-6 h-6" />
                Téléconsultation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <Video className="w-10 h-10 text-blue-600" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Consultation par vidéo
                  </h2>
                  <p className="text-gray-600">
                    {role === 'medecin' 
                      ? 'Votre patient vous attend pour la consultation'
                      : 'Le médecin va vous rejoindre pour la consultation'}
                  </p>
                </div>

                {appointment && (
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4 max-w-md mx-auto">
                    <div className="flex items-center justify-center gap-2 text-gray-700">
                      <User className="w-5 h-5" />
                      <span className="font-medium">
                        {role === 'patient' 
                          ? `Dr. ${appointment.medecin.prenom} ${appointment.medecin.nom}`
                          : `${appointment.patient.prenom} ${appointment.patient.nom}`
                        }
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Calendar className="w-5 h-5" />
                      <span>
                        {new Date(appointment.date).toLocaleDateString('fr-FR')} à {appointment.time}
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <FileText className="w-5 h-5" />
                      <span>{appointment.consultation_type}</span>
                    </div>
                  </div>
                )}

                {canStart ? (
                  <Button
                    onClick={startCall}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg px-8 py-6 text-lg"
                  >
                    <Video className="w-6 h-6 mr-2" />
                    Démarrer la consultation
                  </Button>
                ) : (
                  <div className="text-center">
                    <Badge variant="outline" className="text-amber-600 border-amber-300 px-4 py-2">
                      <Clock className="w-4 h-4 mr-2" />
                      Consultation disponible 15 minutes avant l'heure prévue
                    </Badge>
                  </div>
                )}

                <div className="pt-6 border-t border-gray-200 text-left max-w-md mx-auto">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-600">
                      <p className="font-semibold mb-2">Important :</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Assurez-vous d'avoir une bonne connexion internet</li>
                        <li>Vérifiez que votre caméra et microphone fonctionnent</li>
                        <li>Trouvez un endroit calme et bien éclairé</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <Video className="w-6 h-6" />
                  Consultation en cours
                </CardTitle>
                <div className="flex items-center gap-4">
                  <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                    <Clock className="w-4 h-4 mr-2" />
                    {formatDuration(duration)}
                  </Badge>
                  <Button
                    onClick={endCall}
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <PhoneOff className="w-4 h-4 mr-2" />
                    Terminer
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div 
                ref={jitsiContainerRef}
                className="w-full"
                style={{ minHeight: '600px' }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TelemedicineConsultation;