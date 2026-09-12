/**
 * VERNDS AI - Analytics & Reporting Controller
 * Vernds AI (Formerly SAMVEDNA-AI) | National Helpline Against Atrocities (14566)
 */

const analyticsEngineService = require('../services/analyticsEngineService');

exports.getSpatialHeatmap = (req, res) => {
  try {
    const mockCases = require('../../database/samvedna_db.json').cases || [];
    const analytics = analyticsEngineService.generateStateRiskAnalytics(mockCases);
    return res.status(200).json({
      status: "success",
      timestamp: new Date().toISOString(),
      totalStatesAnalyzed: analytics.length,
      data: analytics
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

exports.getHelplineSla = (req, res) => {
  try {
    const sla = analyticsEngineService.getHelplineSlaMetrics();
    return res.status(200).json({ status: "success", sla });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

exports.getQuarterlyForecast = (req, res) => {
  try {
    const forecast = analyticsEngineService.getQuarterlyForecast();
    return res.status(200).json({ status: "success", forecast });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};
