# Google Drive Integration Guide

## Overview
This guide explains how to integrate Google Drive file upload functionality into the FitCode gym platform for logo and video uploads.

## Files Added/Modified

### New Files:
1. **GoogleDriveFilePicker.jsx** - Main component for Google Drive file selection
2. **GoogleDriveIntegration.jsx** - Simplified fallback component
3. **.env.example** - Environment variables template

### Modified Files:
1. **OwnerDashboard.jsx** - Added Google Drive upload button alongside URL input

## Setup Instructions

### 1. Google Drive API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Drive API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Drive API" and enable it
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key
5. Configure OAuth 2.0:
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs for your domain
   - Download the client configuration

### 2. Environment Configuration
Create a `.env` file in the gym-platform-frontend directory:

```bash
# Copy from .env.example
cp .env.example .env
```

Add your Google Drive API credentials:
```env
VITE_GOOGLE_DRIVE_API_KEY=your_actual_api_key_here
VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here
```

### 3. Usage

#### Logo Upload
The Google Drive upload button has been added to the gym settings form in OwnerDashboard.jsx. Users can now:

1. **Manual Method**: Paste a Google Drive share link directly into the URL field
2. **Google Drive Picker**: Click "Upload from Google Drive" to select files directly

#### Video Upload
Similar functionality can be added to machine video uploads by following the same pattern.

## Implementation Details

### GoogleDriveFilePicker Component
```jsx
<GoogleDriveFilePicker
  onFileSelected={(url) => setGymForm({ ...gymForm, logo_url: url })}
  buttonText="Upload from Google Drive"
/>
```

### URL Conversion
The system automatically converts Google Drive share URLs to direct access URLs:
- Input: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
- Output: `https://drive.google.com/uc?export=view&id=FILE_ID`

### Validation
- Validates image URLs (supports direct links, Google Drive, and data URLs)
- Provides real-time preview of selected images
- Shows error messages for invalid URLs

## Security Considerations

1. **API Key Security**: Never commit actual API keys to version control
2. **OAuth Scopes**: Ensure minimal required scopes are requested
3. **File Permissions**: Users must set Google Drive files to "Anyone with the link can view"
4. **CORS**: Configure proper CORS settings for your domain

## Troubleshooting

### Common Issues

1. **Picker Not Loading**
   - Check if Google Drive API is enabled
   - Verify API key is correct
   - Ensure proper OAuth setup

2. **Authentication Errors**
   - Check if user is logged in with Google
   - Verify OAuth token is valid
   - Ensure proper scopes are granted

3. **File Access Issues**
   - Ensure file sharing permissions are set correctly
   - Check if file is publicly accessible

### Testing

1. Test with various image formats (JPG, PNG, GIF, WebP)
2. Test with different Google Drive URL formats
3. Verify URL conversion works correctly
4. Test error handling with invalid URLs

## Future Enhancements

1. **Multi-file Upload**: Support for uploading multiple files at once
2. **Drag & Drop**: Add drag-and-drop functionality
3. **Progress Indicators**: Show upload progress
4. **File Type Validation**: Validate file types before upload
5. **Size Limits**: Add file size restrictions
6. **Thumbnail Generation**: Auto-generate thumbnails for uploaded images

## API Reference

### GoogleDriveFilePicker Props
- `onFileSelected`: Callback function called with selected file URL
- `buttonText`: Custom text for the upload button
- `accept`: File type filter (default: "image/*")

### Helper Functions
- `getDriveImageUrl()`: Converts Google Drive URLs to direct access URLs
- `validateImageUrl()`: Validates image URLs
- `convertToDirectUrl()`: URL conversion utility

## Support

For issues or questions about Google Drive integration, please:
1. Check the troubleshooting section above
2. Review Google Drive API documentation
3. Check browser console for error messages
4. Verify all setup steps are completed
