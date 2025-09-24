const Facture = require("../models/factureModel");

// 📥 Récupérer toutes les factures
exports.getFactures = async (req, res) => {
  try {
    const factures = await Facture.find();
    res.json(factures);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➕ Créer une nouvelle facture
exports.createFacture = async (req, res) => {
  try {
    const facture = new Facture(req.body);
    const savedFacture = await facture.save();
    res.status(201).json(savedFacture);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✏️ Modifier une facture
exports.updateFacture = async (req, res) => {
  try {
    const updatedFacture = await Facture.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedFacture);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🗑️ Supprimer une facture
exports.deleteFacture = async (req, res) => {
  try {
    await Facture.findByIdAndDelete(req.params.id);
    res.json({ message: "Facture supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
