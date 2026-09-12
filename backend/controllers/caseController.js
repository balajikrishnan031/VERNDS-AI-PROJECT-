const CaseModel = require('../models/CaseModel');

const CaseController = {
  getCases(req, res) {
    const cases = CaseModel.getAllCases();
    res.json({ success: true, cases });
  },

  getAnalytics(req, res) {
    const analytics = CaseModel.getAnalytics();
    const heatmapData = [
      { state: "Uttar Pradesh", district: "Hathras", lat: 27.595, lng: 78.053, avgSvi: 78, totalCases: 142, criticalCases: 38 },
      { state: "Bihar", district: "Gaya", lat: 24.795, lng: 85.0, avgSvi: 81, totalCases: 115, criticalCases: 34 },
      { state: "Odisha", district: "Kalahandi", lat: 19.913, lng: 83.164, avgSvi: 65, totalCases: 64, criticalCases: 11 },
      { state: "Tamil Nadu", district: "Madurai", lat: 9.925, lng: 78.119, avgSvi: 54, totalCases: 92, criticalCases: 8 }
    ];

    res.json({
      success: true,
      totalAssessedVictims: analytics.totalAssessedVictims || 1428,
      avgNationalSVI: analytics.avgNationalSVI || 64.8,
      riskDistribution: analytics.riskDistribution || { critical: 284, high: 512, moderate: 420, low: 212 },
      heatmapData
    });
  },

  createCase(req, res) {
    const newCase = CaseModel.createCase(req.body);
    res.json({ success: true, case: newCase });
  }
};

module.exports = CaseController;
