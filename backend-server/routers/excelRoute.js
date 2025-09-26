const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const xlsx = require("xlsx");
const Medicament = require("../models/medicamentModel");

const fs = require("fs");
const mongoose = require("mongoose");


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

const mapRowToSchema = (row) => {
  return {
    nom: row.nom,
    categorie: row.categorie,
    stock: row.stock ?? 0,
    prix: row.prix ?? 0,  // ✅ ensure prix is always present
    datePeremption: row.datePeremption,
    code: row.code,
    seuilAlerte: row.seuilAlerte ?? 10,
  };
}

router.post("/import-medicaments", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier fourni" });
    }

    // Read workbook whether multer used disk or memory storage
    let workbook;
    if (req.file.path) {
      workbook = xlsx.readFile(req.file.path);
    } else if (req.file.buffer) {
      workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    } else {
      return res.status(400).json({ message: "Unsupported file upload configuration" });
    }

    const sheetName = workbook.SheetNames[0];
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: null });

    // Debugging info
    console.log("rawData length:", Array.isArray(rawData) ? rawData.length : "not-array");
    console.log("sample rawData row:", rawData && rawData[0]);

    // Force conversion to array of plain objects using Array.from and normalize keys/values
    // const data = Array.from(rawData, (r) => normalizeRow(r)).filter((r) => Object.keys(r).length > 0);
    const data = Array.from(rawData, (r) => mapRowToSchema(r)).filter(
      (r) => Object.values(r).some((val) => val !== null && val !== undefined && val !== "")
    );
    if (data.length === 0) {
      // remove uploaded file if on disk
      if (req.file.path) fs.unlink(req.file.path, () => { });
      return res.status(400).json({ message: "Fichier vide ou non valide après normalisation" });
    }

    // Check DB connection state (0 disconnected, 1 connected, 2 connecting, 3 disconnecting)
    if (mongoose.connection.readyState !== 1) {
      console.error("Mongoose not connected. readyState=", mongoose.connection.readyState);
      // Don't try to auto-connect here — handle it where you init mongoose in app
      return res.status(500).json({ message: "DB not connected (check your mongoose connection)" });
    }

    // Validate rows against schema and separate valid vs invalid
    const validRows = [];
    const invalidRows = [];
    for (const row of data) {
      try {
        const doc = new Medicament(row); // build mongoose doc to check defaults/casts/validators
        await doc.validate(); // throws if invalid
        // push the plain object (not the doc) to insert
        validRows.push(row);
      } catch (err) {
        invalidRows.push({ row, error: err.message });
      }
    }

    if (validRows.length === 0) {
      if (req.file.path) fs.unlink(req.file.path, () => { });
      return res.status(400).json({
        message: "Aucune ligne valide à insérer",
        invalidCount: invalidRows.length,
        invalidSample: invalidRows.slice(0, 10),
      });
    }

    // Try insertMany with ordered:false so good docs won't be stopped by bad ones
    let inserted = [];
    try {
      inserted = await Medicament.insertMany(validRows, { ordered: false });
    } catch (err) {
      console.error("insertMany error:", err);
      // Some errors (bulk write with ordered:false) still throw; try to recover inserted docs if available
      if (err && err.insertedDocs) {
        inserted = err.insertedDocs;
      } else if (err && err.result && err.result.result && err.result.result.nInserted) {
        // fallback for older drivers
        // nothing to do here other than log
      }
      // keep going to return diagnostics
    }

    // Clean up file from disk if used
    if (req.file.path) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.warn("Failed to delete uploaded file:", unlinkErr);
      });
    }

    return res.json({
      message: "Import terminé",
      inputCount: data.length,
      validatedCount: validRows.length,
      insertedCount: Array.isArray(inserted) ? inserted.length : 0,
      invalidCount: invalidRows.length,
      invalidSample: invalidRows.slice(0, 10),
    });
  } catch (err) {
    console.error("Unexpected import error:", err);
    return res.status(500).json({ message: "Erreur import", error: err.message });
  }
});

module.exports = router;
