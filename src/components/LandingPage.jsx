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
    <span className="block text-[clamp(2.5rem,8vw,5rem)] md:text-8xl text-white font-black transition-all duration-500 min-h-[60px]">
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
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl blur opacity-75"></div>
              <div className="relative bg-gradient-to-r from-cyan-400 to-purple-500 p-2 rounded-xl">
                <Dumbbell className="h-6 w-6 sm:h-8 sm:w-8 text-black font-bold" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
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
            className="bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold hover:from-cyan-500 hover:to-purple-600 transition-all duration-300 px-6 py-2 rounded-full"
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
        
        <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-7xl mx-auto text-center">
            {/* Animated background elements */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-r from-yellow-400/20 to-pink-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
            
            <div className="relative z-10">
              {/* Hero section headline: responsive, animated gradient text */}
              <h2 className="font-black mb-6 text-center w-full">
                {/* Typing effect headline in white */}
                <TypingHeadline text="Scan. Train. Transform." speed={80} />
              </h2>
              <h2 className="text-5xl md:text-7xl font-black mb-8">
                {/* Subheadline in plain white */}
                <span className="text-white">The smart way to fitness</span>
              </h2>
              <p className="text-2xl md:text-3xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
                FitCode lets you scan gym equipment, get instant AI-powered workout guidance, track your progress, and unlock a new level of motivation. Join the fitness movement that puts technology and results in your hands.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
                <Button
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold px-8 py-4 text-lg rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  onClick={() => navigate('/register/client')}
                >
                  EXPLORE FITCODE
                </Button>
               
                <Button
                  variant="outline"
                  className="border-2 border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white font-bold px-8 py-4 text-lg rounded-full transition-all duration-300"
                  onClick={openDemo}
                >
                  <Play className="w-5 h-5 mr-2" />
                  SEE IT IN ACTION
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Animated Features Showcase */}
        <section className="relative py-20 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-yellow-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-cyan-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-5xl font-black text-white mb-4">
                Why Choose <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">FitCode</span>
              </h3>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Experience the future of fitness with cutting-edge technology and personalized guidance
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="bg-gradient-to-r from-cyan-400 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="h-8 w-8 text-black" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">AI-Powered Intelligence</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Get personalized workout plans and nutrition advice powered by advanced artificial intelligence.
                  </p>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-pink-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="bg-gradient-to-r from-yellow-400 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-8 w-8 text-black" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">Instant Access</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Scan any equipment and instantly access video guides, tips, and workout routines.
                  </p>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/10 to-purple-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="bg-gradient-to-r from-pink-400 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-8 w-8 text-black" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4">Track Progress</h4>
                  <p className="text-gray-300 leading-relaxed">
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

      

      {/* Footer */}
      <footer className="relative bg-black border-t border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-cyan-400 to-purple-500 p-2 rounded-xl">
                  <Dumbbell className="h-6 w-6 text-black" />
                </div>
                <h4 className="text-2xl font-black text-white">
                  fit<span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">code</span>
                </h4>
              </div>
              <p className="text-gray-400 leading-relaxed">
                At fitcode, we make group workouts fun, daily fitness easy, and help you achieve your goals. #BeBetterEveryDay
              </p>
            </div>
            
            <div>
              <h5 className="text-white font-bold mb-4">Company</h5>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors">About Us</a>
                <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors">Careers</a>
                <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors">Contact</a>
                <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors">Blog</a>
              </div>
            </div>
            
            <div>
              <h5 className="text-white font-bold mb-4">Services</h5>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors">Fitness</a>
                <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors">Sports</a>
                <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors">Nutrition</a>
                <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors">Wellness</a>
              </div>
            </div>
            
            <div>
              <h5 className="text-white font-bold mb-4">Support</h5>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors">Help Center</a>
                <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors">Privacy Policy</a>
                <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors">Terms & Conditions</a>
                <a href="#" className="block text-gray-400 hover:text-cyan-400 transition-colors">Security</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} FitCode. All rights reserved. Made with ❤️ for fitness enthusiasts.
            </p>
          </div>
        </div>
      </footer>

      {/* Demo Video Modal */}
      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeDemo}
          ></div>
          
          {/* Modal Content */}
          <div className="relative w-full max-w-4xl bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-cyan-400 to-purple-500 p-2 rounded-xl">
                  <Play className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">FitCode Demo</h3>
                  <p className="text-gray-400 text-sm">See how FitCode transforms your fitness journey</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full p-2"
                onClick={closeDemo}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            {/* Video Container */}
            <div className="relative aspect-video bg-black">
              <iframe
                src={demoVideoUrl}
                title="FitCode Demo Video"
                className="w-full h-full rounded-b-3xl"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            {/* Footer */}
            <div className="p-6 bg-gradient-to-t from-gray-900/50 to-transparent">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-gray-300 text-sm">
                    Ready to transform your fitness experience?
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                    onClick={closeDemo}
                  >
                    Close
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold hover:from-cyan-500 hover:to-purple-600"
                    onClick={() => {
                      closeDemo();
                      navigate('/login/client');
                    }}
                  >
                    Get Started
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

