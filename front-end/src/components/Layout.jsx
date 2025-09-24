import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

export default function Layout({ children, role }) {
  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      {/* Top Navbar */}
      <Navbar />

      {/* Sidebar + Main content */}
      <div className="d-flex flex-grow-1">
        {/* Show sidebar only if user is logged in */}
        {role && <Sidebar role={role} />}

        <div className="flex-grow-1 p-4">
          {children}
        </div>
      </div>

      {/* Footer at bottom */}
      <Footer />
    </div>
  );
}
