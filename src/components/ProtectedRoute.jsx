import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserType } from '../lib/auth';

const ProtectedRoute = ({ children, userType }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (userType && getUserType() !== userType) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

