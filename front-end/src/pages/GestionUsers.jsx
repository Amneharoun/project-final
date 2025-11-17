import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../config";

export default function GestionUsers() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "caissier",
    password: "",
  });

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const fetchUtilisateurs = async () => {
    try {
      const response = await axios.get(`${API_URL}/gestion-users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUtilisateurs(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(
          `${API_URL}/gestion-users/${currentUser._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(`${API_URL}/gestion-users/`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }
      fetchUtilisateurs();
      resetForm();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde de l'utilisateur");
    }
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      try {
        await axios.delete(`${API_URL}/gestion-users/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        fetchUtilisateurs();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression de l'utilisateur");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "caissier",
      password: "",
    });
    setCurrentUser(null);
    setEditMode(false);
    setShowModal(false);
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: "bg-danger",
      pharmacien: "bg-primary",
      caissier: "bg-success",
    };
    return badges[role] || "bg-secondary";
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Utilisateurs</h2>
        <button className="btn btn-success" onClick={() => setShowModal(true)}>
          + Nouvel Utilisateur
        </button>
      </div>

      {/* Table des utilisateurs */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Date création</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {utilisateurs.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="avatar-circle bg-primary text-white me-2">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      {new Date(
                        user.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm" role="group">
                        <button
                          className="btn btn-warning m-2"
                          onClick={() => handleEdit(user)}
                        >
                          Modifier
                        </button>
                        <button
                          className="btn btn-sm btn-danger m-2"
                          onClick={() => handleDelete(user._id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editMode ? "Modifier l'utilisateur" : "Nouvel Utilisateur"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={resetForm}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nom complet *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rôle *</label>
                    <select
                      className="form-select"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      required
                    >
                      <option value="caissier">Caissier</option>
                      <option value="pharmacien">Pharmacien</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      {editMode
                        ? "Nouveau mot de passe (laisser vide)"
                        : "Mot de passe *"}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required={!editMode}
                      minLength="6"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editMode ? "Modifier" : "Créer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        .avatar-circle {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
