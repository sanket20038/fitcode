import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { marked } from 'marked';
import { 
  User, 
  Venus, 
  Ruler, 
  Weight, 
  Target, 
  Dumbbell, 
  Zap, 
  Sparkles,
  Bot,
  Flame,
  TrendingUp,
  X,
  FileText,
  Check
} from 'lucide-react';

// Simple mobile detection hook
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

const AskAIButton = ({ onResponse }) => {
  const [open, setOpen] = useState(false);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [allergies, setAllergies] = useState('');
  const [mealsPerDay, setMealsPerDay] = useState('');
  const [dailyRoutine, setDailyRoutine] = useState('');
  const [dietGoal, setDietGoal] = useState('');
  const [workoutGoal, setWorkoutGoal] = useState('');
  const [workoutPlan, setWorkoutPlan] = useState('');
  const [workoutToday, setWorkoutToday] = useState('');
  const [dietType, setDietType] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [availableEquipment, setAvailableEquipment] = useState('');
  const [workoutDaysTimes, setWorkoutDaysTimes] = useState('');
  const [injuriesLimitations, setInjuriesLimitations] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState('diet');
  const [language, setLanguage] = useState('en');
  const [showResponsePopup, setShowResponsePopup] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleSubmit = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setResponse('Gemini AI API key is missing. Please configure it in environment variables.');
      setShowResponsePopup(true);
      return;
    }

    // Enhanced validation based on selected tab
    if (tabValue === 'diet') {
      // Validate diet-specific required fields
      if (!age || isNaN(age) || age <= 0) {
        setResponse('Please enter a valid positive number for Age.');
        setShowResponsePopup(true);
        return;
      }
      if (!height || isNaN(height) || height <= 0) {
        setResponse('Please enter a valid positive number for Height.');
        setShowResponsePopup(true);
        return;
      }
      if (!weight || isNaN(weight) || weight <= 0) {
        setResponse('Please enter a valid positive number for Weight.');
        setShowResponsePopup(true);
        return;
      }
      if (!dietGoal || dietGoal.trim() === '') {
        setResponse('Please enter your Diet Goal.');
        setShowResponsePopup(true);
        return;
      }
      if (!dietType || dietType.trim() === '') {
        setResponse('Please select your Diet Type.');
        setShowResponsePopup(true);
        return;
      }
      if (!activityLevel || activityLevel.trim() === '') {
        setResponse('Please select your Activity Level.');
        setShowResponsePopup(true);
        return;
      }
    } else if (tabValue === 'workout') {
      // Validate workout-specific required fields
      if (!workoutGoal || workoutGoal.trim() === '') {
        setResponse('Please enter your Workout Goal.');
        setShowResponsePopup(true);
        return;
      }
      if (!fitnessLevel || fitnessLevel.trim() === '') {
        setResponse('Please select your Fitness Level.');
        setShowResponsePopup(true);
        return;
      }
      // Removed availableEquipment validation as it's not required
    }

    setLoading(true);
    setResponse('');
    try {
      let prompt = '';
      if (tabValue === 'diet') {
        // Build diet prompt with only filled fields
        const dietFields = [];
        if (age) dietFields.push(`Age:${age}`);
        if (gender) dietFields.push(`Gender:${gender}`);
        if (height) dietFields.push(`Height:${height}cm`);
        if (weight) dietFields.push(`Weight:${weight}kg`);
        if (dietGoal) dietFields.push(`Goal:${dietGoal}`);
        if (dietType) dietFields.push(`Diet:${dietType}`);
        if (activityLevel) dietFields.push(`Activity:${activityLevel}`);
        if (medicalConditions) dietFields.push(`Medical:${medicalConditions}`);
        if (allergies) dietFields.push(`Allergies:${allergies}`);
        if (mealsPerDay) dietFields.push(`Meals:${mealsPerDay}`);
        if (dailyRoutine) dietFields.push(`Routine:${dailyRoutine}`);

        prompt = `Fitcode AI Nutrition. ${language}. Diet only.
${dietFields.join(', ')}.
Give: 1)BMI/calories 2)7-day plan 3)Shopping 4)Cooking 5)Progress 6)Medical
Indian cuisine, local ingredients.

IMPORTANT: You are ONLY a nutrition/diet assistant. If the user asks for anything other than diet/nutrition advice, respond with: "I am a FitCode AI Nutrition Assistant. I can only help with diet plans, meal suggestions, and nutrition advice. For workout plans, please use the workout tab."`;
      } else if (tabValue === 'workout') {
        // Build workout prompt with only filled fields
        const workoutFields = [];
        if (workoutGoal) workoutFields.push(`Goal:${workoutGoal}`);
        if (workoutPlan) workoutFields.push(`Plan:${workoutPlan}`);
        if (workoutToday) workoutFields.push(`Today:${workoutToday}`);
        if (fitnessLevel) workoutFields.push(`Level:${fitnessLevel}`);
        if (injuriesLimitations) workoutFields.push(`Limits:${injuriesLimitations}`);

        prompt = `Fitcode AI Fitness. ${language}. Workout only.
${workoutFields.join(', ')}.
Give: 1)Workout 2)Form 3)Videos 4)Warm/cool 5)Progress 6)Medical
Mods: beginner/advanced. Form>intensity.

IMPORTANT: You are ONLY a fitness/workout assistant. If the user asks for anything other than workout/fitness advice, respond with: "I am a FitCode AI Fitness Assistant. I can only help with workout plans, exercise guidance, and fitness advice. For nutrition plans, please use the diet tab."`;
      }

      const ai = new GoogleGenAI({ apiKey });

      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        generationConfig: {
          maxOutputTokens: 1000, // Limit response length to save tokens
          temperature: 0.7, // Balanced creativity
          topP: 0.9, // Focus on most relevant responses
          topK: 40 // Limit token selection for efficiency
        }
      });

      let reply = result.text || 'No response from Gemini AI.';
      // Remove asterisks from response
      try {
        const jsonResponse = JSON.parse(reply);
        // Convert JSON object fields to plain text string
        let plainText = '';
        if (jsonResponse.dietPlan) {
          plainText += 'Diet Plan:\n' + jsonResponse.dietPlan.replace(/\*/g, '') + '\n\n';
        }
        if (jsonResponse.workoutPlan) {
          plainText += 'Workout Plan:\n' + jsonResponse.workoutPlan.replace(/\*/g, '') + '\n\n';
        }
        if (jsonResponse.recommendations) {
          plainText += 'Recommendations:\n' + jsonResponse.recommendations.replace(/\*/g, '') + '\n\n';
        }
        // Add fixed output message
        plainText += '---\nThis plan is generated by FitCode AI assistant.';
        reply = plainText.trim();
      } catch (e) {
        // If parsing fails, keep original reply
      }

      setResponse(reply);
      if (onResponse) {
        onResponse(reply);
      }
      setLoading(false);
      console.log('AI response:', reply);
      // Save AI response to localStorage
      localStorage.setItem('aiResponses', JSON.stringify([reply]));
      // Show response popup - no automatic navigation
      setShowResponsePopup(true);
    } catch (error) {
      setResponse('Failed to get AI response. Please try again.');
      setLoading(false);
      setShowResponsePopup(true);
    }
  };

  const exportToPDF = async () => {
    setPdfLoading(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Create iframe for the response
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
          <div class="response-title">${tabValue === 'diet' ? 'Diet Plan' : 'Workout Plan'}:</div>
          <div class="response-content">${marked(response)}</div>
        </body>
        </html>
      `;
      
      const iframeDoc = iframe.contentDocument;
      iframeDoc.write(htmlContent);
      iframeDoc.close();
      
      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Capture the response
      const canvas = await html2canvas(iframeDoc.body, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: iframeDoc.body.scrollWidth,
        height: iframeDoc.body.scrollHeight
      });
      
      document.body.removeChild(iframe);
      
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
      
      pdf.save(`${tabValue === 'diet' ? 'diet' : 'workout'}_plan.pdf`);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <>
      {/* Enhanced Gym-Inspired AI Button */}
      <div className="fixed bottom-6 right-4 z-50">
        <div className="relative group">
          {/* Animated energy aura */}
          <div className={`absolute ${isMobile ? '-inset-1' : '-inset-2'} bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-90 animate-pulse transition duration-1000`}></div>
          
          {/* Main button container */}
          <button
            onClick={() => {
              setOpen(true);
              if (isMobile) setShowTooltip(true);
            }}
            className={`relative flex items-center space-x-3 bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 rounded-2xl shadow-2xl transition-all duration-300 group-hover:shadow-orange-500/50 backdrop-blur-xl border border-orange-400/30
              ${isMobile ? 'px-3 py-2 text-xs' : 'px-5 py-4 text-base'}
              ${isMobile ? '' : 'hover:scale-105 hover:-translate-y-2'}`}
            aria-label="Ask AI for Diet & Workout Plan"
            onMouseEnter={() => !isMobile && setShowTooltip(true)}
            onMouseLeave={() => !isMobile && setShowTooltip(false)}
          >
            
            {/* Gym icon with power effect */}
            <div className="relative">
              <div className={`bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-all duration-300 ${isMobile ? 'p-1' : 'p-3'}`}>
                <Bot className={`text-white transition-all duration-300 ${isMobile ? 'h-5 w-5' : 'h-7 w-7'} group-hover:scale-110 group-hover:rotate-12`} />
              </div>
              
              {/* Power indicator */}
              <div className={`absolute -top-1 -right-1 ${isMobile ? 'w-2 h-2' : 'w-4 h-4'} bg-gradient-to-r from-green-400 to-lime-400 rounded-full animate-ping`}></div>
              <div className={`absolute -top-1 -right-1 ${isMobile ? 'w-2 h-2' : 'w-4 h-4'} bg-gradient-to-r from-green-400 to-lime-400 rounded-full flex items-center justify-center`}>
                <Zap className={`${isMobile ? 'h-1 w-1' : 'h-2 w-2'} text-white`} />
              </div>
            </div>
            
            {/* Motivational text */}
            <div className="text-left">
              <div className={`text-white font-black tracking-wide flex items-center space-x-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                <Dumbbell className={isMobile ? 'h-3 w-3' : 'h-4 w-4'} />
                <span>AI TRAINER</span>
              </div>
              <div className={`text-orange-100 font-bold ${isMobile ? 'text-[10px]' : 'text-xs'}`}>GET FIT NOW!</div>
            </div>
            
            {/* Energy particles */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div className={`absolute top-2 left-4 ${isMobile ? 'w-1 h-1' : 'w-1.5 h-1.5'} bg-yellow-300 rounded-full animate-ping`} style={{ animationDelay: '0s' }}></div>
              <div className={`absolute top-5 right-5 ${isMobile ? 'w-0.5 h-0.5' : 'w-1 h-1'} bg-orange-300 rounded-full animate-ping`} style={{ animationDelay: '0.3s' }}></div>
              <div className={`absolute bottom-4 left-7 ${isMobile ? 'w-1 h-1' : 'w-1.5 h-1.5'} bg-red-300 rounded-full animate-ping`} style={{ animationDelay: '0.6s' }}></div>
              <div className={`absolute bottom-2 right-8 ${isMobile ? 'w-0.5 h-0.5' : 'w-1 h-1'} bg-yellow-400 rounded-full animate-ping`} style={{ animationDelay: '0.9s' }}></div>
              <div className={`absolute top-3 left-12 ${isMobile ? 'w-0.5 h-0.5' : 'w-1 h-1'} bg-orange-400 rounded-full animate-ping`} style={{ animationDelay: '1.2s' }}></div>
            </div>
            
            {/* Strength bars animation */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-0.5">
              <div className={`${isMobile ? 'w-0.5 h-2' : 'w-0.5 h-3'} bg-white/60 rounded-full animate-pulse`} style={{ animationDelay: '0s' }}></div>
              <div className={`${isMobile ? 'w-0.5 h-2.5' : 'w-0.5 h-4'} bg-white/70 rounded-full animate-pulse`} style={{ animationDelay: '0.2s' }}></div>
              <div className={`${isMobile ? 'w-0.5 h-3' : 'w-0.5 h-5'} bg-white/80 rounded-full animate-pulse`} style={{ animationDelay: '0.4s' }}></div>
              <div className={`${isMobile ? 'w-0.5 h-2.5' : 'w-0.5 h-4'} bg-white/70 rounded-full animate-pulse`} style={{ animationDelay: '0.6s' }}></div>
              <div className={`${isMobile ? 'w-0.5 h-2' : 'w-0.5 h-3'} bg-white/60 rounded-full animate-pulse`} style={{ animationDelay: '0.8s' }}></div>
            </div>
          </button>
          
          {/* Motivational tooltip */}
          {(showTooltip || isMobile) && (
            <div className="absolute bottom-full right-0 mb-3 opacity-100 transition-all duration-300 transform translate-y-0">
              <div className={`bg-gradient-to-r from-orange-600 to-red-600 backdrop-blur-xl border border-orange-400/30 rounded-xl shadow-2xl text-white font-bold whitespace-nowrap
                ${isMobile ? 'px-2 py-1 text-[10px] min-w-[120px]' : 'px-4 py-3 text-sm'}`}>
                <div className={`flex items-center space-x-1 ${isMobile ? '' : 'space-x-2'}`}>
                  <Target className={`${isMobile ? 'h-2 w-2' : 'h-4 w-4'} text-yellow-300`} />
                  <span className={`${isMobile ? 'text-[10px]' : ''}`}>Your AI Fitness Coach</span>
                </div>
                <div className={`text-orange-200 mt-1 ${isMobile ? 'text-[9px]' : 'text-xs'}`}>Ready to transform your body? 🔥</div>
                <div className={`absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-orange-600 ${isMobile ? 'scale-75' : ''}`}></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-lg sm:max-w-md md:max-w-lg rounded-xl shadow-2xl border border-gray-300 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-2 sm:p-4 md:p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent flex items-center space-x-2">
              <Flame className="h-6 w-6 text-orange-400" />
              <span>AI Fitness Coach</span>
            </DialogTitle>
          </DialogHeader>

          <Tabs value={tabValue} onValueChange={setTabValue} className="mt-4">
            <TabsList className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-1">
              <TabsTrigger 
                value="diet" 
                className="text-white font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-md transition-all duration-300"
              >
                🥗 Diet Plan
              </TabsTrigger>
              <TabsTrigger 
                value="workout" 
                className="text-white font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white rounded-md transition-all duration-300"
              >
                💪 Workout Plan
              </TabsTrigger>
            </TabsList>

            <TabsContent value="diet" className="mt-4 pr-2">
              <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                  <User className="text-white h-3 w-3 sm:h-4 sm:w-4" />
                </div>
                <Input
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg p-2 sm:p-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-xl"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg">
                  <Venus className="text-white h-4 w-4" />
                </div>
                <Input
                  placeholder="Gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg p-2 sm:p-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-xl"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg">
                  <Ruler className="text-white h-4 w-4" />
                </div>
                <Input
                  placeholder="Height (cm)"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg p-2 sm:p-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-xl"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg">
                  <Weight className="text-white h-4 w-4" />
                </div>
                <Input
                  placeholder="Weight (kg)"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg p-2 sm:p-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-xl"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg">
                  <Target className="text-white h-4 w-4" />
                </div>
                <Input
                  placeholder="Diet Goal (e.g. weight loss, muscle gain)"
                  value={dietGoal}
                  onChange={(e) => setDietGoal(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg p-2 sm:p-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-xl"
                />
              </div>
              <div className="flex gap-3 w-full flex-col sm:flex-row">
                {/* Activity Level */}
                <div className="flex items-center gap-3 w-full sm:w-1/2">
                  <div className="p-2 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg">
                    <Zap className="text-white h-4 w-4" />
                  </div>
                  <Select onValueChange={setActivityLevel} value={activityLevel}>
                    <SelectTrigger className="bg-white/10 border border-white/20 rounded-lg p-3 sm:p-4 text-white w-full text-xs sm:text-base">
                      <SelectValue placeholder="Activity Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary</SelectItem>
                      <SelectItem value="lightly active">Lightly Active</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="very active">Very Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Diet Type */}
                <div className="flex items-center gap-3 w-full sm:w-1/2">
                  <Select onValueChange={setDietType} value={dietType}>
                    <SelectTrigger className="bg-white/10 border border-white/20 rounded-lg p-3 sm:p-4 text-white w-full text-xs sm:text-base">
                      <SelectValue placeholder="Select Diet Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border border-white/20 text-white">
                      <SelectItem value="veg">🥬 Vegetarian</SelectItem>
                      <SelectItem value="non-veg">🍗 Non-Vegetarian</SelectItem>
                      <SelectItem value="vegan">🌱 Vegan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Medical Conditions */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-pink-600 to-red-600 rounded-lg">
                  <Flame className="text-white h-4 w-4" />
                </div>
                <Input
                  placeholder="Medical Conditions (e.g. diabetes)"
                  value={medicalConditions}
                  onChange={(e) => setMedicalConditions(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg p-2 sm:p-3 text-white"
                />
              </div>
              {/* Allergies */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg">
                  <Sparkles className="text-white h-4 w-4" />
                </div>
                <Input
                  placeholder="Allergies"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg p-2 sm:p-3 text-white"
                />
              </div>
              {/* Meals per Day */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                  <Venus className="text-white h-4 w-4" />
                </div>
                <Input
                  placeholder="Meals per Day"
                  value={mealsPerDay}
                  onChange={(e) => setMealsPerDay(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg p-2 sm:p-3 text-white"
                />
              </div>
              {/* Daily Routine */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                  <TrendingUp className="text-white h-4 w-4" />
                </div>
                <Input
                  placeholder="Daily Routine (e.g. work schedule, sleep time)"
                  value={dailyRoutine}
                  onChange={(e) => setDailyRoutine(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg p-2 sm:p-3 text-white"
                />
              </div>
              {/* Move Language selection to the end */}
              <Select onValueChange={setLanguage} value={language}>
                <SelectTrigger className="bg-white/10 border border-white/20 rounded-lg p-4 mt-3 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-xl text-white">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border border-white/20 text-white">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hindi">Hindi (हिन्दी)</SelectItem>
                  <SelectItem value="bengali">Bengali (বাংলা)</SelectItem>
                  <SelectItem value="telugu">Telugu (తెలుగు)</SelectItem>
                  <SelectItem value="marathi">Marathi (मराठी)</SelectItem>
                  <SelectItem value="tamil">Tamil (தமிழ்)</SelectItem>
                </SelectContent>
              </Select>
              </div>
            </TabsContent>

            <TabsContent value="workout" className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg">
                  <Target className="text-white h-4 w-4" />
                </div>
                <Input
                  placeholder="Workout Goal (e.g. weight loss, muscle gain)"
                  value={workoutGoal}
                  onChange={(e) => setWorkoutGoal(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-xl"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                  <Dumbbell className="text-white h-4 w-4" />
                </div>
                <Textarea
                  placeholder="Preferred Workout Plan (e.g. cardio, strength training)"
                  value={workoutPlan}
                  onChange={(e) => setWorkoutPlan(e.target.value)}
                  rows={3}
                  className="flex-1 resize-none bg-white/10 border border-white/20 rounded-lg p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-xl"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                  <TrendingUp className="text-white h-4 w-4" />
                </div>
                <Input
                  placeholder="What are you planning to do today?"
                  value={workoutToday}
                  onChange={(e) => setWorkoutToday(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-xl"
                />
              </div>
              {/* Fitness Level */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg">
                  <Zap className="text-white h-4 w-4" />
                </div>
                <Select onValueChange={setFitnessLevel} value={fitnessLevel}>
                  <SelectTrigger className="bg-white/10 border border-white/20 rounded-lg p-4 text-white">
                    <SelectValue placeholder="Fitness Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Available Equipment */}
              {/* <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                  <Dumbbell className="text-white h-4 w-4" />
                </div>
                <Input
                  placeholder="Available Equipment (e.g. dumbbells, bands, gym)"
                  value={availableEquipment}
                  onChange={(e) => setAvailableEquipment(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg p-4 text-white"
                />
              </div> */}
              {/* Workout Days/Times */}
              {/* <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-pink-600 to-red-600 rounded-lg">
                  <Flame className="text-white h-4 w-4" />
                </div>
                <Input
                  placeholder="Workout Days/Times"
                  value={workoutDaysTimes}
                  onChange={(e) => setWorkoutDaysTimes(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg p-4 text-white"
                />
              </div> */}
              {/* Injuries or Limitations */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg">
                  <Sparkles className="text-white h-4 w-4" />
                </div>
                <Input
                  placeholder="Injuries or Limitations"
                  value={injuriesLimitations}
                  onChange={(e) => setInjuriesLimitations(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg p-4 text-white"
                />
              </div>
              {/* Move Language selection to the end */}
              <Select onValueChange={setLanguage} value={language}>
                <SelectTrigger className="bg-white/10 border border-white/20 rounded-lg p-4 mt-3 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-xl text-white">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border border-white/20 text-white">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hindi">Hindi (हिन्दी)</SelectItem>
                  <SelectItem value="bengali">Bengali (বাংলা)</SelectItem>
                  <SelectItem value="telugu">Telugu (తెలుగు)</SelectItem>
                  <SelectItem value="marathi">Marathi (मराठी)</SelectItem>
                  <SelectItem value="tamil">Tamil (தமிழ்)</SelectItem>
                </SelectContent>
              </Select>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex flex-col space-y-4 mt-6">
            <Button 
              onClick={handleSubmit} 
              disabled={loading || 
                (tabValue === 'diet' && (!age || !height || !weight || !dietGoal || !dietType || !activityLevel)) ||
                (tabValue === 'workout' && (!workoutGoal || !fitnessLevel))
              } 
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-lg py-4 shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Your Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Get My {tabValue === 'diet' ? 'Diet' : 'Workout'} Plan</span>
                  <Flame className="h-5 w-5" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Response Popup */}
      <Dialog open={showResponsePopup} onOpenChange={setShowResponsePopup}>
        <DialogContent className="w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl border border-gray-300 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-2 sm:p-4 md:p-6">
          <DialogHeader className="flex flex-row items-center justify-center">
            <DialogTitle className="text-2xl font-extrabold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent flex items-center space-x-2">
              <Flame className="h-6 w-6 text-orange-400" />
              <span>Your {tabValue === 'diet' ? 'Diet' : 'Workout'} Plan</span>
            </DialogTitle>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            {/* Export to PDF Button */}
            <div className="flex justify-center">
              <Button
                onClick={exportToPDF}
                disabled={pdfLoading}
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold rounded-lg px-6 py-3 transition-all duration-300 hover:scale-105 flex items-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pdfLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5" />
                    <span>Export to PDF</span>
                  </>
                )}
              </Button>
            </div>

            {/* Response Content */}
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-xl border border-white/10 max-h-[60vh] overflow-y-auto">
              <div className="prose prose-invert max-w-none text-white">
                <ReactMarkdown 
                  components={{
                    h1: ({children}) => <h1 className="text-2xl font-bold text-orange-400 mb-4">{children}</h1>,
                    h2: ({children}) => <h2 className="text-xl font-bold text-orange-300 mb-3">{children}</h2>,
                    h3: ({children}) => <h3 className="text-lg font-bold text-orange-200 mb-2">{children}</h3>,
                    p: ({children}) => <p className="text-white/90 mb-3 leading-relaxed">{children}</p>,
                    ul: ({children}) => <ul className="list-disc list-inside space-y-2 text-white/90 mb-4">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal list-inside space-y-2 text-white/90 mb-4">{children}</ol>,
                    li: ({children}) => <li className="text-white/90">{children}</li>,
                    strong: ({children}) => <strong className="text-orange-300 font-bold">{children}</strong>,
                    em: ({children}) => <em className="text-orange-200 italic">{children}</em>,
                    code: ({children}) => <code className="bg-white/10 px-2 py-1 rounded text-orange-300 font-mono text-sm">{children}</code>,
                    blockquote: ({children}) => <blockquote className="border-l-4 border-orange-400 pl-4 italic text-white/80 bg-white/5 p-3 rounded-r-lg">{children}</blockquote>,
                  }}
                >
                  {response}
                </ReactMarkdown>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-400/30 rounded-lg px-4 py-2">
                <Check className="h-5 w-5 text-green-400" />
                <span className="text-green-300 font-semibold">Plan Generated Successfully! 🎉</span>
              </div>
            </div>
          </div>


        </DialogContent>
      </Dialog>
    </>
  );
};

export default AskAIButton;

