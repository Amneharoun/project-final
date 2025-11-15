import React from "react";

export default function Services() {
  return (
    <section className="container my-5" id="services">
      <h2 className="text-center mb-4">Nos Services</h2>
      <div className="row">
        {/* Service 1 */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Recherche de médicaments</h5>
              <p className="card-text">
                Recherchez rapidement un médicament dans toutes les pharmacies disponibles d'Abéché.
              </p>
            </div>
          </div>
        </div>
        {/* Service 2 */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Alertes de stock</h5>
              <p className="card-text">
                Soyez informé en cas de rupture ou expiration proche d’un médicament.
              </p>
            </div>
          </div>
        </div>
        {/* Service 3 */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Gestion des ventes</h5>
              <p className="card-text">
                Suivi des ventes, factures, et historique de chaque client/patient.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
