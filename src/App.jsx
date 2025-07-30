import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

// Components
import Register from './components/Register';
import ClientRegister from './components/ClientRegister';
import OwnerRegister from './components/OwnerRegister';
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
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsConditions from './components/TermsConditions';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import HelpCenter from './components/HelpCenter';
import Abdominals from './components/musclewiki/Abdominals';
import Biceps from './components/musclewiki/Biceps';
import Triceps from './components/musclewiki/Triceps';
import Traps from './components/musclewiki/Traps';
import Shoulder from './components/musclewiki/Shoulder';
import Quads from './components/musclewiki/Quads';
import Obliques from './components/musclewiki/Obliques';
import LowerBack from './components/musclewiki/LowerBack';
import Lats from './components/musclewiki/Lats';
import Hamstrings from './components/musclewiki/Hamstrings';
import Glutes from './components/musclewiki/Glutes';
import Calves from './components/musclewiki/Calves';
import Chest from './components/musclewiki/Chest';
import Forearms from './components/musclewiki/Forearms';
import TrapsMidBack from './components/musclewiki/TrapsMidBack';

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
                <Navigate to="/login/client" replace />
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
          <Route
            path="/register/client"
            element={
              authenticated ?
                <Navigate to="/client/dashboard" replace /> :
                <ClientRegister />
            }
          />
          <Route
            path="/register/owner"
            element={
              authenticated ?
                <Navigate to="/owner/dashboard" replace /> :
                <OwnerRegister />
            }
          />
          {/* Reset Password Route */}
          <Route 
            path="/reset-password" 
            element={<ResetPassword />} 
          />

          {/* Footer Pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help-center" element={<HelpCenter />} />

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

          {/* Muscle Wiki Routes */}
          <Route path="/musclewiki/abdominals" element={<ProtectedRoute userType="client"><Abdominals /></ProtectedRoute>} />
          <Route path="/musclewiki/biceps" element={<ProtectedRoute userType="client"><Biceps /></ProtectedRoute>} />
          <Route path="/musclewiki/triceps" element={<ProtectedRoute userType="client"><Triceps /></ProtectedRoute>} />
          <Route path="/musclewiki/traps" element={<ProtectedRoute userType="client"><Traps /></ProtectedRoute>} />
          <Route path="/musclewiki/shoulder" element={<ProtectedRoute userType="client"><Shoulder /></ProtectedRoute>} />
          <Route path="/musclewiki/quads" element={<ProtectedRoute userType="client"><Quads /></ProtectedRoute>} />
          <Route path="/musclewiki/obliques" element={<ProtectedRoute userType="client"><Obliques /></ProtectedRoute>} />
          <Route path="/musclewiki/lowerback" element={<ProtectedRoute userType="client"><LowerBack /></ProtectedRoute>} />
          <Route path="/musclewiki/lats" element={<ProtectedRoute userType="client"><Lats /></ProtectedRoute>} />
          <Route path="/musclewiki/hamstrings" element={<ProtectedRoute userType="client"><Hamstrings /></ProtectedRoute>} />
          <Route path="/musclewiki/glutes" element={<ProtectedRoute userType="client"><Glutes /></ProtectedRoute>} />
          <Route path="/musclewiki/calves" element={<ProtectedRoute userType="client"><Calves /></ProtectedRoute>} />
          <Route path="/musclewiki/chest" element={<ProtectedRoute userType="client"><Chest /></ProtectedRoute>} />
          <Route path="/musclewiki/forearms" element={<ProtectedRoute userType="client"><Forearms /></ProtectedRoute>} />
          <Route path="/musclewiki/traps-mid-back" element={<ProtectedRoute userType="client"><TrapsMidBack /></ProtectedRoute>} />

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

