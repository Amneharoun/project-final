import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import API_URL from "../config";

// Fix pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Pharmacie = () => {
  // États existants
  const [pharmacies, setPharmacies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    adresse: "",
    telephone: "",
    email: "",
    horaires: {
      ouverture: "",
      fermeture: ""
    },
    responsable: "",
    statutOuvert: true
  });
  const [localisation, setLocalisation] = useState({
    type: "Point",
    coordinates: [0, 0]
  });

  // ✅ NOUVEAUX ÉTATS POUR LA GÉOLOCALISATION
  const [activeTab, setActiveTab] = useState('gestion');
  const [patientPosition, setPatientPosition] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [searchRadius, setSearchRadius] = useState(10);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [nearbyPharmacies, setNearbyPharmacies] = useState([]);
  const [mapLoading, setMapLoading] = useState(false);

  // 🔹 Configuration axios avec token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    };
  };

  // Charger les pharmacies
  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    try {
      const res = await axios.get(`${API_URL}/pharmacies`, getAuthHeaders());
      setPharmacies(res.data);
    } catch (error) {
      console.error("Erreur chargement:", error);
    }
  };

  // 🔥 MÉTHODE DE SOUMISSION COMPLÈTE
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nom.trim() || !formData.adresse.trim()) {
      alert("Le nom et l'adresse sont obligatoires");
      return;
    }

    try {
      const dataToSend = {
        nom: formData.nom.trim(),
        adresse: formData.adresse.trim(),
        telephone: formData.telephone.trim() || undefined,
        email: formData.email.trim() || undefined,
        horaires: {
          ouverture: formData.horaires.ouverture.trim() || undefined,
          fermeture: formData.horaires.fermeture.trim() || undefined
        },
        responsable: formData.responsable.trim() || undefined,
        statutOuvert: formData.statutOuvert,
        localisation: localisation
      };

      console.log("🚀 Données envoyées:", dataToSend);

      if (editMode) {
        await axios.put(
          `${API_URL}/pharmacies/${formData._id}`, 
          dataToSend, 
          getAuthHeaders()
        );
        alert("✅ Pharmacie modifiée avec succès");
      } else {
        await axios.post(
          `${API_URL}/pharmacies`, 
          dataToSend, 
          getAuthHeaders()
        );
        alert("✅ Pharmacie ajoutée avec succès");
      }
      
      setShowModal(false);
      resetForm();
      fetchPharmacies();
      
    } catch (error) {
      console.error("💥 Erreur:", error);
      if (error.response?.data?.message) {
        alert(`❌ ${error.response.data.message}`);
      } else {
        alert("❌ Erreur lors de la sauvegarde");
      }
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      nom: "",
      adresse: "",
      telephone: "",
      email: "",
      horaires: {
        ouverture: "",
        fermeture: ""
      },
      responsable: "",
      statutOuvert: true
    });
    setLocalisation({
      type: "Point",
      coordinates: [0, 0]
    });
    setEditMode(false);
  };

  // Gérer le changement des horaires
  const handleHoraireChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      horaires: {
        ...prev.horaires,
        [field]: value
      }
    }));
  };

  // 🔥 GÉOLOCALISATION - Définir les coordonnées manuellement
  const setCoordinates = (lng, lat) => {
    setLocalisation({
      type: "Point",
      coordinates: [parseFloat(lng), parseFloat(lat)]
    });
  };

  // 🔥 GÉOLOCALISATION - Récupérer position automatique
  const getGeolocation = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée sur votre appareil.");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoordinates(longitude, latitude);
        alert(`📍 Coordonnées récupérées : ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      },
      (error) => {
        console.error("Erreur géolocalisation:", error);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            alert("❌ Permission de géolocalisation refusée");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("❌ Position indisponible");
            break;
          case error.TIMEOUT:
            alert("❌ Timeout de la géolocalisation");
            break;
          default:
            alert("❌ Erreur de géolocalisation");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // ✅ FONCTION GÉOLOCALISATION PATIENT
  const getPatientLocation = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("Géolocalisation non supportée");
      return;
    }

    setMapLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPatientPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setGeoError(null);
        setMapLoading(false);
      },
      (error) => {
        let message = "Erreur de géolocalisation";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            message = "Permission refusée";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Position indisponible";
            break;
          case error.TIMEOUT:
            message = "Timeout";
            break;
        }
        setGeoError(message);
        setMapLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // ✅ RECHERCHE PHARMACIES PROCHEs
  const searchNearbyPharmacies = async () => {
    if (!patientPosition) {
      alert("Veuillez d'abord activer la géolocalisation");
      return;
    }

    setMapLoading(true);
    try {
      const response = await axios.get(`${API_URL}/pharmacies/proches`, {
        params: {
          latitude: patientPosition.latitude,
          longitude: patientPosition.longitude,
          maxDistance: searchRadius * 1000
        },
        ...getAuthHeaders()
      });
      setNearbyPharmacies(response.data);
    } catch (error) {
      console.error("Erreur recherche:", error);
      alert("Erreur lors de la recherche");
    } finally {
      setMapLoading(false);
    }
  };

  // ✅ COMPOSANT CARTE INTÉGRÉ
  const PharmacyMap = ({ pharmacies, patientPos, selectedPharma }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    
    useEffect(() => {
      if (!mapRef.current) return;
      
      // Initialiser carte
      mapInstance.current = L.map(mapRef.current).setView(
        patientPos ? [patientPos.latitude, patientPos.longitude] : [13.8373, 20.8312],
        13
      );
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(mapInstance.current);
      
      // Marqueur patient
      if (patientPos) {
        L.marker([patientPos.latitude, patientPos.longitude])
          .addTo(mapInstance.current)
          .bindPopup('📍 Votre position')
          .openPopup();
      }
      
      // Marqueurs pharmacies
      pharmacies.forEach(pharma => {
        if (pharma.localisation?.coordinates) {
          const [lng, lat] = pharma.localisation.coordinates;
          L.marker([lat, lng])
            .addTo(mapInstance.current)
            .bindPopup(`
              <div>
                <h6><strong>${pharma.nom}</strong></h6>
                <p>${pharma.adresse}</p>
                <p>📞 ${pharma.telephone || 'N/A'}</p>
                <button onclick="window.open('https://www.google.com/maps/dir/${patientPos.latitude},${patientPos.longitude}/${lat},${lng}', '_blank')" 
                  class="btn btn-primary btn-sm mt-1">
                  🗺️ Itinéraire
                </button>
              </div>
            `);
        }
      });
      
      // Nettoyage
      return () => {
        if (mapInstance.current) {
          mapInstance.current.remove();
        }
      };
    }, [pharmacies, patientPos, selectedPharma]);
    
    return (
      <div 
        ref={mapRef} 
        style={{ height: '400px', width: '100%', borderRadius: '10px' }}
      />
    );
  };

  // SUPPRESSION
  const handleDelete = async (id) => {
    console.log("🔴 handleDelete appelé avec ID:", id);
    
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette pharmacie ?")) {
      console.log("❌ Suppression annulée par l'utilisateur");
      return;
    }

    try {
      console.log("🔄 Tentative de suppression...");
      
      const response = await axios.delete(
        `${API_URL}/pharmacies/${id}`,
        getAuthHeaders()
      );
      
      console.log("✅ Réponse suppression:", response);
      alert("✅ Pharmacie supprimée avec succès");
      fetchPharmacies();
      
    } catch (error) {
      console.error("💥 Erreur détaillée suppression:", error);
      
      if (error.response) {
        if (error.response.status === 401) {
          alert("❌ Session expirée. Veuillez vous reconnecter.");
          window.location.href = "/login";
        } else if (error.response.status === 404) {
          alert("❌ Pharmacie non trouvée");
        } else {
          alert(`❌ Erreur serveur: ${error.response.status}`);
        }
      } else if (error.request) {
        alert("❌ Impossible de contacter le serveur");
      } else {
        alert("❌ Erreur inattendue");
      }
    }
  };

  // Basculer statut
  const toggleStatut = async (id) => {
    try {
      await axios.patch(
        `${API_URL}/pharmacies/${id}/statut`,
        {},
        getAuthHeaders()
      );
      fetchPharmacies();
    } catch (error) {
      console.error("Erreur statut:", error);
    }
  };

  // Ouvrir modal modification
  const handleEdit = (pharmacie) => {
    setFormData({
      _id: pharmacie._id,
      nom: pharmacie.nom || "",
      adresse: pharmacie.adresse || "",
      telephone: pharmacie.telephone || "",
      email: pharmacie.email || "",
      horaires: {
        ouverture: pharmacie.horaires?.ouverture || "",
        fermeture: pharmacie.horaires?.fermeture || ""
      },
      responsable: pharmacie.responsable || "",
      statutOuvert: pharmacie.statutOuvert !== undefined ? pharmacie.statutOuvert : true,
    });
    
    if (pharmacie.localisation && pharmacie.localisation.coordinates) {
      setLocalisation({
        type: "Point",
        coordinates: pharmacie.localisation.coordinates
      });
    } else {
      setLocalisation({
        type: "Point",
        coordinates: [0, 0]
      });
    }
    
    setEditMode(true);
    setShowModal(true);
  };

  // Ouvrir modal ajout
  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="container py-4">
      {/* ✅ SYSTÈME D'ONGlets AJOUTÉ */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'gestion' ? 'active' : ''}`}
            onClick={() => setActiveTab('gestion')}
          >
            🏪 Gestion des Pharmacies
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'recherche' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('recherche');
              getPatientLocation();
            }}
          >
            🗺️ Recherche & Itinéraires
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {/* ✅ ONGLET GESTION (EXISTANT) */}
        {activeTab === 'gestion' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Gestion des Pharmacies</h2>
              <button className="btn btn-success" onClick={handleAdd}>
                + Nouvelle Pharmacie
              </button>
            </div>

            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Nom</th>
                  <th>Adresse</th>
                  <th>Téléphone</th>
                  <th>Ouverture</th>
                  <th>Fermeture</th>
                  <th>Localisation</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pharmacies.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      Aucune pharmacie enregistrée
                    </td>
                  </tr>
                ) : (
                  pharmacies.map((pharma) => (
                    <tr key={pharma._id}>
                      <td>{pharma.nom}</td>
                      <td>{pharma.adresse}</td>
                      <td>{pharma.telephone || "N/A"}</td>
                      <td>{pharma.horaires?.ouverture || "N/A"}</td>
                      <td>{pharma.horaires?.fermeture || "N/A"}</td>
                      <td>
                        {pharma.localisation?.coordinates ? 
                          `${pharma.localisation.coordinates[1]?.toFixed(4) || 0}, ${pharma.localisation.coordinates[0]?.toFixed(4) || 0}`
                          : "Non définie"
                        }
                      </td>
                      <td>
                        <span className={`badge ${pharma.statutOuvert ? "bg-success" : "bg-danger"}`}>
                          {pharma.statutOuvert ? "Ouverte" : "Fermée"}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-warning" 
                            onClick={() => handleEdit(pharma)}
                          >
                            Modifier
                          </button>
                          <button 
                            className="btn btn-danger" 
                            onClick={() => handleDelete(pharma._id)}
                          >
                            Supprimer
                          </button>
                          <button 
                            className="btn btn-secondary" 
                            onClick={() => toggleStatut(pharma._id)}
                          >
                            {pharma.statutOuvert ? "Fermer" : "Ouvrir"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Modal - AVEC GÉOLOCALISATION */}
            {showModal && (
              <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                      <div className="modal-header">
                        <h5 className="modal-title">
                          {editMode ? "Modifier la pharmacie" : "Nouvelle pharmacie"}
                        </h5>
                        <button 
                          type="button" 
                          className="btn-close" 
                          onClick={() => setShowModal(false)}
                        ></button>
                      </div>

                      <div className="modal-body">
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Nom *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={formData.nom} 
                              onChange={(e) => setFormData({ ...formData, nom: e.target.value })} 
                              required 
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Adresse *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={formData.adresse} 
                              onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} 
                              required 
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Téléphone</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={formData.telephone} 
                              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} 
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Email</label>
                            <input 
                              type="email" 
                              className="form-control" 
                              value={formData.email} 
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                            />
                          </div>
                        </div>

                        {/* HORAIRES */}
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Heure d'ouverture</label>
                            <input 
                              type="time" 
                              className="form-control" 
                              value={formData.horaires.ouverture} 
                              onChange={(e) => handleHoraireChange('ouverture', e.target.value)} 
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Heure de fermeture</label>
                            <input 
                              type="time" 
                              className="form-control" 
                              value={formData.horaires.fermeture} 
                              onChange={(e) => handleHoraireChange('fermeture', e.target.value)} 
                            />
                          </div>
                        </div>

                        {/* GÉOLOCALISATION */}
                        <div className="mb-3 p-3 border rounded">
                          <label className="form-label fw-bold">📍 Localisation GPS</label>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className={`badge ${localisation.coordinates[0] !== 0 ? 'bg-success' : 'bg-warning'}`}>
                              {localisation.coordinates[0] !== 0 
                                ? `Coordonnées définies: ${localisation.coordinates[1].toFixed(6)}, ${localisation.coordinates[0].toFixed(6)}`
                                : "Coordonnées non définies"
                              }
                            </span>
                          </div>
                          <div className="btn-group w-100">
                            <button 
                              type="button" 
                              className="btn btn-outline-primary btn-sm" 
                              onClick={getGeolocation}
                            >
                              📍 Ma position automatique
                            </button>
                            <button 
                              type="button" 
                              className="btn btn-outline-secondary btn-sm" 
                              onClick={() => {
                                const lng = prompt("Longitude (ex: -4.000000):");
                                const lat = prompt("Latitude (ex: 5.000000):");
                                if (lng && lat && !isNaN(lng) && !isNaN(lat)) {
                                  setCoordinates(lng, lat);
                                  alert("Coordonnées définies manuellement");
                                } else {
                                  alert(" Coordonnées invalides");
                                }
                              }}
                            >
                              📍 Saisir manuellement
                            </button>
                          </div>
                          <small className="text-muted mt-2 d-block">
                            Format: [Longitude, Latitude]. Exemple: [-4.000000, 5.000000]
                          </small>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Statut</label>
                          <div className="form-check">
                            <input 
                              type="checkbox" 
                              className="form-check-input" 
                              checked={formData.statutOuvert}
                              onChange={(e) => setFormData({ ...formData, statutOuvert: e.target.checked })} 
                            />
                            <label className="form-check-label">
                              Pharmacie ouverte
                            </label>
                          </div>
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
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                        >
                          {editMode ? "Modifier" : "Ajouter"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* ✅ NOUVEL ONGLET RECHERCHE */}
        {activeTab === 'recherche' && (
          <div className="row">
            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">📍 Recherche de Pharmacies</h5>
                </div>
                <div className="card-body">
                  {/* Statut géolocalisation */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Votre position:</label>
                    {!patientPosition ? (
                      <div>
                        <button 
                          className="btn btn-outline-primary btn-sm"
                          onClick={getPatientLocation}
                          disabled={mapLoading}
                        >
                          {mapLoading ? (
                            <>
                              <div className="spinner-border spinner-border-sm me-2"></div>
                              Détection...
                            </>
                          ) : (
                            '📍 Activer la géolocalisation'
                          )}
                        </button>
                        {geoError && (
                          <div className="text-danger mt-2 small">❌ {geoError}</div>
                        )}
                      </div>
                    ) : (
                      <div className="text-success">
                        ✅ Position détectée
                        <br />
                        <small>
                          Lat: {patientPosition.latitude.toFixed(6)}, Lng: {patientPosition.longitude.toFixed(6)}
                        </small>
                      </div>
                    )}
                  </div>

                  {/* Contrôle rayon */}
                  <div className="mb-3">
                    <label className="form-label">
                      Rayon: <strong>{searchRadius} km</strong>
                    </label>
                    <input 
                      type="range" 
                      className="form-range" 
                      min="1" 
                      max="50" 
                      value={searchRadius}
                      onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                    />
                    <div className="d-flex justify-content-between">
                      <small>1 km</small>
                      <small>50 km</small>
                    </div>
                  </div>

                  <button 
                    className="btn btn-primary w-100 mb-3"
                    onClick={searchNearbyPharmacies}
                    disabled={!patientPosition || mapLoading}
                  >
                    {mapLoading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2"></div>
                        Recherche...
                      </>
                    ) : (
                      '🔍 Rechercher les pharmacies'
                    )}
                  </button>

                  {/* Liste pharmacies */}
                  <div className="pharmacies-list">
                    <h6 className="border-bottom pb-2">Pharmacies trouvées: {nearbyPharmacies.length}</h6>
                    {nearbyPharmacies.length === 0 ? (
                      <div className="text-center text-muted py-3">
                        Aucune pharmacie trouvée dans ce rayon
                      </div>
                    ) : (
                      nearbyPharmacies.map(pharmacy => (
                        <div 
                          key={pharmacy._id}
                          className={`card mb-2 ${selectedPharmacy?._id === pharmacy._id ? 'border-primary' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedPharmacy(pharmacy)}
                        >
                          <div className="card-body py-2">
                            <h6 className="card-title mb-1">{pharmacy.nom}</h6>
                            <p className="card-text small mb-1">{pharmacy.adresse}</p>
                            <p className="card-text small text-muted mb-1">
                              📞 {pharmacy.telephone || 'N/A'}
                            </p>
                            {pharmacy.distance && (
                              <p className="card-text small text-success mb-0">
                                📏 {pharmacy.distance < 1000 
                                  ? `${Math.round(pharmacy.distance)} m` 
                                  : `${(pharmacy.distance / 1000).toFixed(1)} km`
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {selectedPharmacy && (
                <div className="card">
                  <div className="card-header bg-success text-white">
                    <h6 className="mb-0">📍 {selectedPharmacy.nom}</h6>
                  </div>
                  <div className="card-body">
                    <p><strong>Adresse:</strong> {selectedPharmacy.adresse}</p>
                    <p><strong>Téléphone:</strong> {selectedPharmacy.telephone || 'N/A'}</p>
                    <p><strong>Horaires:</strong> {selectedPharmacy.horaires?.ouverture || 'N/A'} - {selectedPharmacy.horaires?.fermeture || 'N/A'}</p>
                    <p><strong>Statut:</strong> 
                      <span className={`badge ${selectedPharmacy.statutOuvert ? 'bg-success' : 'bg-danger'} ms-2`}>
                        {selectedPharmacy.statutOuvert ? 'Ouverte' : 'Fermée'}
                      </span>
                    </p>
                    
                    <div className="d-grid gap-2">
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => {
                          const [lng, lat] = selectedPharmacy.localisation.coordinates;
                          window.open(`https://www.google.com/maps/dir/${patientPosition.latitude},${patientPosition.longitude}/${lat},${lng}`, '_blank');
                        }}
                      >
                        🗺️ Ouvrir dans Google Maps
                      </button>
                      
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setSelectedPharmacy(null)}
                      >
                        ✖️ Fermer les détails
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="col-md-8">
              <div className="card">
                <div className="card-header bg-dark text-white">
                  <h5 className="mb-0">🗺️ Carte Interactive</h5>
                </div>
                <div className="card-body">
                  <PharmacyMap 
                    pharmacies={nearbyPharmacies}
                    patientPos={patientPosition}
                    selectedPharma={selectedPharmacy}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pharmacie;