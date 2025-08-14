import React, { useEffect } from 'react';
import { Button } from './ui/button';
import { Loader2, UploadCloud } from 'lucide-react';

const GoogleDriveFilePicker = ({ onFileSelected, buttonText = "Upload from Google Drive", accept = "image/*" }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isPickerLoaded, setIsPickerLoaded] = React.useState(false);

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
      document.head.appendChild(script);
    };

    loadGoogleAPI();
  }, []);

  const handleGoogleDriveUpload = () => {
    if (!isPickerLoaded || !window.gapi || !window.google) {
      console.error('Google Drive Picker not loaded');
      return;
    }

    setIsLoading(true);

    // Check if user is authenticated with Google
    const token = localStorage.getItem('google_access_token');
    if (!token) {
      alert('Please sign in with Google first');
      setIsLoading(false);
      return;
    }

    try {
      const picker = new window.google.picker.PickerBuilder()
        .addView(new window.google.picker.View(window.google.picker.ViewId.DOCS_IMAGES))
        .setOAuthToken(token)
        .setDeveloperKey(import.meta.env.VITE_GOOGLE_DRIVE_API_KEY)
        .setCallback((data) => {
          if (data.action === window.google.picker.Action.PICKED) {
            const file = data.docs[0];
            const fileUrl = file.embedUrl || file.url;
            
            // Convert Google Drive URL to direct access URL
            const directUrl = convertToDirectUrl(fileUrl, file.id);
            onFileSelected(directUrl);
          }
          setIsLoading(false);
        })
        .build();
      
      picker.setVisible(true);
    } catch (error) {
      console.error('Error opening Google Drive picker:', error);
      setIsLoading(false);
    }
  };

  const convertToDirectUrl = (url, fileId) => {
    // Convert Google Drive share URL to direct image URL
    if (url.includes('drive.google.com')) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    return url;
  };

  return (
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
  );
};

export default GoogleDriveFilePicker;
