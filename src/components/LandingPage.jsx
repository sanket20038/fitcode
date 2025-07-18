import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Sparkles, Users, BarChart3, Star, Play, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';

const stats = [
  { icon: <Users className="h-8 w-8 text-cyan-400" />, label: 'Active Users', value: 12000 },
  { icon: <BarChart3 className="h-8 w-8 text-yellow-400" />, label: 'Workouts Tracked', value: 50000 },
  { icon: <Star className="h-8 w-8 text-purple-400" />, label: 'Partner Gyms', value: 120 },
];

function AnimatedCounter({ value }) {
  const [count, setCount] = useState(0);
  useState(() => {
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

const LandingPage = () => {
  const navigate = useNavigate();

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
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20"></div>
        
        <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-7xl mx-auto text-center">
            {/* Animated background elements */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-r from-yellow-400/20 to-pink-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
            
            <div className="relative z-10">
              {/* Hero section headline: responsive, animated gradient text */}
              <h2 className="font-black mb-6 text-center w-full">
                <span className="block text-[clamp(2.5rem,8vw,5rem)] md:text-8xl bg-gradient-to-r from-cyan-400 via-yellow-400 to-purple-500 bg-clip-text text-transparent animate-gradient-move transition-all duration-500">
                  Scan. Train. Transform.
                </span>
              </h2>
              <h2 className="text-5xl md:text-7xl font-black mb-8">
                <span className="text-transparent bg-gradient-to-r from-cyan-400 via-yellow-400 to-purple-500 bg-clip-text">
                  The smart way to fitness
                </span>
              </h2>
              <p className="text-2xl md:text-3xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
                FitCode lets you scan gym equipment, get instant AI-powered workout guidance, track your progress, and unlock a new level of motivation. Join the fitness movement that puts technology and results in your hands.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
                <Button
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold px-8 py-4 text-lg rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  onClick={() => navigate('/login/client')}
                >
                  EXPLORE FITCODE
                </Button>
               
                <Button
                  variant="outline"
                  className="border-2 border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white font-bold px-8 py-4 text-lg rounded-full transition-all duration-300"
                  onClick={() => {/* Demo action or modal */}}
                >
                  <Play className="w-5 h-5 mr-2" />
                  WATCH DEMO
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted by row: larger, animated logos */}
        <section className="w-full max-w-5xl mx-auto py-8 flex flex-col items-center">
          <h4 className="text-lg font-semibold text-gray-300 mb-4">Trusted by leading gyms</h4>
          <div className="flex flex-wrap gap-10 items-center justify-center">
            <img src="/public/2.png" alt="Gym 1" className="h-20 w-auto opacity-90 transition-transform duration-300 hover:scale-110 hover:shadow-xl animate-float-slow" />
            <img src="/public/3.png" alt="Gym 2" className="h-20 w-auto opacity-90 transition-transform duration-300 hover:scale-110 hover:shadow-xl animate-float-slow delay-100" />
            <img src="/public/4.png" alt="Gym 3" className="h-20 w-auto opacity-90 transition-transform duration-300 hover:scale-110 hover:shadow-xl animate-float-slow delay-200" />
            <img src="/public/5.png" alt="Gym 4" className="h-20 w-auto opacity-90 transition-transform duration-300 hover:scale-110 hover:shadow-xl animate-float-slow delay-300" />
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

        {/* SVG Divider */}
        <div className="w-full overflow-hidden" style={{lineHeight:0}}>
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="url(#gradient)" fillOpacity="1" d="M0,64L48,58.7C96,53,192,43,288,53.3C384,64,480,96,576,101.3C672,107,768,85,864,80C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" /><defs><linearGradient id="gradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#06b6d4" /><stop offset="1" stopColor="#a21caf" /></linearGradient></defs></svg>
        </div>

        {/* How FitCode Works Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-4xl md:text-5xl font-black text-center mb-16">
              How <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">FitCode</span> Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-r from-cyan-400 to-purple-500 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group transition-transform duration-300 hover:scale-110 hover:text-cyan-400">
                  <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 17v-2a4 4 0 0 1 4-4h2M7 7h.01M7 11h.01M7 15h.01M11 7h.01M11 11h.01M11 15h.01M15 7h.01M15 11h.01M15 15h.01" /></svg>
                </div>
                <h4 className="text-xl font-bold mb-2">Scan QR on Equipment</h4>
                <p className="text-gray-300">Make any gym machine smart by scanning its unique QR code.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-r from-yellow-400 to-pink-500 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group transition-transform duration-300 hover:scale-110 hover:text-cyan-400">
                  <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M4 6h16M4 18h16M4 6v12" /></svg>
                </div>
                <h4 className="text-xl font-bold mb-2">Watch Video Guides</h4>
                <p className="text-gray-300">Instantly access owner-uploaded video guides for safe and effective use.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group transition-transform duration-300 hover:scale-110 hover:text-cyan-400">
                  <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 3v18l7-5 7 5V3" /></svg>
                </div>
                <h4 className="text-xl font-bold mb-2">Bookmark Favorites</h4>
                <p className="text-gray-300">Save your most-used machines for quick access next time.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-r from-cyan-400 to-yellow-400 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group transition-transform duration-300 hover:scale-110 hover:text-cyan-400">
                  <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 17v-2a4 4 0 0 1 4-4h2" /><path d="M7 7h.01M7 11h.01M7 15h.01M11 7h.01M11 11h.01M11 15h.01M15 7h.01M15 11h.01M15 15h.01" /><path d="M12 20v-6M12 4v2m0 0a8 8 0 1 1-8 8" /></svg>
                </div>
                <h4 className="text-xl font-bold mb-2">AI Workout & Diet Plan</h4>
                <p className="text-gray-300">Get AI-powered workout and diet plans, downloadable as PDF for easy access.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-4xl font-black text-center mb-16">
              Fun, trainer led 
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text"> group classes</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-3xl p-8 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 transform hover:scale-105">
                <div className="bg-gradient-to-r from-cyan-400 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-8 w-8 text-black" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">AI-Powered Workouts</h4>
                <p className="text-gray-300 leading-relaxed">Get personalized routines and guidance, powered by advanced AI, for every fitness level and goal.</p>
              </div>
              
              <div className="group bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-3xl p-8 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 transform hover:scale-105">
                <div className="bg-gradient-to-r from-cyan-400 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Dumbbell className="h-8 w-8 text-black" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">Smart Equipment</h4>
                <p className="text-gray-300 leading-relaxed">Scan QR codes to unlock equipment instructions, tips, and track your usage with smart technology.</p>
              </div>
              
              <div className="group bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-3xl p-8 border border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300 transform hover:scale-105">
                <div className="bg-gradient-to-r from-cyan-400 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-8 w-8 text-black" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">Progress Tracking</h4>
                <p className="text-gray-300 leading-relaxed">Monitor your fitness journey with real-time analytics, achievements, and personalized insights.</p>
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
              <div className="text-6xl">🏋️‍♂️</div>
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
              onClick={() => navigate('/login/owner')}
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
    </div>
  );
};

export default LandingPage;

