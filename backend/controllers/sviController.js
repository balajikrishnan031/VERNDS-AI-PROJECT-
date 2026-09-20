/**
 * VERNDS AI - Stress Vulnerability Index (SVI: 0-100) & Multimodal Master Controller
 * National Helpline Against Atrocities (NHAA - 14566) - MoSJE Govt. of India
 */

const verndsIntelligenceEngine = require('../services/verndsIntelligenceEngine');
const SviModel = require('../models/SviModel');

/**
 * Master Multimodal Vulnerability Assessment (3 Layers + Safety Override + 8 kHz Quality)
 */
exports.assessVulnerabilityMaster = async (req, res) => {
  try {
    const {
      caseId,
      transcript = "Naan complaint kuduthathukku apram avanga daily threaten panranga. En family-kum danger irukku. Naan romba bayama irukken. Ippo veetukku veliya aal nikkuranga.",
      language = "ta-IN / Tanglish",
      audioMeta = { sampleRate: 8000, snrDb: 14.2, clippingRatio: 0.02 },
      voiceMetrics = { f0Hz: 268.4, jitterPercent: 3.8, shimmerPercent: 5.4, pauseRatioPercent: 42.5 },
      consentGranted = true
    } = req.body;

    const assessmentResult = await verndsIntelligenceEngine.assessVictimVulnerability({
      caseId: caseId || `NHAA-${Math.floor(Math.random() * 90000 + 10000)}`,
      transcript,
      language,
      audioMeta,
      voiceMetrics,
      consentGranted: consentGranted !== false
    });

    return res.status(200).json({
      success: true,
      system: "VERNDS AI Multimodal Vulnerability Intelligence Engine",
      statutoryFramework: "SC/ST PoA Act 1989 & NHAA 14566 Governance",
      ...assessmentResult
    });
  } catch (error) {
    console.error('[Vernds SVI Controller] Error assessing vulnerability:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Standard SVI Weighted Calculation (Backward Compatibility)
 */
exports.calculateSviScore = async (req, res) => {
  try {
    const {
      acousticFearIndex = 85.0,
      nlpEmotionIntensity = 80.0,
      crimeSeverityWeight = 90.0,
      districtVulnerabilityFactor = 75.0,
      callSid,
      transcript = ""
    } = req.body;

    // Check if transcript contains critical safety indicators
    const safetyCheck = verndsIntelligenceEngine.evaluateSafetyAndThreat(transcript);

    const weightedScore = (
      (acousticFearIndex * 0.35) +
      (nlpEmotionIntensity * 0.30) +
      (crimeSeverityWeight * 0.20) +
      (districtVulnerabilityFactor * 0.15)
    );

    let sviScore = Math.min(100, Math.max(0, Math.round(weightedScore)));
    let riskTier = 'LOW';
    let actionRequired = 'LOG_AND_MONITOR';

    if (sviScore >= 80) {
      riskTier = 'CRITICAL';
      actionRequired = 'AUTO_DISPATCH_112_POLICE_AND_CONNECT_TELE_MANAS_DOCTOR';
    } else if (sviScore >= 65) {
      riskTier = 'HIGH';
      actionRequired = 'CONNECT_TELE_MANAS_DOCTOR_AND_NOTIFY_NODAL_OFFICER';
    } else if (sviScore >= 40) {
      riskTier = 'MODERATE';
      actionRequired = 'ROUTE_TO_14566_SENIOR_COUNSELOR_DESK';
    }

    // Safety Override Engine Check
    let safetyOverrideActive = false;
    let overrideReason = null;
    if (safetyCheck.immediateDanger) {
      safetyOverrideActive = true;
      riskTier = 'CRITICAL';
      sviScore = Math.max(sviScore, 88);
      actionRequired = 'SAFETY_OVERRIDE_TRIGGERED_EMERGENCY_DISPATCH_112_AND_HOTLINE';
      overrideReason = safetyCheck.detectedTriggers.map(t => t.reason).join(" | ");
    }

    const sviBreakdown = {
      sviScore,
      riskTier,
      actionRequired,
      safetyOverride: {
        active: safetyOverrideActive,
        reason: overrideReason
      },
      calculationFactors: {
        acousticFearComponent: parseFloat((acousticFearIndex * 0.35).toFixed(2)),
        nlpEmotionComponent: parseFloat((nlpEmotionIntensity * 0.30).toFixed(2)),
        crimeSeverityComponent: parseFloat((crimeSeverityWeight * 0.20).toFixed(2)),
        districtVulnerabilityComponent: parseFloat((districtVulnerabilityFactor * 0.15).toFixed(2))
      },
      timestamp: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      callSid: callSid || `SVI-CALC-${Date.now()}`,
      sviBreakdown
    });
  } catch (error) {
    console.error('[SVI Controller] Error calculating SVI score:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSviMatrixMetadata = (req, res) => {
  return res.status(200).json({
    success: true,
    sviMatrix: [
      { tier: 'CRITICAL', minScore: 75, maxScore: 100, colorHex: '#ef4444', protocol: 'Immediate 112 ERSS Police Webhook + Tele-MANAS SIP Doctor Transfer + Witness Protection Sec 15A' },
      { tier: 'HIGH', minScore: 50, maxScore: 74, colorHex: '#f97316', protocol: 'Tele-MANAS Doctor Bridge + NALSA 15100 Legal Protection Order + Senior Counselor' },
      { tier: 'MODERATE', minScore: 25, maxScore: 49, colorHex: '#f59e0b', protocol: 'Senior 14566 Counselor Case Creation, Follow-up Welfare Check & DLSA Legal Advice' },
      { tier: 'LOW', minScore: 0, maxScore: 24, colorHex: '#10b981', protocol: 'Standard Grievance Logging & Monitoring under SC/ST PoA Rules' }
    ]
  });
};

// Aliases & Exports
exports.calculateSvi = exports.calculateSviScore;
exports.getRiskMatrix = exports.getSviMatrixMetadata;
exports.assessVulnerability = exports.assessVulnerabilityMaster;
