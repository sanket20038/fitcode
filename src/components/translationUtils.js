// translationUtils.js

// List of all supported languages
export const allSupportedLanguages = [
  'en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'ar', 'hi', 'bn',
  'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'or', 'pa', 'tr'
];

// Helper to get language name from code
export const getLanguageName = (code) => {
  const languageNames = {
    'en': 'English', 'es': 'Español', 'fr': 'Français', 'de': 'Deutsch',
    'it': 'Italiano', 'pt': 'Português', 'zh': '中文', 'ja': '日本語',
    'ko': '한국어', 'ar': 'العربية', 'hi': 'हिन्दी', 'bn': 'বাংলা',
    'ta': 'தமிழ்', 'te': 'తెలుగు', 'mr': 'मराठी', 'gu': 'ગુજરાતી',
    'kn': 'ಕನ್ನಡ', 'ml': 'മലയാളം', 'or': 'ଓଡ଼ିଆ', 'pa': 'ਪੰਜਾਬੀ', 'tr': 'Türkçe'
  };
  return languageNames[code] || code.toUpperCase();
};

// Translation function (Google Translate API, fallback to LibreTranslate)
export const translateText = async (text, targetLang) => {
  if (!text || targetLang === 'en') return text;

  const languageMapping = {
    'hi': 'hi', 'mr': 'mr', 'bn': 'bn', 'ta': 'ta', 'te': 'te', 'gu': 'gu',
    'kn': 'kn', 'ml': 'ml', 'or': 'or', 'pa': 'pa', 'es': 'es', 'fr': 'fr',
    'de': 'de', 'it': 'it', 'pt': 'pt', 'zh': 'zh-cn', 'ja': 'ja', 'ko': 'ko',
    'ar': 'ar', 'tr': 'tr'
  };
  const mappedLang = languageMapping[targetLang] || targetLang;

  try {
    // Google Translate API (unofficial)
    const googleResponse = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${mappedLang}&dt=t&q=${encodeURIComponent(text)}`
    );
    if (googleResponse.ok) {
      const googleData = await googleResponse.json();
      if (googleData && googleData[0] && googleData[0].length > 0) {
        let translatedText = '';
        for (let i = 0; i < googleData[0].length; i++) {
          if (googleData[0][i][0]) {
            translatedText += googleData[0][i][0];
          }
        }
        if (translatedText.trim()) {
          return translatedText;
        }
      }
    }
    // Fallback: LibreTranslate
    const libreResponse = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text, source: 'en', target: mappedLang, format: 'text'
      })
    });
    if (libreResponse.ok) {
      const libreData = await libreResponse.json();
      if (libreData.translatedText) {
        return libreData.translatedText;
      }
    }
    throw new Error('Translation services failed');
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error(`Failed to translate to ${getLanguageName(targetLang)}. Please try again.`);
  }
}; 