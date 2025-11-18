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
  getPharmaciesAvecMedicament,
} = require("../controllers/pharmacieControl");

const verifyToken = require("../middlewares/authMiddelware");
const verifyRole = require("../middlewares/authorizeRole");

router.use(verifyToken);

// ✅ Get all pharmacies
router.get("/", verifyRole("admin", "pharmacien", "caissier", "patient"), getAllPharmacies);

// ✅ SPECIFIC ROUTES FIRST (before /:id)
router.get(
  "/proches",
  verifyRole("admin", "pharmacien", "patient", "caissier"),
  getPharmaciesProches
);
router.get(
  "/recherche/medicament",
  verifyRole("admin", "pharmacien", "patient", "caissier"),
  getPharmaciesAvecMedicament
);

// ✅ CRUD - parameterized routes LAST
router.post("/", verifyRole("admin"), creerPharmacie);
router.get("/:id", verifyRole("admin", "pharmacien"), getPharmacieById);
router.put("/:id", verifyRole("admin"), updatePharmacie);
router.patch("/:id/statut", verifyRole("admin", "pharmacien"), toggleStatut);
router.delete("/:id", verifyRole("admin"), supprimerPharmacie);

module.exports = router;
