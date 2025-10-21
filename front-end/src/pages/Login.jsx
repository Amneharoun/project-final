import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // ✅ Use context login function
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleForgotChange = (e) => {
    setForgotEmail(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Use context to store and decode token
        login(data.token);
        setMessage("Connexion réussie !");
        navigate("/dashboard");
      } else {
        setMessage(data.message || "Erreur lors de la connexion");
      }
    } catch (err) {
      console.error(err);
      setMessage("Erreur serveur. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) return setMessage("Veuillez saisir votre email.");

    try {
      const response = await fetch("http://localhost:5000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();
      localStorage.setItem("otpToken", data.otpToken);

      setMessage(data.message || "Si l'email existe, un lien a été envoyé.");
      setShowForgotModal(false);
      setTimeout(() => navigate("/reset-password"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("Erreur serveur. Veuillez réessayer.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title mb-4 text-center">Connexion</h3>
              {message && <div className="alert alert-info">{message}</div>}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Mot de passe</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center mb-5">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Connexion..." : "Se connecter"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => setShowForgotModal(true)}
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-5">
                  <p>Vous n'avez pas de compte ?</p>
                  <button
                    type="button"
                    className="btn btn-primary mb-5"
                    onClick={() => navigate("/register")}
                  >
                    Inscrivez-vous
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot password modal */}
      {showForgotModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Réinitialiser le mot de passe</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowForgotModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={forgotEmail}
                    onChange={handleForgotChange}
                    placeholder="Votre email"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowForgotModal(false)}
                >
                  Annuler
                </button>
                <button className="btn btn-primary" onClick={handleForgotPassword}>
                  Envoyer le lien
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
