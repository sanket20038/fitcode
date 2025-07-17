import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Dumbbell, User, Building, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../lib/api';
import { setAuth } from '../lib/auth';

const Login = ({ setAuthenticated, setUserType }) => {
  const [ownerForm, setOwnerForm] = useState({ username: '', password: '', showPassword: false });
  const [clientForm, setClientForm] = useState({ username: '', password: '', showPassword: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = (formType) => {
    if (formType === 'owner') {
      setOwnerForm({ ...ownerForm, showPassword: !ownerForm.showPassword });
    } else {
      setClientForm({ ...clientForm, showPassword: !clientForm.showPassword });
    }
  };

  const handleOwnerLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const trimmedOwnerForm = {
        username: ownerForm.username.trim(),
        password: ownerForm.password.trim(),
      };
      const response = await authAPI.loginOwner(trimmedOwnerForm);
      const { token, user } = response.data;
      
      setAuth(token, user, 'owner');
      setAuthenticated(true);
      setUserType('owner');
      navigate('/owner/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClientLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const trimmedClientForm = {
        username: clientForm.username.trim(),
        password: clientForm.password.trim(),
      };
      const response = await authAPI.loginClient(trimmedClientForm);
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
          <CardTitle className="text-4xl font-extrabold text-gray-900">Welcome to FitCode</CardTitle>
          <CardDescription className="text-gray-700 mt-2">Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-5 border-red-400 bg-red-100 animate-fade-in">
              <AlertDescription className="text-red-900 font-semibold">{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="client" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-md bg-gray-100 shadow-inner">
              <TabsTrigger value="client" className="flex items-center gap-2 text-lg font-semibold text-gray-700 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <User className="h-5 w-5" />
                Client
              </TabsTrigger>
              <TabsTrigger value="owner" className="flex items-center gap-2 text-lg font-semibold text-gray-700 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <Building className="h-5 w-5" />
                Gym Owner
              </TabsTrigger>
            </TabsList>

            <TabsContent value="client" className="mt-6">
              <form onSubmit={handleClientLogin} className="space-y-6">
                <Input
                  type="text"
                  placeholder="Username"
                  value={clientForm.username}
                  onChange={(e) => setClientForm({ ...clientForm, username: e.target.value })}
                  required
                  className="text-lg"
                />
                <div className="flex items-center justify-between">
                  <Input
                    type={clientForm.showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={clientForm.password}
                    onChange={(e) => setClientForm({ ...clientForm, password: e.target.value })}
                    required
                    className="text-lg"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('client')}
                    className="ml-2 text-indigo-600 hover:text-indigo-800 focus:outline-none"
                    aria-label={clientForm.showPassword ? 'Hide password' : 'Show password'}
                  >
                    {clientForm.showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <Button type="submit" className="w-full py-3 text-lg font-semibold" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign in as Client'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="owner" className="mt-6">
              <form onSubmit={handleOwnerLogin} className="space-y-6">
                <Input
                  type="text"
                  placeholder="Username"
                  value={ownerForm.username}
                  onChange={(e) => setOwnerForm({ ...ownerForm, username: e.target.value })}
                  required
                  className="text-lg"
                />
                <div className="flex items-center justify-between">
                  <Input
                    type={ownerForm.showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={ownerForm.password}
                    onChange={(e) => setOwnerForm({ ...ownerForm, password: e.target.value })}
                    required
                    className="text-lg"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('owner')}
                    className="ml-2 text-indigo-600 hover:text-indigo-800 focus:outline-none"
                    aria-label={ownerForm.showPassword ? 'Hide password' : 'Show password'}
                  >
                    {ownerForm.showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <Button type="submit" className="w-full py-3 text-lg font-semibold" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign in as Gym Owner'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

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

export default Login;
