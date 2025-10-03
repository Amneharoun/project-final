import React, { useEffect, useState } from "react";
import axios from "axios";

const NouvelleVente = () => {
  const [clients, setClients] = useState([]);
  const [medicaments, setMedicaments] = useState([]);
  const [vente, setVente] = useState({
    client: "",
    medicaments: [],
    reduction: 0,
  });

  const [message, setMessage] = useState("");

  //pour charger les clients et medicaments disponibles
  useEffect(() => {
    axios
      .get("http://localhost:5000/clients")
      .then((res) => setClients(res.data));
    axios
      .get("http://localhost:5000/medicaments")
      .then((res) => setMedicaments(res.data));
  }, []);

  //pour ajouter un medicament a vente

  const ajouterMedicament = () => {
    setVente({
      ...vente,
      medicaments: [
        ...vente.medicaments,
        { medicament: "", quantite: 1, prix: 0 },
      ],
    });
  };

  //pour gerer la modification d'un medicament dans la liste
  const handleMedicamentChange = (index, field, value) => {
    const updated = [...vente.medicaments];
    updated[index][field] = value;
    setVente({ ...vente, medicaments: updated });
  };

  // pour soumettre la vente au backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/ventes/ventes", vente);
      setMessage("vente enregistree avec succes");
      console.log(res.data);
    } catch (error) {
      setMessage("erreur:" + error.response?.message || error.message);
    }
  };

  return (
    <div className="contrainer mt-4">
      <h2>Nouvelle vente</h2>
      {message && <div className="alert alert-info"> {message}</div>}

      <form onSubmit={handleSubmit}>
        {/* choix client */}
        <div className="mb-3">
          <label>Client</label>
          <select
            className="form-select"
            value={vente.client}
            onChange={(e) => setVente({ ...vente, client: e.target.value })}
          >
            <option value="">--selectionner--</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.nom}
              </option>
            ))}
          </select>
        </div>

        {/* liste des medicaments */}
        {vente.medicaments.map((item, index) => (
          <div key={index} className="row mb-2">
            <div className="col-mb-4">
              <select
                className="form-select"
                value={item.medicament}
                onChange={(e) =>
                  handleMedicamentChange(index, "medicament", e.target.value)
                }
              >
                <option value="">--Medicament--</option>
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
                placeholder="Quantite"
                value={isNaN(item.quantite) ? "" : item.quantite}
                onChange={(e) =>
                  handleMedicamentChange(
                    index,
                    "quantite",
                    e.target.value === "" ? "" : parseInt(e.target.value)
                  )
                }
              />
            </div>

            <input
              type="number"
              className="form-control"
              value={isNaN(vente.reduction) ? "" : vente.reduction}
              onChange={(e) =>
                setVente({
                  ...vente,
                  reduction:
                    e.target.value === "" ? "" : parseFloat(e.target.value),
                })
              }
            />
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={ajouterMedicament}
        >
          + Ajouter un medicament
        </button>
        {/* Reduction*/}
        <div className="mb-3">
          <label>Reduction</label>
          <input
            type="number"
            className="from-control"
            value={vente.reduction}
            onChange={(e) =>
              setVente({ ...vente, reduction: parseFloat(e.target.value) })
            }
          />
        </div>

        <button type="submit" className="btn btn-success">
          Enregistrer la vente
        </button>
      </form>
    </div>
  );
};
export default NouvelleVente;
