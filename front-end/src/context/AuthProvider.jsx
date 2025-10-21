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

  useEffect(() => {
    loadUserFromToken();
    window.addEventListener("storage", loadUserFromToken);
    return () => window.removeEventListener("storage", loadUserFromToken);
  }, []);

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
