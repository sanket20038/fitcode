import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Dumbbell, Eye, EyeOff, User, Chrome } from 'lucide-react';
import { authAPI } from '../lib/api';
import { setAuth } from '../lib/auth';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import GoogleOAuthRegistration from './GoogleOAuthRegistration';

const ClientLogin = ({ setAuthenticated, setUserType }) => {
  const [form, setForm] = useState({ username: '', password: '', showPassword: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [showForgot, setShowForgot] = useState(false);
  const [forgotValue, setForgotValue] = useState('');
  const [forgotPassword, setForgotPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const togglePasswordVisibility = () => {
    setForm({ ...form, showPassword: !form.showPassword });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const trimmedForm = {
        username: form.username.trim(),
        password: form.password.trim(),
      };
      const response = await authAPI.loginClient(trimmedForm);
      const { token, user } = response.data;
      setAuth(token, user, 'client');
      setAuthenticated(true);
      setUserType('client');
      navigate('/client/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (googleData) => {
    setLoading(true);
    setError('');
    
    try {
      // Call backend to authenticate with Google
      const response = await authAPI.googleAuth({
        access_token: googleData.access_token,
        user: googleData.user,
        userType: 'client',
        username: googleData.username
      });
      
      const { userExists, message, token, user } = response.data;
      
      // Check if user exists and can login
      if (userExists) {
        if (token && user) {
          // Successful login
          setAuth(token, user, 'client');
          setAuthenticated(true);
          setUserType('client');
          navigate('/client/dashboard');
          return { userExists: true };
        } else {
          // Username doesn't match existing account
          setError(message);
          return { userExists: true };
        }
      } else {
        // User doesn't exist or username taken
        setError(message);
        return { userExists: false };
      }
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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    if (!forgotValue || !forgotPassword || !forgotConfirmPassword) {
      setForgotError('Please fill in all fields.');
      return;
    }
    if (forgotPassword !== forgotConfirmPassword) {
      setForgotError('Passwords do not match.');
      return;
    }
    setForgotLoading(true);
    try {
      await authAPI.resetPassword({ value: forgotValue, password: forgotPassword });
      setForgotSuccess('Password reset successful! You can now log in.');
    } catch (error) {
      setForgotError(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <Card className="w-full max-w-md shadow-2xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-full shadow-lg animate-pulse">
              <User className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text">Client Login</CardTitle>
          <CardDescription className="text-white/70 mt-2">Sign in to your client account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-5 border-red-400 bg-red-500/10 animate-fade-in">
              <AlertDescription className="text-red-100 font-semibold">{error}</AlertDescription>
            </Alert>
          )}
          
          <Tabs defaultValue="normal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/20">
              <TabsTrigger 
                value="normal" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-white/70"
              >
                Normal Login
              </TabsTrigger>
              <TabsTrigger 
                value="google" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-white/70"
              >
                Google Login
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="normal" className="mt-6">
              <form onSubmit={handleLogin} className="space-y-6">
                <Input
                  type="text"
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                  className="text-lg bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <div className="flex items-center justify-between">
                  <Input
                    type={form.showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    className="text-lg bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="ml-2 text-blue-400 hover:text-indigo-400 focus:outline-none"
                    aria-label={form.showPassword ? 'Hide password' : 'Show password'}
                  >
                    {form.showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {/* Forgot Password Link */}
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-indigo-400 hover:underline focus:outline-none"
                    onClick={() => setShowForgot(true)}
                  >
                    Forgot Password?
                  </button>
                </div>
                <Button type="submit" className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 rounded-xl" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign in as Client'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="google" className="mt-6">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-white/70 text-sm mb-4">
                    Login with your Google account. Enter your username to continue.
                  </p>
                </div>
                
                <GoogleOAuthRegistration
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  userType="client"
                  variant="client"
                  isLogin={true}
                >
                  Continue with Google
                </GoogleOAuthRegistration>
                
                <div className="text-center">
                  <p className="text-white/60 text-xs">
                    Don't have an account? 
                    <a href="/register/client" className="text-indigo-400 hover:underline ml-1">
                      Register here
                    </a>
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Forgot Password Modal */}
          {showForgot && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative backdrop-blur-xl border border-pink-400/20">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                  onClick={() => { setShowForgot(false); setForgotError(''); setForgotSuccess(''); setForgotValue(''); setForgotPassword(''); setForgotConfirmPassword(''); }}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h2 className="text-xl font-bold mb-2 text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">Forgot Password</h2>
                <p className="text-gray-600 mb-4 text-sm">Enter your username/email and new password to reset your password.</p>
                {forgotError && <div className="mb-2 text-red-600 text-sm">{forgotError}</div>}
                {forgotSuccess && <div className="mb-2 text-green-600 text-sm">{forgotSuccess}</div>}
                <form onSubmit={handleForgotPassword} className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Email or Username"
                    value={forgotValue}
                    onChange={e => setForgotValue(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-black placeholder:text-gray-500"
                  />
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={forgotPassword}
                    onChange={e => setForgotPassword(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-black placeholder:text-gray-500"
                  />
                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    value={forgotConfirmPassword}
                    onChange={e => setForgotConfirmPassword(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-black placeholder:text-gray-500"
                  />
                  <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 rounded-xl" disabled={forgotLoading}>
                    {forgotLoading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </form>
              </div>
            </div>
          )}
          <div className="mt-8 text-center">
            <p className="text-sm text-white/70">
              Don't have an account?{' '}
              <Link to="/register/client" className="text-pink-400 font-semibold hover:underline">
                Sign up as Client
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientLogin; 