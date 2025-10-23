import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="text-center mt-5">
      <h2>Accès refusé</h2>
      <p>Vous n'avez pas la permission d’accéder à cette page.</p>
      <Link to="/medicament" className="btn btn-primary mt-3">
        Retour à l'accueil
      </Link>
    </div>
  );
}
