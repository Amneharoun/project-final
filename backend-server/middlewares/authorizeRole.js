// middlewares/authorizeRoles.js
module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    if (!allowedRoles.includes(req.user.role)) {
return res.status(403).json({ message: `Rôle "${req.user.role}" non autorisé` });
    }

    next();
  };
};
