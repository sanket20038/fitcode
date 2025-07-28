import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Dumbbell, Building, CheckCircle, BarChart3, Users, Shield } from 'lucide-react';
import { authAPI } from '../lib/api';

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
      
      <Card className="w-full max-w-lg bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur opacity-75"></div>
              <div className="relative bg-gradient-to-r from-blue-400 to-indigo-500 p-3 rounded-2xl">
                <Building className="h-8 w-8 text-white font-bold" />
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl font-black text-white">
            Join <span className="text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text">FitCode</span> Partner Program
          </CardTitle>
          <CardDescription className="text-gray-300 text-lg">
            Transform your gym with smart technology
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
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400"
                required
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-bold hover:from-blue-500 hover:to-indigo-600 transition-all duration-300 py-3 text-lg" 
              disabled={loading}
            >
              {loading ? 'Creating Partner Account...' : 'Become a FitCode Partner'}
            </Button>
          </form>

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