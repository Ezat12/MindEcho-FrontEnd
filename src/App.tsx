import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext'; 

import Onboarding from './pages/Onboarding';
import RoleSelection from './pages/RoleSelection';
import SignupDoctor from './pages/SignupDoctor';
import SignUp from './pages/SignUp'; 
import Login from './pages/Login';
import DoctorDashboard from './pages/DoctorDashboard';
import Patients from './pages/Patients';
import Schedule from './pages/Schedule'; 
import Messages from './pages/Messages';
import DoctorAbout from './pages/DoctorAbout';
import DoctorBookings from './pages/DoctorBookings'; 
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = window.localStorage.getItem('token'); 
  
  if (!token) {
    return <Navigate to="/login" replace />; 
  }
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider> 
      <Router>
        <Toaster position="top-center" reverseOrder={false} />
        
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register-patient" element={<SignUp />} />
          <Route path="/register-doctor" element={<SignupDoctor />} />
          <Route path="/doctor-dashboard" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
          <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/doctor-about" element={<ProtectedRoute><DoctorAbout /></ProtectedRoute>} />
          <Route path="/doctor-bookings" element={<ProtectedRoute><DoctorBookings /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><div>Notifications Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute><div>Billing & Revenue Page (Coming Soon)</div></ProtectedRoute>} />
          <Route path="/complete-profile" element={<Navigate to="/doctor-dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
