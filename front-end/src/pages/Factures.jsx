import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://localhost:5000/factures";

const Factures = () => {
  const [factures, setFactures] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentFacture, setCurrentFacture] = useState(null);

  const initialForm = {
    client: "",
    date: "",
    statut: "En attente",
    items: [{ description: "", quantite: 1, prix: 0 }],
  };

  const [form, setForm] = useState(initialForm);

  // ✅ Charger factures depuis backend
  useEffect(() => {
    fetchFactures();
  }, []);

  const fetchFactures = async () => {
    try {
      const res = await axios.get(API_URL);
      setFactures(res.data);
    } catch (err) {
      console.error("Erreur chargement factures:", err);
    }
  };

  // ➕ Ajouter ou Modifier
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (currentFacture) {
        await axios.put(`${API_URL}/${currentFacture._id}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      fetchFactures();
      setShowModal(false);
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
    }
  };

  // 🗑️ Supprimer
  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette facture ?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchFactures();
      } catch (err) {
        console.error("Erreur suppression:", err);
      }
    }
  };

  // ✏️ Ouvrir modal modification
  const handleEdit = (facture) => {
    setForm(facture);
    setCurrentFacture(facture);
    setShowModal(true);
  };

  // ➕ Ouvrir modal ajout
  const handleAdd = () => {
    setForm(initialForm);
    setCurrentFacture(null);
    setShowModal(true);
  };

  // 📄 Impression
  const handlePrint = (facture) => {
    const printContent = `
      <h3>Facture #${facture._id}</h3>
      <p>Client: ${facture.client}</p>
      <p>Date: ${new Date(facture.date).toLocaleDateString()}</p>
      <table border="1" cellspacing="0" cellpadding="5">
        <thead>
          <tr>
            <th>Description</th><th>Qté</th><th>Prix</th><th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${facture.items
            .map(
              (i) => `
            <tr>
              <td>${i.description}</td>
              <td>${i.quantite}</td>
              <td>${i.prix.toFixed(2)}</td>
              <td>${(i.quantite * i.prix).toFixed(2)}</td>
            </tr>
          `
            )
            .join("")}
          <tr>
            <td colspan="3" style="text-align:right"><strong>Total</strong></td>
            <td><strong>${facture.items
              .reduce((acc, i) => acc + i.quantite * i.prix, 0)
              .toFixed(2)}</strong></td>
          </tr>
        </tbody>
      </table>
    `;
    const w = window.open("", "_blank");
    w.document.write(printContent);
    w.document.close();
    w.print();
  };

  // ➕ Articles
  const addItem = () =>
    setForm({
      ...form,
      items: [...form.items, { description: "", quantite: 1, prix: 0 }],
    });

  const removeItem = (index) => {
    setForm({ ...form, items: form.items.filter((_, i) => i !== index) });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = field === "description" ? value : Number(value);
    setForm({ ...form, items: newItems });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestion des Factures</h2>
        <button className="btn btn-success" onClick={handleAdd}>
          + Ajouter
        </button>
      </div>

      {/* Tableau des factures */}
      <table className="table table-bordered table-hover">
        <thead className="table-primary">
          <tr>
            <th>#</th>
            <th>Client</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {factures.map((f, index) => (
            <tr key={f._id}>
              <td>{index + 1}</td>
              <td>{f.client}</td>
              <td>{new Date(f.date).toLocaleDateString()}</td>
              <td>
                <span
                  className={`badge ${
                    f.statut === "Payée"
                      ? "bg-success"
                      : f.statut === "En attente"
                      ? "bg-warning text-dark"
                      : "bg-danger"
                  }`}
                >
                  {f.statut}
                </span>
              </td>
              <td className="text-center">
                <div className="btn-group btn-group-sm" role="group">
                  <button
                    className="btn btn-warning m-2"
                    onClick={() => handleEdit(f)}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn btn-danger m-2"
                    onClick={() => handleDelete(f._id)}
                  >
                    Supprimer
                  </button>
                  <button
                    className="btn btn-secondary m-2"
                    onClick={() => handlePrint(f)}
                  >
                    Imprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal ajout/modification */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleSave}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {currentFacture ? "Modifier" : "Nouvelle"} Facture
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Client</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.client}
                      onChange={(e) =>
                        setForm({ ...form, client: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Statut</label>
                    <select
                      className="form-select"
                      value={form.statut}
                      onChange={(e) =>
                        setForm({ ...form, statut: e.target.value })
                      }
                    >
                      <option value="En attente">En attente</option>
                      <option value="Payée">Payée</option>
                      <option value="Annulée">Annulée</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Articles</label>
                    {form.items.map((item, index) => (
                      <div key={index} className="row mb-2 align-items-end">
                        <div className="col-md-4">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) =>
                              updateItem(index, "description", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="col-md-2">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Qté"
                            min="1"
                            value={item.quantite}
                            onChange={(e) =>
                              updateItem(index, "quantite", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="col-md-3">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Prix"
                            min="0"
                            step="0.01"
                            value={item.prix}
                            onChange={(e) =>
                              updateItem(index, "prix", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="col-md-2">
                          <strong>
                            {(item.quantite * item.prix).toFixed(2)}
                          </strong>
                        </div>
                        <div className="col-md-1">
                          {form.items.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => removeItem(index)}
                            >
                              X
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={addItem}
                    >
                      + Ajouter article
                    </button>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {currentFacture ? "Modifier" : "Ajouter"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Factures;
