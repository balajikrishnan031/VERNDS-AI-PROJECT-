/**
 * VERNDS AI - Case Entity Model
 * Vernds AI (Formerly SAMVEDNA-AI) | National Helpline Against Atrocities (14566)
 */

class CaseModel {
  constructor(data = {}) {
    this.id = data.id || `INC-2026-${Math.floor(Math.random()*90000 + 10000)}`;
    this.victimId = data.victimId || "VIC-ANON-1001";
    this.callerType = data.callerType || "VICTIM_DIRECT"; // VICTIM_DIRECT, WITNESS, NGO, POLICE_NODAL
    this.state = data.state || "Uttar Pradesh";
    this.district = data.district || "Lakhimpur Kheri";
    this.village = data.village || "Palia Kalan";
    this.coordinates = data.coordinates || { lat: 28.4333, lng: 80.5833 };
    this.policeStation = data.policeStation || "Palia PS";
    this.helplineChannel = data.helplineChannel || "IVRS_14566"; // IVRS_14566, CHATBOT_PORTAL, MOBILE_APP, SATELLITE_SOS
    
    this.sviScore = data.sviScore || 88.5;
    this.riskCategory = data.riskCategory || "CRITICAL_RED";
    this.acousticFearScore = data.acousticFearScore || 0.89;
    this.nlpTraumaScore = data.nlpTraumaScore || 0.92;
    this.crimeCategory = data.crimeCategory || "Public Intimidation & Social Boycott Threat";
    this.language = data.language || "hi";
    
    this.legalSections = data.legalSections || [
      { sectionCode: "3(1)(r)", description: "Public Intimidation & Caste Slurs" },
      { sectionCode: "3(1)(s)", description: "Abuse by Caste Name" },
      { sectionCode: "3(1)(zc)", description: "Threat of Social Boycott" }
    ];

    this.firStatus = data.firStatus || "DRAFT_FIR_SEC18A_GENERATED"; // PENDING, DRAFT_FIR_SEC18A_GENERATED, FILED, INVESTIGATION_IN_PROGRESS, CHARGESHEET_FILED
    this.erssDispatchStatus = data.erssDispatchStatus || "PATROL_UNIT_DISPATCHED";
    this.teleManasSessionId = data.teleManasSessionId || "TM-SESS-9021";
    this.dlsaReliefRupees = data.dlsaReliefRupees || 100000;
    this.witnessProtectionActive = data.witnessProtectionActive || true;

    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return { ...this };
  }
}

module.exports = CaseModel;
