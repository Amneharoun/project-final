import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [medicaments, setMedicaments] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Vérifie connexion + récupère médicaments
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    const userName = localStorage.getItem("userName");

    if (token) {
      setUser(userName || "Utilisateur");
      setRole(userRole || "");
    }

    fetch("http://localhost:5000/medicaments")
      .then((res) => res.json())
      .then((data) => setMedicaments(data))
      .catch((err) => console.error("Erreur médicaments :", err));
  }, []);

  // ✅ Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    setUser(null);
    setRole("");
    navigate("/");
  };

  // ✅ Connexion
  const handleLoginClick = () => {
    navigate("/login");
  };

  // ✅ Activer lien courant
  const isActive = (path) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

  // ✅ Recherche médicaments
  const handleSearch = (e) => {
    e.preventDefault();
    const found = medicaments.find(
      (med) => med.nom.toLowerCase() === searchTerm.toLowerCase()
    );
    if (found) {
      alert(`Médicament trouvé : ${found.nom}`);
      navigate("/medicament");
    } else {
      alert("Médicament introuvable !");
    }
    setSearchTerm("");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand fw-bold" to="/dashboard">
          <i className="fas fa-mortar-pestle me-2"></i>
          Pharmacie-Aboukoumba
        </Link>

        {/* Toggle mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={isActive("/dashboard")} to="/dashboard">
                <i className="fas fa-chart-line me-1"></i>
                Tableau de bord
              </Link>
            </li>

            {role === "admin" && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="fas fa-cog me-1"></i>
                  Administration
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/utilisateurs">
                      <i className="fas fa-user-cog me-2"></i>
                      Utilisateurs
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/medicament">
                      <i className="fas fa-file-import me-2"></i>
                      Import/Export
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>

          {/* 🔎 Recherche */}
          <form className="d-flex me-3" onSubmit={handleSearch}>
            <input
              type="search"
              className="form-control me-2"
              placeholder="Rechercher un médicament"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-light" type="submit">
              <i className="fas fa-search"></i>
            </button>
          </form>

          {/* 👤 Utilisateur */}
          <ul className="navbar-nav">
            {user ? (
              // ✅ Cas connecté → Profil + Déconnexion
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="fas fa-user-circle me-1"></i>
                  {user} ({role})
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="fas fa-user me-2"></i>
                      Mon profil
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <a
                      className="dropdown-item text-danger"
                      href="#"
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>
                      
                       Déconnexion
                    </a>
                  </li>
                </ul>
              </li>
            ) : (
              // ✅ Cas non connecté → Connexion
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLoginClick();
                  }} >
                  <i className="fas fa-sign-in-alt me-1"></i> 
                 Connexion
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;