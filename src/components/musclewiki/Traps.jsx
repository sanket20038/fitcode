import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Dumbbell } from "lucide-react";

const Traps = () => {
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
          <h1 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Traps</h1>
          {/* Elevated Pike Press */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Elevated Pike Press</h2>
            <p className="text-white/80 mb-2"><strong>Difficulty</strong>: Intermediate</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <img className="w-full rounded-xl" src="/musclewiki/Images/Elevated Pike Press.gif" alt="Elevated Pike Press" />
              <img className="w-full rounded-xl" src="/musclewiki/Images/Elevated Pike Press Side.gif" alt="Elevated Pike Press Side" />
            </div>
            <ol className="list-decimal list-inside text-white/90 space-y-2">
              <li>Use a bench or an object to elevate your feet.</li>
              <li>Lower your head by bending your elbows towards the floor</li>
              <li>Push through your hands and reach the starting pike position</li>
              <li>Repeat</li>
            </ol>
          </section>
          {/* Elevated Pike Shoulder Shrug */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Elevated Pike Shoulder Shrug</h2>
            <p className="text-white/80 mb-2"><strong>Difficulty</strong>: Beginner</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <img className="w-full rounded-xl" src="/musclewiki/Images/Elevated Pike Shoulder Shrug.gif" alt="Elevated Pike Shoulder Shrug" />
              <img className="w-full rounded-xl" src="/musclewiki/Images/Elevated Pike Shoulder Shrug Side.gif" alt="Elevated Pike Shoulder Shrug Side" />
            </div>
            <ol className="list-decimal list-inside text-white/90 space-y-2">
              <li>Use a bench or an object like a chair to elevate your feet.</li>
              <li>Slowly lower your body (scapula) while keeping your elbows locked(this is key)</li>
              <li>Slowly raise your body back to the starting position</li>
            </ol>
          </section>
          {/* Dumbbells Shrugs */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Dumbbells Shrugs</h2>
            <p className="text-white/80 mb-2"><strong>Difficulty</strong>: Beginner</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-dumbbell-shrug-front.gif" alt="Dumbbell Shrug Front" />
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-dumbbell-shrug-side.gif" alt="Dumbbell Shrug Side" />
            </div>
            <ol className="list-decimal list-inside text-white/90 space-y-2">
              <li>Stand tall with two dumbbells. Pull your shoulder blades up. Give a one second squeeze at the top.</li>
            </ol>
          </section>
          {/* Dumbbells Seated Shrugs */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Dumbbells Seated Shrugs</h2>
            <p className="text-white/80 mb-2"><strong>Difficulty</strong>: Beginner</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-dumbbell-seated-shrug-front.gif" alt="Dumbbell Seated Shrug Front" />
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-dumbbell-seated-shrug-side.gif" alt="Dumbbell Seated Shrug Side" />
            </div>
            <ol className="list-decimal list-inside text-white/90 space-y-2">
              <li>Sit on a bench with dumbbells in both hands, palms facing your body, back straight.</li>
              <li>Elevate your shoulders and hold the contracted position at the apex of the motion</li>
              <li>Slowly lower your shoulders back to starting position.</li>
            </ol>
          </section>
          {/* Barbell Upright Row */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Barbell Upright Row</h2>
            <p className="text-white/80 mb-2"><strong>Difficulty</strong>: Advanced</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-barbell-upright-row-front_3ROsKgm.gif" alt="Barbell Upright Row Front" />
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-barbell-upright-row-side_NBzD3il.gif" alt="Barbell Upright Row Side" />
            </div>
            <ol className="list-decimal list-inside text-white/90 space-y-2">
              <li>Take a double overhand roughly shoulder width grip.</li>
              <li>Pull your elbows straight up the ceiling. Aim to get the bar to chin level or slightly higher.</li>
            </ol>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Traps; 