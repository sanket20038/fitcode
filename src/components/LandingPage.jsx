import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Sparkles, Users, BarChart3, Star, Play, ArrowRight, CheckCircle, X, Zap, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';

const stats = [
  { icon: <Users className="h-8 w-8 text-cyan-400" />, label: 'Active Users', value: 12000 },
  { icon: <BarChart3 className="h-8 w-8 text-yellow-400" />, label: 'Workouts Tracked', value: 50000 },
  { icon: <Star className="h-8 w-8 text-purple-400" />, label: 'Partner Gyms', value: 120 },
];

function AnimatedCounter({ value }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    let totalMilSecDur = 1200;
    let incrementTime = Math.abs(Math.floor(totalMilSecDur / end));
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{count.toLocaleString()}</span>;
}

// Typing effect for hero headline
function TypingHeadline({ text, speed = 80 }) {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    if (!text) return;
    
    let i = 0;
    setDisplayed('');
    
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    
    return () => clearInterval(interval);
  }, [text, speed]);
  
  return (
    <span className="block text-[clamp(2rem,8vw,4rem)] md:text-6xl lg:text-7xl xl:text-8xl text-white font-black transition-all duration-500 min-h-[50px] md:min-h-[60px] leading-tight">
      {displayed}
    </span>
  );
}

const LandingPage = () => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  
  // Demo video URL - FitCode platform demonstration
  const demoVideoUrl = "https://www.youtube.com/embed/R6gbL8i8MoA";
  
  const openDemo = () => setShowDemo(true);
  const closeDemo = () => setShowDemo(false);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl blur opacity-75"></div>
              <div className="relative bg-gradient-to-r from-cyan-400 to-purple-500 p-1.5 sm:p-2 rounded-xl">
                <Dumbbell className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-black font-bold" />
              </div>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-black text-white">
                fit<span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">code</span>
              </h1>
            </div>
          </div>
          
          {/* <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-white hover:text-cyan-400 font-medium transition-colors">FITNESS</a>
            <a href="#" className="text-white hover:text-cyan-400 font-medium transition-colors">SPORTS</a>
            <a href="#" className="text-white hover:text-cyan-400 font-medium transition-colors">STORE</a>
          </nav> */}

          <Button
            className="bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold hover:from-cyan-500 hover:to-purple-600 transition-all duration-300 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base"
            onClick={() => navigate('/login/client')}
          >
            CLIENT LOGIN
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        {/* Extended background with gradient overlay - now covers the whole page */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20"></div>
        
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-12 lg:py-20">
          <div className="max-w-7xl mx-auto text-center">
            {/* Animated background elements */}
            <div className="absolute top-20 left-10 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-r from-yellow-400/20 to-pink-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
            
            <div className="relative z-10">
              {/* Hero section headline: responsive, animated gradient text */}
              <h2 className="font-black mb-4 sm:mb-6 text-center w-full">
                {/* Typing effect headline in white */}
                <TypingHeadline text="Scan. Train. Transform." speed={80} />
              </h2>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black mb-6 sm:mb-8">
                {/* Subheadline in plain white */}
                <span className="text-white">The smart way to fitness</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-200 mb-8 sm:mb-12 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed px-4">
                FitCode lets you scan gym equipment, get instant AI-powered workout guidance, track your progress, and unlock a new level of motivation. Join the fitness movement that puts technology and results in your hands.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8 sm:mb-10 px-4">
                <Button
                  variant="outline"
                  className="group relative overflow-hidden border-2 border-cyan-400/50 text-cyan-400 hover:border-cyan-400 hover:text-white font-bold px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm sm:text-base lg:text-lg rounded-full transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/25 w-auto max-w-[280px] sm:max-w-none"
                  onClick={openDemo}
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Glowing border effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500"></div>
                  
                  {/* Content */}
                  <div className="relative flex items-center justify-center">
                    <Play className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    <span className="relative">
                      SEE IT IN ACTION
                      {/* Animated underline */}
                      <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-500"></div>
                    </span>
                  </div>
                  
                  {/* Pulse animation */}
                  <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Animated Features Showcase */}
        <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 sm:w-40 sm:h-40 bg-gradient-to-r from-yellow-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-pink-400/20 to-cyan-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
                Why Choose <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">FitCode</span>
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl sm:max-w-3xl mx-auto px-4">
                Experience the future of fitness with cutting-edge technology and personalized guidance
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 sm:p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="bg-gradient-to-r from-cyan-400 to-purple-500 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
                  </div>
                  <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4">AI-Powered Intelligence</h4>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    Get personalized workout plans and nutrition advice powered by advanced artificial intelligence.
                  </p>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-pink-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 sm:p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="bg-gradient-to-r from-yellow-400 to-pink-500 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
                  </div>
                  <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4">Instant Access</h4>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    Scan any equipment and instantly access video guides, tips, and workout routines.
                  </p>
                </div>
              </div>
              
              <div className="group relative sm:col-span-2 lg:col-span-1">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/10 to-purple-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 sm:p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="bg-gradient-to-r from-pink-400 to-purple-500 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
                  </div>
                  <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4">Track Progress</h4>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    Monitor your fitness journey with detailed analytics and achievement tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <style>{`
          @keyframes float-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-float-slow {
            animation: float-slow 4s ease-in-out infinite;
          }
          .animate-float-slow.delay-100 { animation-delay: 1s; }
          .animate-float-slow.delay-200 { animation-delay: 2s; }
          .animate-float-slow.delay-300 { animation-delay: 3s; }
        `}</style>

        {/* How FitCode Works Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-4xl md:text-5xl font-black text-center mb-16">
              How <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">FitCode</span> Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <div className="flex flex-col items-center text-center group">
                <div className="relative bg-gradient-to-r from-cyan-400 to-purple-500 w-24 h-24 rounded-3xl flex items-center justify-center mb-6 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-cyan-400/25">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <svg className="relative w-12 h-12 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 3h6v6H3z"/>
                    <path d="M15 3h6v6h-6z"/>
                    <path d="M3 15h6v6H3z"/>
                    <path d="M15 15h6v6h-6z"/>
                    <path d="M9 9h6v6H9z"/>
                    <path d="M9 3v6"/>
                    <path d="M9 15v6"/>
                    <path d="M3 9h6"/>
                    <path d="M15 9h6"/>
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-2 text-white">Scan QR on Equipment</h4>
                <p className="text-gray-300">Make any gym machine smart by scanning its unique QR code.</p>
              </div>
              
              <div className="flex flex-col items-center text-center group">
                <div className="relative bg-gradient-to-r from-yellow-400 to-pink-500 w-24 h-24 rounded-3xl flex items-center justify-center mb-6 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-yellow-400/25">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <svg className="relative w-12 h-12 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="6" width="20" height="12" rx="2" ry="2"/>
                    <path d="M10 9l5 3-5 3z"/>
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-2 text-white">Watch Video Guides</h4>
                <p className="text-gray-300">Instantly access owner-uploaded video guides for safe and effective use.</p>
              </div>
              
              <div className="flex flex-col items-center text-center group">
                <div className="relative bg-gradient-to-r from-pink-500 to-purple-600 w-24 h-24 rounded-3xl flex items-center justify-center mb-6 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-pink-400/25">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <svg className="relative w-12 h-12 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-2 text-white">Bookmark Favorites</h4>
                <p className="text-gray-300">Save your most-used machines for quick access next time.</p>
              </div>
              
              <div className="flex flex-col items-center text-center group">
                <div className="relative bg-gradient-to-r from-cyan-400 to-yellow-400 w-24 h-24 rounded-3xl flex items-center justify-center mb-6 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-cyan-400/25">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-yellow-400 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <svg className="relative w-12 h-12 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 1 14 18.469V19a2 2 0 0 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-2 text-white">AI Workout & Diet Plan</h4>
                <p className="text-gray-300">Get AI-powered workout and diet plans, downloadable as PDF for easy access.</p>
              </div>
            </div>
          </div>
        </section>

       

        {/* Stats Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-black text-white mb-2">
                    <AnimatedCounter value={stat.value} />+
                  </div>
                  <p className="text-gray-400 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gym Owner Section */}
        <section className="relative w-full max-w-5xl mx-auto mb-16 flex flex-col md:flex-row items-center gap-12 bg-gradient-to-r from-purple-900/80 to-pink-900/80 rounded-3xl p-12 shadow-2xl border border-purple-700/30 overflow-hidden">
          {/* Animated floating shapes */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl animate-pulse z-0"></div>
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-pink-400/20 rounded-full blur-2xl animate-pulse z-0"></div>
          <div className="flex-1 flex justify-center mb-8 md:mb-0 z-10">
            <div className="w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-3xl flex items-center justify-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl blur opacity-75"></div>
                  <div className="relative bg-gradient-to-r from-cyan-400 to-purple-500 p-4 rounded-2xl">
                    <Dumbbell className="h-12 w-12 text-black font-bold" />
                  </div>
                </div>
                <div className="text-center">
                  <h1 className="text-3xl font-black text-white">
                    fit<span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">code</span>
                  </h1>
                  <p className="text-gray-300 text-sm mt-1">Partner Program</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left z-10">
            <h3 className="text-3xl font-black text-white mb-4">
              Are you a <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">Gym Owner?</span>
            </h3>
            <p className="text-lg text-gray-300 mb-6">Partner with FitCode to digitize your gym, engage your clients, and access powerful analytics. Join the fitness revolution and grow your business with us.</p>
            <ul className="text-left text-gray-200 mb-6 space-y-2">
              <li className="flex items-center"><span className="text-cyan-400 mr-2">✔</span>Add video guides to your machines</li>
              <li className="flex items-center"><span className="text-cyan-400 mr-2">✔</span>Reach more clients with QR-powered info</li>
              <li className="flex items-center"><span className="text-cyan-400 mr-2">✔</span>Access your own analytics dashboard</li>
            </ul>
            <Button
              className="bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold px-8 py-4 text-lg rounded-full hover:from-cyan-500 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 animate-bounce-slow"
              onClick={() => navigate('/register/owner')}
            >
              Become a Partner
            </Button>
          </div>
          <style>{`
            .animate-bounce-slow {
              animation: bounce 2s infinite;
            }
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
          `}</style>
        </section>
      </main>

      

      {/* Enhanced Footer - Mobile Responsive */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border-t border-cyan-400/20 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-r from-cyan-400/5 to-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 sm:w-40 sm:h-40 bg-gradient-to-r from-yellow-400/5 to-pink-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Brand Section */}
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl blur-lg opacity-75"></div>
                  <div className="relative bg-gradient-to-r from-cyan-400 to-purple-500 p-2 rounded-xl">
                    <Dumbbell className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                  </div>
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-white">
                  fit<span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">code</span>
                </h4>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                At FitCode, we make group workouts fun, daily fitness easy, and help you achieve your goals. #BeBetterEveryDay
              </p>
              
              {/* Social Media Links */}
              <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6">
                {/* <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-transform duration-300 touch-manipulation">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a> */}
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-transform duration-300 touch-manipulation">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-transform duration-300 touch-manipulation">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-transform duration-300 touch-manipulation">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="http://www.youtube.com/@Fitcode-info" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-transform duration-300 touch-manipulation">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Quick Links - Mobile Optimized */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:col-span-4">
              <div>
                <h5 className="text-white font-bold mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mr-2"></span>
                  Company
                </h5>
                <div className="space-y-2 sm:space-y-3">
                  <a href="/about-us" className="block text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 text-sm sm:text-base py-1 sm:py-0 touch-manipulation">About Us</a>
                  <a href="/contact" className="block text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 text-sm sm:text-base py-1 sm:py-0 touch-manipulation">Contact</a>
                  {/* <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 text-sm sm:text-base py-1 sm:py-0 touch-manipulation">Careers</a>
                  <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 text-sm sm:text-base py-1 sm:py-0 touch-manipulation">Press</a> */}
                </div>
              </div>
              
              <div>
                <h5 className="text-white font-bold mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mr-2"></span>
                  Platform
                </h5>
                <div className="space-y-2 sm:space-y-3">
                  <a href="/login/owner" className="block text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 text-sm sm:text-base py-1 sm:py-0 touch-manipulation">For Gym Owners</a>
                  <a href="/login/client" className="block text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 text-sm sm:text-base py-1 sm:py-0 touch-manipulation">For Members</a>
                  {/* <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 text-sm sm:text-base py-1 sm:py-0 touch-manipulation">Features</a>
                  <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 text-sm sm:text-base py-1 sm:py-0 touch-manipulation">Pricing</a> */}
                </div>
              </div>
              
              <div>
                <h5 className="text-white font-bold mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mr-2"></span>
                  Support
                </h5>
                <div className="space-y-2 sm:space-y-3">
                  <a href="/help-center" className="block text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 text-sm sm:text-base py-1 sm:py-0 touch-manipulation">Help Center</a>
                  <a href="/contact" className="block text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 text-sm sm:text-base py-1 sm:py-0 touch-manipulation">Contact Support</a>
                  {/* <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 text-sm sm:text-base py-1 sm:py-0 touch-manipulation">Community</a>
                  <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 text-sm sm:text-base py-1 sm:py-0 touch-manipulation">Status</a> */}
                </div>
              </div>
              
              <div>
                <h5 className="text-white font-bold mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mr-2"></span>
                  Legal
                </h5>
                <div className="space-y-2 sm:space-y-3">
                  <a href="/privacy-policy" className="block text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 text-sm sm:text-base py-1 sm:py-0 touch-manipulation">Privacy Policy</a>
                  <a href="/terms-conditions" className="block text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 text-sm sm:text-base py-1 sm:py-0 touch-manipulation">Terms & Conditions</a>
                  {/* <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 text-sm sm:text-base py-1 sm:py-0 touch-manipulation">Cookie Policy</a>
                  <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 text-sm sm:text-base py-1 sm:py-0 touch-manipulation">GDPR</a> */}
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Section - Mobile Optimized */}
          <div className="border-t border-cyan-400/20 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="order-2 sm:order-1">
                <p className="text-gray-400 text-sm sm:text-base">
                  &copy; {new Date().getFullYear()} FitCode. All rights reserved. Made with ❤️ for fitness enthusiasts.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 order-1 sm:order-2">
                <span className="text-gray-500 text-xs sm:text-sm">India</span>
                <span className="text-gray-500 text-xs sm:text-sm">English</span>
                <span className="text-gray-500 text-xs sm:text-sm">v1.0.0</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Video Modal */}
      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6">
          {/* Animated Backdrop */}
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in-0 duration-300"
            onClick={closeDemo}
          >
            {/* Animated background elements */}
            <div className="absolute top-1/4 left-1/4 w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-r from-cyan-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-gradient-to-r from-yellow-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          {/* Modal Content */}
          <div className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-cyan-400/20 shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-500">
            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-cyan-400/20 opacity-0 animate-pulse"></div>
            
            {/* Header */}
            <div className="relative flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-cyan-400/20 bg-gradient-to-r from-gray-900/50 to-black/50">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg sm:rounded-xl blur-lg opacity-75"></div>
                  <div className="relative bg-gradient-to-r from-cyan-400 to-purple-500 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
                    <Play className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-black" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-white mb-1">Platform Overview</h3>
                  <p className="text-cyan-400 text-xs sm:text-sm lg:text-base font-medium">See how it works in action</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full p-1.5 sm:p-2 transition-all duration-300 hover:scale-110"
                onClick={closeDemo}
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
            
            {/* Video Container */}
            <div className="relative aspect-video bg-black">
              {/* Video loading overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4 lg:mb-6"></div>
                  <p className="text-cyan-400 font-medium text-sm sm:text-base lg:text-lg">Loading platform overview...</p>
                </div>
              </div>
              
              <iframe
                src={demoVideoUrl}
                title="FitCode Demo Video"
                className="w-full h-full rounded-b-2xl sm:rounded-b-3xl relative z-10"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={(e) => {
                  // Hide loading overlay when video loads
                  e.target.style.opacity = '1';
                  e.target.previousElementSibling.style.display = 'none';
                }}
              ></iframe>
            </div>
            
            {/* Enhanced Footer */}
            <div className="relative p-3 sm:p-4 lg:p-6 bg-gradient-to-t from-gray-900/80 via-black/60 to-transparent">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4">
                <div className="text-center lg:text-left">
                  <h4 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-1">Ready to transform your fitness?</h4>
                  <p className="text-gray-300 text-xs sm:text-sm lg:text-base">
                    Join thousands of users already experiencing the FitCode difference
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 rounded-full transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
                    onClick={closeDemo}
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                    Close Demo
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold hover:from-cyan-500 hover:to-purple-600 px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-400/25 text-xs sm:text-sm"
                    onClick={() => {
                      closeDemo();
                      navigate('/login/client');
                    }}
                  >
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                    Start Your Journey
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;

