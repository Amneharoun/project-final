// models/modelPharmacie.js
const mongoose = require("mongoose");

const pharmacieSchema = new mongoose.Schema({
  nom: { 
    type: String, 
    required: [true, "Le nom de la pharmacie est obligatoire"] 
  },
  adresse: { 
    type: String, 
    required: [true, "L'adresse est obligatoire"] 
  },
  telephone: String,
  email: String,
  horaires: {
    ouverture: String,
    fermeture: String
  },
  responsable: String,
  statutOuvert: { 
    type: Boolean, 
    default: true 
  },
  localisation: {
    type: { 
      type: String, 
      enum: ["Point"], 
      default: "Point" 
    },
    coordinates: { 
      type: [Number], 
      default: [0, 0],
      index: '2dsphere' // ✅ IMPORTANT
    },
  },
}, {
  timestamps: true
});

pharmacieSchema.index({ localisation: "2dsphere" });

module.exports = mongoose.model("Pharmacie", pharmacieSchema);