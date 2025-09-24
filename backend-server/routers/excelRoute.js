const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const xlsx = require("xlsx");
const Medicament = require("../models/medicamentModel");

// ✅ Exporter en Excel
router.get("/export-medicaments", async (req, res) => {
  try {
    const medicaments = await Medicament.find().lean();

    const worksheet = xlsx.utils.json_to_sheet(medicaments);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Medicaments");

    const filePath = `uploads/medicaments_${Date.now()}.xlsx`;
    xlsx.writeFile(workbook, filePath);

    res.download(filePath);
  } catch (err) {
    res.status(500).json({ message: "Erreur export", error: err.message });
  }
});

//  Importer depuis Excel
router.post("/import-medicaments", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Insertion en base
    await Medicament.insertMany(data);

    res.json({ message: "Importation réussie", count: data.length });
  } catch (err) {
    res.status(500).json({ message: "Erreur import", error: err.message });
  }
});

module.exports = router;
