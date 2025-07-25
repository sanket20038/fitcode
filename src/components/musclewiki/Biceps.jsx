import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Dumbbell, Globe, AlertTriangle, Sparkles } from "lucide-react";
import { translateText, getLanguageName, allSupportedLanguages } from "../translationUtils";
import { Button } from "../ui/button";

// Section intro and warm-up/cool-down tips
const bicepsIntro = {
  intro: "The biceps are essential for arm strength, grip, and functional movement. Training your biceps improves pulling power, supports elbow health, and enhances the appearance of your arms.",
  warmup: [
    "5 minutes of light cardio (e.g., arm circles, brisk walking)",
    "Dynamic stretches: arm swings, wrist rotations, gentle biceps stretches"
  ],
  cooldown: [
    "Gentle biceps and forearm stretching",
    "Deep breathing and relaxation for 2-3 minutes"
  ]
};

const bicepsContent = [
  {
    title: "💪 Weighted Standing Curl (With Plate)",
    video: "https://youtu.be/PoWOEi42wHo?si=0wABgpZnXghs4BSE",
    instructions: [
      "Stand tall holding a weight plate with both hands from the sides.",
      "Keep elbows close to your body and curl the plate up toward your chest.",
      "Squeeze your biceps at the top, then slowly lower the plate back down."
    ],
    safetyTips: [
      "Don’t swing your back — use controlled motion to avoid injury.",
      "Keep your wrists neutral to prevent strain."
    ],
    proTips: [
      "Pause for a second at the top of the curl for maximum biceps contraction."
    ]
  },
  {
    title: "💪 Incline Dumbbell Curl",
    video: "https://youtu.be/wSAP_kGQ_WQ?si=wu445F_KI5XY1_oo",
    instructions: [
      "Sit back on an incline bench with a dumbbell in each hand.",
      "Let your arms hang straight down and curl the dumbbells up without moving your upper arms.",
      "Lower back slowly and repeat."
    ],
    safetyTips: [
      "Don't let the dumbbells drop — control the negative (lowering phase) to avoid elbow strain.",
      "Adjust the bench to a safe incline (~45–60°) to avoid excessive shoulder stretch."
    ],
    proTips: [
      "This position places your biceps in a fully stretched position, so keep your form strict for deep activation."
    ]
  },
  {
    title: "💪 Dumbbell Concentration Curl",
    video: "https://youtu.be/JnefPGaLLSs?si=qrsUbOyXmKVnsrPu",
    instructions: [
      "Sit on a bench, lean forward, and rest one elbow against your inner thigh.",
      "Curl the dumbbell up while keeping your upper arm stationary.",
      "Squeeze at the top and slowly lower the weight."
    ],
    safetyTips: [
      "Avoid using your back or swinging the dumbbell — isolate the biceps fully.",
      "Don’t lock your elbow at the bottom."
    ],
    proTips: [
      "Twist your wrist slightly inward at the top (supination) for a peak contraction."
    ]
  },
  {
    title: "💪 Barbell Curl",
    video: "https://youtu.be/45iriPT8oEI?si=belbObUxq5c-ZCV-",
    instructions: [
      "Hold a barbell with an underhand grip, shoulder-width apart.",
      "Keep your elbows tucked in and curl the bar up to your chest.",
      "Lower under control without swinging."
    ],
    safetyTips: [
      "Avoid rocking your body or using momentum — keep the movement slow and controlled.",
      "Don’t let the bar roll your wrists forward."
    ],
    proTips: [
      "Use a slightly narrower grip for inner biceps or wider grip for outer biceps focus."
    ]
  }
];

const DIFFICULTY_COLORS = {
  Beginner: "bg-green-500/20 text-green-400 border-green-400/30",
  Intermediate: "bg-orange-500/20 text-orange-400 border-orange-400/30",
  Advanced: "bg-red-500/20 text-red-400 border-red-400/30"
};

const Biceps = () => {
  const navigate = useNavigate();
  const [translateEnabled, setTranslateEnabled] = useState(false);
  const [translateLanguage, setTranslateLanguage] = useState("hi");
  const [translatedContent, setTranslatedContent] = useState([]);
  const [translatedLabels, setTranslatedLabels] = useState({
    biceps: "Biceps"
  });
  const [translatedIntro, setTranslatedIntro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTranslate = async () => {
    if (translateEnabled) {
      setTranslateEnabled(false);
      setTranslateLanguage("hi");
      setTranslatedContent([]);
      setTranslatedLabels({ biceps: "Biceps" });
      setTranslatedIntro(null);
      setError("");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Translate static labels
      const bicepsLabel = await translateText("Biceps", translateLanguage);
      setTranslatedLabels({ biceps: bicepsLabel });
      // Translate section intro
      const [intro, ...warmup] = await Promise.all([
        translateText(bicepsIntro.intro, translateLanguage),
        ...bicepsIntro.warmup.map((item) => translateText(item, translateLanguage))
      ]);
      const cooldown = await Promise.all(bicepsIntro.cooldown.map((item) => translateText(item, translateLanguage)));
      setTranslatedIntro({ intro, warmup, cooldown });
      // Translate all titles, instructions, safetyTips, proTips
      const translated = await Promise.all(
        bicepsContent.map(async (section) => {
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
    setTranslatedLabels({ biceps: "Biceps" });
    setTranslatedIntro(null);
    setError("");
  };

  const contentToRender = translateEnabled ? translatedContent : bicepsContent;
  const introToRender = translateEnabled && translatedIntro ? translatedIntro : bicepsIntro;

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
          <h2 className="text-2xl font-bold text-white mb-2">Why Train Your Biceps?</h2>
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
            {translateEnabled ? translatedLabels.biceps : "Biceps"}
          </h1>
        </div>
        {/* Exercise Sections */}
        <div className="grid gap-8">
          {contentToRender.map((section, idx) => (
            <div
              key={idx}
              className="group relative bg-gray-900/70 backdrop-blur-lg border border-gray-800 rounded-3xl shadow-2xl p-0 sm:p-0 mb-12 transition-all duration-300 hover:shadow-pink-200/40 hover:-translate-y-1 animate-fade-in"
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

export default Biceps; 