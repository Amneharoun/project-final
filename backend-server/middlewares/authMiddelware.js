// middlewares/auth.js
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      console.log("Aucun token fourni.");
      
      return res.status(401).send({
        message: "Accès refusé, token manquant",
      });
    }

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      console.log("Accès refusé, token manquant");

      return res.status(401).json({ message: "Accès refusé, token manquant" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Si on a donné des rôles autorisés
    // if (roles.length && !roles.includes(decoded.role)) {
    //   return res.status(403).json({ message: "Accès interdit" });
    // }

    next();
  } catch (error) {
    console.log(error);

    res.status(403).json({ message: "Token invalide" });
  }
};

module.exports = authMiddleware;

// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");

// authMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) return res.status(401).json({ message: "Token manquant" });

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id);
//     if (!user) return res.status(403).json({ message: "Utilisateur supprimé ou inexistant" });

//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(403).json({ message: "Accès refusé", error: error.message });
//   }
// };

// module.exports = authMiddleware;
