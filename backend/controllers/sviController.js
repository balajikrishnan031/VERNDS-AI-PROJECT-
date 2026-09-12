/**
 * Vernds AI - Stress Vulnerability Index (SVI: 0-100) Algorithm Controller
 * National Helpline Against Atrocities (14566) - MoSJE Govt. of India
 */

const SviModel = require('../models/SviModel');

exports.calculateSviScore = async (req, res) => {
  try {
    const {
      acousticFearIndex = 85.0,
      nlpEmotionIntensity = 80.0,
      crimeSeverityWeight = 90.0,
      districtVulnerabilityFactor = 75.0,
      callSid
    } = req.body;

    const weightedScore = (
      (acousticFearIndex * 0.35) +
      (nlpEmotionIntensity * 0.30) +
      (crimeSeverityWeight * 0.20) +
      (districtVulnerabilityFactor * 0.15)
    );

    const sviScore = Math.min(100, Math.max(0, Math.round(weightedScore)));

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

    const sviBreakdown = {
      sviScore,
      riskTier,
      actionRequired,
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
      { tier: 'CRITICAL', minScore: 80, maxScore: 100, colorHex: '#ef4444', protocol: 'Immediate 112 ERSS Police Webhook + Tele-MANAS SIP Doctor Transfer' },
      { tier: 'HIGH', minScore: 65, maxScore: 79, colorHex: '#f97316', protocol: 'Tele-MANAS Doctor Bridge + DLSA Legal Protection Order' },
      { tier: 'MODERATE', minScore: 40, maxScore: 64, colorHex: '#f59e0b', protocol: 'Senior 14566 Counselor Case Creation & Follow-up' },
      { tier: 'LOW', minScore: 0, maxScore: 39, colorHex: '#10b981', protocol: 'Standard Grievance Logging & Monitoring' }
    ]
  });
};

// Aliases
exports.calculateSvi = exports.calculateSviScore;
exports.getRiskMatrix = exports.getSviMatrixMetadata;
