const express = require("express");
const router = express.Router();
const factureController = require("../controllers/facture");

// CRUD Factures
router.get("/", factureController.getFactures);
router.post("/", factureController.createFacture);
router.put("/:id", factureController.updateFacture);
router.delete("/:id", factureController.deleteFacture);

module.exports = router;
