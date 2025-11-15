// models/medicamentModel.js - CORRIGÉ
const mongoose = require("mongoose");
const mongoosepaginte = require("mongoose-paginate-v2");

const medicamentSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      unique: true,
      required: true,
    },
    categorie: {
      type: String,
      required: true,
    },
    prix: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    seuilAlerte: {
      type: Number,
      default: 10,
      min: 0,
    },
    datePeremption: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

medicamentSchema.plugin(mongoosepaginte);

const medicamentModel = mongoose.model("medicaments", medicamentSchema);

module.exports = medicamentModel;