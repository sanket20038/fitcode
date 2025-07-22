import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Dumbbell } from "lucide-react";

const Triceps = () => {
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
          <h1 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Triceps</h1>
          {/* Dips */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Dips</h2>
            <p className="text-white/80 mb-2"><strong>Difficulty</strong>: Intermediate</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-bodyweight-dips-front.gif" alt="Dips Front" />
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-bodyweight-dips-side.gif" alt="Dips Side" />
            </div>
            <ol className="list-decimal list-inside text-white/90 space-y-2">
              <li>Hold your body with arms locked above the equipment</li>
              <li>Lower your body slowly while leaning forward, flare out your elbows</li>
              <li>Raise your body above the bars until your arms are locked.</li>
            </ol>
          </section>
          {/* Diamond Push Ups */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Diamond Push Ups</h2>
            <p className="text-white/80 mb-2"><strong>Difficulty</strong>: Beginner</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <img className="w-full rounded-xl" src="/musclewiki/Images/-bodyweight-diamond-pushup-front.gif" alt="Diamond Push Up Front" />
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-bodyweight-diamond-pushup-side.gif" alt="Diamond Push Up Side" />
            </div>
            <ol className="list-decimal list-inside text-white/90 space-y-2">
              <li>Position your index fingers and thumbs so they are touching, forming a diamond shape</li>
              <li>Use a standard push up position</li>
              <li>Lower your chest towards your hands, keep your elbows close to your body</li>
              <li>Stop just before your chest touches the floor, then push back up to the starting position.</li>
            </ol>
          </section>
          {/* Bench Dips */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Bench Dips</h2>
            <p className="text-white/80 mb-2"><strong>Difficulty</strong>: Beginner</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-bodyweight-tricep-dips-front.gif" alt="Bench Dips Front" />
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-bodyweight-tricep-dips-side.gif" alt="Bench Dips Side" />
            </div>
            <ol className="list-decimal list-inside text-white/90 space-y-2">
              <li>Grip the edge of the bench with your hands, Keep your feet together and legs straight.</li>
              <li>Lower your body straight down.</li>
              <li>Slowly press back up to the starting point.</li>
              <li>TIP: Make this harder by raising your feet off the floor and adding weight.</li>
            </ol>
          </section>
          {/* Seated Overhead Triceps Extension */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Seated Overhead Triceps Extension</h2>
            <p className="text-white/80 mb-2"><strong>Difficulty</strong>: Intermediate</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-dumbbell-overhead-tricep-extension-front.gif" alt="Overhead Triceps Extension Front" />
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-dumbbell-overhead-tricep-extension-side.gif" alt="Overhead Triceps Extension Side" />
            </div>
            <ol className="list-decimal list-inside text-white/90 space-y-2">
              <li>Sit on the bench and hold a dumbbell with both hands. Raise the dumbbell overhead at arms length, holding the weight up with the palms of your hands.</li>
              <li>Keep your elbows in while you lower the weight behind your head, your upper arms stationary.</li>
              <li>Raise the weight back to starting position.</li>
            </ol>
          </section>
          {/* Laying Triceps Extension */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Laying Triceps Extension</h2>
            <p className="text-white/80 mb-2"><strong>Difficulty</strong>: Intermediate</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-barbell-laying-tricep-extensions-front.gif" alt="Laying Triceps Extension Front" />
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-barbell-laying-tricep-extensions-side.gif" alt="Laying Triceps Extension Side" />
            </div>
            <ol className="list-decimal list-inside text-white/90 space-y-2">
              <li>Lay on a flat bench while holding a barbell with a shoulder-width grip.</li>
              <li>Fully extend your elbows until the barbell is directly over your chest.</li>
              <li>Begin to flex your elbows and allow the barbell to nearly touch your forehead.</li>
              <li>Extend your elbows back to the starting position and repeat.</li>
            </ol>
          </section>
          {/* Barbell SkullCrusher */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Barbell SkullCrusher</h2>
            <p className="text-white/80 mb-2"><strong>Difficulty</strong>: Intermediate</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-barbell-skullcrusher-front_qpHWUa8.gif" alt="Barbell SkullCrusher Front" />
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-barbell-skullcrusher-side_B7Z6225.gif" alt="Barbell SkullCrusher Side" />
            </div>
            <ol className="list-decimal list-inside text-white/90 space-y-2">
              <li>Take a shoulder width grip. Break at the elbows. Try to keep your elbows tucked in. Don't let them flare out.</li>
              <li>Stop the bar a few inches from your forehead and extend your elbows back up.</li>
            </ol>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Triceps; 