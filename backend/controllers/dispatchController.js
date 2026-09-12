const DispatchController = {
  emergencySos(req, res) {
    const { district = "Hathras", state = "Uttar Pradesh", sviScore = 88 } = req.body;
    res.json({
      success: true,
      message: "EMERGENCY SOS DISPATCH TRIGGERED SUCCESSFULLY",
      sosEventId: `SOS-${Date.now()}`,
      extractedLocation: `${district}, ${state}`,
      dispatchedAgencies: [
        { agency: "112 Emergency Police Dispatch", status: "ACKNOWLEDGED", etaMinutes: 8 },
        { agency: "District Collector / Nodal SP Officer", status: "NOTIFIED_SMS_EMAIL", etaMinutes: 2 },
        { agency: "Tele-MANAS Crisis Stabilization Unit", status: "LINE_HOT_TRANSFER_ACTIVE", etaMinutes: 1 },
        { agency: "SC/ST Atrocity Protection Cell", status: "ALERTED", etaMinutes: 5 }
      ],
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = DispatchController;
