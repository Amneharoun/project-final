// const express = require("express");
// const { getMedicaments, getMedicamentById, addMedicament, updateMedicament, deleteMedicament, getAlerts, alertesMedicaments, importExcel, exportExcel, upload } = require("../controllers/medicamentController");
// const multer = require("multer")
// const xlsx = require("xlsx");
// const medicamentModel = require("../models/medicamentModel");


// const router = express.Router();


// // Alertes stock / péremption
// router.get("/alerts", getAlerts);
// router.get("/alertes", alertesMedicaments);

// // CRUD Médicaments
// router.get("/:page/:limit", getMedicaments);
// router.post("/", addMedicament);
// router.put("/:id", updateMedicament);
// router.delete("/:id", deleteMedicament);

// // Import/Export Excel
// router.post("/import", upload.single("file"), importExcel);
// router.get("/export", exportExcel);

// module.exports = router;

const express = require("express");
const {
  getMedicaments,
  addMedicament,
  updateMedicament,
  deleteMedicament,
  getAlerts,
  alertesMedicaments,
  importExcel,
  exportExcel,
  upload
} = require("../controllers/medicamentController");

const multer = require("multer");
const xlsx = require("xlsx");

// ✅ AJOUT (sans toucher ton code)
const verifyToken = require("../middlewares/authMiddelware");
const verifyRole = require("../middlewares/authorizeRole");
// const authMiddleware = require("../middlewares/authMiddelware");


const router = express.Router();

// S'assure qu'un utilisateur est connecté avant d'autoriser l'accès à l'une des routes ci-dessous
router.use(verifyToken)

// ✅ Alertes stock / péremption → accessibles à tous les utilisateurs connectés
router.get("/alerts", getAlerts);
router.get("/alertes", alertesMedicaments);


// ✅ CRUD Médicaments

// ✅ Export : pour tous les utilisateurs connectés
router.get("/export", exportExcel);

// ✅ Lecture : pour tous les utilisateurs connectés
router.get("/:page/:limit", verifyRole("admin", "pharmacien, caissier"),getMedicaments);

// ✅ Création : admin + pharmacien
router.post("/", verifyRole("admin", "pharmacien"), addMedicament);

// ✅ Modification : admin + pharmacien
router.put("/:id", verifyRole("admin", "pharmacien"), updateMedicament);

// ✅ Suppression : admin uniquement
router.delete("/:id", verifyRole("admin"), deleteMedicament);


// ✅ Import/Export Excel
// ✅ Import : admin + pharmacien
router.post(
  "/import",
    verifyRole("admin", "pharmacien"),
  upload.single("file"),
  importExcel
);

module.exports = router;
