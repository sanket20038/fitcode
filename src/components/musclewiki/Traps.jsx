import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Dumbbell, Globe, AlertTriangle, Sparkles } from "lucide-react";
import { translateText, getLanguageName, allSupportedLanguages } from "../translationUtils";
import { Button } from "../ui/button";

const trapsContent = [
  {
    title: "Elevated Pike Press",
    difficulty: "Intermediate",
    images: [
      { src: "/musclewiki/Images/Elevated Pike Press.gif", alt: "Elevated Pike Press" },
      { src: "/musclewiki/Images/Elevated Pike Press Side.gif", alt: "Elevated Pike Press Side" }
    ],
    steps: [
      "Use a bench or an object to elevate your feet.",
      "Lower your head by bending your elbows towards the floor",
      "Push through your hands and reach the starting pike position",
      "Repeat"
    ]
  },
  {
    title: "Elevated Pike Shoulder Shrug",
    difficulty: "Beginner",
    images: [
      { src: "/musclewiki/Images/Elevated Pike Shoulder Shrug.gif", alt: "Elevated Pike Shoulder Shrug" },
      { src: "/musclewiki/Images/Elevated Pike Shoulder Shrug Side.gif", alt: "Elevated Pike Shoulder Shrug Side" }
    ],
    steps: [
      "Use a bench or an object like a chair to elevate your feet.",
      "Slowly lower your body (scapula) while keeping your elbows locked(this is key)",
      "Slowly raise your body back to the starting position"
    ]
  },
  {
    title: "Dumbbells Shrugs",
    difficulty: "Beginner",
    images: [
      { src: "/musclewiki/Images/male-dumbbell-shrug-front.gif", alt: "Dumbbell Shrug Front" },
      { src: "/musclewiki/Images/male-dumbbell-shrug-side.gif", alt: "Dumbbell Shrug Side" }
    ],
    steps: [
      "Stand tall with two dumbbells. Pull your shoulder blades up. Give a one second squeeze at the top."
    ]
  },
  {
    title: "Dumbbells Seated Shrugs",
    difficulty: "Beginner",
    images: [
      { src: "/musclewiki/Images/male-dumbbell-seated-shrug-front.gif", alt: "Dumbbell Seated Shrug Front" },
      { src: "/musclewiki/Images/male-dumbbell-seated-shrug-side.gif", alt: "Dumbbell Seated Shrug Side" }
    ],
    steps: [
      "Sit on a bench with dumbbells in both hands, palms facing your body, back straight.",
      "Elevate your shoulders and hold the contracted position at the apex of the motion",
      "Slowly lower your shoulders back to starting position."
    ]
  },
  {
    title: "Barbell Upright Row",
    difficulty: "Advanced",
    images: [
      { src: "/musclewiki/Images/male-barbell-upright-row-front_3ROsKgm.gif", alt: "Barbell Upright Row Front" },
      { src: "/musclewiki/Images/male-barbell-upright-row-side_NBzD3il.gif", alt: "Barbell Upright Row Side" }
    ],
    steps: [
      "Take a double overhand roughly shoulder width grip.",
      "Pull your elbows straight up the ceiling. Aim to get the bar to chin level or slightly higher."
    ]
  }
];

const DIFFICULTY_COLORS = {
  Beginner: "bg-green-500/20 text-green-400 border-green-400/30",
  Intermediate: "bg-orange-500/20 text-orange-400 border-orange-400/30",
  Advanced: "bg-red-500/20 text-red-400 border-red-400/30"
};

const Traps = () => {
  const navigate = useNavigate();
  const [translateEnabled, setTranslateEnabled] = useState(false);
  const [translateLanguage, setTranslateLanguage] = useState("hi");
  const [translatedContent, setTranslatedContent] = useState([]);
  const [translatedLabels, setTranslatedLabels] = useState({
    traps: "Traps",
    difficulty: "Difficulty"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTranslate = async () => {
    if (translateEnabled) {
      setTranslateEnabled(false);
      setTranslateLanguage("hi");
      setTranslatedContent([]);
      setTranslatedLabels({ traps: "Traps", difficulty: "Difficulty" });
      setError("");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Translate static labels
      const [trapsLabel, difficultyLabel] = await Promise.all([
        translateText("Traps", translateLanguage),
        translateText("Difficulty", translateLanguage)
      ]);
      setTranslatedLabels({
        traps: trapsLabel,
        difficulty: difficultyLabel
      });
      // Translate all titles, difficulties, and steps
      const translated = await Promise.all(
        trapsContent.map(async (section) => {
          const [title, difficulty, ...steps] = await Promise.all([
            translateText(section.title, translateLanguage),
            translateText(section.difficulty, translateLanguage),
            ...section.steps.map((step) => translateText(step, translateLanguage))
          ]);
          return {
            ...section,
            title,
            difficulty,
            steps
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
    setTranslatedLabels({ traps: "Traps", difficulty: "Difficulty" });
    setError("");
  };

  const contentToRender = translateEnabled ? translatedContent : trapsContent;

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
            {translateEnabled ? translatedLabels.traps : "Traps"}
          </h1>
        </div>
        {/* Exercise Sections */}
        <div className="grid gap-8">
          {contentToRender.map((section, idx) => (
            <div
              key={idx}
              className="group relative bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/20 animate-fade-in"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {/* Section Title and Difficulty Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-1 sm:mb-0 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                  {section.title}
                </h2>
                <span
                  className={`inline-block px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wide ${DIFFICULTY_COLORS[section.difficulty] || "bg-gray-500/20 text-gray-300 border-gray-400/30"}`}
                >
                  {section.difficulty}
                </span>
              </div>
              {/* Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {section.images.map((img, i) => (
                  <div key={i} className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-pink-400/20 transition-all">
                    <img
                      className="w-full h-48 object-cover object-center rounded-2xl border border-white/10"
                      src={img.src}
                      alt={img.alt}
                    />
                  </div>
                ))}
              </div>
              {/* Steps */}
              <ol className="list-decimal list-inside text-white/90 space-y-3 text-lg leading-relaxed pl-4">
                {section.steps.map((step, i) => (
                  <li key={i} className="transition-all duration-300 hover:text-pink-300">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Traps; 