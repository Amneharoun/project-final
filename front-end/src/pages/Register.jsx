import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './register.css';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'pharmacien',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Gestion des champs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Inscription avec appel backend
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        ...form,
        role: form.role.toLowerCase(), // toujours en minuscule
        email: form.email.toLowerCase(), // éviter doublons
      });

      const data = response.data;

      setMessage('Compte créé avec succès ! Vérifiez vos emails pour valider le compte.');

      localStorage.setItem("otpToken", data.otpToken);
      console.log("OTP Token:", localStorage.getItem("otpToken"));
      
      // après validation OTP → login
      setTimeout(() => navigate('/verify'), 1500);
    } catch (error) {
      console.error('Erreur Register:', error);
      setMessage(error.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Créer un compte</h2>

      <form className="register-form" onSubmit={handleRegister}>
        <input
          type="text"
          name="name"
          placeholder="Nom complet"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Adresse email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="pharmacien">Pharmacien</option>
          <option value="admin">Admin</option>
          <option value="caissier">Caissier</option>
          <option value="patient">Patient</option>
        </select>

        <button type="submit" className='btn btn-primary' disabled={loading}>
          {loading ? 'Création...' : 'Créer un compte'}
        </button>
      </form>

      {message && <p className="register-message">{message}</p>}
    </div>
  );
};

export default Register;
