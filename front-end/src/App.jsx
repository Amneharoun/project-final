import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Tdebord from "./pages/Tdebord"
import Medicament from "./pages/Medicament"
import Layout from "./components/Layout";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Commandes from "./pages/Commandes";
import Factures from "./pages/Factures";
import VerifyOtp from "./pages/VerifyOtp";
import GestionUsers from "./pages/GestionUsers";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Profile from './pages/Profile';
import ExcelPage from './pages/Excelpage';
import NouvelleVente from './pages/NouvelleVente';
import ListeVentes from './pages/ListeVente';
const App = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/dashboard/overview", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then((res) => {
        setRole(res.data.role);
      })
      .catch((err) => console.error("Erreur Dashboard:", err));
  }, []);
  return (
    <div>
      <BrowserRouter>
        <Layout role={role}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/tdebord" element={<Tdebord />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<VerifyOtp />} />
            <Route path="/medicament" element={<Medicament />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/commandes" element={<Commandes />} />
            <Route path="/factures" element={<Factures />} />
            <Route path="/gestionUsers" element={<GestionUsers />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/excelpage" element={<ExcelPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/nouvellevente" element={<NouvelleVente />} />
            <Route path="/listevente" element={<ListeVentes />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
};


export default App;


// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/Onboarding" element={<Onboarding />} />
//         <Route path="/Verification" element={<Verification />} />
//         <Route path="/contact" element={<Contact />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;




