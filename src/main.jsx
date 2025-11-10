import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import "@/index.css";
import "@/i18n";
import { AuthProvider } from "@/context/AuthContext";
import { ToasterProvider } from "@/components/ToasterProvider";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleAuthProvider } from '@/context/GoogleAuthContext';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback="Loading...">
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <GoogleAuthProvider>
          <AuthProvider>
            <ToasterProvider>
              <App />
            </ToasterProvider>
          </AuthProvider>
        </GoogleAuthProvider>
      </GoogleOAuthProvider>
    </Suspense>
  </React.StrictMode>
);