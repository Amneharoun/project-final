const Vente = require("../models/venteModel");
const Medicament = require("../models/medicamentModel");
const Facture = require("../models/factureModel");
const clientModel = require("../models/clientModel");

// 📦 Créer une nouvelle vente avec calcul automatique et déduction du stock
exports.creerVente = async (req, res) => {
  try {
    const { medicaments, client, reduction } = req.body;
    console.log("Reduction", reduction);

    if (!medicaments || medicaments.length === 0) {
      return res.status(400).json({ message: "Aucun médicament sélectionné." });
    }

    const clientDetails = await clientModel.findById(client);
    if (!clientDetails) {
      return res.status(404).json({ message: "Client non trouvé" });
    }

    let totalGlobal = 0;
    const medicamentsTraites = [];

    // 🧮 Vérifier le stock et calculer le total de chaque médicament
    for (const item of medicaments) {
      const med = await Medicament.findById(item.medicament);
      if (!med) {
        return res
          .status(404)
          .json({ message: `Médicament non trouvé : ${item.medicament}` });
      }

      if (med.stock < item.quantite) {
        return res.status(400).json({
          message: `Stock insuffisant pour ${med.nom}. Disponible : ${med.stock}`,
        });
      }

      const reductionPourcentage = item.reduction || 0; // ✅ use per-medicament reduction
      const sousTotal =
        med.prix * item.quantite * (1 - reductionPourcentage / 100);

      totalGlobal += sousTotal;

      medicamentsTraites.push({
        medicament: med._id,
        nom: med.nom, // 👈 store nom temporarily for facture
        quantite: item.quantite,
        prix: med.prix,
        reduction: reductionPourcentage,
        prixReduit: med.prix * (1 - reductionPourcentage / 100),
      });
    console.log("Recduction en % :", reductionPourcentage);
    }

    // 🧾 Application d'une réduction globale si existante
    const totalApresReductionGlobale = totalGlobal * (1 - reduction / 100);
    // const totalApresReductionGlobale = totalGlobal; // or totalGlobal * (1 - reduction / 100) if needed

    console.log("Recduction en % :", medicamentsTraites);
    
    // 💾 Création et enregistrement de la vente
    const newVente = new Vente({
      client,
      medicaments: medicamentsTraites,
      // reduction: medicamentsTraites.reduction,
      total: totalApresReductionGlobale,
      dateVente: new Date(),
    });
    console.log("Nouvelle vente", newVente);
    

    const savedVente = await newVente.save();

    // Auto-create facture
    const items = medicamentsTraites.map((m) => ({
      description: m.nom, // 👈 use stored name
      quantite: m.quantite,
      prix: m.prix * (1 - m.reduction / 100), // 👈 apply individual reduction
    }));

    const facture = new Facture({
      client: clientDetails.nom, // 👈 if client is populated, use name
      date: newVente.dateVente,
      items,
      total: totalApresReductionGlobale, // 👈 apply global reduction
    });

    await facture.save();
    console.log("Nouvelle Facture :", facture);

    // 🔻 Mise à jour des stocks après validation de la vente
    for (const item of medicamentsTraites) {
      await Medicament.findByIdAndUpdate(item.medicament, {
        $inc: { stock: -item.quantite },
      });
    }

    // ✅ Renvoi de la vente enregistrée avec données peuplées
    const venteComplete = await Vente.findById(savedVente._id)
      .populate("client", "nom")
      .populate("medicaments.medicament", "nom");

    res.status(201).json(venteComplete);
  } catch (error) {
    console.error("Erreur lors de la création de la vente :", error);
    res.status(500).json({ message: error.message });
  }
};

// 📋 Obtenir toutes les ventes
exports.getVentes = async (req, res) => {
  try {
    const ventes = await Vente.find()
      .populate("client", "nom")
      .populate("medicaments.medicament", "nom")
      .sort({ dateVente: -1 });
    res.json(ventes);
  } catch (error) {
    console.error("Erreur lors de la récupération des ventes :", error);
    res.status(500).json({ message: error.message });
  }
};

// 🔍 Obtenir une vente spécifique par ID
exports.getVenteById = async (req, res) => {
  try {
    const vente = await Vente.findById(req.params.id)
      .populate("client", "nom")
      .populate("medicaments.medicament", "nom");

    if (!vente) {
      return res.status(404).json({ message: "Vente non trouvée" });
    }

    res.json(vente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
