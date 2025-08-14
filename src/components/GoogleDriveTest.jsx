import React, { useState } from 'react';
import EnhancedGoogleDrivePicker from './EnhancedGoogleDrivePicker';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Copy, ExternalLink } from 'lucide-react';

const GoogleDriveTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestFileSelected = (fileData) => {
    const result = {
      timestamp: new Date().toISOString(),
      file: fileData,
      status: 'success',
      message: 'File selected successfully'
    };
    
    setTestResults(prev => [result, ...prev]);
  };

  const handleTestError = (error) => {
    const result = {
      timestamp: new Date().toISOString(),
      error: error,
      status: 'error',
      message: 'Test failed'
    };
    
    setTestResults(prev => [result, ...prev]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Google Drive Integration Test</CardTitle>
        </CardHeader>
        <CardContent>
          <EnhancedGoogleDrivePicker
            onFileSelected={handleTestFileSelected}
            buttonText="Test Google Drive Upload"
            allowedTypes={['image', 'video']}
            acceptPublicOnly={true}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearResults}
            className="ml-auto"
          >
            Clear Results
          </Button>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <p className="text-gray-500">No test results yet. Try uploading a file from Google Drive.</p>
          ) : (
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                        {result.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(result.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    {result.file && (
                      <div className="space-y-2">
                        <div>
                          <strong>Name:</strong> {result.file.name}
                        </div>
                        <div>
                          <strong>Type:</strong> {result.file.type}
                        </div>
                        <div>
                          <strong>Size:</strong> {(result.file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                        <div className="flex items-center gap-2">
                          <strong>URL:</strong>
                          <a 
                            href={result.file.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate max-w-xs"
                          >
                            {result.file.url}
                          </a>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(result.file.url)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(result.file.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {result.error && (
                      <div className="text-red-600">
                        <strong>Error:</strong> {result.error}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Google Drive API enabled</span>
              <Badge variant="outline">Check</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>OAuth credentials configured</span>
              <Badge variant="outline">Check</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>API key restrictions set</span>
              <Badge variant="outline">Check</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Environment variables configured</span>
              <Badge variant="outline">Check</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Backend routes registered</span>
              <Badge variant="outline">Check</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleDriveTest;
