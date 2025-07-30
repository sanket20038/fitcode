import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { marked } from 'marked';

import { 
  QrCode, 
  Bookmark, 
  History, 
  LogOut, 
  Dumbbell,
  Calendar,
  Heart,
  Activity,
  Download,
  Star,
  Clock,
  Users,
  Zap,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Play,
  BookOpen,
  Shield,
  Sparkles,
  TrendingUp,
  Award,
  Target,
  MapPin,
  Phone,
  Mail,
  Timer,
  BarChart3,
  Flame,
  Trophy
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { clientAPI } from '../lib/api';
import { getUser, clearAuth } from '../lib/auth';

import AskAIButton from './AskAIButton';
import GymLoader from './GymLoader';
import MuscleMap from './MuscleMap';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';

const ClientDashboard = ({ setAuthenticated, setUserType }) => {
  const [user] = useState(getUser());
  const [bookmarks, setBookmarks] = useState([]);
  const [scanHistory, setScanHistory] = useState([]);
  const [aiResponses, setAiResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Read tab query param to set default tab - AI Responses is now default
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'airesponses';
  const [tabValue, setTabValue] = useState(initialTab);

  // Load AI responses from localStorage on mount
  useEffect(() => {
    const storedResponses = JSON.parse(localStorage.getItem('aiResponses') || '[]');
    if (storedResponses.length > 0) {
      setAiResponses(storedResponses);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load bookmarks
      try {
        const bookmarksResponse = await clientAPI.getBookmarks();
        setBookmarks(bookmarksResponse.data.bookmarks);
      } catch (error) {
        console.error('Failed to load bookmarks:', error);
      }

      // Load scan history
      try {
        const historyResponse = await clientAPI.getScanHistory();
        setScanHistory(historyResponse.data.scan_history);
      } catch (error) {
        console.error('Failed to load scan history:', error);
      }

    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAiResponse = (response) => {
    setAiResponses([response]);
    localStorage.setItem('aiResponses', JSON.stringify([response]));
  };

  const handleLogout = () => {
    clearAuth();
    setAuthenticated(false);
    setUserType(null);
    window.location.href = '/';
  };

  const handleRemoveBookmark = async (machineId) => {
    try {
      await clientAPI.removeBookmark(machineId);
      setSuccess('Bookmark removed successfully');
      loadData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to remove bookmark');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const scanDate = new Date(dateString);
    const diffInHours = Math.floor((now - scanDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

const exportToPDF = async (aiResponses) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Process each response separately to avoid cutoff
    for (let i = 0; i < aiResponses.length; i++) {
      const response = aiResponses[i];
      
      // Create iframe for each response
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.width = '210mm'; // A4 width
      iframe.style.height = 'auto';
      
      document.body.appendChild(iframe);
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 14px;
              line-height: 1.6;
              color: #333333;
              background-color: #ffffff;
              margin: 0;
              padding: 20px;
              width: 170mm; /* A4 width minus margins */
              box-sizing: border-box;
            }
            .response-title {
              font-size: 18px;
              font-weight: bold;
              color: #1f2937;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 8px;
              margin-bottom: 15px;
            }
            .response-content {
              line-height: 1.8;
            }
            h1, h2, h3, h4, h5, h6 {
              margin-top: 20px;
              margin-bottom: 10px;
              font-weight: bold;
            }
            h1 { font-size: 24px; color: #1f2937; }
            h2 { font-size: 20px; color: #374151; }
            h3 { font-size: 18px; color: #4b5563; }
            p { margin-bottom: 12px; }
            ul, ol { margin-bottom: 15px; padding-left: 25px; }
            li { margin-bottom: 5px; }
            strong { font-weight: bold; color: #1f2937; }
            em { font-style: italic; }
          </style>
        </head>
        <body>
          <div class="response-title">Response ${i + 1}:</div>
          <div class="response-content">${marked(response)}</div>
        </body>
        </html>
      `;
      
      const iframeDoc = iframe.contentDocument;
      iframeDoc.write(htmlContent);
      iframeDoc.close();
      
      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Capture this response
      const canvas = await html2canvas(iframeDoc.body, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: iframeDoc.body.scrollWidth,
        height: iframeDoc.body.scrollHeight
      });
      
      document.body.removeChild(iframe);
      
      // Add to PDF - each response starts on a new page
      if (i > 0) {
        pdf.addPage();
      }
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pdfWidth - 20; // 10mm margin each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // If content is too tall for one page, split it
      if (imgHeight > pdfHeight - 20) {
        const pageContentHeight = pdfHeight - 20;
        const totalPages = Math.ceil(imgHeight / pageContentHeight);
        
        for (let page = 0; page < totalPages; page++) {
          if (page > 0) {
            pdf.addPage();
          }
          
          const sourceY = (page * pageContentHeight * canvas.height) / imgHeight;
          const sourceHeight = Math.min(
            (pageContentHeight * canvas.height) / imgHeight,
            canvas.height - sourceY
          );
          
          // Create a temporary canvas for this page section
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = sourceHeight;
          const pageCtx = pageCanvas.getContext('2d');
          
          pageCtx.drawImage(
            canvas,
            0, sourceY, canvas.width, sourceHeight,
            0, 0, canvas.width, sourceHeight
          );
          
          const pageImgData = pageCanvas.toDataURL('image/png');
          const pageImgHeight = (sourceHeight * imgWidth) / canvas.width;
          
          pdf.addImage(pageImgData, 'PNG', 10, 10, imgWidth, pageImgHeight);
        }
      } else {
        // Content fits on one page
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      }
    }
    
    pdf.save('ai_responses.pdf');
    
  } catch (error) {
    console.error('PDF generation failed:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <GymLoader size="xlarge" text="Loading your dashboard..." variant="video" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 relative dashboard-container">
      {/* Modern Header with Glassmorphism */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-2xl"
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          zIndex: 50,
          backdropFilter: 'blur(16px)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          minHeight: '60px',
          width: '100%'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo and App Name */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-2xl shadow-xl">
                <Dumbbell className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                FitCode
              </h1>
              <p className="text-white/60 text-xs sm:text-sm font-medium">Premium Fitness Platform</p>
            </div>
            
          </div>
          {/* Welcome and Logout */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="text-right">
              <span className="block text-white/60 text-xs sm:text-sm">Welcome back,</span>
              <span className="block text-white font-bold text-base sm:text-lg break-all">{user?.username}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 border-none text-white font-bold shadow-lg hover:from-pink-600 hover:to-yellow-500 hover:scale-105 active:scale-95 transition-all duration-300 px-4 py-1 text-xs sm:text-sm rounded-xl drop-shadow-lg"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8" style={{ paddingTop: '80px' }}>
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

        {/* Hero Section with QR Scanner */}
        <div className="text-center mb-16 mt-10">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Fitness Journey
            </h2>
            <p className="text-lg sm:text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed px-4">
              Scan machine QR codes, access personalized workouts, and track your progress with AI-powered insights
            </p>
            
            {/* Modern Hexagonal QR Scanner */}
            <div className="flex justify-center px-4">
              <div 
                onClick={() => navigate('/client/scanner')}
                className="group relative cursor-pointer"
              >
                {/* Hexagonal background */}
                <div className="relative w-64 sm:w-72 md:w-80 h-32 sm:h-36 md:h-40">
                  {/* Outer hexagon glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                  
                  {/* Main hexagon container */}
                  <div className="relative bg-gradient-to-br from-slate-900 via-purple-900/50 to-cyan-900/50 backdrop-blur-xl border border-white/20 rounded-full p-4 sm:p-6 md:p-8 shadow-2xl hover:shadow-cyan-400/30 transition-all duration-500 hover:scale-105">
                    
                    {/* Inner scanning area */}
                    <div className="relative w-full h-full bg-black/60 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center">
                      
                      {/* Rotating ring */}
                      {/* <div className="absolute inset-2 sm:inset-3 md:inset-4 border-2 border-cyan-400/50 rounded-full animate-spin-slow"></div> */}
                      
                      {/* Center QR icon */}
                      <div className="relative z-10 bg-gradient-to-r from-cyan-400 to-purple-500 p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl shadow-2xl group-hover:scale-110 transition-transform duration-300">
                        <QrCode className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-black" />
                      </div>
                      
                      {/* Scanning particles */}
                      <div className="absolute inset-0">
                        <div className="absolute top-4 sm:top-6 md:top-8 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-ping"></div>
                        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-ping delay-300"></div>
                        <div className="absolute left-4 sm:left-6 md:left-8 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-ping delay-150"></div>
                        <div className="absolute right-4 sm:right-6 md:right-8 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-ping delay-450"></div>
                      </div>
                      
                      {/* Scanning wave */}
                      <div className="absolute inset-0 rounded-full">
                        <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-ping"></div>
                        <div className="absolute inset-2 sm:inset-3 md:inset-4 border-2 border-purple-400/30 rounded-full animate-ping delay-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Text below */}
                <div className="mt-4 sm:mt-6 text-center">
                  <div className="text-white font-black text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">
                    <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">SCAN</span> QR
                  </div>
                  <div className="text-cyan-400 text-xs sm:text-sm font-medium">Tap to access equipment guides</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 mb-20 text-center">
  <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white/90 tracking-wide mb-2 px-4">
    Want to train smarter?
  </h2>
  <p className="text-white/60 max-w-xl mx-auto text-base sm:text-lg mb-6 px-4">
  Explore our interactive muscle map to discover machine-specific exercises, complete with how-to videos, multilingual instructions, and safety tips — designed to guide users of all backgrounds.
</p>


  <Dialog>
    <DialogTrigger asChild>
      <Button
        className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-xl hover:scale-105 transition-transform duration-300"
      >
        🔍 Explore Muscle Map
      </Button>
    </DialogTrigger>

    <DialogContent
      className="w-full max-w-[95vw] h-full max-h-[95vh] rounded-2xl p-0 bg-gradient-to-br from-white/80 via-white/60 to-purple-100/80 dark:from-gray-900/90 dark:via-gray-800/80 dark:to-purple-900/80 backdrop-blur-2xl shadow-2xl border-0 animate-fade-in overflow-y-auto overflow-x-hidden grid grid-cols-2 gap-0"
      style={{
        alignItems: 'stretch',
        justifyItems: 'stretch',
      }}
    >
      {/* Left: Muscle Map */}
      <div className="flex justify-center items-center p-6 bg-gradient-to-b from-purple-50/60 to-white/0 dark:from-purple-900/40 dark:to-gray-900/0">
        <div className="w-full flex items-center justify-center">
          <MuscleMap />
        </div>
      </div>

      {/* Right: Info & Tips */}
      <div className="flex flex-col justify-center items-center p-6 bg-gradient-to-b from-pink-50/60 to-white/0 dark:from-pink-900/40 dark:to-gray-900/0 text-center">
      <div className="flex items-center gap-3 mb-5 px-4 py-2 rounded-xl bg-white/5 border border-pink-400/30 shadow-inner backdrop-blur-md">
  <div className="flex items-center justify-center bg-pink-500/20 rounded-full p-1.5">
    <Sparkles className="h-4 w-4 text-pink-600 animate-pulse" />
  </div>
  <p className="text-sm sm:text-base text-pink-600nt-medium">
    <span className="font-semibold text-pink-400">Pro Tip:</span> Tap any muscle to view exercises, videos, and safety tips.
  </p>
</div>




        <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
          Muscle Map Overview
        </DialogTitle>

        <DialogDescription className="text-gray-700 dark:text-gray-300 max-w-lg text-base sm:text-lg mb-4">
        See all muscle groups and related exercises.
        </DialogDescription>

        <div className="w-full border-t border-purple-200/60 dark:border-purple-700/40 my-4"></div>

        <p className="text-purple-700 dark:text-purple-200 text-base sm:text-lg font-medium">
          💪 Every rep has a reason. Explore with purpose!
        </p>
      </div>
    </DialogContent>
  </Dialog>
</div>


        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-xl hover:shadow-orange-500/10 transition-all duration-500 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{aiResponses.length}</h3>
                  <p className="text-white/70 font-medium">AI Responses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-xl hover:shadow-green-500/10 transition-all duration-500 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-lg">
                  <Bookmark className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{bookmarks.length}</h3>
                  <p className="text-white/70 font-medium">Bookmarked Machines</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                  <History className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{scanHistory.length}</h3>
                  <p className="text-white/70 font-medium">Total Scans</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Modern Tabs - Responsive */}
        <Tabs value={tabValue} onValueChange={setTabValue} className="space-y-8">
          <div className="flex justify-center px-2 sm:px-4">
            <TabsList className="inline-flex h-12 sm:h-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-1 sm:p-2 shadow-2xl w-full max-w-full overflow-hidden">
              <TabsTrigger 
                value="airesponses"
                className="relative px-2 sm:px-4 md:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:scale-105 text-white/70 hover:text-white hover:bg-white/10 group flex-1"
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="relative">
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute -top-1 -right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <span className="font-semibold text-xs sm:text-sm md:text-base">AI Responses</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl sm:rounded-2xl blur-xl opacity-0 data-[state=active]:opacity-100 transition-opacity duration-500"></div>
              </TabsTrigger>
              
              <TabsTrigger 
                value="bookmarks" 
                className="relative px-2 sm:px-4 md:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:scale-105 text-white/70 hover:text-white hover:bg-white/10 group flex-1"
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="relative">
                    <Bookmark className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute -top-1 -right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <span className="font-semibold text-xs sm:text-sm md:text-base">Bookmarks</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl sm:rounded-2xl blur-xl opacity-0 data-[state=active]:opacity-100 transition-opacity duration-500"></div>
              </TabsTrigger>
              
              <TabsTrigger 
                value="history"
                className="relative px-2 sm:px-4 md:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:scale-105 text-white/70 hover:text-white hover:bg-white/10 group flex-1"
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="relative">
                    <History className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute -top-1 -right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <span className="font-semibold text-xs sm:text-sm md:text-base">Scan History</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl sm:rounded-2xl blur-xl opacity-0 data-[state=active]:opacity-100 transition-opacity duration-500"></div>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* AI Responses Tab - Now First */}
          <TabsContent value="airesponses" className="animate-in fade-in duration-500 w-full max-w-full">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl w-full max-w-full">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 w-full">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg">
                      <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg sm:text-xl md:text-2xl">AI Responses</CardTitle>
                      <CardDescription className="text-white/70 text-sm sm:text-base">Your personalized AI fitness guidance</CardDescription>
                    </div>
                  </div>
                  {aiResponses.length > 0 && (
                    <Button
                      onClick={() => exportToPDF(aiResponses)}
                      className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto text-sm sm:text-base"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {aiResponses.length > 0 ? (
                  <div className="flex flex-col gap-4 sm:gap-6 w-full">
                    {aiResponses.map((response, index) => (
                      <Card 
                        key={index} 
                        className="bg-white/5 border-white/10 backdrop-blur-xl hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 w-full"
                      >
                        <CardHeader className="p-4 sm:p-6">
                          <CardTitle className="text-white text-base sm:text-lg flex items-center space-x-2">
                            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
                            <span>AI Response {index + 1}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6">
                          <div className="prose prose-invert max-w-none">
                            <ReactMarkdown className="text-white/90 leading-relaxed text-sm sm:text-base">
                              {response}
                            </ReactMarkdown>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-16">
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-full w-fit mx-auto mb-4">
                      <Zap className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No AI responses yet</h3>
                    <p className="text-white/70 mb-4 sm:mb-6 text-sm sm:text-base">Ask the AI assistant for personalized fitness guidance</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookmarks Tab - Now Second */}
          <TabsContent value="bookmarks" className="animate-in fade-in duration-500 w-full max-w-full">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl w-full max-w-full">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 w-full">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
                      <Bookmark className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg sm:text-xl md:text-2xl">Bookmarked Machines</CardTitle>
                      <CardDescription className="text-white/70 text-sm sm:text-base">Your saved machines for quick access</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {bookmarks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
                    {bookmarks.map((bookmark) => (
                      <Card 
                        key={bookmark.id} 
                        className="bg-white/5 border-white/10 backdrop-blur-xl hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 hover:scale-105 group w-full"
                      >
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2 w-full">
                            <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-green-400 transition-colors">
                              {bookmark.machine.name}
                            </h3>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveBookmark(bookmark.machine_id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Heart className="h-4 w-4 fill-current" />
                            </Button>
                          </div>
                          <p className="text-white/70 text-xs sm:text-sm mb-3 sm:mb-4">{bookmark.gym?.name}</p>
                          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                            {bookmark.machine.how_to_use_video_url && (
                              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                                <Play className="h-3 w-3 mr-1" />
                                Video
                              </Badge>
                            )}
                            {bookmark.machine.usage_guide && (
                              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                                <BookOpen className="h-3 w-3 mr-1" />
                                Guide
                              </Badge>
                            )}
                            {bookmark.machine.safety_tips && (
                              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Safety
                              </Badge>
                            )}
                          </div>
                          <Button
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                            onClick={() => navigate(`/machine/${bookmark.machine_id}`)}
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-16">
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full w-fit mx-auto mb-4">
                      <Bookmark className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No bookmarks yet</h3>
                    <p className="text-white/70 mb-4 sm:mb-6 text-sm sm:text-base">Start bookmarking machines to see them here</p>
                    <Button
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm sm:text-base"
                      onClick={() => navigate('/client/scanner')}
                    >
                      Scan a Machine
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scan History Tab - Now Third with Enhanced Responsive UI */}
          <TabsContent value="history" className="animate-in fade-in duration-500 w-full max-w-full">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl w-full max-w-full">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 w-full">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                      <History className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg sm:text-xl md:text-2xl">Scan History</CardTitle>
                      <CardDescription className="text-white/70 text-sm sm:text-base">Your recent machine scans and activity</CardDescription>
                    </div>
                  </div>
                  {scanHistory.length > 0 && (
                    <div className="flex items-center space-x-2 text-white/60 text-xs sm:text-sm">
                      <BarChart3 className="h-4 w-4" />
                      <span>{scanHistory.length} total scans</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {scanHistory.length > 0 ? (
                  <div className="flex flex-col gap-3 sm:gap-4 w-full">
                    {scanHistory.map((scan, index) => (
                      <Card 
                        key={scan.id} 
                        className="bg-white/5 border-white/10 backdrop-blur-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] group w-full"
                      >
                        <CardContent className="p-3 sm:p-4 md:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 w-full">
                            {/* Left side - Machine info */}
                            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-1 min-w-0">
                              <div className="relative flex-shrink-0">
                                <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                                  <Dumbbell className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                  {index + 1}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0 pr-2">
                                <h3 className="font-bold text-sm sm:text-base lg:text-lg text-white group-hover:text-blue-400 transition-colors mb-1 break-words leading-tight">
                                  {scan.machine.name}
                                </h3>
                                <div className="flex flex-col space-y-1 text-white/70 text-xs sm:text-sm">
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>{scan.gym?.name}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{getTimeAgo(scan.scanned_at)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* Right side - View Details Button */}
                            <Button
                              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base mt-2 sm:mt-0"
                              onClick={() => navigate(`/machine/${scan.machine_id}`)}
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-16">
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full w-fit mx-auto mb-4">
                      <History className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No scan history yet</h3>
                    <p className="text-white/70 mb-4 sm:mb-6 text-sm sm:text-base">Start scanning machines to see your activity here</p>
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm sm:text-base"
                      onClick={() => navigate('/client/scanner')}
                    >
                      Scan a Machine
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* AI Assistant Button */}
      <AskAIButton onResponse={handleAiResponse} />
    </div>
  );
};

export default ClientDashboard;

