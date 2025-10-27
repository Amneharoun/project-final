const express = require("express");
const router = express.Router();
const {
   creerPharmacie,
  getPharmacieById,
  updatePharmacie,
  toggleStatut,
  getPharmacieProche,
  getAllPharmacies,
} = require("../controllers/pharmacieControl");

// ✅ Récupérer toutes les pharmacies
router.get("/", getAllPharmacies);

// CRUD
router.post("/", creerPharmacie);
router.get("/:id", getPharmacieById);
router.put("/:id", updatePharmacie);
router.patch("/:id/statut", toggleStatut);

// Géolocalisation
router.post("/proche", getPharmacieProche);

module.exports = router;
