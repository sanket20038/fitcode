import React, { useState, useEffect } from 'react';
import GoogleOAuthButton from './GoogleOAuthButton';
import { Button } from './ui/button';
import { Loader2, UploadCloud, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

const EnhancedGoogleDrivePicker = ({ 
  onFileSelected, 
  buttonText = "Upload from Google Drive",
  allowedTypes = ['image', 'video'],
  acceptPublicOnly = true 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPickerLoaded, setIsPickerLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [permissionPrompt, setPermissionPrompt] = useState(null);

  useEffect(() => {
    // Load Google Drive Picker API
    const loadGoogleAPI = () => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('picker', () => {
          setIsPickerLoaded(true);
        });
      };
      script.onerror = () => {
        setError('Failed to load Google Drive Picker');
      };
      document.head.appendChild(script);
    };

    loadGoogleAPI();
  }, []);

  const [showSignIn, setShowSignIn] = useState(false);

  const handleGoogleDriveUpload = async () => {
    if (!isPickerLoaded || !window.gapi || !window.google) {
      setError('Google Drive Picker not loaded');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPermissionPrompt(null);

    try {
      const token = localStorage.getItem('google_access_token');
      if (!token) {
        setError('You must sign in with Google to use the Drive Picker.');
        setShowSignIn(true);
        setIsLoading(false);
        return;
      }

      // Create picker with specific view for images and videos
      const view = new window.google.picker.View(window.google.picker.ViewId.DOCS);
      // Filter for images and videos
      if (allowedTypes.includes('image')) {
        view.setMimeTypes('image/*');
      }
      if (allowedTypes.includes('video')) {
        view.setMimeTypes('video/*');
      }

      const picker = new window.google.picker.PickerBuilder()
        .addView(view)
        .setOAuthToken(token)
        .setDeveloperKey(import.meta.env.VITE_GOOGLE_DRIVE_API_KEY)
        .setCallback(async (data) => {
          if (data.action === window.google.picker.Action.PICKED) {
            const file = data.docs[0];
            await processSelectedFile(file, token);
          }
          setIsLoading(false);
        })
        .build();
      picker.setVisible(true);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const processSelectedFile = async (file, token) => {
    try {
      // Check if file is publicly accessible
      const isPublic = await checkFilePermissions(file.id, token);
      
      if (!isPublic && acceptPublicOnly) {
        setPermissionPrompt({
          fileId: file.id,
          fileName: file.name,
          file: file
        });
        return;
      }

      // Generate public URL
      const publicUrl = await generatePublicUrl(file, token);
      
      // Prepare file data for upload
      const fileData = {
        name: file.name,
        type: file.mimeType,
        url: publicUrl,
        driveFileId: file.id,
        size: file.sizeBytes,
        thumbnailUrl: file.thumbnailUrl,
        source: 'google_drive'
      };

      onFileSelected(fileData);
    } catch (error) {
      setError(`Error processing file: ${error.message}`);
    }
  };

  const checkFilePermissions = async (fileId, token) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?fields=shared`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to check file permissions');
      }
      
      const data = await response.json();
      return data.shared === true;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  };

  const generatePublicUrl = async (file, token) => {
    const mimeType = file.mimeType;
    
    if (mimeType.startsWith('image/')) {
      // For images, use the direct view URL
      return `https://drive.google.com/uc?export=view&id=${file.id}`;
    } else if (mimeType.startsWith('video/')) {
      // For videos, use the embed URL
      return `https://drive.google.com/file/d/${file.id}/preview`;
    }
    
    // Fallback to webViewLink
    return file.url || file.webViewLink;
  };

  const handleMakePublic = async (file) => {
    try {
      const token = localStorage.getItem('google_access_token');
      
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${file.id}/permissions`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            role: 'reader',
            type: 'anyone'
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to make file public');
      }

      setPermissionPrompt(null);
      
      // Process the file now that it's public
      const publicUrl = await generatePublicUrl(file, token);
      const fileData = {
        name: file.name,
        type: file.mimeType,
        url: publicUrl,
        driveFileId: file.id,
        size: file.sizeBytes,
        thumbnailUrl: file.thumbnailUrl,
        source: 'google_drive'
      };

      onFileSelected(fileData);
    } catch (error) {
      setError(`Failed to make file public: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {permissionPrompt && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p>
                The file "{permissionPrompt.fileName}" is not publicly accessible. 
                Would you like to make it shareable via link?
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleMakePublic(permissionPrompt.file)}
                >
                  Make Public
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPermissionPrompt(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleDriveUpload}
        disabled={isLoading || !isPickerLoaded}
        className="w-full"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <UploadCloud className="h-4 w-4 mr-2" />
        )}
        {buttonText}
      </Button>

      {showSignIn && (
        <div className="mt-2">
          <GoogleOAuthButton
            onSuccess={(data) => {
              if (data?.access_token) {
                localStorage.setItem('google_access_token', data.access_token);
                setShowSignIn(false);
                setError(null);
              }
            }}
            onError={() => setError('Google sign-in failed.')}
            userType="owner"
            variant="owner"
            className="w-fit"
          >
            Sign in with Google
          </GoogleOAuthButton>
        </div>
      )}
    </div>
  );
};

export default EnhancedGoogleDrivePicker;
