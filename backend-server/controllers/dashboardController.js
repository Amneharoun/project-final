// backend/controllers/dashboardController.js
const Medicament = require("../models/medicamentModel");
const Vente = require("../models/venteModel");
const commande = require("../models/commandeModel");

const getDashboardOverview = async (req, res) => {
  try {
    console.log("📊 Dashboard appelé pour:", req.user.email);
    
    const userId = req.user.id;
    const userRole = req.user.role;

    // 🔹 RÉCUPÉRATION DES VRAIES DONNÉES

    // 1. Médicaments en rupture (stock = 0)
    const medicamentsRupture = await Medicament.find({ 
      stock: 0 
    }).select("nom stock datePeremption").limit(10);

    // 2. Médicaments avec stock faible (stock <= 5)
    const medicamentsStockFaible = await Medicament.find({ 
      stock: { $lte: 5, $gt: 0 } 
    }).select("nom stock").limit(10);

    // 3. Médicaments bientôt périmés (30 prochains jours)
    const trenteJours = new Date();
    trenteJours.setDate(trenteJours.getDate() + 30);
    
    const medicamentsPeremption = await Medicament.find({
      datePeremption: { 
        $lte: trenteJours,
        $gte: new Date() // aujourd'hui
      }
    }).select("nom datePeremption stock").limit(10);

    // 4. Statistiques de réservations (30 derniers jours)
    const trenteJoursPasses = new Date();
    trenteJoursPasses.setDate(trenteJoursPasses.getDate() - 30);
    
    const commandesStats = await commande.aggregate([
      // {
      //   $match: {
      //     createdAt: { $gte: trenteJoursPasses }
      //   }
      // },
      {
        $group: {
          _id: "$statut",
          count: { $sum: 1 }
        }
      }
    ]);
    console.log(commandesStats);
    

    // 5. Top médicaments (les plus en stock ou les plus vendus)
    const topMedicaments = await Medicament.find()
      .sort({ stock: -1 })
      .limit(5)
      .select("nom stock");

    // 🔹 CALCUL DES STATISTIQUES
    const lowStockCount = medicamentsStockFaible.length;
    const expiringCount = medicamentsPeremption.length;
    const ruptureCount = medicamentsRupture.length;

    // Données réelles du dashboard
    const dashboardData = {
      // Statistiques principales
      lowStockCount,
      expiringCount,
      ruptureCount,
      totalMedicaments: await Medicament.countDocuments(),
      
      // Données réelles
      medicamentsRupture,
      medicamentsStockFaible, 
      medicamentsPeremption,
      topMedicaments,
      
      // Réservations (convertir l'agrégation en objet simple)
      commandes: {
        total: commandesStats.reduce((acc, curr) => acc + curr.count, 0),
        pending: commandesStats.find(r => r._id === 'En attente')?.count || 0,
        // confirmed: commandesStats.find(r => r._id === 'confirmed')?.count || 0,
        completed: commandesStats.find(r => r._id === 'Livrée')?.count || 0,
        canceled: commandesStats.find(r => r._id === 'Annulée')?.count || 0,
      },
      
      // Données simulées (en attendant vos modèles de vente)
      revenue30d: 12500.50, // À remplacer par de vraies données plus tard
      sales: [
        { mois: "Janvier", valeur: 100 },
        { mois: "Février", valeur: 130 },
        { mois: "Mars", valeur: 110 }
      ],
      
      role: userRole
    };

    console.log("📊 Données réelles chargées:", {
      ruptures: ruptureCount,
      stockFaible: lowStockCount,
      peremption: expiringCount,
      commandes: dashboardData.commandes.total
    });

    res.json(dashboardData);

  } catch (err) {
    console.error("❌ Erreur Dashboard:", err);
    res.status(500).json({ 
      message: "Erreur serveur dashboard",
      error: err.message 
    });
  }
};

module.exports = {
  getDashboardOverview
};