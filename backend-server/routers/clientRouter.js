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

// ✅ SPECIFIC ROUTES FIRST
router.post("/achat", ajouterAchat);

// ✅ Use prefixes to avoid conflicts
router.get("/list/:page/:limit", getClients);  // Changed from /:page/:limit

// ✅ CRUD routes with :id
router.post("/", creerClient);
router.get("/:id", getClientById);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

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

