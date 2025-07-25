import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Dumbbell, Globe, AlertTriangle, Sparkles } from "lucide-react";
import { translateText, getLanguageName, allSupportedLanguages } from "../translationUtils";
import { Button } from "../ui/button";

// Section intro and warm-up/cool-down tips
const tricepsIntro = {
  intro: "The triceps are essential for elbow extension, pressing strength, and arm development. Training your triceps improves upper body power, athletic performance, and daily movement.",
  warmup: [
    "5 minutes of light cardio (e.g., arm swings, brisk walking)",
    "Dynamic stretches: triceps stretches, arm circles, gentle push-ups"
  ],
  cooldown: [
    "Gentle triceps and shoulder stretching",
    "Deep breathing and relaxation for 2-3 minutes"
  ]
};

const tricepsContent = [
  {
    title: "💪 Skull Crusher",
    video: "https://youtu.be/5yTIzPEnIDo?si=eoD1hzPL2ZJGOo9H",
    instructions: [
      "Lie flat on a bench holding an EZ bar or dumbbells above your chest.",
      "Keep your elbows fixed and slowly lower the weight toward your forehead.",
      "Stop just before touching, then push the weight back up by extending your arms.",
      "Repeat for desired reps."
    ],
    safetyTips: [
      "Keep your elbows locked in place to avoid shoulder involvement and reduce risk of injury.",
      "Avoid going too heavy — it puts pressure on your elbow joints and skull."
    ],
    proTips: [
      "Lower the bar slightly behind your head instead of directly to your forehead for more triceps stretch and safer form."
    ]
  },
  {
    title: "💪 Overhead Dumbbell Triceps Extension",
    video: "https://youtu.be/RxZbJsQhPhs?si=zkFMp5eGbEp9EGPk",
    instructions: [
      "Hold a dumbbell with both hands and lift it overhead.",
      "Keep elbows close to your ears and slowly lower the dumbbell behind your head.",
      "Pause briefly, then extend your arms to raise the dumbbell back overhead.",
      "Control the motion throughout the reps."
    ],
    safetyTips: [
      "Avoid flaring elbows — this reduces tension on the triceps and increases shoulder strain.",
      "Don't drop the dumbbell too low; stop at a point where you feel a stretch, not joint stress."
    ],
    proTips: [
      "Perform in a seated position with back support for better form and balance, especially with heavier weights."
    ]
  },
  {
    title: "💪 Cable Triceps Pushdown",
    video: "https://youtu.be/W0UQnLulZa4?si=5pNUJePrWwYO5Rnr",
    instructions: [
      "Stand upright at a cable machine with a bar or rope attachment.",
      "Grip the handle and tuck your elbows close to your torso.",
      "Push the bar down until your arms are fully extended.",
      "Slowly return to the starting position without letting the weights slam."
    ],
    safetyTips: [
      "Don’t let your elbows drift forward — this takes tension off the triceps and stresses the shoulders.",
      "Use a weight you can control to avoid jerking the cable."
    ],
    proTips: [
      "Squeeze your triceps at the bottom of each rep and pause for 1–2 seconds to increase muscle activation."
    ]
  },
  {
    title: "💪 Triceps Dips",
    video: "https://youtu.be/pL560PkMVXA?si=E9DG_YvsegA7tbr4",
    instructions: [
      "Position your hands shoulder-width apart on parallel bars or a bench.",
      "Lower your body by bending your elbows to a 90° angle.",
      "Push back up by extending your arms fully to return to the starting position.",
      "Keep your core tight and chest upright."
    ],
    safetyTips: [
      "Avoid going too deep — it can stress your shoulder joints. Stop when upper arms are parallel to the floor.",
      "Maintain control throughout to prevent shoulder strain and wobble."
    ],
    proTips: [
      "To target triceps more, keep your torso upright. Leaning forward shifts emphasis to the chest."
    ]
  }
];

const DIFFICULTY_COLORS = {
  Beginner: "bg-green-500/20 text-green-400 border-green-400/30",
  Intermediate: "bg-orange-500/20 text-orange-400 border-orange-400/30",
  Advanced: "bg-red-500/20 text-red-400 border-red-400/30"
};

const Triceps = () => {
  const navigate = useNavigate();
  const [translateEnabled, setTranslateEnabled] = useState(false);
  const [translateLanguage, setTranslateLanguage] = useState("hi");
  const [translatedContent, setTranslatedContent] = useState([]);
  const [translatedLabels, setTranslatedLabels] = useState({
    triceps: "Triceps"
  });
  const [translatedIntro, setTranslatedIntro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTranslate = async () => {
    if (translateEnabled) {
      setTranslateEnabled(false);
      setTranslateLanguage("hi");
      setTranslatedContent([]);
      setTranslatedLabels({ triceps: "Triceps" });
      setTranslatedIntro(null);
      setError("");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Translate static labels
      const tricepsLabel = await translateText("Triceps", translateLanguage);
      setTranslatedLabels({ triceps: tricepsLabel });
      // Translate section intro
      const [intro, ...warmup] = await Promise.all([
        translateText(tricepsIntro.intro, translateLanguage),
        ...tricepsIntro.warmup.map((item) => translateText(item, translateLanguage))
      ]);
      const cooldown = await Promise.all(tricepsIntro.cooldown.map((item) => translateText(item, translateLanguage)));
      setTranslatedIntro({ intro, warmup, cooldown });
      // Translate all titles, instructions, safetyTips, proTips
      const translated = await Promise.all(
        tricepsContent.map(async (section) => {
          const title = await translateText(section.title, translateLanguage);
          const instructions = section.instructions
            ? await Promise.all(section.instructions.map((step) => translateText(step, translateLanguage)))
            : [];
          const safetyTips = section.safetyTips
            ? await Promise.all(section.safetyTips.map((tip) => translateText(tip, translateLanguage)))
            : [];
          const proTips = section.proTips
            ? await Promise.all(section.proTips.map((tip) => translateText(tip, translateLanguage)))
            : [];
          return {
            ...section,
            title,
            instructions,
            safetyTips,
            proTips
          };
        })
      );
      setTranslatedContent(translated);
      setTranslateEnabled(true);
    } catch (err) {
      setError(err.message || "Failed to translate content");
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (e) => {
    setTranslateLanguage(e.target.value);
    setTranslateEnabled(false);
    setTranslatedContent([]);
    setTranslatedLabels({ triceps: "Triceps" });
    setTranslatedIntro(null);
    setError("");
  };

  const contentToRender = translateEnabled ? translatedContent : tricepsContent;
  const introToRender = translateEnabled && translatedIntro ? translatedIntro : tricepsIntro;

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
        {/* Section Intro */}
        <div className="mb-8 p-6 bg-white/10 rounded-2xl border border-white/10 shadow-lg animate-fade-in">
          <h2 className="text-2xl font-bold text-white mb-2">Why Train Your Triceps?</h2>
          <p className="text-white/80 mb-4">{introToRender.intro}</p>
          <div className="flex flex-col sm:flex-row gap-6">
            <div>
              <h3 className="text-lg font-semibold text-pink-300 mb-1">Warm-Up</h3>
              <ul className="list-disc list-inside text-white/70 text-base">
                {introToRender.warmup.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-1">Cool-Down</h3>
              <ul className="list-disc list-inside text-white/70 text-base">
                {introToRender.cooldown.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
        {/* Translation Controls - sticky/floating bar */}
        <div className="sticky top-4 z-40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 bg-white/10 backdrop-blur-xl rounded-2xl px-4 py-3 border border-white/10 shadow-lg">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleTranslate}
              className={`transition-all duration-300 hover:scale-105 ${
                translateEnabled ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
              disabled={loading}
            >
              <Globe className="h-4 w-4 mr-2" />
              {translateEnabled ? "Original" : "Translate"}
            </Button>
            <select
              className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={translateLanguage}
              onChange={handleLanguageChange}
              disabled={loading}
            >
              {allSupportedLanguages.filter(lang => lang !== 'en').map((lang) => (
                <option key={lang} value={lang} className="bg-slate-800 text-white">
                  {getLanguageName(lang)}
                </option>
              ))}
            </select>
            <span className="ml-2 text-xs text-white/60 hidden sm:inline-block">🌐 Translate this page</span>
          </div>
          {loading && <span className="text-white/80 text-sm">Translating...</span>}
          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-500/10 px-3 py-1 rounded-lg">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
        {/* Main Title with Icon and Gradient Underline */}
        <div className="flex items-center gap-3 mb-10 animate-fade-in">
          <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-xl flex items-center justify-center">
            <Sparkles className="h-7 w-7 text-yellow-300 animate-pulse" />
          </div>
          <h1 className="text-5xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text drop-shadow-lg">
            {translateEnabled ? translatedLabels.triceps : "Triceps"}
          </h1>
        </div>
        {/* Exercise Sections */}
        <div className="grid gap-8">
          {contentToRender.map((section, idx) => (
            <div
              key={idx}
              className="group relative bg-white-700/60 backdrop-blur-lg border border-gray-800 rounded-3xl shadow-2xl p-0 sm:p-0 mb-12 transition-all duration-300 hover:shadow-pink-200/40 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {/* Responsive Video */}
              {section.video && (
                <div className="w-full aspect-w-16 aspect-h-9 rounded-t-3xl overflow-hidden">
                  <iframe
                    src={section.video.replace('youtu.be/', 'www.youtube.com/embed/').replace('watch?v=', 'embed/').split('?')[0]}
                    title={section.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full min-h-[220px]"
                    style={{ minHeight: 220 }}
                  ></iframe>
                </div>
              )}
              <div className="p-6 sm:p-10 flex flex-col items-center">
                {/* Title */}
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 text-center">
                  {section.title}
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mb-6 mx-auto" />
                {/* Instructions */}
                {section.instructions && (
                  <div className="w-full max-w-xl mx-auto mb-6">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-pink-300 mb-2">
                      <span role="img" aria-label="instructions">✅</span> Instructions
                    </h3>
                    <ol className="list-decimal list-inside text-white space-y-2 text-base leading-relaxed pl-4">
                      {section.instructions.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
                {/* Safety Tips */}
                {section.safetyTips && (
                  <div className="w-full max-w-xl mx-auto mb-6">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-red-300 mb-2">
                      <span role="img" aria-label="safety">⚠️</span> Safety Tips
                    </h3>
                    <ul className="list-disc list-inside text-white text-base pl-4">
                      {section.safetyTips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Pro Tips */}
                {section.proTips && (
                  <div className="w-full max-w-xl mx-auto">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-yellow-200 mb-2">
                      <span role="img" aria-label="pro">⭐</span> Pro Tips
                    </h3>
                    <ul className="list-disc list-inside text-white text-base pl-4">
                      {section.proTips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Triceps; 