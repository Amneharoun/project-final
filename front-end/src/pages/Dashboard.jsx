// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/commandes/dashboard/overview`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(" Données RÉELLES reçues:", response.data);
      setData(response.data);
      setError("");
    } catch (err) {
      console.error(" Erreur:", err);
      setError("Erreur de chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const retryConnection = () => {
    setLoading(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-2">Chargement des données en temps réel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={retryConnection}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Données RÉELLES du backend
  const {
    lowStockCount = 0,
    expiringCount = 0,
    ruptureCount = 0,
    revenue30d = 0,
    totalMedicaments = 0,
    medicamentsRupture = [],
    medicamentsStockFaible = [],
    medicamentsPeremption = [],
    commandes = {},
    role = "user",
  } = data || {};

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Tableau de Bord Temps Réel</h3>
        <div>
          <span className="text-muted">Rôle: </span>
          <strong>{role}</strong>
          <button
            className="btn btn-sm btn-outline-primary ms-3"
            onClick={retryConnection}
          >
            Actualiser
          </button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-success">
            <div className="card-body text-center">
              <h5 className="card-title "> 30j</h5>
              <h3>{revenue30d}FCA</h3>
              <small className="text-muted">Chiffre d'affaires</small>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card border-danger">
            <div className="card-body text-center">
              <h5 className="card-title text-danger">💊 Ruptures</h5>
              <h3>{ruptureCount}</h3>
              <small className="text-muted">Stock = 0</small>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card border-warning">
            <div className="card-body text-center">
              <h5 className="card-title text-warning">
                {" "}
                <i class="bi bi-exclamation-triangle text-danger"></i> Stock
                faible
              </h5>
              <h3>{lowStockCount}</h3>
              <small className="text-muted">Stock ≤ 5</small>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card border-info">
            <div className="card-body text-center">
              <h5 className="card-title text-info">📅 Péremptions</h5>
              <h3>{expiringCount}</h3>
              <small className="text-muted">30 prochains jours</small>
            </div>
          </div>
        </div>
      </div>

      {/* Détails des alertes */}
      <div className="row">
        {/* Médicaments en RUPTURE */}
        <div className="col-md-4 mb-4">
          <div className="card border-danger h-100">
            <div className="card-header bg-danger text-white">
              <h6 className="mb-0">
                <i class="bi bi-heartbreak"></i> Rupture de stock
                <span className="badge bg-light text-dark ms-2">
                  {ruptureCount}
                </span>
              </h6>
            </div>
            <div className="card-body">
              {medicamentsRupture.length > 0 ? (
                <div className="list-group list-group-flush">
                  {medicamentsRupture.map((med, index) => (
                    <div
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center px-0"
                    >
                      <small>💊 {med.nom}</small>
                      <span className="badge bg-danger">Rupture</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center mb-0">✅ Aucune rupture</p>
              )}
            </div>
          </div>
        </div>

        {/* Médicaments STOCK FAIBLE */}
        <div className="col-md-4 mb-4">
          <div className="card border-warning h-100">
            <div className="card-header bg-warning text-dark">
              <h6 className="mb-0">
                <i class="bi bi-exclamation-triangle text-danger"></i> Stock
                faible
                <span className="badge bg-light text-dark ms-2">
                  {lowStockCount}
                </span>
              </h6>
            </div>
            <div className="card-body">
              {medicamentsStockFaible.length > 0 ? (
                <div className="list-group list-group-flush">
                  {medicamentsStockFaible.map((med, index) => (
                    <div
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center px-0"
                    >
                      <small>💊 {med.nom}</small>
                      <span className="badge bg-warning text-dark">
                        {med.stock} restants
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center mb-0"> Stock normal</p>
              )}
            </div>
          </div>
        </div>

        {/* Médicaments PÉREMPTION */}
        <div className="col-md-4 mb-4">
          <div className="card border-info h-100">
            <div className="card-header bg-info text-white">
              <h6 className="mb-0">
                <i class="bi bi-calendar"></i> Bientôt périmés
                <span className="badge bg-light text-dark ms-2">
                  {expiringCount}
                </span>
              </h6>
            </div>
            <div className="card-body">
              {medicamentsPeremption.length > 0 ? (
                <div className="list-group list-group-flush">
                  {medicamentsPeremption.map((med, index) => (
                    <div
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center px-0"
                    >
                      <small>💊 {med.nom}</small>
                      <span className="badge bg-info">
                        {new Date(med.datePeremption).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center mb-0"> Aucun risque</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Réservations et informations */}
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">📋 Commande (30j)</h6>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-4">
                  <h5 className="text-primary">{commandes.total || 0}</h5>
                  <small>Total</small>
                </div>
                <div className="col-4">
                  <h5 className="text-warning">{commandes.pending || 0}</h5>
                  <small>En attente</small>
                </div>
                <div className="col-4">
                  <h5 className="text-success">{commandes.completed || 0}</h5>
                  <small>Terminées</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">📊 Vue d'ensemble</h6>
            </div>
            <div className="card-body">
              <p>
                <strong>Total médicaments:</strong> {totalMedicaments}
              </p>
              <p>
                <strong>Dernière mise à jour:</strong>{" "}
                {new Date().toLocaleString()}
              </p>
              <p>
                <strong>Statut:</strong>
                <span className="badge bg-success ms-2">Connecté</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
