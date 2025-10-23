import React from "react";
import { Navigate } from "react-router-dom";


export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // tu peux aussi venir du contexte ou d’un appel API

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si l’utilisateur n’a pas le bon rôle, on le redirige
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
