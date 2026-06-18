import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { AudioProvider } from "./context/AudioContext";
import { useState } from "react";

// Patient Pages
import Home from "./pages/Home/Home";
import Doctors from "./pages/Doctors/Doctors";
import DoctorProfile from "./pages/DoctorProfile/DoctorProfile";
import Library from "./pages/Library";
import Journal from "./pages/Journal";
import Community from "./pages/Community";
import Profile from "./pages/Profile/Profile";
import MyBookings from "./pages/MyBookings/MyBookings";

// Auth Pages
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import RoleSelection from "./pages/RoleSelection";
import SignupDoctor from "./pages/SignupDoctor";

// Doctor Pages
import DoctorDashboard from "./pages/DoctorDashboard";
import Patients from "./pages/Patients";
import Schedule from "./pages/Schedule";
import Messages from "./pages/Messages";
import DoctorAbout from "./pages/DoctorAbout";
import DoctorBookings from "./pages/DoctorBookings";

// Components
import ProtectedRoute from "./components/ProtectRoute/ProtectRoute";
import Chatbot from "./components/Chat/Chatbot";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <AuthProvider>
      <AudioProvider>
        <BrowserRouter>
          <Toaster position="top-center" reverseOrder={false} />

          <Routes>
            {/* Public Routes */}
            {/* <Route path="/" element={<Onboarding />} /> */}
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/register-patient" element={<SignUp />} />
            <Route path="/register-doctor" element={<SignupDoctor />} />

            {/* Patient Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctors"
              element={
                <ProtectedRoute>
                  <Doctors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctors/:doctorId"
              element={
                <ProtectedRoute>
                  <DoctorProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/library"
              element={
                <ProtectedRoute>
                  <Library searchTerm={searchTerm} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/journal"
              element={
                <ProtectedRoute>
                  <Journal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />

            {/* Doctor Routes */}
            <Route
              path="/doctor-dashboard"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <Patients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/schedule"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <Schedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-about"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorAbout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-bookings"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <div>Notifications Page (Coming Soon)</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/billing"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <div>Billing & Revenue Page (Coming Soon)</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/complete-profile"
              element={<Navigate to="/doctor-dashboard" replace />}
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Chatbot />
        </BrowserRouter>
      </AudioProvider>
    </AuthProvider>
  );
}

export default App;
