const GestionUser = require("../models/GestionUsersModel");
const bcrypt = require("bcryptjs");

// Liste des utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await GestionUser.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Erreur getAllUsers:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Créer un utilisateur
exports.createUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    if (!name || !email || !role || !password) {
      return res.status(400).json({ message: "Champs obligatoires manquants" });
    }

    const exist = await GestionUser.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Cet email existe déjà" });
    }

    const user = new GestionUser({ name, email, role, password });
    await user.save();

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Erreur createUser:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Modifier un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    const user = await GestionUser.findById(id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    if (password && password.length >= 6) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ message: "Utilisateur mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur updateUser:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await GestionUser.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur deleteUser:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
