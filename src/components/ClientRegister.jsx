import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Dumbbell, User, CheckCircle, Zap, Target, TrendingUp } from 'lucide-react';
import { authAPI } from '../lib/api';
import GoogleOAuthRegistration from './GoogleOAuthRegistration';

const ClientRegister = () => {
  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleGoogleSuccess = async (googleData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Call backend to authenticate with Google
      const response = await authAPI.googleAuth({
        access_token: googleData.access_token,
        user: googleData.user,
        userType: 'client',
        username: googleData.username
      });
      
      const { userExists, message, token, user } = response.data;
      
      // Check if user exists or is new
      if (userExists) {
        // User exists - show login message
        setError(message || 'User already exists. Please login instead.');
        setTimeout(() => navigate('/login/client'), 2000);
      } else {
        if (token && user) {
          // New user created successfully
          setSuccess('Welcome to FitCode! Your account has been created successfully.');
          setTimeout(() => navigate('/login/client'), 2000);
        } else {
          // Username taken or other issue
          setError(message || 'Registration failed. Please try a different username.');
        }
      }
      
      return { userExists: userExists };
    } catch (error) {
      setError(error.response?.data?.message || 'Google authentication failed');
      return { userExists: false };
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await authAPI.registerClient({
        username: form.username,
        email: form.email,
        password: form.password
      });
      
      setSuccess('Welcome to FitCode! Your fitness journey starts now.');
      setTimeout(() => navigate('/login/client'), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-cyan-900 p-4">
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-r from-yellow-400/20 to-pink-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl blur opacity-75"></div>
              <div className="relative bg-gradient-to-r from-cyan-400 to-purple-500 p-3 rounded-2xl">
                <Dumbbell className="h-8 w-8 text-black font-bold" />
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl font-black text-white">
            Join <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">FitCode</span>
          </CardTitle>
          <CardDescription className="text-gray-300 text-lg">
            Start your fitness transformation today
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 border-red-500/50 bg-red-500/10">
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-500/50 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-200">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Choose your username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400"
                required
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Your email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400"
                required
              />
            </div>

            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold hover:from-cyan-500 hover:to-purple-600 transition-all duration-300 py-3 text-lg" 
              disabled={loading}
            >
              {loading ? 'Creating Your Account...' : 'Start My Fitness Journey'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Google OAuth Button */}
                  <GoogleOAuthRegistration
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          userType="client"
          variant="client"
          className="mb-4"
          isLogin={false}
        >
          Continue with Google
        </GoogleOAuthRegistration>

          {/* Benefits section */}
          <div className="mt-8 space-y-3">
            <h4 className="text-white font-semibold text-center mb-4">What you'll get:</h4>
            <div className="flex items-center space-x-3 text-gray-300">
              <Zap className="h-5 w-5 text-cyan-400" />
              <span>AI-powered workout guidance</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <Target className="h-5 w-5 text-purple-400" />
              <span>Personalized fitness plans</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <TrendingUp className="h-5 w-5 text-yellow-400" />
              <span>Progress tracking & analytics</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login/client" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientRegister; 