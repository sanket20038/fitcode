import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Dumbbell, Eye, EyeOff, User } from 'lucide-react';
import { authAPI } from '../lib/api';
import { setAuth } from '../lib/auth';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-indigo-300 p-6">
      <Card className="w-full max-w-md shadow-xl rounded-lg border border-gray-300">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-700 p-5 rounded-full shadow-lg animate-pulse">
              <Dumbbell className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl font-extrabold text-gray-900">Client Login</CardTitle>
          <CardDescription className="text-gray-700 mt-2">Sign in to your client account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-5 border-red-400 bg-red-100 animate-fade-in">
              <AlertDescription className="text-red-900 font-semibold">{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              className="text-lg"
            />
            <div className="flex items-center justify-between">
              <Input
                type={form.showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="text-lg"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="ml-2 text-indigo-600 hover:text-indigo-800 focus:outline-none"
                aria-label={form.showPassword ? 'Hide password' : 'Show password'}
              >
                {form.showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-indigo-700 hover:underline focus:outline-none"
                onClick={() => setShowForgot(true)}
              >
                Forgot Password?
              </button>
            </div>
            <Button type="submit" className="w-full py-3 text-lg font-semibold" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in as Client'}
            </Button>
          </form>
          {/* Forgot Password Modal */}
          {showForgot && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                  onClick={() => { setShowForgot(false); setForgotError(''); setForgotSuccess(''); setForgotValue(''); setForgotPassword(''); setForgotConfirmPassword(''); }}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h2 className="text-xl font-bold mb-2 text-gray-900">Forgot Password</h2>
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
                  />
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={forgotPassword}
                    onChange={e => setForgotPassword(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    value={forgotConfirmPassword}
                    onChange={e => setForgotConfirmPassword(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full" disabled={forgotLoading}>
                    {forgotLoading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </form>
              </div>
            </div>
          )}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-700 font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientLogin; 