const Pharmacie = require("../models/modelPharmacie");

// 🧩 Créer une pharmacie
exports.creerPharmacie = async (req, res) => {
  try {
    const pharmacie = new Pharmacie(req.body);
    await pharmacie.save();
    res.status(201).json(pharmacie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔍 Obtenir une pharmacie par ID
exports.getPharmacieById = async (req, res) => {
  try {
    const pharmacie = await Pharmacie.findById(req.params.id);
    if (!pharmacie) return res.status(404).json({ message: "Pharmacie non trouvée" });
    res.json(pharmacie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔎 Obtenir toutes les pharmacies
exports.getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacie.find();
    res.json(pharmacies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✏️ Modifier les infos d’une pharmacie
exports.updatePharmacie = async (req, res) => {
  try {
    const updated = await Pharmacie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Pharmacie non trouvée" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🕒 Changer le statut d’ouverture
exports.toggleStatut = async (req, res) => {
  try {
    const pharmacie = await Pharmacie.findById(req.params.id);
    if (!pharmacie) return res.status(404).json({ message: "Pharmacie non trouvée" });

    pharmacie.statutOuvert = !pharmacie.statutOuvert;
    await pharmacie.save();

    res.json({ message: `Pharmacie ${pharmacie.statutOuvert ? "ouverte" : "fermée"}`, pharmacie });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📍 Trouver la pharmacie la plus proche
exports.getPharmacieProche = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    if (!latitude || !longitude)
      return res.status(400).json({ message: "Coordonnées manquantes" });

    const pharmacieProche = await Pharmacie.findOne({
      localisation: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: 5000, // rayon 5 km
        },
      },
    });

    if (!pharmacieProche)
      return res.status(404).json({ message: "Aucune pharmacie trouvée à proximité" });

    res.json(pharmacieProche);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
