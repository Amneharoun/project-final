const mongoose = require("mongoose");

const venteSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  medicaments: [
    {
      medicament: { type: mongoose.Schema.Types.ObjectId, ref: "medicaments" },
      quantite: { type: Number, required: true },
      prix: { type: Number, required: true },
      reduction: { type: Number, required: true },
      prixReduit: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  dateVente: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Vente", venteSchema);
