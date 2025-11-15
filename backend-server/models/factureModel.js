const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantite: { type: Number, required: true },
  prix: { type: Number, required: true },
});

const FactureSchema = new mongoose.Schema({
  client: { type: String, required: true },
  date: { type: Date, required: true },
  statut: {
    type: String,
    enum: ["En attente", "Payée", "Annulée"],
    default: "En attente",
  },
  items: [ItemSchema],
  total: { type: Number, required: true },
});

module.exports = mongoose.model("Facture", FactureSchema);
