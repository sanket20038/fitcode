import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Dumbbell, Building, CheckCircle, BarChart3, Users, Shield, Chrome } from 'lucide-react';
import { authAPI } from '../lib/api';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import GoogleOAuthRegistration from './GoogleOAuthRegistration';

const OwnerRegister = () => {
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
        userType: 'owner',
        username: googleData.username
      });
      
      const { userExists, message, token, user } = response.data;
      
      // Check if user exists or is new
      if (userExists) {
        // User exists - show login message
        setError(message || 'User already exists. Please login instead.');
        setTimeout(() => navigate('/login/owner'), 2000);
      } else {
        if (token && user) {
          // New user created successfully
          setSuccess('Welcome to FitCode Partner Program! We\'ll contact you soon.');
          setTimeout(() => navigate('/login/owner'), 2000);
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
      await authAPI.registerOwner({
        username: form.username,
        email: form.email,
        password: form.password
      });
      
      setSuccess('Welcome to FitCode Partner Program! We\'ll contact you soon.');
      setTimeout(() => navigate('/login/owner'), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-r from-indigo-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      
      <Card className="w-full max-w-md shadow-2xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl relative z-10">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-full shadow-lg animate-pulse">
              <Building className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text">Partner Registration</CardTitle>
          <CardDescription className="text-white/70 mt-2">Join FitCode as a Gym Partner</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-5 border-red-400 bg-red-500/10">
              <AlertDescription className="text-red-100 font-semibold">{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-5 border-green-400 bg-green-500/10">
              <AlertDescription className="text-green-100 font-semibold">{success}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="normal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/20">
              <TabsTrigger 
                value="normal" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-white/70"
              >
                Normal Registration
              </TabsTrigger>
              <TabsTrigger 
                value="google" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-white/70"
              >
                Google Registration
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="normal" className="mt-6">
              <form onSubmit={handleRegister} className="space-y-6">
                <Input
                  type="text"
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                  className="text-lg bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="text-lg bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="text-lg bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                  className="text-lg bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Button type="submit" className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 rounded-xl" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Partner Account'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="google" className="mt-6">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-white/70 text-sm mb-4">
                    Register with your Google account. Choose a username to get started.
                  </p>
                </div>
                
                <GoogleOAuthRegistration
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  userType="owner"
                  variant="owner"
                  isLogin={false}
                >
                  Continue with Google
                </GoogleOAuthRegistration>
                
                <div className="text-center">
                  <p className="text-white/60 text-xs">
                    Already have an account? 
                    <a href="/login/owner" className="text-indigo-400 hover:underline ml-1">
                      Login here
                    </a>
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Partner benefits section */}
          <div className="mt-8 space-y-3">
            <h4 className="text-white font-semibold text-center mb-4">Partner Benefits:</h4>
            <div className="flex items-center space-x-3 text-gray-300">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              <span>Advanced analytics dashboard</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <Users className="h-5 w-5 text-indigo-400" />
              <span>Enhanced client engagement</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <Shield className="h-5 w-5 text-purple-400" />
              <span>Professional business tools</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already a partner?{' '}
              <Link to="/login/owner" className="text-blue-400 hover:text-blue-300 font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerRegister; 