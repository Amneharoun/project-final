import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Sidebar() {
  const [data, setData] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/dashboard/overview", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setData(res.data);
        setRole(res.data.role);
      })
      .catch((err) => console.error("Erreur Dashboard:", err));
  }, []);

  if (!data) return <div className="text-center mt-5">Chargement...</div>;

  return (
    <div
      className="bg-primary text-white p-3"
      style={{ width: "220px", minHeight: "100vh" }}
    >
      <h4 className="mb-4">Pharmacie</h4>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <a href="/dashboard" className="nav-link text-white">
            📊 Tableau de bord
          </a>
        </li>

        {/* Accessible à TOUS */}
        <li className="nav-item mb-2">
          <a href="/medicament" className="nav-link text-white">
            💊 Médicaments
          </a>
        </li>

        <li className="nav-item mb-2">
          <a href="/clients" className="nav-link text-white">
            👥 Clients
          </a>
        </li>
        <li className="nav-item mb-2">
          <a href="/NouvelleVente" className="nav-link text-white">
            EnregistreVentes
          </a>
        </li>
        <li className="nav-item mb-2">
          <a href="/ListeVente" className="nav-link text-white">
            ListeVentes
          </a>
        </li>
        <li className="nav-item mb-2">
          <a href="/factures" className="nav-link text-white">
            🧾 Factures
          </a>
        </li>

        {/* Visible uniquement par Admin & Pharmacien */}
        {(role === "admin" || role === "pharmacien") && (
          <li className="nav-item mb-2">
            <a href="/commandes" className="nav-link text-white">
              📦 Commandes
            </a>
          </li>
        )}
        {/* Visible uniquement par Admin & Pharmacien */}
        {(role === "admin" || role === "pharmacien") && (
          <li className="nav-item mb-2">
            <a href="/excelpage" className="nav-link text-white">
              Import/Export
            </a>
          </li>
        )}
        {/* Visible uniquement par Admin */}
        {role === "admin" && (
          <li className="nav-item mb-2">
            <a href="/GestionUsers" className="nav-link text-white">
              ⚙️ Utilisateurs
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
