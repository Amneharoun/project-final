import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/pharmacies";

export default function Pharmacies() {
  const [pharmacies, setPharmacies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    adresse: "",
    telephone: "",
    email: "",
    horaires: { ouverture: "", fermeture: "" },
    statutOuvert: true,
    localisation: null, // vide par défaut
  });

  // Charger les pharmacies
  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    try {
      const res = await axios.get(API_URL);
      setPharmacies(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
    }
  };

  // Ajouter ou modifier une pharmacie
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.localisation) {
      alert("Veuillez renseigner les coordonnées GPS de la pharmacie !");
      return;
    }

    try {
      if (editMode) {
        await axios.put(`${API_URL}/${formData._id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      setShowModal(false);
      fetchPharmacies();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
    }
  };

  // Supprimer
  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous supprimer cette pharmacie ?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchPharmacies();
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  };

  // Basculer statut
  const toggleStatut = async (id) => {
    try {
      await axios.patch(`${API_URL}/${id}/statut`);
      fetchPharmacies();
    } catch (error) {
      console.error("Erreur statut :", error);
    }
  };

  // Définir la localisation GPS (manuel ou navigateur)
  const setCoordinates = (lng, lat) => {
    setFormData({ ...formData, localisation: { type: "Point", coordinates: [lng, lat] } });
  };

  // Récupérer position de l'utilisateur (optionnel)
  const getGeolocation = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n’est pas supportée sur votre appareil.");
      return;
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setCoordinates(longitude, latitude);
      alert(`Coordonnées récupérées ✅ (${latitude}, ${longitude})`);
    });
  };

  // Ouvrir modal modification
  const handleEdit = (pharmacie) => {
    setFormData(pharmacie);
    setEditMode(true);
    setShowModal(true);
  };

  // Ouvrir modal ajout
  const handleAdd = () => {
    setEditMode(false);
    setFormData({
      nom: "",
      adresse: "",
      telephone: "",
      email: "",
      horaires: { ouverture: "", fermeture: "" },
      statutOuvert: true,
      localisation: null,
    });
    setShowModal(true);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Pharmacies</h2>
        <button className="btn btn-success btn-sm" onClick={handleAdd}>
          + Nouvelle Pharmacie
        </button>
      </div>

      {/* Tableau */}
      <table className="table table-bordered table-hover shadow-sm">
        <thead className="table-primary">
          <tr>
            <th>Nom</th>
            <th>Adresse</th>
            <th>Téléphone</th>
            <th>Horaires</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pharmacies.length > 0 ? (
            pharmacies.map((p) => (
              <tr key={p._id}>
                <td>{p.nom}</td>
                <td>{p.adresse}</td>
                <td>{p.telephone}</td>
                <td>{p.horaires?.ouverture} - {p.horaires?.fermeture}</td>
                <td>
                  <span className={`badge ${p.statutOuvert ? "bg-success" : "bg-danger"}`}>
                    {p.statutOuvert ? "Ouverte" : "Fermée"}
                  </span>
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-warning" onClick={() => handleEdit(p)}>Modifier</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(p._id)}>Supprimer</button>
                    <button className="btn btn-secondary" onClick={() => toggleStatut(p._id)}>
                      {p.statutOuvert ? "Fermer" : "Ouvrir"}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">Aucune pharmacie enregistrée</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal Ajout / Édition */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{editMode ? "Modifier la pharmacie" : "Nouvelle pharmacie"}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>

                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label>Nom</label>
                      <input type="text" className="form-control" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Adresse</label>
                      <input type="text" className="form-control" value={formData.adresse} onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} required />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label>Téléphone</label>
                      <input type="text" className="form-control" value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Email</label>
                      <input type="email" className="form-control" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label>Heure d’ouverture</label>
                      <input type="time" className="form-control" value={formData.horaires.ouverture} onChange={(e) => setFormData({ ...formData, horaires: { ...formData.horaires, ouverture: e.target.value } })} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Heure de fermeture</label>
                      <input type="time" className="form-control" value={formData.horaires.fermeture} onChange={(e) => setFormData({ ...formData, horaires: { ...formData.horaires, fermeture: e.target.value } })} />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <span>
                      📍 Coordonnées : {formData.localisation ? formData.localisation.coordinates.join(", ") : "Non renseignées"}
                    </span>
                    <div>
                      <button type="button" className="btn btn-outline-primary btn-sm me-2" onClick={getGeolocation}>Récupérer ma position</button>
                      <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => {
                        const lng = parseFloat(prompt("Longitude de la pharmacie"));
                        const lat = parseFloat(prompt("Latitude de la pharmacie"));
                        if (!isNaN(lng) && !isNaN(lat)) setCoordinates(lng, lat);
                      }}>Saisir manuellement</button>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                  <button type="submit" className="btn btn-primary">{editMode ? "Modifier" : "Ajouter"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
