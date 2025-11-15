import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import Aboukomba from '../assets/aboukoumba.png';


const Navbar = () => {
  const { user, role, isAuthenticated, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLoginClick = () => navigate("/login");
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <img
            src={Aboukomba}
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

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

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
                </a>
              </li>
            )}
          </ul>

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
