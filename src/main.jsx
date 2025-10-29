import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import "@/index.css";
import "@/i18n";
import { AuthProvider } from "@/context/AuthContext";
import { ToasterProvider } from "@/components/ToasterProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback="Loading...">
      <AuthProvider>
        <ToasterProvider>
          <App />
        </ToasterProvider>
      </AuthProvider>
    </Suspense>
  </React.StrictMode>
);