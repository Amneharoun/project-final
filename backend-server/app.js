const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const authRouter = require("./routers/authRouter");
const medicamentRouter = require("./routers/medicamentRouter");
const venteRouter = require("./routers/venteRouter");
const dashbordRoute = require("./routers/dashbord");
const clientRouter = require("./routers/clientRouter");
const commandeRouter = require("./routers/commandeRouter");
const gestionUserRoutes = require("./routers/GestionUserAuter");
const factureRoutes = require("./routers/factureRoute");
const userRoutes = require("./routers/authRouter");
const excelRoutes = require("./routers/excelRoute");
const pharmacieRouter = require("./routers/pharRouter");

const corsOption = {
  origin: "http://localhost:5173/",
};

const app = express();
app.use(cors());
app.use(express.static('dist'))
app.use(express.json());
app.use(morgan("dev"));

// Connexion MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur MongoDB :", err));

// Routes
app.use("/auth", authRouter);
app.use("/medicaments", medicamentRouter);
app.use("/ventes", venteRouter);
app.use("/dashboard", dashbordRoute);
app.use("/clients", clientRouter);
app.use("/commandes", commandeRouter);
app.use("/gestion-users", gestionUserRoutes);
app.use("/factures", factureRoutes);
app.use("/users", userRoutes);
app.use("/excel", excelRoutes);
app.use("/pharmacies", pharmacieRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Serveur démarré sur http://localhost:${PORT}`)
);
