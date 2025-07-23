import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import {
  ArrowLeft,
  Heart,
  Play,
  Shield,
  BookOpen,
  Globe,
  Bookmark,
  BookmarkCheck,
  Dumbbell,
  LogOut,
  Star,
  Clock,
  Users,
  Zap,
  CheckCircle,
  AlertTriangle,
  Loader2,
  MapPin,
  Phone,
  Info,
  AlertCircle,
  Lightbulb,
  Target,
  Activity,
  Sparkles,
  Award,
  TrendingUp
} from 'lucide-react';
import { clientAPI } from '../lib/api';
import { getUser, clearAuth } from '../lib/auth';
import GymLoader from './GymLoader';

const allSupportedLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'ar', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'or', 'pa', 'tr'];

const MachineInfo = ({ setAuthenticated, setUserType }) => {
  const { machineId } = useParams();
  const [user] = useState(getUser());
  const [machine, setMachine] = useState(null);
  const [gymInfo, setGymInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translateEnabledInstructions, setTranslateEnabledInstructions] = useState(false);
  const [translateLanguageInstructions, setTranslateLanguageInstructions] = useState('en');
  const [translateEnabledSafety, setTranslateEnabledSafety] = useState(false);
  const [translateLanguageSafety, setTranslateLanguageSafety] = useState('en');
  const [translatedInstructions, setTranslatedInstructions] = useState({});
  const [translatedSafety, setTranslatedSafety] = useState({});
  const [translatingInstructions, setTranslatingInstructions] = useState(false);
  const [translatingSafety, setTranslatingSafety] = useState(false);
  const [translationErrorInstructions, setTranslationErrorInstructions] = useState('');
  const [translationErrorSafety, setTranslationErrorSafety] = useState('');
  const [activeTab, setActiveTab] = useState('video');
  const navigate = useNavigate();

  useEffect(() => {
    loadMachineData();
  }, [machineId]);

  const loadMachineData = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getMachineDetails(machineId);
      const machineData = response.data.machine;
      setMachine(machineData);
      
      // Extract gym information from the machine response
      if (machineData?.gym) {
        const gym = machineData.gym;
        setGymInfo({
          id: gym.id,
          owner_id: gym.owner_id,
          name: gym.name,
          logo_url: gym.logo_url,
          contact_info: gym.contact_info,
          created_at: gym.created_at
        });
      } else {
        // Fallback gym info if gym data is not available
        setGymInfo({
          id: 'N/A',
          owner_id: 'N/A',
          name: 'Gym Name',
          logo_url: null,
          contact_info: 'Contact information not available',
          created_at: null
        });
      }
      
    } catch (error) {
      console.error('Failed to load machine information:', error);
      setError(error.response?.data?.message || 'Failed to load machine information');
      
      // Set fallback gym info on error
      setGymInfo({
        id: 'N/A',
        owner_id: 'N/A',
        name: 'Gym Name',
        logo_url: null,
        contact_info: 'Contact information not available',
        created_at: null
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    setAuthenticated(false);
    setUserType(null);
    navigate('/');
  };

  // Direct translation function that bypasses your backend
  const translateText = async (text, targetLang) => {
    if (!text || targetLang === 'en') return text;
    
    const languageMapping = {
      'hi': 'hi', 'mr': 'mr', 'bn': 'bn', 'ta': 'ta', 'te': 'te', 'gu': 'gu',
      'kn': 'kn', 'ml': 'ml', 'or': 'or', 'pa': 'pa', 'es': 'es', 'fr': 'fr',
      'de': 'de', 'it': 'it', 'pt': 'pt', 'zh': 'zh-cn', 'ja': 'ja', 'ko': 'ko',
      'ar': 'ar', 'tr': 'tr'
    };

    const mappedLang = languageMapping[targetLang] || targetLang;
    
    try {
      console.log(`Translating to ${mappedLang}:`, text.substring(0, 50) + '...');
      
      const googleResponse = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${mappedLang}&dt=t&q=${encodeURIComponent(text)}`
      );
      
      if (googleResponse.ok) {
        const googleData = await googleResponse.json();
        if (googleData && googleData[0] && googleData[0].length > 0) {
          let translatedText = '';
          for (let i = 0; i < googleData[0].length; i++) {
            if (googleData[0][i][0]) {
              translatedText += googleData[0][i][0];
            }
          }
          if (translatedText.trim()) {
            return translatedText;
          }
        }
      }
      
      const libreResponse = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text, source: 'en', target: mappedLang, format: 'text'
        })
      });
      
      if (libreResponse.ok) {
        const libreData = await libreResponse.json();
        if (libreData.translatedText) {
          return libreData.translatedText;
        }
      }
      
      throw new Error('Translation services failed');
      
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error(`Failed to translate to ${getLanguageName(targetLang)}. Please try again.`);
    }
  };

  // Translation effects
  useEffect(() => {
    const fetchTranslation = async () => {
      if (!translateEnabledInstructions || !machine?.usage_guide) {
        setTranslatedInstructions({});
        setTranslationErrorInstructions('');
        return;
      }
      
      const targetLang = translateLanguageInstructions;
      if (translatedInstructions[targetLang]) {
        setTranslationErrorInstructions('');
        return;
      }
      
      setTranslatingInstructions(true);
      setTranslationErrorInstructions('');
      
      try {
        const translated = await translateText(machine.usage_guide, targetLang);
        setTranslatedInstructions(prev => ({ ...prev, [targetLang]: translated }));
      } catch (error) {
        setTranslationErrorInstructions(error.message || 'Failed to translate instructions');
      } finally {
        setTranslatingInstructions(false);
      }
    };
    
    fetchTranslation();
  }, [translateEnabledInstructions, translateLanguageInstructions, machine]);

  useEffect(() => {
    const fetchTranslation = async () => {
      if (!translateEnabledSafety || !machine?.safety_tips) {
        setTranslatedSafety({});
        setTranslationErrorSafety('');
        return;
      }
      
      const targetLang = translateLanguageSafety;
      if (translatedSafety[targetLang]) {
        setTranslationErrorSafety('');
        return;
      }
      
      setTranslatingSafety(true);
      setTranslationErrorSafety('');
      
      try {
        const translated = await translateText(machine.safety_tips, targetLang);
        setTranslatedSafety(prev => ({ ...prev, [targetLang]: translated }));
      } catch (error) {
        setTranslationErrorSafety(error.message || 'Failed to translate safety information');
      } finally {
        setTranslatingSafety(false);
      }
    };
    
    fetchTranslation();
  }, [translateEnabledSafety, translateLanguageSafety, machine]);

  const handleBookmark = async () => {
    try {
      if (machine.is_bookmarked) {
        await clientAPI.removeBookmark(machineId);
        setSuccess('Bookmark removed');
        setMachine({ ...machine, is_bookmarked: false });
      } else {
        await clientAPI.bookmarkMachine(machineId);
        setSuccess('Machine bookmarked');
        setMachine({ ...machine, is_bookmarked: true });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update bookmark');
    }
  };

  const getAvailableLanguages = () => {
    const languages = machine?.multilingual_content ? 
      machine.multilingual_content.map(content => content.language_code) : [];
    const merged = [...new Set([...allSupportedLanguages, ...languages])];
    return merged;
  };

  const getLanguageName = (code) => {
    const languageNames = {
      'en': 'English', 'es': 'Español', 'fr': 'Français', 'de': 'Deutsch',
      'it': 'Italiano', 'pt': 'Português', 'zh': '中文', 'ja': '日本語',
      'ko': '한국어', 'ar': 'العربية', 'hi': 'हिन्दी', 'bn': 'বাংলা',
      'ta': 'தமிழ்', 'te': 'తెలుగు', 'mr': 'मराठी', 'gu': 'ગુજરાતી',
      'kn': 'ಕನ್ನಡ', 'ml': 'മലയാളം', 'or': 'ଓଡ଼ିଆ', 'pa': 'ਪੰਜਾਬੀ', 'tr': 'Türkçe'
    };
    return languageNames[code] || code.toUpperCase();
  };

  const isYouTubeUrl = (url) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const isGoogleDriveUrl = (url) => {
    if (!url) return false;
    return url.includes('drive.google.com');
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    return url;
  };

  const getGoogleDriveEmbedUrl = (url) => {
    if (!url) return '';
    let fileId = '';
    if (url.includes('/file/d/')) {
      const parts = url.split('/file/d/');
      fileId = parts[1].split('/')[0];
    } else if (url.includes('id=')) {
      const parts = url.split('id=');
      fileId = parts[1].split('&')[0];
    } else if (url.includes('/open?id=')) {
      const parts = url.split('/open?id=');
      fileId = parts[1].split('&')[0];
    }
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return url;
  };

  const getLocalVideoUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) {
      return path;
    }
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
    return `${apiBaseUrl}/${path}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <GymLoader size="xlarge" text="Loading machine details..." variant="video" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Alert className="max-w-md bg-red-500/10 border-red-500/20 backdrop-blur-xl">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-100">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Alert className="max-w-md bg-yellow-500/10 border-yellow-500/20 backdrop-blur-xl">
          <AlertTriangle className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-100">Machine not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center py-8 px-2">
      <div className="w-full max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl p-4 sm:p-8 flex flex-col gap-8 min-h-[600px]">
        {/* Top: Back and Bookmark Buttons */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleBookmark}
            className={`transition-all duration-300 hover:scale-105 hover:-translate-y-1 backdrop-blur-xl ${
              machine.is_bookmarked 
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/25' 
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
          >
            {machine.is_bookmarked ? (
              <BookmarkCheck className="h-4 w-4 mr-2" />
            ) : (
              <Bookmark className="h-4 w-4 mr-2" />
            )}
            Bookmark
          </Button>
        </div>
        {/* 1 & 2. Gym Branding/Info and FitCode Branding (left), Equipment Info (right) */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8 mb-4">
          {/* Left: Gym Branding/Info and FitCode Branding */}
          <div className="flex flex-col items-center sm:items-start gap-2 flex-1 min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="relative mb-2">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shadow-2xl">
                  {gymInfo.logo_url ? (
                    <img src={gymInfo.logo_url} alt={gymInfo.name} className="w-14 h-14 rounded-xl object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                      <Dumbbell className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full px-3 py-1 text-xs font-semibold text-white/90">
                  <Award className="h-4 w-4 text-purple-400" /> Premium Gym
                </span>
                <span className="text-lg font-black text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {gymInfo.name}
                </span>
                <span className="text-white/70 text-xs">Gym ID: {gymInfo.id} {gymInfo.created_at && <>• Established: {new Date(gymInfo.created_at).getFullYear()}</>}</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="flex items-center bg-white/10 rounded-lg px-2 py-1 text-xs text-white">
                    <Phone className="h-4 w-4 text-green-400 mr-1" />{gymInfo.contact_info}
                  </span>
                  <span className="flex items-center bg-white/10 rounded-lg px-2 py-1 text-xs text-white">
                    <MapPin className="h-4 w-4 text-blue-400 mr-1" />Visit us today!
                  </span>
                </div>
              </div>
            </div>
            
          </div>
          {/* Right: Equipment Info */}
          <div className="flex flex-col items-center sm:items-end gap-3 flex-1 min-w-[200px]">
            <span className="text-2xl font-black text-white bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {machine.name}
            </span>
            <span className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 px-4 py-2 text-sm font-bold shadow-lg rounded-full">
              {machine.category}
            </span>
            <span className="text-white/70 text-sm text-center sm:text-right max-w-xs">{machine.description}</span>
            
          </div>
        </div>
        {/* Tabs Section */}
        <div className="w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8 flex-1 flex flex-col">
            <div className="flex justify-center px-2 sm:px-4">
              <TabsList className="inline-flex h-12 sm:h-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-1 sm:p-2 shadow-2xl w-full sm:max-w-none overflow-x-auto min-w-max no-scrollbar">
                <TabsTrigger value="video" className="relative px-3 sm:px-6 md:px-8 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:scale-105 text-white/70 hover:text-white hover:bg-white/10 group flex-none">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Play className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:scale-110" />
                    <span className="font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap">Video Guide</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="instructions" className="relative px-3 sm:px-6 md:px-8 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:scale-105 text-white/70 hover:text-white hover:bg-white/10 group flex-none">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:scale-110" />
                    <span className="font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap">Instructions</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="safety" className="relative px-3 sm:px-6 md:px-8 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:scale-105 text-white/70 hover:text-white hover:bg-white/10 group flex-none">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:scale-110" />
                    <span className="font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap">Safety Tips</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>
            {/* Video Tab */}
            <TabsContent value="video" className="animate-in fade-in duration-500">
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                      <Play className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-xl">How to Use Video</CardTitle>
                      <CardDescription className="text-white/70">Watch this video to learn proper technique</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {machine.how_to_use_video_url ? (
                    <div className="aspect-video bg-black/50 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                      {isYouTubeUrl(machine.how_to_use_video_url) ? (
                        <iframe
                          src={getYouTubeEmbedUrl(machine.how_to_use_video_url)}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={`${machine.name} - How to Use`}
                        />
                      ) : isGoogleDriveUrl(machine.how_to_use_video_url) ? (
                        <iframe
                          src={getGoogleDriveEmbedUrl(machine.how_to_use_video_url)}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="autoplay"
                          title={`${machine.name} - How to Use`}
                        />
                      ) : (
                        <video src={getLocalVideoUrl(machine.how_to_use_video_url)} className="w-full h-full" controls title={`${machine.name} - How to Use`} />
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                      <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full w-fit mx-auto mb-4">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">No video available</h3>
                      <p className="text-white/70">Check the instructions tab for written guidance</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            {/* Instructions Tab */}
            <TabsContent value="instructions" className="animate-in fade-in duration-500 flex-1 flex flex-col min-h-[350px]">
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 flex-1 flex flex-col h-full">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
                    {/* Left: Icon, Title, Description */}
                    <div className="flex flex-row items-center gap-3 flex-1">
                      <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex-shrink-0">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg sm:text-xl">Usage Instructions</CardTitle>
                        <CardDescription className="text-white/70 text-xs sm:text-sm">Complete guide for using this machine safely and effectively</CardDescription>
                      </div>
                    </div>
                    {/* Right: Translate Button/Select */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                      <Button
                        size="sm"
                        onClick={() => {
                          if (translateEnabledInstructions) {
                            setTranslateEnabledInstructions(false);
                            setTranslateLanguageInstructions('en');
                          } else {
                            setTranslateEnabledInstructions(true);
                            setTranslateLanguageInstructions('hi');
                          }
                        }}
                        className={`w-full sm:w-auto transition-all duration-300 hover:scale-105 ${
                          translateEnabledInstructions 
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                            : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                        }`}
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        {translateEnabledInstructions ? "Original" : "Translate"}
                      </Button>
                      {translateEnabledInstructions && (
                        <select
                          className="w-full sm:w-auto bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                          value={translateLanguageInstructions}
                          onChange={(e) => setTranslateLanguageInstructions(e.target.value)}
                        >
                          {getAvailableLanguages().filter(lang => lang !== 'en').map((lang) => (
                            <option key={lang} value={lang} className="bg-slate-800 text-white">
                              {getLanguageName(lang)}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col h-full">
                  {translateEnabledInstructions ? (
                    translatingInstructions ? (
                      <div className="flex-1 w-full h-full flex items-center justify-center">
                        <span className="text-white/80 text-base">Translating...</span>
                      </div>
                    ) : translationErrorInstructions ? (
                      <div className="text-center py-16 bg-red-500/10 rounded-2xl border border-red-500/20">
                        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                        <p className="text-red-100 mb-4">{translationErrorInstructions}</p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          onClick={() => {
                            setTranslationErrorInstructions('');
                            setTranslatedInstructions(prev => {
                              const newState = { ...prev };
                              delete newState[translateLanguageInstructions];
                              return newState;
                            });
                          }}
                        >
                          Try Again
                        </Button>
                      </div>
                    ) : translatedInstructions[translateLanguageInstructions] ? (
                      <div className="prose prose-invert max-w-none bg-white/5 rounded-2xl p-6 border border-white/10 text-sm sm:text-base md:text-lg">
                        <div className="text-white/90 whitespace-pre-wrap leading-relaxed">
                          {translatedInstructions[translateLanguageInstructions]}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                        <Globe className="h-12 w-12 text-white/40 mx-auto mb-4" />
                        <p className="text-white/70">No translation available for {getLanguageName(translateLanguageInstructions)}</p>
                      </div>
                    )
                  ) : machine?.usage_guide ? (
                    <div className="prose prose-invert max-w-none bg-white/5 rounded-2xl p-6 border border-white/10 text-sm sm:text-base md:text-lg">
                      <div className="text-white/90 whitespace-pre-wrap leading-relaxed">
                        {machine?.usage_guide}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                      <BookOpen className="h-12 w-12 text-white/40 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">No instructions available</h3>
                      <p className="text-white/70">Check the video tab for visual guidance</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            {/* Safety Tab */}
            <TabsContent value="safety" className="animate-in fade-in duration-500 flex-1 flex flex-col min-h-[350px]">
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 flex-1 flex flex-col h-full">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
                    {/* Left: Icon, Title, Description */}
                    <div className="flex flex-row items-center gap-3 flex-1">
                      <div className="p-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex-shrink-0">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg sm:text-xl">Safety Information</CardTitle>
                        <CardDescription className="text-white/70 text-xs sm:text-sm">Important safety tips and precautions</CardDescription>
                      </div>
                    </div>
                    {/* Right: Translate Button/Select */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                      <Button
                        size="sm"
                        onClick={() => {
                          if (translateEnabledSafety) {
                            setTranslateEnabledSafety(false);
                            setTranslateLanguageSafety('en');
                          } else {
                            setTranslateEnabledSafety(true);
                            setTranslateLanguageSafety('hi');
                          }
                        }}
                        className={`w-full sm:w-auto transition-all duration-300 hover:scale-105 ${
                          translateEnabledSafety 
                            ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg' 
                            : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                        }`}
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        {translateEnabledSafety ? "Original" : "Translate"}
                      </Button>
                      {translateEnabledSafety && (
                        <select
                          className="w-full sm:w-auto bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                          value={translateLanguageSafety}
                          onChange={(e) => setTranslateLanguageSafety(e.target.value)}
                        >
                          {getAvailableLanguages().filter(lang => lang !== 'en').map((lang) => (
                            <option key={lang} value={lang} className="bg-slate-800 text-white">
                              {getLanguageName(lang)}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col h-full">
                  {translateEnabledSafety ? (
                    translatingSafety ? (
                      <div className="flex-1 w-full h-full flex items-center justify-center">
                        <span className="text-white/80 text-base">Translating...</span>
                      </div>
                    ) : translationErrorSafety ? (
                      <div className="text-center py-16 bg-red-500/10 rounded-2xl border border-red-500/20">
                        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                        <p className="text-red-100 mb-4">{translationErrorSafety}</p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          onClick={() => {
                            setTranslationErrorSafety('');
                            setTranslatedSafety(prev => {
                              const newState = { ...prev };
                              delete newState[translateLanguageSafety];
                              return newState;
                            });
                          }}
                        >
                          Try Again
                        </Button>
                      </div>
                    ) : translatedSafety[translateLanguageSafety] ? (
                      <div className="prose prose-invert max-w-none bg-orange-500/5 rounded-2xl p-6 border border-orange-500/20 text-sm sm:text-base md:text-lg">
                        <div className="text-white/90 whitespace-pre-wrap leading-relaxed">
                          {translatedSafety[translateLanguageSafety]}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                        <Globe className="h-12 w-12 text-white/40 mx-auto mb-4" />
                        <p className="text-white/70">No translation available for {getLanguageName(translateLanguageSafety)}</p>
                      </div>
                    )
                  ) : machine?.safety_tips ? (
                    <div className="prose prose-invert max-w-none bg-orange-500/5 rounded-2xl p-6 border border-orange-500/20 text-sm sm:text-base md:text-lg">
                      <div className="text-white/90 whitespace-pre-wrap leading-relaxed">
                        {machine?.safety_tips}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                      <Shield className="h-12 w-12 text-white/40 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">No safety information available</h3>
                      <p className="text-white/70">Always follow general gym safety guidelines</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        {/* Bottom: Powered by FitCode Branding */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center space-x-2 mb-1">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-75"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl shadow-lg">
                <Dumbbell className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              FitCode
            </span>
          </div>
          <p className="text-white/60 text-sm mb-0">Powered by <span className="font-semibold text-white/80">FitCode</span></p>
          <p className="text-white/40 text-xs mb-0">Premium Fitness Platform • Smart Gym Solutions</p>
          <div className="flex items-center space-x-2 mt-2 bg-gradient-to-r from-orange-600/20 to-indigo-600/20 border border-orange-500/30 rounded-full px-3 py-1">
            <Sparkles className="h-3 w-3 text-orange-400" />
            <span className="text-white/80 text-xs font-medium">AI-Powered</span>
          </div>
        </div>
      </div>
    </div>
    

    
  );
};

export default MachineInfo;

