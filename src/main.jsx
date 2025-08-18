import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import "@/index.css";
import "@/i18n";
import { AuthProvider } from "@/context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback="Loading...">
      <AuthProvider>
        <App />
      </AuthProvider>
    </Suspense>
  </React.StrictMode>
);
