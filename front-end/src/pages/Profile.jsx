import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Erreur profil:", err));
  }, []);

  if (!user) return <div className="text-center mt-5">Chargement...</div>;

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4">
        <h3 className="mb-3">👤 Mon Profil</h3>
        <p><strong>Nom :</strong> {user.nom}</p>
        <p><strong>Email :</strong> {user.email}</p>
        <p><strong>Rôle :</strong> {user.role}</p>
        <p><strong>Date d'inscription :</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
