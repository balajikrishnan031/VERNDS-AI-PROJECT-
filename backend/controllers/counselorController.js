/**
 * VERNDS AI - Counselor Desk & Tele-MANAS Triage Controller
 * Vernds AI (Formerly SAMVEDNA-AI) | National Helpline Against Atrocities (14566)
 */

const teleManasSipService = require('../services/teleManasSipService');

exports.getTriageQueue = (req, res) => {
  try {
    const queue = [
      { id: "TR-901", victimId: "VIC-8841", sviScore: 92.4, traumaTier: "CRITICAL_RED", waitTimeSec: 12, language: "Hindi", status: "WAITING_TELEMANAS_BRIDGE" },
      { id: "TR-902", victimId: "VIC-8842", sviScore: 84.1, traumaTier: "CRITICAL_RED", waitTimeSec: 45, language: "Tamil", status: "WAITING_COUNSELOR" },
      { id: "TR-903", victimId: "VIC-8843", sviScore: 68.5, traumaTier: "HIGH_AMBER", waitTimeSec: 90, language: "Telugu", status: "IN_SESSION" }
    ];
    return res.status(200).json({ status: "success", count: queue.length, queue });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

exports.connectTeleManasBridge = (req, res) => {
  try {
    const { caseId, victimPhone, sviScore } = req.body;
    const bridge = teleManasSipService.initiateConferenceBridge(caseId, victimPhone, sviScore);
    return res.status(200).json({ status: "success", message: "Tele-MANAS (+91 14416) VoIP 3-Way Bridge Initiated", bridge });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

exports.getBridgeTelemetry = (req, res) => {
  try {
    const { bridgeId } = req.params;
    const data = teleManasSipService.getBridgeStatus(bridgeId);
    return res.status(200).json({ status: "success", data });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};
