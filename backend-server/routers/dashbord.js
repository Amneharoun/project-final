// routers/dashboard.js (CORRIGEZ le nom du fichier)
const express = require("express");
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddelware');
const authorizeRoles = require('../middlewares/authorizeRole');

// ✅ IMPORT CORRECT - sans accolades si c'est un export par défaut
const dashboardController = require("../controllers/dashboardController");

// ✅ Middleware d'authentification pour toutes les routes
router.use(authMiddleware);

// ✅ Route dashboard - handler correct
router.get("/overview", authorizeRoles("admin", "pharmacien", "caissier"), dashboardController.getDashboardOverview);

module.exports = router;