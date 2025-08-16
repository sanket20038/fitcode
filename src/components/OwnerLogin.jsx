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
          <div className="flex flex-col items-center gap-6 mt-6">
            <GoogleOAuthRegistration
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              userType="owner"
              variant="owner"
            >
              <span className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-lg">
                <svg className="w-6 h-6 mr-2" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.7 29.8 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 .9 8.3 2.7l6.2-6.2C34.2 4.5 29.4 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.3-.1-2.7-.3-4z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15.2 17.1 19.2 14 24 14c3.1 0 6 .9 8.3 2.7l6.2-6.2C34.2 4.5 29.4 3 24 3c-7.2 0-13 5.8-13 13 0 2.2.6 4.3 1.7 6.1z"/><path fill="#FBBC05" d="M24 44c5.8 0 10.7-3.3 13.7-8.1l-7-5.1C29.8 37 24 37 24 37c-4.8 0-8.8-3.1-10.7-7.6l-7 5.1C7.3 39.5 15.2 44 24 44z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.7C34.7 33.7 29.8 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 .9 8.3 2.7l6.2-6.2C34.2 4.5 29.4 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.3-.1-2.7-.3-4z"/></g></svg>
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