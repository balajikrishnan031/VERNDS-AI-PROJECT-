/**
 * VERNDS AI - Case Entity Model & Persistence Layer
 * National Helpline Against Atrocities (NHAA - 14566) | MoSJE Govt. of India
 */

const Database = require('../config/database');

class CaseModel {
  constructor(data = {}) {
    this.id = data.id || `INC-2026-${Math.floor(Math.random()*90000 + 10000)}`;
    this.victimId = data.victimId || "VIC-ANON-1001";
    this.callerType = data.callerType || "VICTIM_DIRECT"; // VICTIM_DIRECT, WITNESS, NGO, POLICE_NODAL
    this.state = data.state || "Tamil Nadu";
    this.district = data.district || "Villupuram";
    this.village = data.village || "Kandachipuram";
    this.coordinates = data.coordinates || { lat: 11.9912, lng: 79.3087 };
    this.policeStation = data.policeStation || "Kandachipuram Special SC/ST PS";
    this.helplineChannel = data.helplineChannel || "IVRS_14566"; // IVRS_14566, CHATBOT_PORTAL, MOBILE_APP
    
    this.sviScore = data.sviScore !== undefined ? data.sviScore : 86;
    this.riskCategory = data.riskCategory || "CRITICAL_RED";
    this.safetyOverride = data.safetyOverride || false;
    this.overrideReason = data.overrideReason || null;
    this.acousticFearScore = data.acousticFearScore || 0.89;
    this.nlpTraumaScore = data.nlpTraumaScore || 0.92;
    this.crimeCategory = data.crimeCategory || "Public Intimidation & Social Boycott Threat";
    this.language = data.language || "ta-IN";
    
    this.legalSections = data.legalSections || [
      { sectionCode: "3(1)(r)", description: "Public Intimidation & Caste Slurs" },
      { sectionCode: "3(1)(s)", description: "Abuse by Caste Name" },
      { sectionCode: "3(1)(zc)", description: "Threat of Social Boycott" }
    ];

    this.firStatus = data.firStatus || "DRAFT_FIR_SEC18A_GENERATED";
    this.erssDispatchStatus = data.erssDispatchStatus || "PATROL_UNIT_DISPATCHED";
    this.teleManasSessionId = data.teleManasSessionId || "TM-SESS-9021";
    this.nalsaLegalAid15100 = data.nalsaLegalAid15100 !== undefined ? data.nalsaLegalAid15100 : true;
    this.dlsaReliefRupees = data.dlsaReliefRupees || 100000;
    this.witnessProtectionActive = data.witnessProtectionActive !== undefined ? data.witnessProtectionActive : true;

    // Human-in-the-Loop (HITL) Status
    this.humanReview = data.humanReview || {
      status: "PENDING_OFFICER_REVIEW", // PENDING_OFFICER_REVIEW, APPROVED, MODIFIED, ESCALATED_112
      reviewedBy: null,
      reviewNotes: null,
      reviewedAt: null
    };

    // Dynamic SVI Longitudinal History (Day 1 -> Day 3 -> Day 7 -> Day 14)
    this.longitudinalHistory = data.longitudinalHistory || [
      { day: 1, svi: this.sviScore, risk: this.riskCategory, timestamp: new Date().toISOString(), note: "Initial Intake Call (14566)" }
    ];

    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return { ...this };
  }

  static getAllCases() {
    return Database.getAllCases();
  }

  static getCaseById(caseId) {
    return Database.getCaseById(caseId);
  }

  static getCasesPaged(query) {
    return Database.getCasesPaged(query);
  }

  static getAnalytics() {
    return Database.getAnalytics();
  }

  static createCase(caseData) {
    const instance = new CaseModel(caseData);
    return Database.addCase(instance.toJSON());
  }

  static updateOfficerAction(caseId, reviewAction) {
    const db = Database.read();
    const caseIndex = (db.cases || []).findIndex(c => c.id === caseId || c.caseId === caseId);
    
    if (caseIndex === -1) return null;

    const existing = db.cases[caseIndex];
    existing.humanReview = {
      status: reviewAction.action || "APPROVED",
      reviewedBy: reviewAction.officerName || "District Nodal Officer (MoSJE)",
      officerDesignation: reviewAction.officerDesignation || "Sub-Divisional Magistrate / DSP",
      reviewNotes: reviewAction.notes || "Case interventions validated and endorsed.",
      interventionsApproved: reviewAction.interventions || existing.interventions,
      reviewedAt: new Date().toISOString()
    };

    if (reviewAction.action === "ESCALATE_112_IMMEDIATE") {
      existing.erssDispatchStatus = "P1_EMERGENCY_PATROL_MOBILIZED";
      existing.riskCategory = "CRITICAL_RED";
    }

    existing.updatedAt = new Date().toISOString();
    db.cases[caseIndex] = existing;
    Database.write(db);

    // Write audit trail log entry
    Database.logAudit({
      action: `OFFICER_HITL_${reviewAction.action || 'APPROVED'}`,
      operator: reviewAction.officerName || "District Nodal Officer",
      officerDesignation: reviewAction.officerDesignation || "DSP Special SC/ST Crime Cell",
      caseId: existing.id || caseId,
      details: reviewAction.notes || "Statutory review endorsed.",
      status: "VERIFIED"
    });

    return existing;
  }

  static addFollowUp(caseId, followUpData) {
    const db = Database.read();
    const caseIndex = (db.cases || []).findIndex(c => c.id === caseId || c.caseId === caseId);
    
    if (caseIndex === -1) return null;

    const existing = db.cases[caseIndex];
    if (!existing.longitudinalHistory) {
      existing.longitudinalHistory = [
        { day: 1, svi: existing.sviScore, risk: existing.riskCategory, timestamp: existing.createdAt }
      ];
    }

    const nextDay = followUpData.day || (existing.longitudinalHistory.length > 0 ? existing.longitudinalHistory[existing.longitudinalHistory.length - 1].day + 3 : 3);

    existing.longitudinalHistory.push({
      day: nextDay,
      svi: followUpData.sviScore || existing.sviScore - 12,
      risk: followUpData.riskCategory || (followUpData.sviScore < 50 ? "MODERATE" : "HIGH"),
      timestamp: new Date().toISOString(),
      note: followUpData.note || `Follow-up Welfare Check on Day ${nextDay}`
    });

    existing.updatedAt = new Date().toISOString();
    db.cases[caseIndex] = existing;
    Database.write(db);
    return existing;
  }
}

module.exports = CaseModel;
