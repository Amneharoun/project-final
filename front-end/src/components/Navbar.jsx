import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [medicaments, setMedicaments] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Load user info + meds
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    const userName = localStorage.getItem("userName");

    setIsAuthenticated(!!token);
    if (token) {
      setUser(userName || "Utilisateur");
      setRole(userRole || "");
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setRole("");
    setIsAuthenticated(false);
    navigate("/");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        {/* 🧴 Logo */}
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <img
            src="/src/assets/aboukoumba.png"
            alt="Pharmacie Logo"
            style={{
              width: "40px",
              height: "40px",
              marginRight: "10px",
              borderRadius: "5px",
            }}
          />
          Pharmacie-Aboukoumba
        </Link>

        {/* 📱 Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 🌐 Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {isAuthenticated && (
              <li className="nav-item">
                <Link className={isActive("/dashboard")} to="/dashboard">
                  <i className="fas fa-chart-line me-1"></i> Tableau de bord
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/services">
                Services
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
                  <i className="fas fa-cog me-1"></i> Administration
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/utilisateurs">
                      <i className="fas fa-user-cog me-2"></i> Utilisateurs
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/medicament">
                      <i className="fas fa-file-import me-2"></i> Import /
                      Export
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>

          {/* 👤 User */}
          <ul className="navbar-nav">
            {isAuthenticated ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="fas fa-user-circle me-1"></i> {user} ({role})
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="fas fa-user me-2"></i> Mon profil
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i> Déconnexion
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLoginClick();
                  }}
                >
                  <i className="fas fa-sign-in-alt me-1"></i> Connexion
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
