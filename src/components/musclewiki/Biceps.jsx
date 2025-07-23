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
    title: "Chin Ups",
    difficulty: "Intermediate",
    muscleFocus: "Biceps brachii, forearms, back",
    benefits: [
      "Builds upper body and arm strength",
      "Improves grip strength",
      "Engages multiple muscle groups"
    ],
    images: [
      { src: "/musclewiki/Images/male-bodyweight-chinup-front.gif", alt: "Person performing chin up, front view" },
      { src: "/musclewiki/Images/male-bodyweight-chinup-side.gif", alt: "Person performing chin up, side view" }
    ],
    steps: [
      "Grab the bar shoulder width apart with a supinated grip (palms facing you).",
      "With your body hanging and arms fully extended, pull yourself up until your chin is past the bar.",
      "Slowly return to starting position. Repeat."
    ],
    proTips: [
      "Engage your core to prevent swinging.",
      "Pull your chest toward the bar for better biceps activation."
    ],
    safetyTips: [
      "Avoid jerking or kipping movements.",
      "Lower yourself with control to protect your elbows."
    ],
    commonMistakes: [
      "Using momentum instead of muscle strength.",
      "Letting shoulders shrug up toward ears."
    ]
  },
  {
    title: "Dumbbells Curl",
    difficulty: "Beginner",
    muscleFocus: "Biceps brachii, brachialis, forearms",
    benefits: [
      "Isolates and strengthens the biceps",
      "Improves arm definition",
      "Enhances grip strength"
    ],
    images: [
      { src: "/musclewiki/Images/male-dumbbell-curl-front.gif", alt: "Person performing dumbbell curl, front view" },
      { src: "/musclewiki/Images/male-dumbbell-curl-side.gif", alt: "Person performing dumbbell curl, side view" }
    ],
    steps: [
      "Stand up straight with a dumbbell in each hand at arm's length.",
      "Raise one dumbbell and twist your forearm until it is vertical and your palm faces the shoulder.",
      "Lower to original position and repeat with opposite arm."
    ],
    proTips: [
      "Keep your elbows close to your torso.",
      "Squeeze your biceps at the top of the movement."
    ],
    safetyTips: [
      "Avoid swinging your body or using momentum.",
      "Keep your wrists straight to prevent strain."
    ],
    commonMistakes: [
      "Letting elbows drift forward or outward.",
      "Not fully extending arms at the bottom."
    ]
  },
  {
    title: "Dumbbells Hammer Curls",
    difficulty: "Beginner",
    muscleFocus: "Brachialis, biceps brachii, forearms",
    benefits: [
      "Targets both biceps and forearms",
      "Improves grip and arm strength",
      "Reduces risk of muscle imbalances"
    ],
    images: [
      { src: "/musclewiki/Images/male-dumbbell-hammer-curl-front_JbvhNLU.gif", alt: "Person performing hammer curl, front view" },
      { src: "/musclewiki/Images/male-dumbbell-hammer-curl-side_io6oHN7.gif", alt: "Person performing hammer curl, side view" }
    ],
    steps: [
      "Hold the dumbbells with a neutral grip (thumbs facing the ceiling).",
      "Slowly lift the dumbbell up to chest height.",
      "Return to starting position and repeat."
    ],
    proTips: [
      "Keep your upper arms stationary.",
      "Move slowly for maximum muscle engagement."
    ],
    safetyTips: [
      "Avoid swinging the weights.",
      "Keep your wrists neutral."
    ],
    commonMistakes: [
      "Using momentum to lift the weights.",
      "Letting elbows flare out."
    ]
  },
  {
    title: "Dumbbells Reverse Curls",
    difficulty: "Intermediate",
    muscleFocus: "Brachioradialis, biceps brachii, forearms",
    benefits: [
      "Strengthens forearms and biceps",
      "Improves grip strength",
      "Targets different arm muscles than standard curls"
    ],
    images: [
      { src: "/musclewiki/Images/male-dumbbell-reverse-curl-front.gif", alt: "Person performing reverse curl, front view" },
      { src: "/musclewiki/Images/male-dumbbell-reverse-curl-side.gif", alt: "Person performing reverse curl, side view" }
    ],
    steps: [
      "Grab the dumbbells with a pronated (overhand) grip. You can do this exercise thumbless if it's more comfortable on your wrists.",
      "Flex at the elbows until your biceps touch your forearms. Try not to let your elbows flare outward."
    ],
    proTips: [
      "Keep your wrists straight throughout the movement.",
      "Lower the weights slowly for extra control."
    ],
    safetyTips: [
      "Avoid using too much weight.",
      "Stop if you feel wrist pain."
    ],
    commonMistakes: [
      "Letting wrists bend excessively.",
      "Using momentum to lift the weights."
    ]
  },
  {
    title: "Barbell Curl",
    difficulty: "Beginner",
    muscleFocus: "Biceps brachii, brachialis, forearms",
    benefits: [
      "Builds overall arm strength",
      "Improves muscle definition",
      "Allows for progressive overload"
    ],
    images: [
      { src: "/musclewiki/Images/male-barbell-curl-front_uKPCb8P.gif", alt: "Person performing barbell curl, front view" },
      { src: "/musclewiki/Images/male-barbell-curl-side_NN1ZFmi.gif", alt: "Person performing barbell curl, side view" }
    ],
    steps: [
      "While holding the upper arms stationary, curl the weights forward while contracting the biceps as you breathe out.",
      "Continue the movement until your biceps are fully contracted and the bar is at shoulder level.",
      "Hold the contracted position for a second and squeeze the biceps hard.",
      "Slowly bring the weight back down to the starting position."
    ],
    proTips: [
      "Keep your elbows tucked in at your sides.",
      "Exhale as you lift the bar."
    ],
    safetyTips: [
      "Do not arch your back.",
      "Use a weight you can control."
    ],
    commonMistakes: [
      "Swinging the bar or using momentum.",
      "Not fully extending arms at the bottom."
    ]
  },
  {
    title: "Reverse Barbell Curl",
    difficulty: "Advanced",
    muscleFocus: "Brachioradialis, biceps brachii, forearms",
    benefits: [
      "Targets forearms and biceps",
      "Improves grip and wrist strength",
      "Adds variety to arm training"
    ],
    images: [
      { src: "/musclewiki/Images/male-barbell-reverse-curl-front_ysdi82M.gif", alt: "Person performing reverse barbell curl, front view" },
      { src: "/musclewiki/Images/male-barbell-reverse-curl-side_EGHsY3f.gif", alt: "Person performing reverse barbell curl, side view" }
    ],
    steps: [
      "Take a double overhand grip that's about shoulder width. Flex your elbows while keeping your elbows tucked in. Try not to let them flare out.",
      "Curl until your forearm presses into your bicep. Then fully extend your elbows at the bottom of each rep."
    ],
    proTips: [
      "Keep your elbows close to your body.",
      "Lower the bar slowly for more muscle activation."
    ],
    safetyTips: [
      "Avoid using excessive weight.",
      "Stop if you feel wrist or elbow pain."
    ],
    commonMistakes: [
      "Letting elbows flare out.",
      "Using momentum to lift the bar."
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
    biceps: "Biceps",
    difficulty: "Difficulty"
  });
  const [translatedIntro, setTranslatedIntro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTranslate = async () => {
    if (translateEnabled) {
      setTranslateEnabled(false);
      setTranslateLanguage("hi");
      setTranslatedContent([]);
      setTranslatedLabels({ biceps: "Biceps", difficulty: "Difficulty" });
      setTranslatedIntro(null);
      setError("");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Translate static labels
      const [bicepsLabel, difficultyLabel] = await Promise.all([
        translateText("Biceps", translateLanguage),
        translateText("Difficulty", translateLanguage)
      ]);
      setTranslatedLabels({
        biceps: bicepsLabel,
        difficulty: difficultyLabel
      });
      // Translate section intro
      const [intro, ...warmup] = await Promise.all([
        translateText(bicepsIntro.intro, translateLanguage),
        ...bicepsIntro.warmup.map((item) => translateText(item, translateLanguage))
      ]);
      const cooldown = await Promise.all(bicepsIntro.cooldown.map((item) => translateText(item, translateLanguage)));
      setTranslatedIntro({ intro, warmup, cooldown });
      // Translate all titles, difficulties, muscleFocus, steps, benefits, proTips, safetyTips, commonMistakes
      const translated = await Promise.all(
        bicepsContent.map(async (section) => {
          const [title, difficulty, muscleFocus, ...steps] = await Promise.all([
            translateText(section.title, translateLanguage),
            translateText(section.difficulty, translateLanguage),
            translateText(section.muscleFocus, translateLanguage),
            ...section.steps.map((step) => translateText(step, translateLanguage))
          ]);
          const benefits = section.benefits
            ? await Promise.all(section.benefits.map((b) => translateText(b, translateLanguage)))
            : [];
          const proTips = section.proTips
            ? await Promise.all(section.proTips.map((tip) => translateText(tip, translateLanguage)))
            : [];
          const safetyTips = section.safetyTips
            ? await Promise.all(section.safetyTips.map((tip) => translateText(tip, translateLanguage)))
            : [];
          const commonMistakes = section.commonMistakes
            ? await Promise.all(section.commonMistakes.map((tip) => translateText(tip, translateLanguage)))
            : [];
          return {
            ...section,
            title,
            difficulty,
            muscleFocus,
            steps,
            benefits,
            proTips,
            safetyTips,
            commonMistakes
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
    setTranslatedLabels({ biceps: "Biceps", difficulty: "Difficulty" });
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
              {/* Muscle Focus and Benefits */}
              <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm text-yellow-300 font-semibold">Muscle Focus: {section.muscleFocus}</span>
                <ul className="flex flex-wrap gap-2 text-xs text-green-300">
                  {section.benefits && section.benefits.map((b, i) => <li key={i} className="bg-green-900/30 px-2 py-1 rounded-lg">{b}</li>)}
                </ul>
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
              <ol className="list-decimal list-inside text-white/90 space-y-3 text-lg leading-relaxed pl-4 mb-2">
                {section.steps.map((step, i) => (
                  <li key={i} className="transition-all duration-300 hover:text-pink-300">
                    {step}
                  </li>
                ))}
              </ol>
              {/* Pro Tips, Safety Tips, Common Mistakes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="bg-purple-900/20 rounded-xl p-3">
                  <h4 className="text-purple-300 font-bold mb-1 text-sm">Pro Tips</h4>
                  <ul className="list-disc list-inside text-white/80 text-sm">
                    {section.proTips && section.proTips.map((tip, i) => <li key={i}>{tip}</li>)}
                  </ul>
                </div>
                <div className="bg-red-900/20 rounded-xl p-3">
                  <h4 className="text-red-300 font-bold mb-1 text-sm">Safety Tips</h4>
                  <ul className="list-disc list-inside text-white/80 text-sm">
                    {section.safetyTips && section.safetyTips.map((tip, i) => <li key={i}>{tip}</li>)}
                  </ul>
                </div>
                <div className="bg-yellow-900/20 rounded-xl p-3">
                  <h4 className="text-yellow-300 font-bold mb-1 text-sm">Common Mistakes</h4>
                  <ul className="list-disc list-inside text-white/80 text-sm">
                    {section.commonMistakes && section.commonMistakes.map((tip, i) => <li key={i}>{tip}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Biceps; 