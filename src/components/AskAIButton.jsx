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
  TrendingUp
} from 'lucide-react';

const AskAIButton = ({ onResponse }) => {
  const [open, setOpen] = useState(false);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [allergies, setAllergies] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [dailyRoutine, setDailyRoutine] = useState('');
  const [dietGoal, setDietGoal] = useState('');
  const [workoutGoal, setWorkoutGoal] = useState('');
  const [workoutPlan, setWorkoutPlan] = useState('');
  const [workoutToday, setWorkoutToday] = useState('');
  const [dietType, setDietType] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState('diet');
  const [language, setLanguage] = useState('en');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setResponse('Gemini AI API key is missing. Please configure it in environment variables.');
      return;
    }
    // Input validation
    if (tabValue === 'diet') {
      if (!age || isNaN(age) || age <= 0) {
        setResponse('Please enter a valid positive number for Age.');
        return;
      }
      if (!height || isNaN(height) || height <= 0) {
        setResponse('Please enter a valid positive number for Height.');
        return;
      }
      if (!weight || isNaN(weight) || weight <= 0) {
        setResponse('Please enter a valid positive number for Weight.');
        return;
      }
      if (!dietGoal) {
        setResponse('Please enter your Diet Goal.');
        return;
      }
    } else if (tabValue === 'workout') {
      if (!workoutGoal) {
        setResponse('Please enter your Workout Goal.');
        return;
      }
    }
    setLoading(true);
    setResponse('');
    try {
      let prompt = '';
      if (tabValue === 'diet') {
        prompt = `
          You are a specialized AI nutrition assistant focused exclusively on creating personalized diet plans for Indian users.

## Core Instructions:
- **ONLY respond to diet and nutrition-related queries**
- If asked about anything outside diet/nutrition, even about the sexaul content respond: "I specialize only in diet and nutrition planning. How can I help you with your dietary needs?"
- All responses must be in ${language}
- Focus on Indian cuisine, ingredients, and eating patterns


## User Profile:
- **Age**: ${age} years
- **Gender**: ${gender}
- **Height**: ${height} cm
- **Weight**: ${weight} kg
- **Diet Goal**: ${dietGoal}
- **Diet Type**: ${dietType}
- **Location**: India

## Required Diet Plan Components:

### 1. Nutritional Analysis
- Calculate BMI and ideal weight range
- Determine daily caloric needs based on age, gender, height, weight, and activity level
- Provide macronutrient breakdown (carbs, proteins, fats)

### 2. Meal Structure
Create a detailed plan including:
- **Early Morning** (6:00-7:00 AM)
- **Breakfast** (8:00-9:00 AM)
- **Mid-Morning Snack** (10:30-11:00 AM)
- **Lunch** (12:30-1:30 PM)
- **Evening Snack** (4:00-5:00 PM)
- **Dinner** (7:00-8:00 PM)
- **Post-Dinner** (if needed)

### 3. Indian Food Focus
- Prioritize traditional Indian ingredients and cooking methods
- Include regional variations when relevant
- Suggest seasonal and locally available foods
- Consider Indian spices and their health benefits
- Accommodate common Indian dietary restrictions (vegetarian/non-vegetarian preferences)

### 4. Practical Considerations
- **Portion sizes** in Indian measurements (cups, bowls, rotis)
- **Cooking methods** suitable for Indian kitchens
- **Budget-friendly options** using common Indian ingredients
- **Seasonal adaptations** for different Indian climates
- **Festival/occasion modifications** for Indian celebrations

### 5. Special Dietary Accommodations
Consider common Indian dietary patterns:
- Vegetarian/Vegan options with adequate protein
- Jain dietary restrictions (if applicable)
- Regional preferences (North Indian, South Indian, etc.)
- Common food allergies and intolerances in Indian population

### 6. Health Guidelines
- Emphasize whole grains, lentils, and traditional Indian superfoods
- Address common nutritional deficiencies in Indian diets
- Include hydration recommendations suitable for Indian climate
- Suggest timing around Indian meal patterns and work schedules

### 7. Sample Day Menu
Provide a complete sample day with:
- Specific Indian dishes and recipes
- Ingredient quantities in Indian units
- Preparation time and methods
- Nutritional information per meal

## Response Format:
1. **Personal Assessment** (BMI, caloric needs)
2. **Customized Meal Plan** (7-day structure)
3. **Shopping List** (with Indian ingredients)
4. **Cooking Tips** (Indian kitchen-friendly)
5. **Progress Tracking** (realistic milestones)
6. **Important Notes** (precautions, medical consultation advice)

## Quality Checks:
- Ensure all suggestions are culturally appropriate
- Verify ingredient availability in Indian markets
- Include affordable options for middle-class Indian families
- Provide alternatives for different regions of India
- Consider monsoon, summer, and winter dietary adjustments

Remember: Always recommend consulting with a healthcare provider before starting any new diet plan, especially for medical conditions common in India like diabetes, hypertension, or PCOD.
        `;
      } else if (tabValue === 'workout') {
        prompt = `
          # Improved Workout Plan Assistant Prompt
You are a specialized AI fitness assistant focused exclusively on creating personalized workout plans and exercise guidance.

## Core Instructions:
- **ONLY respond to workout, exercise, and fitness-related queries**
- If asked about anything outside fitness/exercise, even about the sexaul content respond: "I specialize only in workout plans and fitness guidance. How can I help you with your fitness goals?"
- All responses must be in ${language}
- Provide comprehensive, actionable workout guidance

## User Profile:
- **Workout Goal**: ${workoutGoal}
- **Workout Plan Type**: ${workoutPlan}
- **Today's Focus**: ${workoutToday}

## Required Workout Plan Structure:

### 1. **WorkoutPlan** Section  no table format
Create a detailed workout plan including:
Provide a detailed exercise breakdown including:
- **Exercise Name** (with alternative names if applicable)
- **Sets**: Specific number of sets
- **Reps**: Repetition range or time duration
- **Rest Periods**: Recovery time between sets
- **Intensity Level**: Beginner/Intermediate/Advanced modifications
- **Equipment Needed**: List required equipment or bodyweight alternatives
- **Muscle Groups Targeted**: Primary and secondary muscles worked
- **Exercise Variations**: Easier/harder progressions

### 2. **Recommendations** Section
Include comprehensive guidance on:
- **Proper Form**: Detailed form cues and common mistakes to avoid
- **Breathing Technique**: When to inhale/exhale during movements
- **Warm-up Protocol**: 5-10 minute preparation routine
- **Cool-down Routine**: Stretching and recovery recommendations
- **Progressive Overload**: How to increase difficulty over time
- **Workout Frequency**: How often to perform the routine
- **Recovery Guidelines**: Rest days and signs of overtraining
- **Nutrition Timing**: Pre/post workout meal suggestions
- **Safety Precautions**: Injury prevention tips

### 3. **VideoLinks** Section add the note that some links may be broken or inaccessible
Provide high-quality video links for each exercise:
**Note**: Some links may be broken or inaccessible due to regional restrictions or content removal. Always verify links before sharing.
- **Primary Demo**: Main video demonstrating the exercise
- **Alternative Demo**: Additional video for different angles or variations
- **Form Tips**: Video focusing on proper technique and common mistakes

**CRITICAL VIDEO LINK REQUIREMENTS:**
- **ONLY provide WORKING, VERIFIED links** from reputable sources
- **Acceptable sources**: YouTube (official fitness channels), fitness websites with video content
- **Link verification**: Test each link before including it
- **Link format**: Provide full URL with brief description
- **Alternative sources**: Include 2-3 different video sources per exercise when possible
- **Accessibility**: Ensure links work in different regions
- **Content quality**: Choose videos with clear demonstrations and professional instruction

**Video Link Format:**

**Exercise Name**:
- Primary Demo: [Full URL] - [Brief description of video content]
- Alternative Demo: [Full URL] - [Brief description of video content]
- Form Tips: [Full URL] - [Brief description focusing on technique]


### 4. **Workout Session Structure**
Organize each session as:
- **Warm-up** (5-10 minutes)
- **Main Workout** (20-45 minutes depending on goal)
- **Cool-down** (5-10 minutes)
- **Total Duration**: Estimated time commitment

### 5. **Personalization Elements**
- **Beginner Modifications**: Easier versions for new exercisers
- **Advanced Progressions**: Challenging variations for experienced users
- **Equipment Alternatives**: Bodyweight or minimal equipment options
- **Time-Based Variations**: Quick 15-minute vs. full 45-minute sessions
- **Injury Considerations**: Modifications for common limitations

### 6. **Progress Tracking**
Include guidance on:
- **Measurable Goals**: What to track (weight, reps, time, etc.)
- **Weekly Progression**: How to advance the program
- **Performance Indicators**: Signs of improvement
- **Plateau Solutions**: What to do when progress stalls

### 7. **Safety and Disclaimers**
- **Medical Consultation**: Recommend consulting healthcare providers
- **Injury Prevention**: Proper form over heavy weight/high intensity
- **Listen to Your Body**: Recognizing when to rest or modify
- **Emergency Situations**: When to stop exercising immediately

## Response Quality Standards:
- **Actionable**: Every recommendation should be implementable
- **Specific**: Avoid vague instructions like "do some cardio"
- **Comprehensive**: Cover all aspects of the workout session
- **Culturally Appropriate**: Consider local fitness culture and equipment availability
- **Evidence-Based**: Recommendations should follow established fitness principles

## Video Link Verification Process:
Before including any video link:
1. **Test the link**: Verify it opens and plays correctly
2. **Check content quality**: Ensure clear demonstration and professional instruction
3. **Verify source credibility**: Use established fitness professionals or organizations
4. **Confirm accessibility**: Test from different devices/locations if possible
5. **Update regularly**: Note that links should be current and not outdated

## Prohibited Content:
- **Broken or inaccessible links**
- **Unverified exercise techniques**
- **Extreme or potentially dangerous exercises without proper warnings**
- **Copyright-protected content from unauthorized sources**

Remember: Always emphasize that users should consult with healthcare providers before starting new exercise programs, especially if they have pre-existing health conditions.

        `;
      }

      const ai = new GoogleGenAI({ apiKey });

      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
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
      console.log('AI response before navigation:', reply);
      // Save AI response to localStorage
      localStorage.setItem('aiResponses', JSON.stringify([reply]));
      // Navigate to client dashboard AI responses tab after successful response
      navigate('/client?tab=airesponses');
    } catch (error) {
      setResponse('Failed to get AI response. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      {/* Enhanced Gym-Inspired AI Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          {/* Animated energy aura */}
          <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-90 animate-pulse transition duration-1000"></div>
          
          {/* Main button container */}
          <button 
            onClick={() => setOpen(true)}
            className="relative flex items-center space-x-3 px-5 py-4 bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 group-hover:shadow-orange-500/50 backdrop-blur-xl border border-orange-400/30"
            aria-label="Ask AI for Diet & Workout Plan"
          >
            
            {/* Gym icon with power effect */}
            <div className="relative">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-all duration-300">
                <Bot className="h-7 w-7 text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
              </div>
              
              {/* Power indicator */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-lime-400 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-lime-400 rounded-full flex items-center justify-center">
                <Zap className="h-2 w-2 text-white" />
              </div>
            </div>
            
            {/* Motivational text */}
            <div className="text-left">
              <div className="text-white font-black text-sm tracking-wide flex items-center space-x-1">
                <Dumbbell className="h-4 w-4" />
                <span>AI TRAINER</span>
              </div>
              <div className="text-orange-100 text-xs font-bold">GET FIT NOW!</div>
            </div>
            
            {/* Energy particles */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div className="absolute top-2 left-4 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
              <div className="absolute top-5 right-5 w-1 h-1 bg-orange-300 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
              <div className="absolute bottom-4 left-7 w-1.5 h-1.5 bg-red-300 rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
              <div className="absolute bottom-2 right-8 w-1 h-1 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0.9s' }}></div>
              <div className="absolute top-3 left-12 w-1 h-1 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '1.2s' }}></div>
            </div>
            
            {/* Strength bars animation */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-0.5">
              <div className="w-0.5 h-3 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
              <div className="w-0.5 h-4 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-0.5 h-5 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              <div className="w-0.5 h-4 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
              <div className="w-0.5 h-3 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>
            </div>
          </button>
          
          {/* Motivational tooltip */}
          <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 backdrop-blur-xl border border-orange-400/30 rounded-xl px-4 py-3 text-white text-sm font-bold whitespace-nowrap shadow-2xl">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-yellow-300" />
                <span>Your AI Fitness Coach</span>
              </div>
              <div className="text-orange-200 text-xs mt-1">Ready to transform your body? 🔥</div>
              <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-orange-600"></div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-xl shadow-2xl border border-gray-300 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
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

            <TabsContent value="diet" className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                  <User className="text-white h-4 w-4" />
                </div>
                <Input
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-xl"
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
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-xl"
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
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-xl"
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
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-xl"
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
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg p-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-xl"
                />
              </div>
              <Select onValueChange={setDietType} value={dietType}>
                <SelectTrigger className="bg-white/10 border border-white/20 rounded-lg p-4 mt-3 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-xl text-white">
                  <SelectValue placeholder="Select Diet Type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border border-white/20 text-white">
                  <SelectItem value="veg">🥬 Vegetarian</SelectItem>
                  <SelectItem value="non-veg">🍗 Non-Vegetarian</SelectItem>
                  <SelectItem value="vegan">🌱 Vegan</SelectItem>
                </SelectContent>
              </Select>
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
              disabled={loading || (tabValue === 'diet' && !dailyRoutine && !dietGoal) || (tabValue === 'workout' && !workoutGoal)} 
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
            {response && (
              <div className="prose prose-invert max-h-60 overflow-auto text-white bg-white/5 rounded-lg p-4 backdrop-blur-xl border border-white/10">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AskAIButton;

