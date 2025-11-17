// src/pages/Medicaments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config";

const Medicaments = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [meds, setMeds] = useState([]);
  const [form, setForm] = useState({
    nom: "",
    code: "",
    categorie: "",
    prix: "",
    stock: "",
    seuilAlerte: "",
    datePeremption: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    const med = localStorage.getItem("selectedMedicament");
    if (localStorage.getItem("selectedMedicament")) {
      const parsed = JSON.parse(med);
      // console.log("Médicament sélectionné :", parsed);
      setMeds([parsed]);
      // console.log(meds);
    } else {
      fetchMeds(page, limit);
    }
  }, [page, limit]);

  // 🔹 Charger les médicaments
  const fetchMeds = async (page, limit) => {
    try {
      const res = await axios.get(
       `${API_URL}/medicaments/${page}/${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = res.data;
      console.log("Data", typeof data);

      setMeds(data.docs);

      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMeds = meds.filter((med) =>
    med.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // useEffect(() => {
  //   fetchMeds();
  // }, []);

  // 🔹 Gérer saisie du formulaire
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Ajouter ou Modifier
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `${API_URL}/medicaments/${editingId}`,
          form,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        alert(" Médicament modifié");
      } else {
        await axios.post("`${API_URL}/medicaments", form, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        alert("Médicament ajouté");
      }
      setForm({
        nom: "",
        code: "",
        categorie: "",
        prix: "",
        stock: "",
        seuilAlerte: "",
        datePeremption: "",
      });
      setEditingId(null);
      fetchMeds();
    } catch (err) {
      console.error(err);
      alert(" Erreur lors de l'opération");
    }
  };

  // 🔹 Supprimer
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce médicament ?")) return;
    try {
      await axios.delete(`${API_URL}/medicaments/${id}`,

        
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
      );
      alert(" Médicament supprimé");
      fetchMeds();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Remplir formulaire pour modification
  const handleEdit = (med) => {
    setForm(med);
    setEditingId(med._id);
  };
  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestion des Médicaments</h2>
      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          {/* Nom */}
          <div className="col-md-4">
            <label htmlFor="nom" className="form-label">
              Nom
            </label>
            <input
              id="nom"
              type="text"
              name="nom"
              className="form-control"
              value={form.nom}
              onChange={handleChange}
              required
            />
          </div>

          {/* Code */}
          <div className="col-md-2">
            <label htmlFor="code" className="form-label">
              Code
            </label>
            <input
              id="code"
              type="text"
              name="code"
              className="form-control"
              value={form.code}
              onChange={handleChange}
              required
            />
          </div>

          {/* Catégorie */}
          <div className="col-md-3">
            <label htmlFor="categorie" className="form-label">
              Catégorie
            </label>
            <input
              id="categorie"
              type="text"
              name="categorie"
              className="form-control"
              value={form.categorie}
              onChange={handleChange}
            />
          </div>

          {/* Prix */}
          <div className="col-md-2">
            <label htmlFor="prix" className="form-label">
              Prix (fcf)
            </label>
            <input
              id="prix"
              type="number"
              name="prix"
              className="form-control"
              value={form.prix}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>

          {/* Stock */}
          <div className="col-md-2">
            <label htmlFor="stock" className="form-label">
              Stock
            </label>
            <input
              id="stock"
              type="number"
              name="stock"
              className="form-control"
              value={form.stock}
              onChange={handleChange}
              min="0"
            />
          </div>

          {/* Seuil alerte */}
          <div className="col-md-2">
            <label htmlFor="seuilAlerte" className="form-label">
              Seuil alerte
            </label>
            <input
              id="seuilAlerte"
              type="number"
              name="seuilAlerte"
              className="form-control"
              value={form.seuilAlerte}
              onChange={handleChange}
              min="0"
            />
          </div>

          {/* Date de péremption */}
          <div className="col-md-3">
            <label htmlFor="datePeremption" className="form-label">
              Date de péremption
            </label>
            <input
              id="datePeremption"
              type="date"
              name="datePeremption"
              className="form-control"
              value={form.datePeremption}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]} // prevents past dates
            />
          </div>

          {/* Submit button */}
          <div className="col-md-2 d-flex align-items-end">
            <button type="submit" className="btn btn-success w-100">
              {editingId ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </div>
      </form>
      <div className="mb-3 d-flex justify-content-end">
        <input
          type="search"
          className="form-control w-25"
          placeholder="Rechercher un médicament..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tableau */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Nom</th>
            <th>Code</th>
            <th>Catégorie</th>
            <th>Prix (fcf)</th>
            <th>Stock</th>
            <th>Seuil alerte</th>
            <th>Péremption</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMeds.length == 0 && (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", color: "red" }}>
                Aucun médicament correspondant n'est trouvé.
              </td>
            </tr>
          )}

          {filteredMeds.map((med) => (
            <tr key={med._id}>
              <td>{med.nom}</td>
              <td>{med.code}</td>
              <td>{med.categorie}</td>
              <td>{med.prix}</td>
              <td>{med.stock}</td>
              <td>{med.seuilAlerte}</td>
              <td>{new Date(med.datePeremption).toLocaleDateString()}</td>
              <td className="text-center">
                <div className="btn-group btn-group-sm" role="group">
                  <button
                    onClick={() => handleEdit(med)}
                    className="btn btn-warning m-2"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(med._id)}
                    className="btn btn-danger m-2"
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* pour le bouton des Limites */}
      <div className="container text-center">
        <div className="row">
          <div className="col text-end">
            <input
              id="nom"
              type="text"
              name="nom"
              // className="form-control"
              placeholder="Limites"
              onChange={(e) => {
                setLimit(e.target.value);
              }}
            />
          </div>
          {/* bouton pour les pages */}
          <div className="col text-start">
            <button
              className="btn btn-outline-primary"
              disabled={page <= 1}
              onClick={previousPage}
            >
              <i className="bi bi-caret-left-fill"></i>
            </button>
            &nbsp;{page}&nbsp;
            <button
              className="btn btn-outline-primary"
              disabled={page >= totalPages}
              onClick={nextPage}
            >
              <i className="bi bi-caret-right-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Medicaments;
