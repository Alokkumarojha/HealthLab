import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Spinner from "./pages/Spinner";
// import PatientDetails from "./pages/PatientDetails";
import AddPatient from "./pages/AddPatient";
import LabDashboard from "./pages/Dashboard/LabDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import authService from "./appwrite/auth";
import { login as loginAction } from "./store/authSlice";

function App() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(
            loginAction({
              userData: userData,
              role: userData?.prefs?.role || "patient",
            })
          );
        }
      })
      .catch((err) => {
        console.error("Auto-login failed:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Header always visible */}
      <Header />

      <main className="p-4">
        {/* ✅ Only main content shows loading */}
        {loading ? (
          <Spinner />
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={!authStatus ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!authStatus ? <Signup /> : <Navigate to="/" />}
            />
            <Route
              path="/add-patient"
              element={authStatus ? <AddPatient /> : <Navigate to="/login" />}
            />
            <Route
              path="/lab-dashboard"
              element={authStatus ? <LabDashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/patient-dashboard"
              element={
                authStatus ? <PatientDashboard /> : <Navigate to="/login" />
              }
            />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default App;
