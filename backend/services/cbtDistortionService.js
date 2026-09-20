/**
 * VERNDS AI - Cognitive Behavioral Therapy (CBT) Distortion & Psychological Marker Engine
 * Applied Clinical Triage Protocol for Crisis Helplines (NHAA 14566 / Tele-MANAS 14416)
 *
 * Evaluates victim transcripts for cognitive distortions and traumatic affective patterns:
 * 1. Catastrophizing (Magnification of doom, assuming irreversible ruin)
 * 2. Learned Helplessness (Pervasive belief of zero agency, systemic abandonment)
 * 3. Fatalism & All-or-Nothing Thinking (Hopeless surrender, existential despair)
 * 4. Social Alienation & Paranoia (Perceived complete isolation, severe threat hypervigilance)
 * 5. Acute Crisis / Suicidal Ideation Flag (Explicit self-harm language)
 */

class CbtDistortionService {
  constructor() {
    this.DISTORTION_PATTERNS = {
      learned_helplessness: {
        label: "Learned Helplessness & Agency Depletion",
        description: "Victim expresses belief that no external agency or personal action can change the traumatic outcome.",
        keywords: [
          "mudiyala", "yaarume illa", "no one to help", "no one will help", "enga pogradhune theriyala",
          "help panraku aal illa", "abandoned", "destitute", "koi nahi hai", "kuch nahi ho sakta",
          "வழியே இல்லை", "யாரும் இல்லை", "உதவி இல்லை", "முடியவில்லை", "முடியல"
        ],
        weight: 35
      },
      catastrophizing: {
        label: "Catastrophic Magnification & Anticipatory Panic",
        description: "Victim anticipates inevitable complete destruction of family, honor, or survival.",
        keywords: [
          "ellame pochu", "everything is ruined", "sab khatam", "veede nasam aayirum", "destroy us",
          "uyiroda vida maaten", "ruined completely", "alindhu pochu", "total ruin",
          "எல்லாம் போச்சு", "அழிந்து போச்சு", "எல்லாமே போச்சு"
        ],
        weight: 30
      },
      fatalism_all_or_nothing: {
        label: "Fatalistic Resignation & All-or-Nothing Despair",
        description: "Victim exhibits binary cognitive framing that life cannot continue under current persecution.",
        keywords: [
          "vazhanum-nu thonala", "vazha virumbala", "saaganum", "end my life", "suicide",
          "uyira maachika", "mar jana", "no point in living", "ini onnume illa",
          "வாழவே முடியாது", "வாழ முடியாது", "தற்கொலை", "உயிர் வாழ முடியாது", "வாழ வழியில்லை"
        ],
        weight: 45
      },
      threat_hypervigilance: {
        label: "Traumatic Hypervigilance & Persecutory Dread",
        description: "Victim experiences continuous terror of retaliation and unremitting danger.",
        keywords: [
          "daily threaten", "eppovum bayama irukku", "thookam varala", "always scared", "constant terror",
          "veetta soolnthutaanga", "surrounded us", "watch panraanga", "tracking us",
          "பயமா இருக்கு", "அச்சுறுத்தல்", "கொலை மிரட்டல்"
        ],
        weight: 25
      }
    };
  }

  /**
   * Evaluate psychological transcript through CBT framework
   */
  analyzeCognitiveDistortions(transcript = "") {
    const lower = transcript.toLowerCase();
    const detectedDistortions = [];
    let cumulativeDistortionScore = 0;
    let suicidalIdeationFlag = false;

    for (const [key, category] of Object.entries(this.DISTORTION_PATTERNS)) {
      const matchedTokens = category.keywords.filter(kw => lower.includes(kw));
      if (matchedTokens.length > 0) {
        detectedDistortions.push({
          type: key,
          label: category.label,
          description: category.description,
          matchedPhrases: matchedTokens,
          clinicalWeight: category.weight
        });
        cumulativeDistortionScore += category.weight;

        if (key === "fatalism_all_or_nothing" && matchedTokens.some(t => ["vazhanum-nu thonala", "end my life", "suicide", "uyira maachika", "saaganum", "தற்கொலை", "வாழவே முடியாது"].includes(t))) {
          suicidalIdeationFlag = true;
        }
      }
    }

    const cbtTraumaScore = Math.min(100, Math.round(cumulativeDistortionScore * 0.9 + (detectedDistortions.length * 8)));

    // Categorization
    let cognitiveDistressTier = "MILD";
    if (cbtTraumaScore >= 75 || suicidalIdeationFlag) cognitiveDistressTier = "ACUTE_CRISIS";
    else if (cbtTraumaScore >= 50) cognitiveDistressTier = "HIGH_DISTORTION";
    else if (cbtTraumaScore >= 25) cognitiveDistressTier = "MODERATE_DISTORTION";

    return {
      cbtTraumaScore,
      distortionCount: detectedDistortions.length,
      cognitiveDistressTier,
      suicidalIdeationFlag,
      detectedDistortions,
      primaryDistortion: detectedDistortions.length > 0 ? detectedDistortions[0].label : "No Severe Cognitive Distortion Identified",
      clinicalGroundingRecommendation: suicidalIdeationFlag 
        ? "Immediate Tele-MANAS (+91 14416) clinical psychiatrist bridge required. Deploy active suicide prevention protocol."
        : (cbtTraumaScore >= 50 
          ? "Apply 5-4-3-2-1 Sensory Grounding and de-escalate learned helplessness with statutory legal assurance."
          : "Standard supportive listening and grievance procedural clarity.")
    };
  }
}

module.exports = new CbtDistortionService();
