const express = require("express");
const router = express.Router();
const {
  creerClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
  ajouterAchat
} = require("../controllers/clientController");

// Routes CRUD pour clients
router.post("/", creerClient);
router.get("/:page/:limit", getClients);
router.get("/:id", getClientById);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

// Route pour ajouter un achat à l'historique
router.post("/achat", ajouterAchat);

module.exports = router;
// const express = require("express");
// const router = express.Router();
// const {
//   creerClient,
//   getClients,
//   getClientById,
//   updateClient,
//   deleteClient,
//   ajouterAchat,
// } = require("../controllers/clientController");

// // 🟢 Route avec pagination

// // Route pagination
// router.get("/:page/:limit", getClients);
// // 🟢 CRUD
// router.post("/", creerClient);
// router.get("/:id", getClientById);
// router.put("/:id", updateClient);
// router.delete("/:id", deleteClient);

// // 🟢 Ajouter un achat
// router.post("/achat", ajouterAchat);

// module.exports = router;

