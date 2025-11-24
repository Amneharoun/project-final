const User = require("../models/userModel");

module.exports = async function (req, res, next) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email requis" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  if (!user.isVerified) {
    return res.status(403).json({
      message: "Veuillez vérifier votre email avant de vous connecter."
    });
  }

  // Email vérifié → on continue
  next();
};
