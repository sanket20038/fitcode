import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from './ui/button';
import { Chrome } from 'lucide-react';

const GoogleOAuthRegistration = ({ 
  onSuccess, 
  onError, 
  userType = 'client', 
  variant = 'default',
  className = '',
  children
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        setIsLoading(true);
        // Get user info from Google
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${response.access_token}` },
        }).then(res => res.json());

        // Automatically use Google profile name as username
        const username = userInfo.name || userInfo.email?.split('@')[0] || 'user';
        
        // Create Google user data with auto-generated username
        const googleData = {
          access_token: response.access_token,
          user: userInfo,
          userType: userType,
          username: username
        };

        // Directly call success callback with auto-generated username
        await onSuccess(googleData);
        
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
  );
};

export default GoogleOAuthRegistration;
