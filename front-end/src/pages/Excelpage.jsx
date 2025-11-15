import React, { useState } from "react";
import axios from "axios";

export default function ExcelPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Importer
  const handleImport = async () => {
    if (!file) return setMessage("Veuillez sélectionner un fichier Excel.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/excel/import-medicaments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message + " (" + res.data.count + " lignes)");
    } catch (err) {
      setMessage("Erreur import: " + err.message);
    }
  };

  // Exporter
  const handleExport = () => {
    window.location.href = "http://localhost:5000/excel/export-medicaments";
  };

  return (
    <div className="container mt-5">
      <h3><i class="bi bi-cloud-arrow-up"></i> Import / Export Excel (Médicaments)</h3>

      <div className="mb-3">
        <input type="file" className="form-control" accept=".xlsx, .xls" onChange={handleFileChange} />
      </div>

      <button className="btn btn-success me-2" onClick={handleImport}>Importer</button>
      <button className="btn btn-primary" onClick={handleExport}>Exporter</button>

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}
