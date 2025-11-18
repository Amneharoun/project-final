import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function Sidebar() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    api
      .get("/dashboard/overview")
      .then((res) => {
        setRole(res.data.role);
      })
      .catch((err) => console.error("Erreur Dashboard:", err));
  }, []);

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
            <i className="bi bi-bandaid"></i> Médicaments
          </a>
        </li>

        {/* Accessible à TOUS */}
        <li className="nav-item mb-2">
          <a href="/Pharmacies" className="nav-link text-white">
            🏥 Pharmacies
          </a>
        </li>

      {/* Visible uniquement par Admin & Pharmacien */}
        {(role === "admin" || role === "pharmacien" || role === "caissier") && (
        <li className="nav-item mb-2">
          <a href="/clients" className="nav-link text-white">
           <i className="bi bi-person-fill"></i> patients
          </a>
        </li>
        )}

        {/* Visible uniquement par Admin & Pharmacien */}
        {(role === "admin" || role === "pharmacien" || role === "caissier") && (
        <li className="nav-item mb-2">
          <a href="/NouvelleVente" className="nav-link text-white">
            <i className="bi bi-cart-dash"></i> EnregistreVentes
          </a>
        </li>
        )}

        {/* Visible uniquement par Admin & Pharmacien */}
        {(role === "admin" || role === "caissier" || role === "pharmacien") && (
        <li className="nav-item mb-2">
          <a href="/ListeVente" className="nav-link text-white">
            <i className="bi bi-card-checklist"></i> ListeVentes
          </a>
        </li>
        )}

        {/* Visible uniquement par Admin & Pharmacien */}
        {(role === "admin" || role === "caissier" || role === "pharmacien") && (
        <li className="nav-item mb-2">
          <a href="/factures" className="nav-link text-white">
            <i className="bi bi-file-text-fill"></i> Factures
          </a>
        </li>
        )}
        {/* Visible uniquement par Admin & Pharmacien */}
        {(role === "admin" || role === "pharmacien" || role === "caissier") && (
          <li className="nav-item mb-2">
            <a href="/commandes" className="nav-link text-white">
              <i className="bi bi-box-seam-fill"></i> Commandes
            </a>
          </li>
        )}
        {/* Visible uniquement par Admin & Pharmacien */}
        {(role === "admin" || role === "pharmacien") && (
          <li className="nav-item mb-2">
            <a href="/excelpage" className="nav-link text-white">
              <i className="bi bi-cloud-arrow-up"></i> Import/Export
            </a>
          </li>
        )}
        {/* Visible uniquement par Admin */}
        {role === "admin" && (
          <li className="nav-item mb-2">
            <a href="/GestionUsers" className="nav-link text-white">
              <i className="bi bi-person-gear"></i> Utilisateurs
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
