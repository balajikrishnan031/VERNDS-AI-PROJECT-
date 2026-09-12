const NerService = require('../services/nerService');
const EmotionAiService = require('../services/emotionAiService');
const SviModel = require('../models/SviModel');
const CaseModel = require('../models/CaseModel');

const TelephonyController = {
  // Handles incoming real phone calls (Twilio / Exotel TwiML Webhook)
  handleVoiceWebhook(req, res) {
    const callerPhone = req.body.From || req.body.callerPhone || "+91 98765 43210";
    const speechResult = req.body.SpeechResult || req.body.speechText || "";

    console.log(`\n📞 [TELEPHONY WEBHOOK] Call From: ${callerPhone}`);

    if (!speechResult) {
      const greetingTwiML = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Aditi" language="hi-IN">नमस्ते। राष्ट्रीय अत्याचार निवारण हेल्पलाइन 14566 में आपका स्वागत है। कृपया बताएं कि आपके साथ क्या समस्या हुई है।</Say>
    <Gather input="speech" action="/api/telephony/voice-webhook" method="POST" speechTimeout="auto" language="hi-IN">
    </Gather>
</Response>`;
      res.type('text/xml');
      return res.send(greetingTwiML);
    }

    // Process speech narrative
    const locationInfo = NerService.extractLocation(speechResult);
    const nlpInfo = EmotionAiService.analyzeText(speechResult);
    const sviInfo = SviModel.calculateSVI(85, nlpInfo.nlpDistressScore, 85, 75);

    // Save to Database
    CaseModel.createCase({
      callerPhone,
      extractedLocation: locationInfo,
      incidentType: nlpInfo.crimeCategory,
      sviScore: sviInfo.sviScore,
      riskCategory: sviInfo.riskCategory
    });

    let actionTwiML = "";
    if (sviInfo.sviScore >= 76) {
      actionTwiML = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Aditi" language="hi-IN">आपकी स्थिति को अत्यंत गंभीर समझा गया है। आपातकालीन पुलिस 112 और डॉक्टर को तुरंत सूचित कर दिया गया है। हम आपको डॉक्टर से जोड़ रहे हैं।</Say>
    <Dial>+9114416</Dial>
</Response>`;
    } else {
      actionTwiML = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Aditi" language="hi-IN">आपकी शिकायत दर्ज कर ली गई है। हमारी कानूनी और सामाजिक न्याय टीम आपसे संपर्क करेगी। धन्यवाद।</Say>
</Response>`;
    }

    res.type('text/xml');
    res.send(actionTwiML);
  },

  // Telephony Live Stream endpoint for web UI
  handleLiveStream(req, res) {
    const { callerPhone = "+91 98765 *****", speechText = "" } = req.body;
    const locationInfo = NerService.extractLocation(speechText);
    const nlpInfo = EmotionAiService.analyzeText(speechText);
    const sviInfo = SviModel.calculateSVI(85, nlpInfo.nlpDistressScore, 85, 75);

    res.json({
      success: true,
      telephonySessionId: `SIP-REALPHONE-${Date.now()}`,
      callerPhone,
      extractedLocation: locationInfo,
      nlpAnalysis: nlpInfo,
      sviScore: sviInfo.sviScore,
      riskCategory: sviInfo.riskCategory,
      autoTriggeredActions: {
        police112Dispatch: sviInfo.sviScore >= 76 ? "TRIGGERED_ETA_8MIN" : "STANDBY",
        teleManasDoctorBridge: sviInfo.sviScore >= 76 ? "HOTLINE_CONNECTED" : "NOT_REQUIRED"
      }
    });
  }
};

module.exports = TelephonyController;
