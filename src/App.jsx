import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

// Components
import Login from './components/Login';
import Register from './components/Register';
import OwnerDashboard from './components/OwnerDashboard';
import ClientDashboard from './components/ClientDashboard';
import QRScanner from './components/QRScanner';
import MachineInfo from './components/MachineInfo';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './components/LandingPage';
import ClientLogin from './components/ClientLogin';
import OwnerLogin from './components/OwnerLogin';
import GymLoader from './components/GymLoader';
import ResetPassword from './components/ResetPassword';

// Utils
import { isAuthenticated, isOwner, isClient } from './lib/auth';
import { authAPI } from './lib/api';

function App() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          await authAPI.verifyToken();
          setAuthenticated(true);
          setUserType(isOwner() ? 'owner' : 'client');
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.clear();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <GymLoader text="Loading FitCode..." />
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              authenticated ? 
                <Navigate to={userType === 'owner' ? '/owner/dashboard' : '/client/dashboard'} replace /> : 
                <Login />
            } 
          />
          <Route
            path="/login/client"
            element={
              authenticated ?
                <Navigate to="/client/dashboard" replace /> :
                <ClientLogin setAuthenticated={setAuthenticated} setUserType={setUserType} />
            }
          />
          <Route
            path="/login/owner"
            element={
              authenticated ?
                <Navigate to="/owner/dashboard" replace /> :
                <OwnerLogin setAuthenticated={setAuthenticated} setUserType={setUserType} />
            }
          />
          <Route 
            path="/register" 
            element={
              authenticated ? 
                <Navigate to={userType === 'owner' ? '/owner/dashboard' : '/client/dashboard'} replace /> : 
                <Register />
            } 
          />
          {/* Reset Password Route */}
          <Route 
            path="/reset-password" 
            element={<ResetPassword />} 
          />

          {/* Owner Routes */}
          <Route 
            path="/owner/dashboard" 
            element={
              <ProtectedRoute userType="owner">
                <OwnerDashboard setAuthenticated={setAuthenticated} setUserType={setUserType} />
              </ProtectedRoute>
            } 
          />

          {/* Client Routes */}
          <Route 
            path="/client/dashboard" 
            element={
              <ProtectedRoute userType="client">
                <ClientDashboard setAuthenticated={setAuthenticated} setUserType={setUserType} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/client/scanner" 
            element={
              <ProtectedRoute userType="client">
                <QRScanner />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/machine/:machineId" 
            element={
              <ProtectedRoute userType="client">
                <MachineInfo />
              </ProtectedRoute>
            } 
          />

          {/* Default Routes */}
          <Route 
            path="/" 
            element={
              authenticated ? 
                <Navigate to={userType === 'owner' ? '/owner/dashboard' : '/client/dashboard'} replace /> : 
                <LandingPage />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

