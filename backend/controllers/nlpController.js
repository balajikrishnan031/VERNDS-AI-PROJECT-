const NerService = require('../services/nerService');
const EmotionAiService = require('../services/emotionAiService');

const NlpController = {
  analyzeText(req, res) {
    const { text = "" } = req.body;
    if (!text) return res.status(400).json({ error: "Text narrative is required" });

    const locationInfo = NerService.extractLocation(text);
    const nlpInfo = EmotionAiService.analyzeText(text);

    res.json({
      success: true,
      extractedLocation: locationInfo.formattedAddress,
      ...nlpInfo
    });
  }
};

module.exports = NlpController;
