import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./components/home/HomePage";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import OwnerDashboard from "./components/dashboard/OwnerDashboard";
import SeekerDashboard from "./components/dashboard/SeekerDashboard";
import "./styles/global.css";

// Protected route component
const ProtectedRoute = ({ element, allowedRole }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!user || !token) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return (
      <Navigate
        to={user.role === "owner" ? "/owner-dashboard" : "/seeker-dashboard"}
      />
    );
  }

  return element;
};

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/owner-dashboard"
              element={
                <ProtectedRoute
                  element={<OwnerDashboard />}
                  allowedRole="owner"
                />
              }
            />
            <Route
              path="/seeker-dashboard"
              element={
                <ProtectedRoute
                  element={<SeekerDashboard />}
                  allowedRole="seeker"
                />
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
