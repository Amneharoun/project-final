const Pharmacie = require("../models/modelPharmacie");

// ✅ Créer une pharmacie
exports.creerPharmacie = async (req, res) => {
  try {
    const pharmacie = new Pharmacie(req.body);
    await pharmacie.save();
    return res.status(201).json(pharmacie);
  } catch (error) {
    console.error("Erreur création :", error);
    console.log("📥 DONNÉES REÇUES PAR LE BACKEND :", req.body);
    return res.status(400).json({ message: error.message });
  }
};

// ✅ Obtenir toutes les pharmacies
exports.getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacie.find();
    return res.json(pharmacies);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Obtenir une pharmacie par ID
exports.getPharmacieById = async (req, res) => {
  try {
    const pharmacie = await Pharmacie.findById(req.params.id);
    if (!pharmacie)
      return res.status(404).json({ message: "Pharmacie non trouvée" });

    return res.json(pharmacie);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Modifier une pharmacie
exports.updatePharmacie = async (req, res) => {
  try {
    const updated = await Pharmacie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated)
      return res.status(404).json({ message: "Pharmacie non trouvée" });

    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// ✅ Changer le statut d'ouverture
exports.toggleStatut = async (req, res) => {
  try {
    const pharmacie = await Pharmacie.findById(req.params.id);
    if (!pharmacie)
      return res.status(404).json({ message: "Pharmacie non trouvée" });

    pharmacie.statutOuvert = !pharmacie.statutOuvert;
    await pharmacie.save();

    return res.json(pharmacie);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ VERSION DEBUG - Géolocalisation
exports.getPharmaciesProches = async (req, res) => {
  console.log("ICI");
  
  try {
    console.log("📍 REQUÊTE GÉOLOC REÇUE - Query params:", req.query);

    const { latitude, longitude, maxDistance = 15000 } = req.query;

    // Validation des paramètres
    if (!latitude || !longitude) {
      console.log("❌ Coordonnées manquantes");
      return res.status(400).json({ message: "Coordonnées manquantes" });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      console.log("❌ Coordonnées invalides:", latitude, longitude);
      return res.status(400).json({ message: "Coordonnées invalides" });
    }

    console.log("🔍 Recherche autour de:", { lat, lng, maxDistance });

    // VERSION SIMPLE SANS GEOQUERY - d'abord tester si ça retourne des données
    const pharmaciesTest = await Pharmacie.find();
    console.log(`📊 Total pharmacies en base: ${pharmaciesTest.length}`);

    pharmaciesTest.forEach((pharma) => {
      console.log(`🏪 ${pharma.nom} - Localisation:`, pharma.localisation);
    });

    // VERSION AVEC GEOQUERY - Essayer les deux syntaxes
    let pharmacies = [];

    try {
      // Essayer la syntaxe 1
      pharmacies = await Pharmacie.find({
        localisation: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [lng, lat],
            },
            $maxDistance: parseInt(maxDistance),
          },
        },
      });
      console.log("✅ Syntaxe 1 réussie");
    } catch (error1) {
      console.log("❌ Syntaxe 1 échouée:", error1.message);

      try {
        // Essayer la syntaxe 2
        pharmacies = await Pharmacie.find({
          "localisation.coordinates": {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [lng, lat],
              },
              $maxDistance: parseInt(maxDistance),
            },
          },
        });
        console.log("✅ Syntaxe 2 réussie");
      } catch (error2) {
        console.log("❌ Syntaxe 2 échouée:", error2.message);

        // Fallback: retourner toutes les pharmacies
        pharmacies = await Pharmacie.find({});
        console.log("🔄 Fallback: retour de toutes les pharmacies");
      }
    }

    console.log(`🎯 ${pharmacies.length} pharmacies trouvées`);

    // Ajouter la distance calculée manuellement pour l'affichage
    const pharmaciesAvecDistance = pharmacies.map((pharma) => {
      if (pharma.localisation && pharma.localisation.coordinates) {
        const [pharmaLng, pharmaLat] = pharma.localisation.coordinates;
        // Calcul simple de distance (approximatif)
        const distance = calculateDistance(lat, lng, pharmaLat, pharmaLng);
        return {
          ...pharma.toObject(),
          distance: distance,
        };
      }
      return pharma;
    });

    return res.json(pharmaciesAvecDistance);
  } catch (error) {
    console.error("💥 ERREUR CRITIQUE dans getPharmaciesProches:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la recherche géolocalisée",
      error: error.message,
      stack: error.stack,
    });
  }
};

// Fonction utilitaire pour calculer la distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Rayon de la Terre en mètres
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

// ✅ Supprimer une pharmacie
exports.supprimerPharmacie = async (req, res) => {
  try {
    console.log(" Suppression demandée pour ID:", req.params.id);

    const pharmacie = await Pharmacie.findByIdAndDelete(req.params.id);

    if (!pharmacie) {
      console.log("Pharmacie non trouvée pour suppression");
      return res.status(404).json({ message: "Pharmacie non trouvée" });
    }

    console.log(" Pharmacie supprimée:", pharmacie.nom);
    res.json({ message: "Pharmacie supprimée avec succès", pharmacie });
  } catch (error) {
    console.error(" Erreur suppression:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ NOUVELLE MÉTHODE - Recherche avec médicament spécifique
exports.getPharmaciesAvecMedicament = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      medicamentId,
      maxDistance = 10000,
    } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Coordonnées manquantes" });
    }

    const pharmacies = await Pharmacie.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: parseInt(maxDistance),
        },
      },
      // Note: Tu peux ajouter le lookup vers ton modèle de stock si nécessaire
    ]);

    return res.json(pharmacies);
  } catch (error) {
    console.error("Erreur recherche avec médicament:", error);
    return res.status(500).json({ message: error.message });
  }
};
