/**
 * VERNDS AI - Master API Routes Registry
 * National Helpline Against Atrocities (14566) | MoSJE Govt. of India
 */

const express = require('express');
const router = express.Router();

// Import Controllers & Services
const telephonyController = require('../controllers/telephonyController');
const nlpController = require('../controllers/nlpController');
const sviController = require('../controllers/sviController');
const dispatchController = require('../controllers/dispatchController');
const complianceController = require('../controllers/complianceController');
const analyticsController = require('../controllers/analyticsController');
const counselorController = require('../controllers/counselorController');
const legalController = require('../controllers/legalController');
const caseController = require('../controllers/caseController');
const authController = require('../controllers/authController');
const aiMonitoringController = require('../controllers/aiMonitoringController');
const audioComplaintController = require('../controllers/audioComplaintController');

const bhashiniService = require('../services/bhashiniService');
const cbtDistortionService = require('../services/cbtDistortionService');
const audioQueueService = require('../services/audioQueueService');

// 0. Role-Based Authentication & Session Management
router.post('/auth/send-otp', (req, res) => authController.sendOtp(req, res));
router.post('/auth/verify-otp', (req, res) => authController.verifyOtp(req, res));
router.post('/auth/login', (req, res) => authController.login(req, res));
router.get('/auth/session', (req, res) => authController.checkSession(req, res));
router.post('/auth/logout', (req, res) => authController.logout(req, res));

// 1. Multimodal Vulnerability Intelligence Engine (4-Tuple: SVI, AVCS, SSI, Confidence)
router.post('/intelligence/assess', sviController.assessVulnerabilityMaster);

// 2. 10 Curated Benchmark Test Suite Routes (Part T Implementation)
router.get('/benchmark/cases', caseController.getBenchmarkCases);
router.post('/benchmark/run/:caseId', caseController.runBenchmarkCase);

// 3. Government of India Bhashini Language Translation Layer
router.post('/language/bhashini-translate', async (req, res) => {
  try {
    const { text, sourceLang } = req.body;
    const result = await bhashiniService.translateToEnglish(text, sourceLang);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. CBT Cognitive Distortion & Trauma Analysis
router.post('/intelligence/cbt-analyze', (req, res) => {
  try {
    const { transcript } = req.body;
    const result = cbtDistortionService.analyzeCognitiveDistortions(transcript);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Real-Time Audio Streaming Queue & Redis Pub/Sub Adapter (20ms frames)
router.post('/audio/stream-chunk', (req, res) => {
  try {
    const { callSid, pcmBase64, sampleRate } = req.body;
    const frameBuffer = pcmBase64 ? Buffer.from(pcmBase64, 'base64') : Buffer.alloc(320); // 20ms of 8kHz 16-bit
    const result = audioQueueService.enqueueAudioFrame(callSid || 'CALL-ACTIVE-1', frameBuffer, { sampleRate: sampleRate || 8000 });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/audio/queue-metrics', (req, res) => {
  try {
    const metrics = audioQueueService.getQueueMetrics();
    res.json({ success: true, ...metrics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/audio/call-telemetry/:callSid', (req, res) => {
  try {
    const telemetry = audioQueueService.getCallTelemetry(req.params.callSid);
    res.json({ success: true, ...telemetry });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Case Management & Human-in-the-Loop (HITL) Officer Portal Routes
router.get('/cases', caseController.getCases);
router.get('/case/:id', caseController.getCaseById);
router.post('/case/create', caseController.createCase);
router.post('/case/officer-action', caseController.handleOfficerAction);
router.get('/case/:caseId/trend', caseController.getCaseTrend);
router.post('/case/:caseId/follow-up', caseController.addFollowUpAssessment);
router.get('/case/victim-dossier/:phoneOrCaseId', caseController.getVictimCaseDossier);
router.post('/case/victim-update', caseController.addVictimUpdate);

// 6B. Audio & Voice Complaint Processing & Registration
router.post('/complaint/analyze-audio', (req, res) => audioComplaintController.analyzeAndRegisterAudio(req, res));
router.get('/complaint/latest', (req, res) => audioComplaintController.getLatestComplaint(req, res));

// 7. Telephony & Acoustic WebRTC Ingestion Routes
router.post('/telephony/ingest-frame', telephonyController.ingestFrame);
router.post('/telephony/twiml-gather', telephonyController.handleTwimlGather);
router.post('/telephony/track-live-call', telephonyController.trackLiveCall);
router.get('/telephony/session-prosody/:sessionId', telephonyController.getSessionProsody);

// 8. Multilingual ASR & Legal NLP Routes
router.post('/nlp/process-transcript', nlpController.processTranscript);
router.get('/nlp/supported-languages', nlpController.getSupportedLanguages);

// 9. Stress & Vulnerability Index (SVI) Engine Routes
router.post('/svi/calculate', sviController.calculateSvi);
router.get('/svi/benchmarks', sviController.getRiskMatrix);

// 10. ERSS 112 Dispatch & CAD Webhook Routes (Simulated NENA i3)
router.post('/dispatch/erss-112', dispatchController.triggerErssDispatch);
router.post('/telephony/dispatch-112', dispatchController.triggerErssDispatch);
router.post('/dispatch/generate-draft-fir', dispatchController.generateDraftFir);

// 11. DPDP Act 2023 Compliance & Encryption Routes
router.post('/compliance/consent', complianceController.recordConsent);
router.post('/compliance/scrub-pii', complianceController.scrubPii);
router.post('/compliance/encrypt-voice', complianceController.encryptVoiceRecord);
router.get('/compliance/audit-logs', complianceController.getAuditLogs);

// 12. Atrocity Spatial Analytics & Heatmap Routes
router.get('/analytics/spatial-heatmap', analyticsController.getSpatialHeatmap);
router.get('/analytics/helpline-sla', analyticsController.getHelplineSla);
router.get('/analytics/quarterly-forecast', analyticsController.getQuarterlyForecast);

// 13. Counselor Desk & Tele-MANAS Triage Routes (Simulated SIP Bridge)
router.get('/counselor/triage-queue', counselorController.getTriageQueue);
router.post('/counselor/telemanas-bridge', counselorController.connectTeleManasBridge);
router.get('/counselor/bridge-telemetry/:bridgeId', counselorController.getBridgeTelemetry);

// 14. DLSA / NALSA 15100 Legal Aid & Relief Compensation Routes
router.post('/legal/calculate-compensation', legalController.calculateCompensation);
router.get('/legal/dlsa-advocates', legalController.getAdvocates);

// 15. Operational Priority Queue & Resource Demand Allocation
router.get('/cases/priority-queue', caseController.getPriorityQueue);
router.get('/analytics/resource-allocation', caseController.getResourceAllocation);

// 16. AI Monitoring, Model Health & Bias Calibration
router.get('/ai/model-health', (req, res) => aiMonitoringController.getModelHealth(req, res));
router.get('/ai/model-performance', (req, res) => aiMonitoringController.getModelPerformance(req, res));
router.get('/ai/bias-monitoring', (req, res) => aiMonitoringController.getBiasMonitoring(req, res));

module.exports = router;
