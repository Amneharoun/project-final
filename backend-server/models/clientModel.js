const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const clientSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  contact: String,
  historiqueAchats: [
    {
      medicament: { type: mongoose.Schema.Types.ObjectId, ref: "medicaments" },
      date: { type: Date, default: Date.now },
      quantite: Number,
    },
  ],
});

clientSchema.plugin(paginate);

const clientModel = mongoose.model("Client", clientSchema);
module.exports = clientModel;
