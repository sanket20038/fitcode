import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Dumbbell } from "lucide-react";

const Abdominals = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
      {/* Nav Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
          <button
            onClick={() => navigate('/client/dashboard')}
            className="mr-4 flex items-center text-white hover:text-pink-400 transition"
          >
            <ArrowLeft className="h-6 w-6 mr-1" />
            <span className="font-semibold">Back</span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-2xl shadow-xl">
                <Dumbbell className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
            <h1 className="text-lg sm:text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              FitCode
            </h1>
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white/5 border-white/10 backdrop-blur-xl shadow-xl rounded-2xl p-8">
          <h1 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Abdominals</h1>
          {/* Crunches */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Crunches</h2>
            <p className="text-white/80 mb-2"><strong>Difficulty</strong>: Beginner</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-bodyweight-crunch-front.gif" alt="Crunch Front" />
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-bodyweight-crunch-side.gif" alt="Crunch Side" />
            </div>
            <ol className="list-decimal list-inside text-white/90 space-y-2">
              <li>Lay flat on your back with your knees bent and your feet flat on the ground, about a foot from your lower back.</li>
              <li>Place your fingertips on your temples with your palms facing out.</li>
              <li>Draw your belly into the base of your spine to engage the muscles, then raise your head and shoulders off the floor. Return to starting position and repeat.</li>
            </ol>
          </section>
          {/* Leg Raises */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Leg Raises</h2>
            <p className="text-white/80 mb-2"><strong>Difficulty</strong>: Beginner</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-bodyweight-leg-raises-front.gif" alt="Leg Raises Front" />
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-bodyweight-leg-raises-side.gif" alt="Leg Raises Side" />
            </div>
            <ol className="list-decimal list-inside text-white/90 space-y-2">
              <li>Lay on your back with your arms palms down on either side.</li>
              <li>Keep your legs together and as straight as possible.</li>
              <li>Slowly raise your legs to a 90° angle, pause at this position, or as high as you can reach your legs, and then slowly lower your legs back down.</li>
              <li>Duration of these movements should be slow so that you do not utilize momentum, enabling you to get the most out of the exercise.</li>
            </ol>
          </section>
          {/* Plank */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Plank</h2>
            <p className="text-white/80 mb-2"><strong>Difficulty</strong>: Beginner</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-bodyweight-forearm-plank-front.gif" alt="Plank Front" />
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-bodyweight-forarm-plank-side.gif" alt="Plank Side" />
            </div>
            <ol className="list-decimal list-inside text-white/90 space-y-2">
              <li>Place forearms on the ground with your elbows bent at a 90° angle aligned beneath your shoulders, with your arms parallel at shoulder-width.</li>
              <li>Your feet should be together, with only your toes touching the floor.</li>
              <li>Lift your belly off the floor and form a straight line from your heels to the crown of your head and hold.</li>
            </ol>
          </section>
          {/* Russian Twist */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Russian Twist</h2>
            <p className="text-white/80 mb-2"><strong>Difficulty</strong>: Intermediate</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-dumbbell-russian-twist-front.gif" alt="Russian Twist Front" />
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-dumbbell-russian-twist-side.gif" alt="Russian Twist Side" />
            </div>
            <ol className="list-decimal list-inside text-white/90 space-y-2">
              <li>Sit on the floor and flex your knees and hips to a 90 degree angle.</li>
              <li>Your feet should be hovering off the ground. (If that's too hard start with heels on the floor)</li>
              <li>Rotate your upper spine to engage your obliques.</li>
            </ol>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Abdominals; 