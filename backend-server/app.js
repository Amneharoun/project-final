const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const authRouter = require("./routers/authRouter");
const medicamentRouter = require("./routers/medicamentRouter");
const venteRouter = require("./routers/venteRouter");
const dashbordRoute = require("./routers/dashbord");
const clientRouter = require("./routers/clientRouter");
const commandeRouter = require("./routers/commandeRouter");
const gestionUserRoutes = require("./routers/GestionUserAuter");
const factureRoutes = require("./routers/factureRoute");
const excelRoutes = require("./routers/excelRoute");
const pharmacieRouter = require("./routers/pharRouter");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur MongoDB :", err));

// API Routes
app.use("/auth", authRouter);
app.use("/medicaments", medicamentRouter);
app.use("/ventes", venteRouter);
app.use("/dashboard", dashbordRoute);
app.use("/clients", clientRouter);
app.use("/commandes", commandeRouter);
app.use("/gestion-users", gestionUserRoutes);
app.use("/factures", factureRoutes);
app.use("/excel", excelRoutes);
app.use("/pharmacies", pharmacieRouter);

// Serve frontend static files
// app.use(express.static(path.join(__dirname, "dist")));

// ✅ Catch-all to React Router - FIXED
// app.use((req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Serveur démarré sur http://localhost:${PORT}`)
);
