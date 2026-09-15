/**
 * VERNDS AI - Master API Routes Registry
 * Vernds AI (Formerly SAMVEDNA-AI) | National Helpline Against Atrocities (14566)
 */

const express = require('express');
const router = express.Router();

// Import Controllers
const telephonyController = require('../controllers/telephonyController');
const nlpController = require('../controllers/nlpController');
const sviController = require('../controllers/sviController');
const dispatchController = require('../controllers/dispatchController');
const complianceController = require('../controllers/complianceController');
const analyticsController = require('../controllers/analyticsController');
const counselorController = require('../controllers/counselorController');
const legalController = require('../controllers/legalController');

// 1. Telephony & Acoustic WebRTC Ingestion Routes
router.post('/telephony/ingest-frame', telephonyController.ingestFrame);
router.post('/telephony/twiml-gather', telephonyController.handleTwimlGather);
router.post('/telephony/track-live-call', telephonyController.trackLiveCall);
router.get('/telephony/session-prosody/:sessionId', telephonyController.getSessionProsody);


// 2. Multilingual ASR & Legal NLP Routes
router.post('/nlp/process-transcript', nlpController.processTranscript);
router.get('/nlp/supported-languages', nlpController.getSupportedLanguages);

// 3. Stress & Vulnerability Index (SVI) Engine Routes
router.post('/svi/calculate', sviController.calculateSvi);
router.get('/svi/benchmarks', sviController.getRiskMatrix);

// 4. ERSS 112 Dispatch & CAD Webhook Routes
router.post('/dispatch/erss-112', dispatchController.triggerErssDispatch);
router.post('/dispatch/generate-draft-fir', dispatchController.generateDraftFir);

// 5. DPDP Act 2023 Compliance & Encryption Routes
router.post('/compliance/scrub-pii', complianceController.scrubPii);
router.post('/compliance/encrypt-voice', complianceController.encryptVoiceRecord);
router.get('/compliance/audit-logs', complianceController.getAuditLogs);

// 6. Atrocity Spatial Analytics & Heatmap Routes
router.get('/analytics/spatial-heatmap', analyticsController.getSpatialHeatmap);
router.get('/analytics/helpline-sla', analyticsController.getHelplineSla);
router.get('/analytics/quarterly-forecast', analyticsController.getQuarterlyForecast);

// 7. Counselor Desk & Tele-MANAS Triage Routes
router.get('/counselor/triage-queue', counselorController.getTriageQueue);
router.post('/counselor/telemanas-bridge', counselorController.connectTeleManasBridge);
router.get('/counselor/bridge-telemetry/:bridgeId', counselorController.getBridgeTelemetry);

// 8. DLSA Legal Aid & Relief Compensation Routes
router.post('/legal/calculate-compensation', legalController.calculateCompensation);
router.get('/legal/dlsa-advocates', legalController.getAdvocates);

module.exports = router;
