import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Dumbbell } from "lucide-react";

const LowerBack = () => {
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
          <h1 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Lower Back</h1>
          {/* Superman */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Superman</h2>
            <p className="text-white/80 mb-2"><strong>Difficulty</strong>: Beginner</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-bodyweight-superman-front.gif" alt="Superman Front" />
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-bodyweight-superman-side.gif" alt="Superman Side" />
            </div>
            <ol className="list-decimal list-inside text-white/90 space-y-2">
              <li>Lie face down on the floor with your arms extended in front of you.</li>
              <li>Lift your arms, chest, and legs off the ground simultaneously, hold, then lower back down.</li>
            </ol>
          </section>
          {/* Back Extension */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Back Extension</h2>
            <p className="text-white/80 mb-2"><strong>Difficulty</strong>: Intermediate</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-bodyweight-back-extension-front.gif" alt="Back Extension Front" />
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-bodyweight-back-extension-side.gif" alt="Back Extension Side" />
            </div>
            <ol className="list-decimal list-inside text-white/90 space-y-2">
              <li>Lie face down on a back extension bench, hook your feet under the footpads.</li>
              <li>Lower your upper body towards the ground, then raise it back up until your body is in a straight line.</li>
            </ol>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LowerBack; 