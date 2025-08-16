import React from "react";
import { useParams, Navigate } from "react-router-dom";
import AdminPage from "@/pages/AdminPage";
import { toast } from "react-hot-toast";

const AdminRoute = () => {
  const { hash } = useParams();
  const validHash = import.meta.env.VITE_ADMIN_HASH;

  if (!hash || hash !== validHash) {
    toast.error("Accès interdit");
    return <Navigate to="/" />;
  }

  return <AdminPage />;
};

export default AdminRoute;
