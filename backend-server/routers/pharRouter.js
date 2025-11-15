const express = require("express");
const router = express.Router();
const {
  creerPharmacie,
  getPharmacieById,
  updatePharmacie,
  toggleStatut,
  supprimerPharmacie,
  getAllPharmacies,
  getPharmaciesProches,
  getPharmaciesAvecMedicament // ✅ AJOUT IMPORT
} = require("../controllers/pharmacieControl");

const verifyToken = require("../middlewares/authMiddelware");
const verifyRole = require("../middlewares/authorizeRole");

// S'assure qu'un utilisateur est connecté avant d'autoriser l'accès à l'une des routes ci-dessous
router.use(verifyToken)

// ✅ Récupérer toutes les pharmacies
router.get("/", verifyRole("admin", "pharmacien"), getAllPharmacies);

// CRUD
router.post("/", verifyRole("admin", "pharmacien"), creerPharmacie);
// Géolocalisation
router.get("/proches", verifyRole("admin", "pharmacien", "patient"), getPharmaciesProches); // ✅ AJOUT "patient" aux rôles
router.get("/:id", verifyRole("admin", "pharmacien"), getPharmacieById);
router.put("/:id", verifyRole("admin", "pharmacien"), updatePharmacie);
router.patch("/:id/statut", verifyRole("admin", "pharmacien"), toggleStatut);


// ✅ NOUVELLE ROUTE - Recherche avec médicament
router.get("/recherche/medicament", verifyRole("admin", "pharmacien", "patient"), getPharmaciesAvecMedicament);

// 🆕 SUPPRESSION
router.delete("/:id", verifyRole("admin", "pharmacien"), supprimerPharmacie);

module.exports = router;