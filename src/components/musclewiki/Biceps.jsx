import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Dumbbell } from "lucide-react";

const Biceps = () => {
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
          <h1 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Biceps</h1>
          {/* Chin Ups */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Chin Ups</h2>
            <p className="text-white/80 mb-2"><strong>Difficulty</strong>: Intermediate</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-bodyweight-chinup-front.gif" alt="Chin Up Front" />
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-bodyweight-chinup-side.gif" alt="Chin Up Side" />
            </div>
            <ol className="list-decimal list-inside text-white/90 space-y-2">
              <li>Grab the bar shoulder width apart with a supinated grip (palms facing you)</li>
              <li>With your body hanging and arms fully extended, pull yourself up until your chin is past the bar.</li>
              <li>Slowly return to starting position. Repeat.</li>
            </ol>
          </section>
          {/* Dumbbells Curl */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Dumbbells Curl</h2>
            <p className="text-white/80 mb-2"><strong>Difficulty</strong>: Beginner</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-dumbbell-curl-front.gif" alt="Dumbbell Curl Front" />
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-dumbbell-curl-side.gif" alt="Dumbbell Curl Side" />
            </div>
            <ol className="list-decimal list-inside text-white/90 space-y-2">
              <li>Stand up straight with a dumbbell in each hand at arm's length.</li>
              <li>Raise one dumbbell and twist your forearm until it is vertical and your palm faces the shoulder.</li>
              <li>Lower to original position and repeat with opposite arm</li>
            </ol>
          </section>
          {/* Dumbbells Hammer Curls */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Dumbbells Hammer Curls</h2>
            <p className="text-white/80 mb-2"><strong>Difficulty</strong>: Beginner</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-dumbbell-hammer-curl-front_JbvhNLU.gif" alt="Hammer Curl Front" />
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-dumbbell-hammer-curl-side_io6oHN7.gif" alt="Hammer Curl Side" />
            </div>
            <ol className="list-decimal list-inside text-white/90 space-y-2">
              <li>Hold the dumbbells with a neutral grip (thumbs facing the ceiling).</li>
              <li>Slowly lift the dumbbell up to chest height</li>
              <li>Return to starting position and repeat.</li>
            </ol>
          </section>
          {/* Dumbbells Reverse Curls */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Dumbbells Reverse Curls</h2>
            <p className="text-white/80 mb-2"><strong>Difficulty</strong>: Intermediate</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-dumbbell-reverse-curl-front.gif" alt="Reverse Curl Front" />
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-dumbbell-reverse-curl-side.gif" alt="Reverse Curl Side" />
            </div>
            <ol className="list-decimal list-inside text-white/90 space-y-2">
              <li>Grab the dumbbells with a pronated (overhand) grip. You can do this exercise thumbless if it's more comfortable on your wrists.</li>
              <li>Flex at the elbows until your biceps touch your forearms. Try not to let your elbows flair outward.</li>
            </ol>
          </section>
          {/* Barbell Curl */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Barbell Curl</h2>
            <p className="text-white/80 mb-2"><strong>Difficulty</strong>: Beginner</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-barbell-curl-front_uKPCb8P.gif" alt="Barbell Curl Front" />
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-barbell-curl-side_NN1ZFmi.gif" alt="Barbell Curl Side" />
            </div>
            <ol className="list-decimal list-inside text-white/90 space-y-2">
              <li>While holding the upper arms stationary, curl the weights forward while contracting the biceps as you breathe out.</li>
              <li>Continue the movement until your biceps are fully contracted and the bar is at shoulder level.</li>
              <li>Hold the contracted position for a second and squeeze the biceps hard.</li>
              <li>Slowly bring the weight back down to the starting position.</li>
            </ol>
          </section>
          {/* Reverse Barbell Curl */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Reverse Barbell Curl</h2>
            <p className="text-white/80 mb-2"><strong>Difficulty</strong>: Advanced</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-barbell-reverse-curl-front_ysdi82M.gif" alt="Reverse Barbell Curl Front" />
              <img className="w-full rounded-xl" src="/musclewiki/Images/male-barbell-reverse-curl-side_EGHsY3f.gif" alt="Reverse Barbell Curl Side" />
            </div>
            <ol className="list-decimal list-inside text-white/90 space-y-2">
              <li>Take a double overhand grip that's about shoulder width. Flex your elbows while keeping your elbows tucked in. Try not to let them flare out.</li>
              <li>Curl until your forearm presses into your bicep. Then fully extend your elbows at the bottom of each rep.</li>
            </ol>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Biceps; 