const express = require("express");
const { register, login, verify, creerVente, getVentes, ajouterFournisseur, listeFournisseurs, forgotPassword, resetPassword, getProfile } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddelware");
const router = express.Router();

// crer un route
router.post("/register", register);
router.post("/login", login);
router.patch("/email-verify", verify)
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);

router.post("/ventes", creerVente);   // Ajouter une vente
router.get("/getVentes", getVentes);     // Voir l’historique

router.post("/ajouterFournisseur", ajouterFournisseur);
router.get("/listeFournisseurs", listeFournisseurs);

router.get("/profile", authMiddleware, getProfile);

// router.get("/medicaments", auth(["admin", "pharmacien"]), getMedicaments);
// router.post("/ventes", auth(["caissier", "pharmacien"]), creerVente);
// router.get("/users", auth(["admin"]), getAllUsers);

module.exports = router;