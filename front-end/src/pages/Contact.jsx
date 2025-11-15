import React from "react";

export default function Contact() {
  return (
    <div className="container mt-4">
      <h2>Contactez-nous</h2>
      <p>Remplissez ce formulaire pour nous envoyer un message :</p>
      
      <form>
        <div className="mb-3">
          <label className="form-label">Nom</label>
          <input type="text" className="form-control" placeholder="Votre nom" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" placeholder="Votre email" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Message</label>
          <textarea className="form-control" rows="4" placeholder="Votre message..." required></textarea>
        </div>
        <button type="submit" className="btn btn-primary btn-sm">Envoyer</button>
      </form>
    </div>
  );
}
