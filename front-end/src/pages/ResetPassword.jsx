import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setMessage("Les mots de passe ne correspondent pas.");
    }

    setLoading(true);
    const otpToken = localStorage.getItem("otpToken");

    try {
      const response = await api.patch("/auth/reset-password", {
        otp,
        otpToken,
        password,
      });

      const data = response.data;
      console.log(data.message);      

      setMessage("Mot de passe réinitialisé avec succès !");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "Erreur lors de la réinitialisation."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title mb-5 text-center">
                Réinitialiser le mot de passe
              </h3>
              {message && <div className="alert alert-info">{message}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Code de vérification</label>
                  <input
                    type="number"
                    className="form-control"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Nouveau mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary mb-5"
                  disabled={loading}
                >
                  {loading ? "En cours..." : "Réinitialiser"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
