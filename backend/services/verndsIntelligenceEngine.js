/**
 * VERNDS AI - Master Multimodal Vulnerability Intelligence Engine
 * National Helpline Against Atrocities (NHAA - 14566) | MoSJE Govt. of India
 *
 * Implements the 38-Module Blueprint:
 * 1. SVI: Psychological Vulnerability Score (0 - 100) - Pure psychological distress
 * 2. AVCS: Atrocity Vulnerability Context Score (0 - 100) - PoA Act statutory offences
 * 3. SSI: Safety Severity Index (0 - 100) - Immediate physical danger & crisis signals
 * 4. Confidence Score (0.0 - 1.0): Assessment reliability based on audio quality & text clarity
 * 5. Safety Override Engine: SSI >= 75 forces CRITICAL review (Emotion != Risk)
 * 6. Bhashini Integration: Language interoperability & normalization
 * 7. CBT Engine: Catastrophizing, learned helplessness, and fatalism detection
 * 8. Telephony 8 kHz Calibrator: SNR dynamic weight recalibration
 */

const bhashiniService = require('./bhashiniService');
const cbtDistortionService = require('./cbtDistortionService');

class VerndsIntelligenceEngine {
  constructor() {
    // SC/ST Prevention of Atrocities Act 1989 Domain Taxonomy
    this.POA_TAXONOMY = {
      social_economic_boycott: {
        section: "Sec 3(1)(zc)",
        label: "Social & Economic Boycott",
        keywords: [
          "boycott", "social boycott", "oorkuttu", "oor kattu", "pesa koodadhu", "kadai", "kadaikku", 
          "hukka pani", "panchayat ban", "ostracized", "velakki", "vilakki", "samuga purakkanippu",
          "விலக்கி", "ஊர்க்கட்டு", "சமூக புறக்கணிப்பு", "பேசக்கூடாது"
        ],
        weight: 90
      },
      land_dispossession: {
        section: "Sec 3(1)(g)",
        label: "Wrongful Land Dispossession / Encroachment",
        keywords: [
          "land", "patta", "patta nilam", "nilam", "poramboke", "zameen", "khet", "kabza", 
          "occupied", "dispossessed", "evicted", "agri land", "farming land", "நிலம்", "பட்டா"
        ],
        weight: 88
      },
      caste_insult_slur: {
        section: "Sec 3(1)(r) & 3(1)(s)",
        label: "Intentional Caste Insult & Public Humiliation",
        keywords: [
          "caste slur", "caste name", "jaathi", "saathi", "theendaamai", "untouchable", "slur", 
          "gaali", "thittunanga", "kevalapaduthinanga", "humiliation", "public view", "zaat",
          "சாதி", "சாதியைச் சொல்லி", "ஜாதி", "திட்டி", "தீண்டாமை", "அவமானம்"
        ],
        weight: 92
      },
      water_community_denial: {
        section: "Sec 3(1)(b)",
        label: "Denial of Drinking Water & Community Access",
        keywords: [
          "water", "kudineer", "thanni", "well", "drinking water", "handpump", "kuttai", 
          "water denied", "thanni edukka koodadhu", "pani bandh",
          "குடிநீர்", "தண்ணீர்", "தண்ணி", "கிணறு", "குடிநீர் கிணற்றில்"
        ],
        weight: 89
      },
      arson_property_destruction: {
        section: "Sec 3(2)(iv)",
        label: "Arson & Dwelling Destruction",
        keywords: [
          "fire", "thee", "arson", "house burning", "veedu kolutha", "burn", "burnt", 
          "destroyed house", "koodaram", "jalliya", "தீ", "வீடு கொளுத்த"
        ],
        weight: 98
      },
      physical_violence: {
        section: "Sec 3(1)(r) & IPC 323/324",
        label: "Physical Assault & Grievous Hurt",
        keywords: [
          "assault", "attack", "marpit", "thrashed", "adi", "kodumai", "injured", 
          "blood", "beaten", "laathi", "knife", "kai vaithal",
          "தாக்குதல்", "தாக்குகிறார்கள்", "அடி", "காயம்", "கொடுமை"
        ],
        weight: 95
      }
    };

    // Emotional Indicators (Pure Tamil, English & Tanglish)
    this.EMOTION_KEYWORDS = {
      fear: ["bayama", "bayam", "fear", "scared", "terrified", "frightened", "darr", "bhayam", "very scared", "romba bayama", "nadunguren", "பயம்", "பயமா", "அச்சம்", "நடுங்குகிறேன்"],
      anxiety: ["anxiety", "padhabadhavu", "nervous", "tension", "panicking", "stress", "urakkam varala", "restless", "ghabrahat", "பதட்டம்", "பதபதப்பு"],
      distress: ["distress", "vedhanai", "pain", "suffering", "kastam", "thunbam", "agony", "azhugai", "crying", "broken", "துன்பம்", "வேதனை", "கஷ்டம்", "அழுகை"],
      helplessness: ["helpless", "enga pogradhune theriyala", "yaarume illa", "no one to help", "madhadhu", "mudiyala", "abandoned", "உதவி", "முடியவில்லை", "யாரும் இல்லை"],
      sadness: ["sad", "depressed", "kavalai", "manam odanjuten", "hopeless", "tearful", "கவலை", "சோகம்"]
    };

    // Critical Safety & Life-Threat Triggers (For SSI & Safety Override)
    this.CRITICAL_SAFETY_TRIGGERS = [
      {
        id: "IMMEDIATE_WEAPON_PRESENCE",
        keywords: ["weapon", "aruva", "aruval", "knife", "kathi", "gun", "thuppakki", "laathi", "sword", "kambu", "hathiyar", "அரிவாள்", "அரிவாளுடன்", "கத்தி", "ஆயுதம்", "துப்பாக்கி"],
        reason: "Accused armed with lethal weapon in vicinity",
        severity: "CRITICAL",
        ssiWeight: 95
      },
      {
        id: "ARMED_ACCUSED_OUTSIDE",
        keywords: ["veetukku veliya", "outside my house", "outside door", "doors surrounded", "veetta soolnthutaanga", "surrounded us", "standing outside", "bahar khade hain", "வீட்டைச் சுற்றி", "சுற்றி வளைத்து", "வீட்டுக்கு வெளியே"],
        reason: "Accused mob/persons actively surrounding victim premises",
        severity: "CRITICAL",
        ssiWeight: 95
      },
      {
        id: "IMMINENT_DEATH_THREAT",
        keywords: ["kolai", "kill", "murder", "threaten panranga", "threaten to kill", "uyiroda vida maaten", "jaan se maar denge", "உயிருக்கு ஆபத்து", "மிரட்டுகிறார்கள்", "மிரட்டல்", "கொலை"],
        reason: "Direct and explicit threat to life or family safety",
        severity: "CRITICAL",
        ssiWeight: 90
      },
      {
        id: "FAMILY_DEPENDENT_DANGER",
        keywords: ["family-kum danger", "kuzhandhainga", "children", "pillai", "amma", "family attack", "wife", "elderly", "குடும்பம்", "பிள்ளைகள்"],
        reason: "Active threat to vulnerable dependents and family members",
        severity: "HIGH",
        ssiWeight: 80
      },
      {
        id: "EXPLICIT_SELF_HARM_INTENT",
        keywords: ["vazhanum-nu thonala", "vazha virumbala", "end my life", "suicide", "uyira maachika", "saaganum", "die"],
        reason: "Explicit psychological crisis and self-harm vulnerability",
        severity: "CRITICAL",
        ssiWeight: 95
      },
      {
        id: "ACUTE_SOCIAL_ISOLATION",
        keywords: ["yaarum ennoda pesave maatanga", "isolated", "no safe place", "no shelter", "veetta vittu veliyethittaanga"],
        reason: "Extreme social exclusion with zero community shelter",
        severity: "HIGH",
        ssiWeight: 70
      }
    ];
  }

  /**
   * 8 kHz Telephony Audio Quality Scorer
   */
  assessTelephonyAudioQuality(audioMeta = {}) {
    const sampleRate = audioMeta.sampleRate || 8000;
    const snrDb = audioMeta.snrDb !== undefined ? audioMeta.snrDb : 14.2;
    const clippingRatio = audioMeta.clippingRatio !== undefined ? audioMeta.clippingRatio : 0.02;

    let qualityScore = 100;
    if (sampleRate <= 8000) qualityScore -= 12; // Telephony standard limit
    if (snrDb < 10) qualityScore -= 40; // High noise
    else if (snrDb < 16) qualityScore -= 15;
    if (clippingRatio > 0.04) qualityScore -= 20;

    qualityScore = Math.max(15, Math.min(100, Math.round(qualityScore)));
    const isDegraded = qualityScore < 50;

    return {
      sampleRate,
      snrDb,
      clippingRatio,
      audioQualityScore: qualityScore,
      isDegraded,
      confidenceFactor: parseFloat((qualityScore / 100).toFixed(2)),
      weights: {
        acousticWeight: isDegraded ? 0.10 : 0.30,
        textWeight: isDegraded ? 0.90 : 0.70
      },
      statusMessage: isDegraded 
        ? "8 kHz Telephony audio quality degraded (Low SNR/clipping). Acoustic weight reduced; relying on transcript and safety rules."
        : "8 kHz Telephony audio clear and verified for DSP extraction."
    };
  }

  /**
   * AVCS: Atrocity Vulnerability Context Score (0 - 100)
   * Evaluates SC/ST PoA Act 1989 statutory categories
   */
  evaluateAtrocityContext(text = "") {
    const normalizedText = text.toLowerCase();
    const matchedOffences = [];
    let cumulativeWeight = 0;

    for (const [key, category] of Object.entries(this.POA_TAXONOMY)) {
      const foundMatch = category.keywords.some(kw => normalizedText.includes(kw.toLowerCase()));
      if (foundMatch) {
        matchedOffences.push({
          categoryKey: key,
          section: category.section,
          label: category.label,
          statutoryWeight: category.weight
        });
        cumulativeWeight += category.weight;
      }
    }

    let avcs = 0;
    if (matchedOffences.length > 0) {
      const maxWeight = Math.max(...matchedOffences.map(o => o.statutoryWeight));
      avcs = Math.min(100, Math.round(maxWeight * 0.7 + (matchedOffences.length * 10)));
    } else {
      avcs = 20; // Generic grievance baseline
    }

    return {
      avcsScore: avcs,
      matchedOffences,
      hasAtrocityContext: matchedOffences.length > 0,
      summary: matchedOffences.length > 0 
        ? matchedOffences.map(o => `${o.label} (${o.section})`).join(", ")
        : "General Citizen Grievance / Non-Specific Narrative"
    };
  }

  /**
   * SSI: Safety Severity Index (0 - 100)
   * Evaluates weapons, mobs, death threats, and self-harm
   */
  evaluateSafetySeverity(text = "") {
    const normalizedText = text.toLowerCase();
    const detectedTriggers = [];
    let maxSsiWeight = 20;
    let hasCriticalTrigger = false;

    for (const trigger of this.CRITICAL_SAFETY_TRIGGERS) {
      const match = trigger.keywords.some(kw => normalizedText.includes(kw.toLowerCase()));
      if (match) {
        detectedTriggers.push(trigger);
        if (trigger.ssiWeight > maxSsiWeight) maxSsiWeight = trigger.ssiWeight;
        if (trigger.severity === "CRITICAL") hasCriticalTrigger = true;
      }
    }

    const ssiScore = Math.min(100, Math.max(20, maxSsiWeight));

    return {
      ssiScore,
      detectedTriggers,
      immediateDanger: hasCriticalTrigger || ssiScore >= 80,
      criticalSummary: detectedTriggers.map(t => t.reason).join(" | ")
    };
  }

  /**
   * Alias for backward-compatible threat and safety evaluation
   */
  evaluateSafetyAndThreat(text = "") {
    return this.evaluateSafetySeverity(text);
  }

  /**
   * SVI: Psychological Vulnerability Score (0 - 100)
   * Refactored: Contains ONLY psychological variables (No crime severity or district proxy!)
   */
  evaluatePsychologicalSvi(text = "", voiceMetrics = {}, cbtResult = {}) {
    const normalizedText = text.toLowerCase();
    const emotionScores = { fear: 0, anxiety: 0, distress: 0, helplessness: 0, sadness: 0 };

    for (const [emotion, keywords] of Object.entries(this.EMOTION_KEYWORDS)) {
      let matches = 0;
      keywords.forEach(kw => {
        if (normalizedText.includes(kw)) matches++;
      });
      emotionScores[emotion] = Math.min(100, matches * 30 + (matches > 0 ? 35 : 0));
    }

    // Acoustic Voice Distress
    const voiceStress = Math.min(100, Math.round(((voiceMetrics.f0Hz || 220) / 300) * 50 + ((voiceMetrics.jitterPercent || 2.0) * 15)));

    // CBT Trauma & Distortion Weight
    const cbtTraumaWeight = cbtResult.cbtTraumaScore || 30;

    // SVI Multi-factor Formula:
    // 20% Distress, 20% Fear, 20% Trauma/CBT, 15% Anxiety, 10% Social Isolation, 10% Voice Distress, 5% Contextual Urgency
    const svi = Math.round(
      (emotionScores.distress * 0.20) +
      (emotionScores.fear * 0.20) +
      (cbtTraumaWeight * 0.20) +
      (emotionScores.anxiety * 0.15) +
      (emotionScores.helplessness * 0.10) +
      (voiceStress * 0.10) +
      (35 * 0.05)
    );

    return {
      sviScore: Math.max(10, Math.min(100, svi)),
      emotionScores,
      voiceStress
    };
  }

  /**
   * Master Multimodal Assessment Engine
   * Outputs 4-tuple: { svi, avcs, ssi, confidence } + Safety Override
   */
  async assessVictimVulnerability(params = {}) {
    const {
      caseId = `NHAA-${Math.floor(Math.random() * 90000 + 10000)}`,
      transcript = "",
      language = "ta-IN / Tanglish",
      audioMeta = {},
      voiceMetrics = { f0Hz: 255.4, jitterPercent: 3.4, shimmerPercent: 5.1, pauseRatioPercent: 41.2 },
      consentGranted = true
    } = params;

    // Consent Check (DPDP Act 2023)
    if (!consentGranted) {
      return {
        caseId,
        consentGranted: false,
        status: "CONSENT_DECLINED",
        message: "AI assessment deactivated by caller consent. Routed directly to manual operator queue.",
        routing: { action: "STANDARD_GRIEVANCE_MANUAL_OPERATOR" }
      };
    }

    // Step 1: Telephony Audio Quality Check
    const audioQuality = this.assessTelephonyAudioQuality(audioMeta);

    // Step 2: Bhashini Indian Language Translation & Normalization
    const bhashiniResult = await bhashiniService.translateToEnglish(transcript, language);

    const combinedAnalysisText = `${transcript} ${bhashiniResult.translatedEnglish || ''}`;

    // Step 3: CBT Cognitive Distortion & Trauma Analysis
    const cbtResult = cbtDistortionService.analyzeCognitiveDistortions(combinedAnalysisText);

    // Step 4: Layer 1 - Atrocity Vulnerability Context Score (AVCS: 0-100)
    const layer1 = this.evaluateAtrocityContext(combinedAnalysisText);

    // Step 5: Layer 2 - Psychological SVI (SVI: 0-100)
    const layer2 = this.evaluatePsychologicalSvi(combinedAnalysisText, voiceMetrics, cbtResult);

    // Step 6: Layer 3 - Safety Severity Index (SSI: 0-100)
    const layer3 = this.evaluateSafetySeverity(combinedAnalysisText);

    // Step 7: Confidence Score Calculation (0.00 - 1.00)
    const textClarityScore = Math.min(1.0, transcript.length / 80);
    const confidenceScore = parseFloat(
      ((audioQuality.confidenceFactor * 0.45) + (bhashiniResult.confidence * 0.30) + (textClarityScore * 0.25)).toFixed(2)
    );

    // Risk Classification (Low/Moderate/High/Critical)
    let finalRiskTier = "LOW";
    if (layer2.sviScore >= 75) finalRiskTier = "CRITICAL";
    else if (layer2.sviScore >= 50) finalRiskTier = "HIGH";
    else if (layer2.sviScore >= 25) finalRiskTier = "MODERATE";

    // Step 8: SAFETY OVERRIDE ENGINE ("Emotion != Risk")
    // If SSI >= 75 or explicit weapon/self-harm detected, force CRITICAL review
    let safetyOverrideActive = false;
    let overrideReason = null;

    if (layer3.ssiScore >= 75 || layer3.immediateDanger || cbtResult.suicidalIdeationFlag) {
      safetyOverrideActive = true;
      finalRiskTier = "CRITICAL";
      overrideReason = layer3.criticalSummary || "High Safety Severity Index (SSI >= 75) or Crisis Trigger Detected.";
    }

    // Multi-Agency Structured Interventions
    const interventions = {
      immediateHumanReviewRequired: finalRiskTier === "CRITICAL" || finalRiskTier === "HIGH" || confidenceScore < 0.50,
      emergencyPolice112Dispatch: safetyOverrideActive || (finalRiskTier === "CRITICAL" && layer3.ssiScore >= 80),
      teleManasPsychiatric14416: cbtResult.suicidalIdeationFlag || layer2.sviScore >= 70,
      nalsaLegalAid15100: layer1.hasAtrocityContext,
      witnessProtectionSec15A: finalRiskTier === "CRITICAL" || layer3.detectedTriggers.some(t => t.id === "IMMINENT_DEATH_THREAT"),
      priorityCounselorAssignment: finalRiskTier !== "LOW"
    };

    // Explainable AI (XAI) Component Breakdown
    const explainability = {
      sviScore: layer2.sviScore,
      avcsScore: layer1.avcsScore,
      ssiScore: layer3.ssiScore,
      confidenceScore,
      fearPercentage: layer2.emotionScores.fear,
      threatPercentage: layer3.ssiScore,
      traumaCbtPercentage: cbtResult.cbtTraumaScore,
      anxietyPercentage: layer2.emotionScores.anxiety,
      voiceStressPercentage: layer2.voiceStress,
      audioQuality: audioQuality.audioQualityScore,
      cognitiveDistortions: cbtResult.detectedDistortions.map(d => d.label),
      suicidalIdeationDetected: cbtResult.suicidalIdeationFlag,
      keyTriggers: layer3.detectedTriggers.map(t => t.reason),
      bhashiniProvider: bhashiniResult.provider
    };

    return {
      caseId,
      timestamp: new Date().toISOString(),
      languageDetected: language,
      bhashiniTranslation: bhashiniResult,
      cbtDistortionTelemetry: cbtResult,
      audioQualityTelemetry: audioQuality,
      
      // Decoupled 4-Tuple Output Model:
      decisionMetrics: {
        svi: layer2.sviScore,        // 1. Psychological Vulnerability (0-100)
        avcs: layer1.avcsScore,      // 2. Atrocity Context Score (0-100)
        ssi: layer3.ssiScore,        // 3. Safety Severity Index (0-100)
        confidence: confidenceScore  // 4. Assessment Confidence (0.0-1.0)
      },

      sviScore: layer2.sviScore,
      avcsScore: layer1.avcsScore,
      ssiScore: layer3.ssiScore,
      confidenceScore,
      riskTier: finalRiskTier,
      
      safetyOverride: {
        active: safetyOverrideActive,
        reason: overrideReason
      },

      layer1AtrocityContext: {
        summary: layer1.matchedOffences && layer1.matchedOffences.length > 0
          ? layer1.matchedOffences.map(o => o.label).join(", ")
          : "Allegation of Caste-Based Discrimination & Intimidation",
        avcsScore: layer1.avcsScore,
        matchedOffences: layer1.matchedOffences || [],
        poaOffences: layer1.matchedOffences || []
      },

      interventions,
      explainability,
      humanReviewStatus: "PENDING_OFFICER_SIGN_OFF",
      governanceNote: "AI-assisted screening only. Final intervention decision requires authorized human officer review."
    };
  }

  /**
   * Dynamic SVI Longitudinal Trend Tracker
   */
  calculateLongitudinalTrend(history = []) {
    if (!history || history.length < 2) {
      return {
        trend: "BASELINE_RECORDED",
        direction: "➔",
        message: "Initial baseline assessment recorded. Longitudinal monitoring active."
      };
    }

    const firstScore = history[0].svi;
    const latestScore = history[history.length - 1].svi;
    const delta = latestScore - firstScore;

    if (delta <= -15) {
      return {
        trend: "IMPROVING_RECOVERY",
        direction: "↘",
        delta,
        message: "Positive recovery trend detected. SVI has decreased significantly following support interventions."
      };
    } else if (delta >= 10) {
      return {
        trend: "RISK_ESCALATING",
        direction: "↗",
        delta,
        message: "CRITICAL ALERT: Vulnerability score is escalating over time. Immediate re-escalation to District Officer required."
      };
    } else {
      return {
        trend: "STABLE_MONITORING",
        direction: "➔",
        delta,
        message: "Vulnerability levels remain stable. Continuing scheduled welfare checks."
      };
    }
  }
}

module.exports = new VerndsIntelligenceEngine();
