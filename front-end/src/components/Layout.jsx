import React, { useContext } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { AuthContext } from "../context/AuthContext";

export default function Layout({ children }) {
  const { role, isAuthenticated } = useContext(AuthContext);

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <Navbar />

      <div className="d-flex flex-grow-1">
        {isAuthenticated && <Sidebar role={role} />}
        <div className="flex-grow-1 p-4">{children}</div>
      </div>

      <Footer />
    </div>
  );
}
