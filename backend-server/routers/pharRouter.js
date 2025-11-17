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
router.get("/", verifyRole("admin", "pharmacien"), getAllPharmacies);

// ✅ SPECIFIC ROUTES FIRST (before /:id)
router.get(
  "/proches",
  verifyRole("admin", "pharmacien", "patient"),
  getPharmaciesProches
);
router.get(
  "/recherche/medicament",
  verifyRole("admin", "pharmacien", "patient"),
  getPharmaciesAvecMedicament
);

// ✅ CRUD - parameterized routes LAST
router.post("/", verifyRole("admin", "pharmacien"), creerPharmacie);
router.get("/:id", verifyRole("admin", "pharmacien"), getPharmacieById);
router.put("/:id", verifyRole("admin", "pharmacien"), updatePharmacie);
router.patch("/:id/statut", verifyRole("admin", "pharmacien"), toggleStatut);
router.delete("/:id", verifyRole("admin", "pharmacien"), supprimerPharmacie);

module.exports = router;
