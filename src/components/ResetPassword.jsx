import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Dumbbell, CheckCircle, AlertTriangle } from 'lucide-react';
import { authAPI } from '../lib/api';

const ResetPassword = () => {
  const [value, setValue] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!value || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await authAPI.resetPassword({ value, password });
      setSuccess('Password reset successful! You can now log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
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
          <CardTitle className="text-3xl font-extrabold text-gray-900">Reset Password</CardTitle>
          <CardDescription className="text-gray-700 mt-2">Enter your username/email and new password</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-5 border-red-400 bg-red-100 animate-fade-in">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-900 font-semibold">{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-5 border-green-400 bg-green-100 animate-fade-in">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 font-semibold">{success}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              placeholder="Username or Email"
              value={value}
              onChange={e => setValue(e.target.value)}
              required
              className="text-lg"
            />
            <Input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="text-lg"
            />
            <Input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="text-lg"
            />
            <Button type="submit" className="w-full py-3 text-lg font-semibold" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword; 