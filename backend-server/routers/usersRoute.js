// const express = require("express");
// const router = express.Router();
// const { getProfile } = require("../controllers/userController");
// const authMiddleware = require("../middleware/authMiddleware");

// router.get("/profile", authMiddleware, getProfile);

// module.exports = router;
const express = require("express");
const { getProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Route protégée pour récupérer le profil
router.get("/profile", authMiddleware, getProfile);

module.exports = router;
