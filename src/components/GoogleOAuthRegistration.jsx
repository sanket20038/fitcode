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
    const baseStyles = "w-full flex items-center justify-center gap-3 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5";
    
    switch (variant) {
      case 'client':
        return `${baseStyles} bg-gradient-to-r from-white to-gray-50 text-gray-700 hover:from-gray-50 hover:to-gray-100 border border-gray-300 hover:border-gray-400 focus:ring-4 focus:ring-blue-500/20`;
      case 'owner':
        return `${baseStyles} bg-gradient-to-r from-white to-gray-50 text-gray-700 hover:from-gray-50 hover:to-gray-100 border border-gray-300 hover:border-gray-400 focus:ring-4 focus:ring-indigo-500/20`;
      default:
        return `${baseStyles} bg-gradient-to-r from-white to-gray-50 text-gray-700 hover:from-gray-50 hover:to-gray-100 border border-gray-300 hover:border-gray-400 focus:ring-4 focus:ring-gray-500/20`;
    }
  };

  return (
    <Button
      type="button"
      onClick={() => login()}
      className={`${getButtonStyles()} ${className} rounded-xl py-3 px-4 text-base font-medium`}
      disabled={isLoading}
    >
      <div className="flex items-center justify-center gap-3">
        <div className="bg-white p-1 rounded">
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </div>
        <span className="text-gray-700">
          {isLoading ? 'Processing...' : (children || 'Continue with Google')}
        </span>
      </div>
    </Button>
  );
};

export default GoogleOAuthRegistration;
