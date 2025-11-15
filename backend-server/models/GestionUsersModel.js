const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const gestionUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  role: {
    type: String,
    enum: ["admin", "pharmacien", "caissier", "patient"],
    default: "caissier"
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, { timestamps: true });

// hash du mot de passe avant sauvegarde
gestionUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("GestionUser", gestionUserSchema);
