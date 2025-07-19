import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { 
  QrCode, 
  Camera, 
  Upload, 
  ArrowLeft, 
  LogOut, 
  Play, 
  BookOpen, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Info,
  Sparkles,
  Zap
} from 'lucide-react';
import { clientAPI } from '../lib/api';
import { getUser, clearAuth } from '../lib/auth';
import GymLoader from './GymLoader';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [scanCount, setScanCount] = useState(0);
  const [cameraPermission, setCameraPermission] = useState('prompt'); // 'prompt', 'granted', 'denied'
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [showUploadOption, setShowUploadOption] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const html5QrcodeScannerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Clean up scanner on unmount
  useEffect(() => {
    return () => {
      if (html5QrcodeScannerRef.current) {
        html5QrcodeScannerRef.current.clear().catch(console.error);
      }
    };
  }, []);

  // Load scan count from localStorage
  useEffect(() => {
    const storedCount = localStorage.getItem('scanCount') || '0';
    setScanCount(parseInt(storedCount));
  }, []);

  // Check camera permission on mount
  useEffect(() => {
    checkCameraPermission();
  }, []);

  // Only initialize scanner when scanning is true and DOM is updated
  useEffect(() => {
    if (scanning && scannerRef.current && cameraPermission === 'granted') {
      initializeScanner();
    }
  }, [scanning, cameraPermission]);

  const checkCameraPermission = async () => {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const permission = await navigator.permissions.query({ name: 'camera' });
        setCameraPermission(permission.state);
        
        permission.onchange = () => {
          setCameraPermission(permission.state);
        };
      }
    } catch (error) {
      console.log('Permission API not supported, will request on scan');
    }
  };

  const requestCameraPermission = async () => {
    setIsRequestingPermission(true);
    setError('');
    
    try {
      // Try to get user media to request permission with back camera preference
      const constraints = {
        video: {
          facingMode: 'environment', // Prefer back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Stop the stream immediately after getting permission
      stream.getTracks().forEach(track => track.stop());
      
      setCameraPermission('granted');
      setScanning(true);
    } catch (error) {
      console.error('Camera permission denied:', error);
      setCameraPermission('denied');
      setShowUploadOption(true);
      setError('Camera not available. You can upload an image with a QR code instead.');
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file (JPEG, PNG, etc.)');
      }

      // Create HTML5Qrcode instance for file scanning
      const html5QrCode = new Html5Qrcode("qr-reader");
      
      // Read the file and scan for QR codes
      const qrCodeData = await html5QrCode.scanFile(file, true);
      
      if (qrCodeData) {
        await onScanSuccess(qrCodeData);
      } else {
        setError('No QR code found in the uploaded image. Please try with a different image.');
      }
    } catch (error) {
      console.error('File scan error:', error);
      if (error.message.includes('No QR code found')) {
        setError('No QR code found in the uploaded image. Please try with a different image.');
      } else {
        setError('Error processing image. Please try again with a clear image containing a QR code.');
      }
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const initializeScanner = () => {
    if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.clear().catch(console.error);
    }

    html5QrcodeScannerRef.current = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 25,
        qrbox: { width: 280, height: 280 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
        // Disable camera selection dialog completely
        showCameraSelectionButton: false,
        // Disable permission request dialog
        showPermissionRequestButton: false,
        // Auto-start scanning
        autoStart: true,
        // Disable all UI elements that might interfere
        showScanRegionSelectionButton: false,
        showScanRegionSelectionDialog: false,
      },
      false
    );

    html5QrcodeScannerRef.current.render(onScanSuccess, onScanFailure);
  };

  const startScanning = () => {
    setError('');
    setSuccess('');
    
    if (cameraPermission === 'granted') {
      setScanning(true);
    } else if (cameraPermission === 'denied') {
      setError('Camera permission is required. Please enable camera access in your browser settings and try again.');
    } else {
      // Request permission first
      requestCameraPermission();
    }
  };

  const stopScanning = () => {
    if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.clear().catch(console.error);
      html5QrcodeScannerRef.current = null;
    }
    setScanning(false);
  };

  const onScanSuccess = async (decodedText) => {
    console.log('Scanned:', decodedText);
    stopScanning();

    try {
      const response = await qrAPI.scanQR(decodedText);
      const { machine } = response.data;
      
      // Update scan count
      const newCount = scanCount + 1;
      setScanCount(newCount);
      localStorage.setItem('scanCount', newCount.toString());
      
      setSuccess('QR code scanned successfully!');
      setTimeout(() => {
        navigate(`/machine/${machine.id}`);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid QR code');
    }
  };

  const onScanFailure = (error) => {
    console.warn('Scan failed:', error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      {/* Modern Header with Glassmorphism */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/client/dashboard')}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-xs sm:text-sm">Back</span>
            </Button>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-2 sm:p-3 rounded-2xl shadow-xl">
                  <QrCode className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-sm sm:text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  QR Scanner
                </h1>
                <p className="text-white/60 text-xs sm:text-sm font-medium">Scan machine codes</p>
              </div>
            </div>
          </div>
          {/* Scan Counter */}
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-xl rounded-full px-2 sm:px-4 py-1 sm:py-2">
            <Target className="h-4 w-4 text-purple-400" />
            <span className="text-white font-medium text-xs sm:text-base">{scanCount} scans</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Success/Error Messages */}
        {error && (
          <Alert className="mb-6 bg-red-500/10 border-red-500/20 backdrop-blur-xl animate-in slide-in-from-top duration-300">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-100">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-500/10 border-green-500/20 backdrop-blur-xl animate-in slide-in-from-top duration-300">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-100">{success}</AlertDescription>
          </Alert>
        )}

        {/* Main Scanner Card */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl mb-8">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                <Scan className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-2xl">Scan Machine QR Code</CardTitle>
                <CardDescription className="text-white/70">
                  Point your camera at a FitCode QR code to access machine information
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!scanning ? (
              <div className="text-center py-12">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-full shadow-2xl mx-auto w-fit">
                    <Camera className="h-16 w-16 text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Ready to Scan
                </h3>
                <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">
                  {cameraPermission === 'denied' 
                    ? 'Camera not available. You can upload an image with a QR code instead.'
                    : 'Make sure you have a FitCode QR code ready. Camera will be automatically selected.'
                  }
                </p>
                
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute -inset-1 from-blue-600 to-indigo-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <Button 
                      onClick={startScanning} 
                      size="lg"
                      disabled={isRequestingPermission}
                      className="relative bg-gradient-to-r from-orange-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-2xl transition-all duration-300 hover:scale-105 px-8 py-4 text-lg font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRequestingPermission ? (
                        <>
                          <GymLoader size="small" text="Requesting Camera..." variant="dumbbells" />
                        </>
                      ) : (
                        <>
                          <QrCode className="h-6 w-6 mr-3" />
                          Start Scanning
                          <Sparkles className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Upload Option - Show when camera is denied or as alternative */}
                  {(cameraPermission === 'denied' || showUploadOption) && (
                    <div className="relative group">
                      <div className="absolute -inset-1 from-green-600 to-emerald-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                      <Button 
                        onClick={triggerFileUpload}
                        size="lg"
                        disabled={isUploading}
                        className="relative bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-2xl transition-all duration-300 hover:scale-105 px-8 py-4 text-lg font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUploading ? (
                          <>
                            <GymLoader size="small" text="Processing Image..." variant="weights" />
                          </>
                        ) : (
                          <>
                            <Upload className="h-6 w-6 mr-3" />
                            Upload QR Image
                            <Image className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mt-12 max-w-md mx-auto">
                  <div className="text-center">
                    <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg mx-auto w-fit mb-2">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-white/60 text-sm">Fast Scan</p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg mx-auto w-fit mb-2">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-white/60 text-sm">Secure</p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl shadow-lg mx-auto w-fit mb-2">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-white/60 text-sm">Instant</p>
                  </div>
                </div>

                {/* Upload Instructions */}
                {(cameraPermission === 'denied' || showUploadOption) && (
                  <div className="mt-8 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <Image className="h-5 w-5 text-green-400" />
                      <h4 className="text-white font-semibold">Upload QR Image</h4>
                    </div>
                    <ul className="text-white/70 text-sm space-y-2">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>Take a clear photo of the QR code</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>Ensure good lighting and focus</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>Supported formats: JPEG, PNG, WebP</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-white font-medium">Scanning active</p>
                  </div>
                  <p className="text-white/70 text-sm mb-6">
                    Position the QR code within the scanning area below
                    <br />
                    <span className="text-xs text-white/50">
                      {navigator.userAgent.includes('Mobile') ? 'Back camera selected' : 'Camera automatically selected'}
                    </span>
                  </p>
                </div>
                
                {/* Scanner Container with Modern Styling */}
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-20"></div>
                  <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                    <div
                      id="qr-reader"
                      ref={scannerRef}
                      className="w-full min-h-[350px] rounded-2xl overflow-hidden"
                      style={{
                        // Hide unwanted HTML5 QR scanner UI elements
                        '--html5-qr-code-scanner-camera-selection-button': 'none',
                        '--html5-qr-code-scanner-permission-button': 'none',
                        '--html5-qr-code-scanner-scan-region-button': 'none'
                      }}
                    />
                    <style>{`
                      #qr-reader {
                        border: none !important;
                      }
                      #qr-reader__scan_region {
                        background: transparent !important;
                      }
                      #qr-reader__scan_region > img {
                        display: none !important;
                      }
                      #qr-reader__camera_selection {
                        display: none !important;
                      }
                      #qr-reader__dashboard {
                        display: none !important;
                      }
                      #qr-reader__dashboard_section {
                        display: none !important;
                      }
                      #qr-reader__dashboard_section_csr {
                        display: none !important;
                      }
                      #qr-reader__status_span {
                        display: none !important;
                      }
                      #qr-reader__camera_permission_button {
                        display: none !important;
                      }
                      #qr-reader__scan_region_scan_region_selection {
                        display: none !important;
                      }
                      #qr-reader__camera_permission_button {
                        display: none !important;
                      }
                      #qr-reader__scan_region_scan_region_selection {
                        display: none !important;
                      }
                      #qr-reader__scan_region_scan_region_selection_button {
                        display: none !important;
                      }
                      #qr-reader__scan_region_scan_region_selection_dialog {
                        display: none !important;
                      }
                    `}</style>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    onClick={stopScanning}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-xl transition-all duration-300 hover:scale-105"
                  >
                    <CameraOff className="h-4 w-4 mr-2" />
                    Stop Scanning
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Tips Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-xl hover:shadow-purple-500/10 transition-all duration-500 hover:scale-105">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-white text-lg">Scanning Tips</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Ensure good lighting for best results</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Hold device steady at arm's length</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Only FitCode QR codes are supported</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Try different angles if scanning fails</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-xl hover:shadow-purple-500/10 transition-all duration-500 hover:scale-105">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                  <Focus className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-white text-lg">What Happens Next?</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                  <span className="text-white/80 text-sm">QR code gets validated</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                  <span className="text-white/80 text-sm">Machine info loads instantly</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                  <span className="text-white/80 text-sm">Access guides, videos & AI help</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm mb-4">Need help or want to explore?</p>
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/client/dashboard')}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-xl transition-all duration-300 hover:scale-105"
            >
              <Dumbbell className="h-4 w-4 mr-2" />
              View Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-xl transition-all duration-300 hover:scale-105"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Refresh Scanner
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;

