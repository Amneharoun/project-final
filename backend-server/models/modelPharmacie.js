const mongoose = require("mongoose");

const pharmacieSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  adresse: { type: String, required: true },
  telephone: { type: String },
  email: { type: String },
  horaires: {
    ouverture: String,
    fermeture: String,
  },
  statutOuvert: { type: Boolean, default: true },

  // Géolocalisation
 localisation: {
  type: { type: String, enum: ["Point"], default: "Point" },
  coordinates: { type: [Number], required: true } // [longitude, latitude]
}
}, { timestamps: true });

// Index géospatial pour les recherches par distance
pharmacieSchema.index({ localisation: "2dsphere" });

module.exports = mongoose.model("Pharmacie", pharmacieSchema);
