// Case Data Model & Data Access Object

const Database = require('../config/database');

const CaseModel = {
  getAllCases() {
    const db = Database.read();
    return db.cases || [];
  },

  getAnalytics() {
    const db = Database.read();
    return db.analytics || {};
  },

  createCase(caseData) {
    const newCase = {
      id: `NHAA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      callerId: caseData.callerPhone || "+91 98765 *****",
      extractedLocation: caseData.extractedLocation || { address: "Hathras Region", district: "Hathras", state: "Uttar Pradesh" },
      casteCategory: caseData.casteCategory || "Scheduled Caste",
      incidentType: caseData.incidentType || "Atrocity Grievance",
      sviScore: caseData.sviScore || 50,
      riskCategory: caseData.riskCategory || "Moderate Risk",
      status: caseData.sviScore >= 76 ? "Active - Emergency Response Dispatched" : "Logged in System",
      assignedCounselor: caseData.sviScore >= 76 ? "Tele-MANAS Crisis Doctor" : "Scheduled Counselor"
    };

    return Database.addCase(newCase);
  }
};

module.exports = CaseModel;
