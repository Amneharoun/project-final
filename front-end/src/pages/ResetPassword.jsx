import React, { useState } from "react";
import { useNavigate} from "react-router-dom";
import API_URL from "../config";
const ResetPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState();
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
            const response = await fetch(`${API_URL}/auth/reset-password`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ otp, otpToken, password }),
            });

            const data = await response.json();
            if (response.ok) {
                // Stocker dans localStorage
                // localStorage.setItem("token", data.token);
                // localStorage.setItem("user", JSON.stringify(data.user));

                setMessage("Mot de passe réinitialisé avec succès !");
                setTimeout(() => navigate("/dashboard"), 1500);
            } else {
                setMessage(data.message || "Erreur lors de la réinitialisation.");
            }
        } catch (err) {
            console.error(err);
            setMessage("Erreur serveur. Veuillez réessayer.");
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
                            <h3 className="card-title mb-5 text-center">Réinitialiser le mot de passe</h3>
                            {message && <div className="alert alert-info">{message}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Code de vérificaiton</label>
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
                                    <label className="form-label">Confirmer le mot de passe</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary mb-5 " disabled={loading}>
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
