const express = require("express");
const router = express.Router();
const { creerVente, getVentes, getVenteById } = require("../controllers/venteController");

// Routes pour les ventes
// router.get("/vente", getVentes);
// router.post("/vente", creerVente);

router.post("/ventes", creerVente);   // Ajouter une vente
router.get("/getVentes", getVentes);     // Voir l’historique
router.get("/:id", getVenteById);

module.exports = router;
