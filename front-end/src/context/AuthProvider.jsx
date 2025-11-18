import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        setUser(decoded.email);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.clear();
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
    }
  };
  
  // ✅ CORRECTION : Enlever user et role des dépendances pour éviter la boucle infinie
  useEffect(() => {
    loadUserFromToken();
    window.addEventListener("storage", loadUserFromToken);
    
    // ✅ Log uniquement au premier chargement
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log(`User authenticated successfully with email ${decoded.email} and role ${decoded.role}`);
      } catch (err) {
        console.error("Error reading token:", err);
      }
    }
    
    return () => window.removeEventListener("storage", loadUserFromToken);
  }, []); // ✅ Tableau de dépendances vide

  const login = (token) => {
    localStorage.setItem("token", token);
    loadUserFromToken();
  };

  const logout = () => {
    localStorage.clear();
    loadUserFromToken();
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
