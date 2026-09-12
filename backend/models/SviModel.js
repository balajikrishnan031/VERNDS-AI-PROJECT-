/**
 * VERNDS AI - Stress & Vulnerability Index (SVI) Diagnostic Model
 * Vernds AI (Formerly SAMVEDNA-AI) | National Helpline Against Atrocities (14566)
 */

class SviModel {
  constructor(data = {}) {
    this.sviId = data.sviId || `SVI-DIAG-${Date.now()}`;
    this.caseId = data.caseId || "INC-2026-9012";
    this.compositeSviScore = data.compositeSviScore || 88.5; // 0.0 to 100.0
    this.riskTier = data.riskTier || "CRITICAL_RED"; // CRITICAL_RED, HIGH_AMBER, MODERATE_YELLOW, STABLE_GREEN
    
    this.weightedComponents = {
      acousticFearWeight: 0.35,
      acousticFearScore: data.acousticFearScore || 0.89,
      acousticContribution: data.acousticContribution || 31.15,

      nlpTraumaWeight: 0.30,
      nlpTraumaScore: data.nlpTraumaScore || 0.92,
      nlpContribution: data.nlpContribution || 27.60,

      crimeSeverityWeight: 0.20,
      crimeSeverityScore: data.crimeSeverityScore || 0.95,
      crimeContribution: data.crimeContribution || 19.00,

      districtRiskWeight: 0.15,
      districtRiskScore: data.districtRiskScore || 0.72,
      districtContribution: data.districtContribution || 10.80
    };

    this.physioBiomarkers = {
      f0MeanHz: data.f0MeanHz || 294.2,
      jitterPct: data.jitterPct || 3.14,
      shimmerPct: data.shimmerPct || 7.82,
      pauseRatioPct: data.pauseRatioPct || 41.2,
      vocalTremorHz: data.vocalTremorHz || 6.1
    };

    this.calculatedAt = new Date().toISOString();
  }

  toJSON() {
    return { ...this };
  }
}

module.exports = SviModel;
