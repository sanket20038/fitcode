import React, { useState } from 'react';
import EnhancedGoogleDrivePicker from './EnhancedGoogleDrivePicker';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';

const GoogleDriveIntegrationExample = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelected = async (fileData) => {
    setSelectedFile(fileData);
    setUploadStatus('processing');
    setIsUploading(true);

    try {
      // Get Google access token
      const googleToken = localStorage.getItem('google_access_token');
      
      // Send file data to backend
      const response = await fetch('/api/google-drive/process-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          file_id: fileData.driveFileId,
          file_name: fileData.name,
          file_type: fileData.type,
          google_access_token: googleToken
        })
      });

      const result = await response.json();

      if (result.success) {
        setUploadStatus('success');
        
        // Save to your backend via existing upload API
        const uploadResponse = await fetch('/api/gym/machines', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            name: fileData.name,
            how_to_use_video_url: result.public_url,
            source: 'google_drive',
            drive_file_id: fileData.driveFileId
          })
        });

        if (uploadResponse.ok) {
          console.log('File successfully saved to backend');
        }
      } else {
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Google Drive Integration Example</CardTitle>
          <CardDescription>
            Upload images and videos directly from Google Drive to your gym platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <EnhancedGoogleDrivePicker
            onFileSelected={handleFileSelected}
            buttonText="Upload from Google Drive"
            allowedTypes={['image', 'video']}
            acceptPublicOnly={true}
          />

          {selectedFile && (
            <Card>
              <CardHeader>
                <CardTitle>Selected File</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {selectedFile.name}</p>
                  <p><strong>Type:</strong> {selectedFile.type}</p>
                  <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <p><strong>URL:</strong> <a href={selectedFile.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selectedFile.url}</a></p>
                </div>
              </CardContent>
            </Card>
          )}

          {uploadStatus && (
            <Alert variant={uploadStatus === 'success' ? 'default' : 'destructive'}>
              {uploadStatus === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {uploadStatus === 'success' ? 'File uploaded successfully!' : 'Error uploading file'}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Click "Upload from Google Drive" to open the file picker</li>
            <li>Select images or videos from your Google Drive</li>
            <li>The system will automatically make the file publicly accessible</li>
            <li>File metadata will be saved to your gym platform</li>
            <li>You can use the public URL directly in your app</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleDriveIntegrationExample;
