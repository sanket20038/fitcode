import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Chrome, AlertCircle, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';

const GoogleOAuthRegistration = ({ 
  onSuccess, 
  onError, 
  userType = 'client', 
  variant = 'default',
  className = '',
  children,
  isLogin = false // New prop to distinguish between login and registration
}) => {
  const [showUsernameDialog, setShowUsernameDialog] = useState(false);
  const [username, setUsername] = useState('');
  const [googleUserData, setGoogleUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userExists, setUserExists] = useState(null); // null = not checked yet

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        setIsLoading(true);
        // Get user info from Google
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${response.access_token}` },
        }).then(res => res.json());

        // Store Google user data
        const googleData = {
          access_token: response.access_token,
          user: userInfo,
          userType: userType
        };

        // If this is login, automatically use email as username and skip dialog
        if (isLogin) {
          const autoUsername = userInfo.email.split('@')[0]; // Use email prefix as username
          onSuccess({
            ...googleData,
            username: autoUsername
          });
          return;
        }

        // For registration, show username dialog
        setGoogleUserData(googleData);
        setUsername(userInfo.name); // Automatically set username from Google profile
        setShowUsernameDialog(true);
        setUserExists(null); // Reset user existence check
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
      const result = await onSuccess({
        ...googleUserData,
        username: username.trim()
      });
      
      // Update the userExists state based on the result
      if (result && result.userExists !== undefined) {
        setUserExists(result.userExists);
        
        // If user exists and this is login, close dialog and let parent handle
        if (result.userExists && isLogin) {
          setShowUsernameDialog(false);
          setUsername('');
          setGoogleUserData(null);
          setUserExists(null);
        }
        // If user doesn't exist and this is registration, close dialog and let parent handle
        else if (!result.userExists && !isLogin) {
          setShowUsernameDialog(false);
          setUsername('');
          setGoogleUserData(null);
          setUserExists(null);
        }
        // Otherwise, keep dialog open to show the appropriate message
      }
    } catch (error) {
      onError('Authentication failed. Please try again.');
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

  const getDialogTitle = () => {
    if (isLogin) {
      if (userExists === null) return 'Enter Username for Google Login';
      return userExists ? 'User Found - Login' : 'User Not Found';
    }
    return 'Choose Your Username';
  };

  const getSubmitButtonText = () => {
    if (isLoading) return 'Processing...';
    
    if (isLogin) {
      if (userExists === null) return 'Check Username';
      return userExists ? 'Login with Google' : 'Go Back to Register';
    }
    return 'Create Account';
  };

  const getDialogMessage = () => {
    if (isLogin) {
      if (userExists === null) {
        return 'Enter your username to login with Google';
      } else if (userExists) {
        return 'User found! Click login to continue with Google.';
      } else {
        return 'User not found. Please register first or go back to registration.';
      }
    }
    return 'This will be your display name on the platform';
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
            <DialogTitle>{getDialogTitle()}</DialogTitle>
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
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500 mt-1">
                {getDialogMessage()}
              </p>
            </div>

            {/* Show different messages based on user existence */}
            {isLogin && userExists === true && (
              <Alert className="border-green-500/50 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-200">
                  User found! Click login to continue with Google.
                </AlertDescription>
              </Alert>
            )}

            {isLogin && userExists === false && (
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-200">
                  User not found. Please register first or go back to registration.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleUsernameSubmit}
                disabled={isLoading || !username.trim()}
                className="flex-1"
              >
                {getSubmitButtonText()}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowUsernameDialog(false);
                  setUsername('');
                  setGoogleUserData(null);
                  setUserExists(null);
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
