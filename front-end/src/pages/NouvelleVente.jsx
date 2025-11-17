import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config";

const NouvelleVente = () => {
  const [clients, setClients] = useState([]);
  const [medicaments, setMedicaments] = useState([]);
  const [vente, setVente] = useState({
    client: "",
    medicaments: [],
    reduction: 0,
  });

  const [message, setMessage] = useState("");

  // 🔹 Charger les clients et médicaments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resClients = await axios.get(
          `${API_URL}/clients/1/1000`,
          {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
        );
        const resMeds = await axios.get(
          `${API_URL}/medicaments/1/1000`,
          {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
        );
        setClients(resClients.data.docs || []);
        setMedicaments(resMeds.data.docs || []);
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      }
    };
    fetchData();
  }, []);

  // 🔹 Ajouter un médicament à la vente
  const ajouterMedicament = () => {
    setVente({
      ...vente,
      medicaments: [
        ...vente.medicaments,
        { medicament: "", quantite: 1, reduction: 0 },
      ],
    });
  };

  // 🔹 Gérer les changements
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

  // 🔹 Soumettre la vente
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(vente);

      const res = await axios.post(
        `${API_URL}/ventes/ventes`,
        vente,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage("✅ Vente enregistrée avec succès !");
      console.log("Nouvelle Vente : ", res.data);

      // ==== Plus besoin de créer une facture, car directement gérer par le backend à l'ajout d'une vente
      // // Transformer les médicaments en items de facture
      // const items = res.data.medicaments.map((m) => ({
      //   description: m.medicament.nom,
      //   quantite: m.quantite,
      //   prix: m.prix,
      // }));

      // // Créer la facture
      // const resFacture = await axios.post(`${API_URL}/factures", {
      //   client: res.data.client.nom,
      //   date: res.data.dateVente,
      //   items,
      // });
      // console.log("Nouvelle Facture : ", resFacture.data);
      // ====

      setVente({ client: "", medicaments: [], reduction: 0 }); // reset
    } catch (error) {
      setMessage(
        " Erreur: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="container mt-4">
      <h2>Nouvelle Vente</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit}>
        {/* 🔸 Choix du client */}
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

        {/* 🔸 Liste des médicaments */}
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

            {/* <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Prix (fcfa)"
                min="0"
                value={item.prix || ""}
                onChange={(e) =>
                  handleMedicamentChange(
                    index,
                    "prix",
                    parseFloat(e.target.value) || 0
                  )
                }
                required
              />
            </div> */}

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

        {/* 🔸 Bouton pour ajouter un médicament */}
        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={ajouterMedicament}
        >
          + Ajouter un médicament
        </button>

        <div>
          {/* 🔸 Soumettre */}
          <button type="submit" className="btn btn-success">
            Enregistrer la vente
          </button>
        </div>
      </form>
    </div>
  );
};

export default NouvelleVente;
