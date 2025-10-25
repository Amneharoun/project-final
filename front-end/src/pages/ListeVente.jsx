import React, { useEffect, useState } from "react";
import axios from "axios";

const ListeVentes = () => {
  const [ventes, setVentes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/ventes/getventes")
      .then((res) => setVentes(res.data))
      .catch((err) => console.error("Erreur chargement ventes :", err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🧾 Historique des ventes</h2>

      <table className="table table-bordered table-hover align-middle">
        <thead className="table-dark text-center">
          <tr>
            <th>Date</th>
            <th>Client</th>
            <th>Médicament</th>
            <th>Quantité</th>
            <th>Prix (FCFA)</th>
            <th>Réduction (%)</th>
            <th>Prix Après Réduction (FCFA)</th>
            <th>Total (FCFA)</th>
          </tr>
        </thead>
        <tbody>
          {ventes.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center text-muted">
                Aucune vente enregistrée
              </td>
            </tr>
          ) : (
            ventes.flatMap((vente) =>
              vente.medicaments.map((m, index) => (
                <tr key={`${vente._id}-${index}`}>
                  {/* ✅ Afficher la date et le client seulement sur la 1ère ligne */}
                  {index === 0 && (
                    <>
                      <td rowSpan={vente.medicaments.length}>
                        {new Date(vente.dateVente).toLocaleDateString()}
                      </td>
                      <td rowSpan={vente.medicaments.length}>
                        {vente.client?.nom || "Client inconnu"}
                      </td>
                    </>
                  )}

                  {/* Médicament */}
                  <td>{m.medicament?.nom || "-"}</td>
                  <td className="text-center">{m.quantite}</td>
                  <td className="text-end">{m.prix?.toFixed(2)}</td>
                  <td className="text-center">{m.reduction || 0}</td>
                  <td className="text-center">{m.prixReduit || 0}</td>

                  {/* Total global sur la dernière ligne */}
                  {index === 0 && (
                    <>
                      <td
                        rowSpan={vente.medicaments.length}
                        className="text-end fw-bold"
                      >
                        {vente.total?.toFixed(2)} FCFA
                      </td>
                    </>
                  )}
                </tr>
              ))
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListeVentes;
