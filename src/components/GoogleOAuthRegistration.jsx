import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Chrome } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

const GoogleOAuthRegistration = ({ 
  onSuccess, 
  onError, 
  userType = 'client', 
  variant = 'default',
  className = '',
  children 
}) => {
  const [showUsernameDialog, setShowUsernameDialog] = useState(false);
  const [username, setUsername] = useState('');
  const [googleUserData, setGoogleUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        setIsLoading(true);
        // Get user info from Google
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${response.access_token}` },
        }).then(res => res.json());

        // Store Google user data and show username dialog
        setGoogleUserData({
          access_token: response.access_token,
          user: userInfo,
          userType: userType
        });
        setShowUsernameDialog(true);
      } catch (error) {
        console.error('Error fetching user info:', error);
        onError('Failed to get user information from Google');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      onError('Google login failed. Please try again.');
    },
    scope: 'email profile openid',
  });

  const handleUsernameSubmit = async () => {
    if (!username.trim()) {
      onError('Username is required');
      return;
    }

    if (username.length < 3) {
      onError('Username must be at least 3 characters long');
      return;
    }

    try {
      setIsLoading(true);
      // Call the success callback with username included
      onSuccess({
        ...googleUserData,
        username: username.trim()
      });
      setShowUsernameDialog(false);
      setUsername('');
      setGoogleUserData(null);
    } catch (error) {
      onError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonStyles = () => {
    const baseStyles = "w-full flex items-center justify-center gap-3 font-semibold transition-all duration-300";
    
    switch (variant) {
      case 'client':
        return `${baseStyles} bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 hover:border-gray-400`;
      case 'owner':
        return `${baseStyles} bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 hover:border-gray-400`;
      default:
        return `${baseStyles} bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 hover:border-gray-400`;
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => login()}
        className={`${getButtonStyles()} ${className}`}
        variant="outline"
        disabled={isLoading}
      >
        <Chrome className="h-5 w-5" />
        {isLoading ? 'Loading...' : (children || `Continue with Google`)}
      </Button>

      <Dialog open={showUsernameDialog} onOpenChange={setShowUsernameDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Your Username</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUsernameSubmit()}
                className="mt-1"
                autoFocus
              />
              <p className="text-sm text-gray-500 mt-1">
                This will be your display name on the platform
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleUsernameSubmit}
                disabled={isLoading || !username.trim()}
                className="flex-1"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowUsernameDialog(false);
                  setUsername('');
                  setGoogleUserData(null);
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GoogleOAuthRegistration;
