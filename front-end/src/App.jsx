import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider"; 
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Tdebord from "./pages/Tdebord";
import Medicament from "./pages/Medicament";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Commandes from "./pages/Commandes";
import Factures from "./pages/Factures";
import VerifyOtp from "./pages/VerifyOtp";
import GestionUsers from "./pages/GestionUsers";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import ExcelPage from "./pages/Excelpage";
import NouvelleVente from "./pages/NouvelleVente";
import ListeVentes from "./pages/ListeVente";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
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
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />

          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
