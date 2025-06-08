import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import SideBar from "./components/SideBar";
import UserManagement from "./pages/UserManagement";
import TransactionManagement from "./pages/TransactionManagement";
import ImageAnalytics from "./pages/ImageAnalytics";
import PlanManagement from "./pages/PlanManagement";
import Dashboard from "./pages/Dashboard";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem("adminToken", token);
    }
  }, [token]);

  if (!token) {
    return (
      <>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Zoom}
        />
        <Login setToken={setToken} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Zoom}
      />

      <div className="relative">
        <SideBar />
        <div className="ml-[16.67%]">
          <Navbar setToken={setToken} />
          <div className="pt-20 px-6">
            <Routes>
              <Route path="/admin" element={<Login setToken={setToken} />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/manageUser" element={<UserManagement />} />
              <Route
                path="/admin/transactions"
                element={<TransactionManagement />}
              />
              <Route path="/admin/analytics" element={<ImageAnalytics />} />
              <Route path="/admin/plans" element={<PlanManagement />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
