import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import OwnerDashboard from './pages/OwnerDashboard';
import ClientDashboard from './pages/ClientDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/owner"
        element={
          <ProtectedRoute userType="owner">
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/client"
        element={
          <ProtectedRoute userType="client">
            <ClientDashboard />
          </ProtectedRoute>
        }
      />

      {/* Default route fallback */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
