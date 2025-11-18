import React, { useEffect, useState } from "react";
import api from "../utils/api";

const NouvelleVente = () => {
  const [clients, setClients] = useState([]);
  const [medicaments, setMedicaments] = useState([]);
  const [vente, setVente] = useState({
    client: "",
    medicaments: [],
    reduction: 0,
  });

  const [message, setMessage] = useState("");

  // Charger les clients et médicaments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resClients = await api.get(`/clients/list/1/1000`);
        const resMeds = await api.get(`/medicaments/list/1/1000`);
        setClients(resClients.data.docs || []);
        setMedicaments(resMeds.data.docs || []);
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      }
    };
    fetchData();
  }, []);

  // Ajouter un médicament à la vente
  const ajouterMedicament = () => {
    setVente({
      ...vente,
      medicaments: [
        ...vente.medicaments,
        { medicament: "", quantite: 1, reduction: 0 },
      ],
    });
  };

  // Gérer les changements
  const handleMedicamentChange = (index, field, value) => {
    const updated = [...vente.medicaments];

    // For numeric fields (quantite, reduction), convert carefully
    if (field === "quantite" || field === "reduction") {
      updated[index][field] = value === "" ? "" : parseInt(value);
    } else {
      updated[index][field] = value;
    }

    setVente({ ...vente, medicaments: updated });
  };

  // Soumettre la vente
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(vente);

      const res = await api.post(`/ventes/ventes`, vente);
      setMessage("✅ Vente enregistrée avec succès !");
      console.log("Nouvelle Vente : ", res.data);

      setVente({ client: "", medicaments: [], reduction: 0 }); // reset
    } catch (error) {
      setMessage(
        "❌ Erreur: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="container mt-4">
      <h2>Nouvelle Vente</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit}>
        {/* Choix du client */}
        <div className="mb-3">
          <label className="form-label">Client</label>
          <select
            className="form-select"
            value={vente.client}
            onChange={(e) => setVente({ ...vente, client: e.target.value })}
            required
          >
            <option value="">-- Sélectionner --</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.nom}
              </option>
            ))}
          </select>
        </div>

        {/* Liste des médicaments */}
        {vente.medicaments.map((item, index) => (
          <div key={index} className="row mb-2 align-items-center">
            <div className="col-md-4">
              <select
                className="form-select"
                value={item.medicament}
                onChange={(e) =>
                  handleMedicamentChange(index, "medicament", e.target.value)
                }
                required
              >
                <option value="">-- Médicament --</option>
                {medicaments.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.nom} (stock: {m.stock})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Quantité"
                min="1"
                value={item.quantite || ""}
                onChange={(e) =>
                  handleMedicamentChange(
                    index,
                    "quantite",
                    parseInt(e.target.value) || 1
                  )
                }
                required
              />
            </div>

            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Réduction (%)"
                min="0"
                max="100"
                value={item.reduction === "" ? "" : item.reduction}
                onChange={(e) =>
                  handleMedicamentChange(
                    index,
                    "reduction",
                    parseInt(e.target.value) || 0
                  )
                }
              />
            </div>
          </div>
        ))}

        {/* Bouton pour ajouter un médicament */}
        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={ajouterMedicament}
        >
          + Ajouter un médicament
        </button>

        <div>
          {/* Soumettre */}
          <button type="submit" className="btn btn-success">
            Enregistrer la vente
          </button>
        </div>
      </form>
    </div>
  );
};

export default NouvelleVente;
