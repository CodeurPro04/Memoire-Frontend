// context/GoogleAuthContext.js
import React, { createContext, useContext, useState } from "react";
import api from "@/api/axios";

const GoogleAuthContext = createContext();

export const useGoogleAuth = () => {
  const context = useContext(GoogleAuthContext);
  if (!context) {
    throw new Error("useGoogleAuth must be used within a GoogleAuthProvider");
  }
  return context;
};

export const GoogleAuthProvider = ({ children }) => {
  const [googleUser, setGoogleUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async (credentialResponse, userType) => {
    setLoading(true);
    try {
      const endpoints = {
        patient: "/auth/google/patient",
        medecin: "/auth/google/medecin",
        clinique: "/auth/google/clinique",
      };

      const response = await api.post(endpoints[userType], {
        token: credentialResponse.credential,
        userType: userType,
      });

      return response.data;
    } catch (error) {
      console.error("Google auth error:", error);

      // Gestion d'erreur détaillée
      if (error.response?.status === 401) {
        throw new Error("Token Google invalide ou expiré");
      } else if (error.response?.status === 500) {
        throw new Error("Erreur serveur lors de l'authentification Google");
      } else {
        throw new Error(
          error.response?.data?.message || "Erreur de connexion avec Google"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const value = {
    googleUser,
    handleGoogleLogin,
    loading,
  };

  return (
    <GoogleAuthContext.Provider value={value}>
      {children}
    </GoogleAuthContext.Provider>
  );
};
