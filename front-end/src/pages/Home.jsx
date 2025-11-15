import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Aboukomba from '../assets/aboukoumba.png';


const Home = () => {
  return (
    <section className="container-fluid bg-light py-5 min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row align-items-center">
          {/* Illustration */}
          <div className="col-md-6 mb-4 mb-md-0">
            <img
              src={Aboukomba} 
              alt="Pharmacie illustration"
              className="img-fluid"
            />
          </div>

          {/* Texte */}
          <div className="col-md-6 text-center text-md-start">
            <h1 className="display-4 fw-bold text-primary mb-3">
              Bienvenue sur <span className="text-success">Medi</span>
            </h1>
            <p className="lead text-muted mb-4">
              La solution digitale pour trouver vos médicaments en un seul clic.
              <br />
              Gagnez du temps, vérifiez la disponibilité, et localisez votre
              pharmacie la plus proche.
            </p>
            <div className="d-flex gap-3 justify-content-center justify-content-md-start">
              <button className="btn btn-primary btn-lg px-4 rounded-pill shadow-sm">
                Commencer
              </button>
              <button className="btn btn-outline-secondary btn-lg px-4 rounded-pill">
                En savoir plus
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
