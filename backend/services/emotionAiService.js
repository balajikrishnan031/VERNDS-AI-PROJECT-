// Emotion AI & Multilingual Atrocity NLP Parsing Service

const traumaDictionary = {
  highRiskTerms: [
    "rape", "murder", "kill", "death threat", "suicide", "burn", "social boycott", "arson", "hanged",
    "जाति सूचक", "मार डाला", "जान से मारने", "आत्महत्या", "गाँव से बाहर", "घर में आग",
    "கொலை", "பாலியல் வன்கொடுமை", "தற்கொலை", "சாதி கொடுமை", "ஊரை விட்டு தள்ளுபடி", "அச்சுறுத்தல்"
  ],
  moderateRiskTerms: [
    "threat", "abuse", "slur", "pushed", "denied water", "wages cut", "harassment",
    "धमकी", "गाली-गलौज", "पानी नहीं भरने देना", "मजबूरी",
    "பயமுறுத்தல்", "ஏளனம்", "வேலை மறுப்பு"
  ]
};

const EmotionAiService = {
  analyzeText(textNarrative = "") {
    const lowerText = textNarrative.toLowerCase();
    let highMatches = [];
    let modMatches = [];

    traumaDictionary.highRiskTerms.forEach(term => {
      if (lowerText.includes(term.toLowerCase())) highMatches.push(term);
    });

    traumaDictionary.moderateRiskTerms.forEach(term => {
      if (lowerText.includes(term.toLowerCase())) modMatches.push(term);
    });

    let fearScore = Math.min(98, (highMatches.length * 28 + modMatches.length * 14 + (textNarrative.length > 50 ? 20 : 10)));
    let panicScore = Math.min(95, (highMatches.length * 30 + (lowerText.includes("!") || lowerText.includes("help") || lowerText.includes("बचाओ") ? 25 : 10)));
    let despairScore = Math.min(90, (lowerText.includes("suicide") || lowerText.includes("आत्महत्या") || lowerText.includes("தற்கொலை") ? 88 : 30));
    let angerScore = Math.min(85, (modMatches.length * 20 + 15));

    let suicidalIdeation = (lowerText.includes("suicide") || lowerText.includes("end my life") || lowerText.includes("आत्महत्या") || lowerText.includes("தற்கொலை")) ? 85 : 5;
    let nlpDistressScore = Math.round((fearScore * 0.35) + (panicScore * 0.30) + (despairScore * 0.25) + (suicidalIdeation * 0.10));

    // Classify Crime Type
    let crimeCategory = "General Grievance & Discrimination";
    if (highMatches.length > 0 || lowerText.includes("मारना") || lowerText.includes("கொலை") || lowerText.includes("आग")) {
      crimeCategory = "Physical Violence & Death Threats";
    } else if (lowerText.includes("जमीन") || lowerText.includes("land")) {
      crimeCategory = "Illegal Land Displacement & Intimidation";
    } else if (lowerText.includes("पानी") || lowerText.includes("boycott")) {
      crimeCategory = "Social Boycott & Resource Exclusion";
    }

    return {
      highRiskKeywords: highMatches,
      moderateRiskKeywords: modMatches,
      nlpDistressScore,
      crimeCategory,
      emotions: {
        fear: fearScore,
        panic: panicScore,
        despair: despairScore,
        anger: angerScore,
        calm: Math.max(2, 100 - nlpDistressScore)
      },
      suicidalIdeationFlag: suicidalIdeation > 50,
      suicidalIdeationScore: suicidalIdeation
    };
  }
};

module.exports = EmotionAiService;
