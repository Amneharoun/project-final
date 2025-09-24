import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/dashboard/overview", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then((res) => {
        setData(res.data);
        setRole(res.data.role);
      })
      .catch((err) => console.error("Erreur Dashboard:", err));
  }, []);

  if (!data) return <div className="text-center mt-5">Chargement...</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Tableau de bord ({role})</h3>

      {/* Alertes */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm p-3">
            <h6 className="text-warning">Médicaments en rupture</h6>
            <p>{data.medicamentsRupture.length} médicaments en rupture</p>
            <ul className="list-unstyled">
              {data.medicamentsRupture.slice(0, 5).map((med) => (
                <li key={med._id}>💊 {med.nom} ({med.stock})</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3">
            <h6 className="text-danger">Péremption</h6>
            <p>{data.expiringCount} arrivent à péremption</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3">
            <h6 className="text-info">Stock faible</h6>
            <p>{data.lowStockCount} médicaments</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3">
            <h6 className="text-success">Chiffre d’affaires</h6>
            <p>{data.revenue30d}  (30 derniers jours)</p>
          </div>
        </div>
      </div>

      {/* Graphique ventes */}
      {(role === "admin" || role === "pharmacien") && (
        <div className="card shadow-sm p-3 mb-4">
          <h5>Ventes (30 derniers jours)</h5>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={data.sales}>
                <Line type="monotone" dataKey="valeur" stroke="#007bff" />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}