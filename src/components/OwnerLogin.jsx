import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
// import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Dumbbell, Eye, EyeOff, Building } from 'lucide-react';
import { authAPI } from '../lib/api';
import { setAuth } from '../lib/auth';
import GoogleOAuthRegistration from './GoogleOAuthRegistration';

const OwnerLogin = ({ setAuthenticated, setUserType }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Username/password login removed

  const handleGoogleSuccess = async (googleData) => {
    setLoading(true);
    setError('');
    
    try {
      // Call backend to authenticate with Google
      const response = await authAPI.googleAuth({
        access_token: googleData.access_token,
        user: googleData.user,
        userType: 'owner',
        username: googleData.username
      });
      
      const { userExists, message, token, user } = response.data;
      
      // Unified flow - handle both login and registration
      if (token && user) {
        // Successful authentication (login or registration)
        setAuth(token, user, 'owner');
        setAuthenticated(true);
        setUserType('owner');
        navigate('/owner/dashboard');
        return { success: true };
      } else {
        setError(message);
        return { success: false };
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Google authentication failed');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (errorMessage) => {
    setError(errorMessage);
  };

  // Forgot password logic removed

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-3xl border border-white/10 bg-white/10 backdrop-blur-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-full shadow-lg animate-pulse">
              <Dumbbell className="h-12 w-12 text-white drop-shadow-lg" />
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text drop-shadow">Welcome, Gym Owner</CardTitle>
          <CardDescription className="text-white/80 mt-2 text-base">Sign in with your Google account to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-5 border-red-400 bg-red-500/10 animate-fade-in">
              <AlertDescription className="text-red-100 font-semibold">{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex flex-col items-center w-full mt-10 mb-4">
            <GoogleOAuthRegistration
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              userType="owner"
              variant="owner"
            >
              <span className="flex items-center gap-3 px-8 py-4 bg-white rounded-full shadow-md text-black font-semibold text-lg w-full justify-center hover:bg-gray-100 transition-all duration-200 border border-gray-200">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6 mr-2" />
                Sign in with Google
              </span>
            </GoogleOAuthRegistration>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerLogin; 