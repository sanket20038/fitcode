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
            <Button type="submit" className="w-full py-3 text-lg font-semibold" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in as Client'}
            </Button>
          </form>
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