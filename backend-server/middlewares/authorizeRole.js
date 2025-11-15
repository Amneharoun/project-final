// middlewares/authorizeRoles.js
module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }
    console.log(req.user.role, allowedRoles);
    

    // function verifyRole(roles = []) {
    //   return (req, res, next) => {
    //     if (!roles.includes(req.user.role)) {
    //       return res.status(403).json({ message: "Accès refusé" });
    //     }
    //     next();
    //   };
    // }

    // module.exports = verifyRole;
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `Rôle "${req.user.role}" non autorisé` });
    }

    next();
  };
};
