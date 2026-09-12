const express = require('express');
const router = express.Router();

const TelephonyController = require('../controllers/telephonyController');
const NlpController = require('../controllers/nlpController');
const VoiceController = require('../controllers/voiceController');
const SviController = require('../controllers/sviController');
const CaseController = require('../controllers/caseController');
const DispatchController = require('../controllers/dispatchController');

// 1. Telephony Webhook & Live Stream Routes
router.post('/telephony/voice-webhook', TelephonyController.handleVoiceWebhook);
router.post('/telephony/live-stream', TelephonyController.handleLiveStream);

// 2. Multilingual NLP & Emotion AI Route
router.post('/analyze-text', NlpController.analyzeText);

// 3. Voice Acoustic Biomarkers Route
router.post('/analyze-voice', VoiceController.analyzeVoice);

// 4. SVI Calculator Route
router.post('/calculate-svi', SviController.calculateSvi);

// 5. Emergency SOS Dispatch Route
router.post('/dispatch/emergency-sos', DispatchController.emergencySos);

// 6. Case Audit & Analytics Routes
router.get('/cases', CaseController.getCases);
router.post('/cases', CaseController.createCase);
router.get('/analytics/heatmap', CaseController.getAnalytics);

module.exports = router;
