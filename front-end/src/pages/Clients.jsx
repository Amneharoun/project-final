import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../config";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({ nom: "", contact: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    fetchClients(page, limit);
  }, [page, limit]);

  const fetchClients = async (page, limit) => {
    try {
      const response = await axios.get(
        `${API_URL}/clients/${page}/${limit}`
      );
      console.log("🧾 Réponse backend :", response.data);

      const data = response.data;
      setClients(data.docs);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await axios.put(
          `${API_URL}/clients/${editingClient._id}`,
          formData
        );
      } else {
        await axios.post("`${API_URL}/clients", formData);
      }
      fetchClients(page, limit); // ✅ toujours passer page et limit
      resetForm();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        await axios.delete(`${API_URL}/clients/${id}`);
        fetchClients(page, limit);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ nom: "", contact: "" });
    setEditingClient(null);
    setShowModal(false);
  };

  const openEditModal = (client) => {
    setEditingClient(client);
    setFormData({ nom: client.nom, contact: client.contact });
    setShowModal(true);
  };

  const previousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="container p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Clients</h2>
        <button className="btn btn-success" onClick={() => setShowModal(true)}>
          + Nouveau Client
        </button>
      </div>

      {/* Table des clients */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Nom</th>
                  <th>Contact</th>
                  <th>Nb Achats</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client._id}>
                    <td>{client.nom}</td>
                    <td>{client.contact}</td>
                    <td>
                      <span className="badge bg-info">
                        {client.historiqueAchats?.length || 0}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm" role="group">
                        <button
                          className="btn btn-warning m-2"
                          onClick={() => openEditModal(client)}
                        >
                          Modifier
                        </button>
                        <button
                          className="btn btn-danger m-2"
                          onClick={() => handleDelete(client._id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination et limite */}
            <div className="container text-center">
              <div className="row">
                <div className="col text-end">
                  <input
                    type="number"
                    placeholder="Limite"
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="form-control"
                  />
                </div>
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
        </div>
      </div>

      {/* Modal pour ajouter/modifier */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingClient ? "Modifier Client" : "Nouveau Client"}
                </h5>
                <button type="button" className="btn-close" onClick={resetForm}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nom *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.nom}
                      onChange={(e) =>
                        setFormData({ ...formData, nom: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contact</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.contact}
                      onChange={(e) =>
                        setFormData({ ...formData, contact: e.target.value })
                      }
                      placeholder="Téléphone ou email"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingClient ? "Modifier" : "Ajouter"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
