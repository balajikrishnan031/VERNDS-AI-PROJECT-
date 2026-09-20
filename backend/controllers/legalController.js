/**
 * VERNDS AI - DLSA Legal Aid & Victim Compensation Controller
 * Vernds AI (Formerly SAMVEDNA-AI) | National Helpline Against Atrocities (14566)
 */

const dlsaLegalService = require('../services/dlsaLegalService');

exports.calculateCompensation = (req, res) => {
  try {
    const { poaSections, sections } = req.body;
    const relief = dlsaLegalService.calculateVictimRelief(poaSections || sections || ['3(1)(r)', '3(1)(s)', '3(1)(zc)']);
    return res.status(200).json({
      status: "success",
      success: true,
      totalCompensationRupees: relief.totalEligibleReliefRupees || 100000,
      relief
    });
  } catch (err) {
    return res.status(500).json({ status: "error", success: false, message: err.message });
  }
};

exports.getAdvocates = (req, res) => {
  try {
    const { district } = req.query;
    const advocates = dlsaLegalService.getDlsaAdvocates(district || "Lakhimpur Kheri");
    return res.status(200).json({ status: "success", district: district || "Lakhimpur Kheri", count: advocates.length, advocates });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};
