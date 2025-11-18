import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const otpToken = localStorage.getItem("otpToken");
      
      const response = await api.patch('/auth/email-verify', {
        otp,
        otpToken,
        purpose: 'verify-email',
      });

      const data = response.data;
      console.log(data.message);      

      setMessage('Vérification réussie ! Vous pouvez maintenant vous connecter.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      console.error('Erreur Verify:', error);
      setMessage(error.response?.data?.message || "Erreur de vérification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-center mb-3">Vérification du compte</h3>
          <p className="text-center text-muted">Entrez le code OTP reçu par email</p>

          {message && (
            <div className={`alert ${message.includes('réussie') ? 'alert-success' : 'alert-danger'}`} role="alert">
              {message}
            </div>
          )}

          <form onSubmit={handleVerify}>
            <div className="mb-3">
              <label htmlFor="otp" className="form-label">Code OTP</label>
              <input
                type="text"
                id="otp"
                className="form-control"
                placeholder="Entrez votre code OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Vérification...' : 'Vérifier'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
