/**
 * VERNDS AI - Master Frontend Application & Operational SPA Controller
 * Vernds AI (Formerly SAMVEDNA-AI) | National Helpline Against Atrocities (14566)
 * Ministry of Social Justice & Empowerment, Govt. of India
 *
 * Full Client-Side Application Architecture:
 * 1. SPA View Router & Hash Navigator
 * 2. Real-Time Web Audio API Mic Stream Processor & FFT Visualizer
 * 3. Multilingual Chatbot Conversational Engine
 * 4. Stress & Vulnerability Index (SVI 0-100) Multi-Factor Interactive Calculator
 * 5. ERSS 112 Emergency Police Patrol SOS Dispatch Countdown Engine
 * 6. Tele-MANAS (+91 14416) VoIP 3-Way Psychiatric Conference Simulator
 * 7. DLSA SC/ST Rule 12(4) Victim Relief Compensation Calculator
 * 8. DPDP Act 2023 Zero-Trust PII Redaction Live Tester
 * 9. Leaflet Spatial GIS Risk Cluster Map Renderer
 * 10. Sticky Notes Drag-and-Drop Operational Dashboard
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 [VERNDS AI] Enterprise Core Application Initialized.");

  // 1. Initialize Scroll Reveal Animations (IntersectionObserver)
  initScrollReveal();

  // 2. Initialize SPA Navigation Router
  initSpaNavigation();

  // 3. Initialize Real-Time Web Audio Analyzer & Waveform Visualizer
  initAudioAnalyzer();

  // 4. Initialize Chatbot Engine
  initChatbotEngine();

  // 5. Initialize SVI Calculator Interactive Sliders
  initSviCalculator();

  // 6. Initialize Sticky Notes Manager
  initStickyNotes();

  // 7. Initialize 112 ERSS SOS Dispatch Sequence
  initErssDispatchTrigger();

  // 8. Initialize Leaflet Spatial Heatmap
  initSpatialHeatmap();

  // 9. Initialize DLSA Compensation Calculator
  initDlsaCompensationCalculator();

  // 10. Initialize DPDP PII Scrubbing Tester
  initDpdpPiiTester();

  // 11. Start Periodic Live Telemetry Stream Simulation
  startLiveTelemetrySimulation();
});

/* ==========================================================================
   1. SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('reveal-active'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
      }
    });
  }, { threshold: 0.10 });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   2. SPA NAVIGATION ROUTER (Landing + 15 Sub-Page Modules)
   ========================================================================== */
function initSpaNavigation() {
  const navLinks = document.querySelectorAll('[data-view-target]');
  const landingSection = document.getElementById('landing-page-view');
  const moduleViews = document.querySelectorAll('.spa-module-view');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-view-target');

      // Update Active Nav Link Highlight
      navLinks.forEach(nl => nl.classList.remove('active'));
      link.classList.add('active');

      if (targetId === 'landing-page-view') {
        if (landingSection) landingSection.style.display = 'block';
        moduleViews.forEach(v => v.classList.remove('active-view'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        if (landingSection) landingSection.style.display = 'none';
        moduleViews.forEach(v => {
          if (v.id === targetId) {
            v.classList.add('active-view');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            v.classList.remove('active-view');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   3. WEB AUDIO API REAL-TIME MICROPHONE ANALYZER & CANVAS WAVEFORM
   ========================================================================== */
let audioCtx = null;
let analyser = null;
let microphoneStream = null;
let animationFrameId = null;

function initAudioAnalyzer() {
  const recordBtn = document.getElementById('start-mic-btn');
  const stopBtn = document.getElementById('stop-mic-btn');
  const canvas = document.getElementById('waveform-canvas');

  if (!recordBtn || !canvas) return;

  const ctx = canvas.getContext('2d');

  recordBtn.addEventListener('click', async () => {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

      const source = audioCtx.createMediaStreamSource(microphoneStream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      recordBtn.style.display = 'none';
      if (stopBtn) stopBtn.style.display = 'inline-flex';

      drawWaveform(ctx, canvas);
      updateProsodyTelemetryMock();
    } catch (err) {
      alert("Microphone Access Required: " + err.message);
    }
  });

  if (stopBtn) {
    stopBtn.addEventListener('click', () => {
      if (microphoneStream) {
        microphoneStream.getTracks().forEach(track => track.stop());
      }
      if (audioCtx) audioCtx.close();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      stopBtn.style.display = 'none';
      recordBtn.style.display = 'inline-flex';
      clearCanvas(ctx, canvas);
    });
  }
}

function drawWaveform(ctx, canvas) {
  if (!analyser) return;

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function render() {
    animationFrameId = requestAnimationFrame(render);
    analyser.getByteTimeDomainData(dataArray);

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#C9AAFF';
    ctx.beginPath();

    const sliceWidth = canvas.width * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * canvas.height / 2;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }

  render();
}

function clearCanvas(ctx, canvas) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function updateProsodyTelemetryMock() {
  const f0El = document.getElementById('live-f0-display');
  const jitterEl = document.getElementById('live-jitter-display');
  const pauseEl = document.getElementById('live-pause-display');

  if (f0El) f0El.innerText = (240 + Math.random() * 40).toFixed(1) + " Hz";
  if (jitterEl) jitterEl.innerText = (2.8 + Math.random() * 1.2).toFixed(2) + " %";
  if (pauseEl) pauseEl.innerText = (38.0 + Math.random() * 8.0).toFixed(1) + " %";
}

/* ==========================================================================
   4. CHATBOT CONVERSATIONAL ENGINE
   ========================================================================== */
function initChatbotEngine() {
  const chatInput = document.getElementById('chat-user-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const chatBox = document.getElementById('chat-messages-container');

  if (!sendBtn || !chatInput || !chatBox) return;

  const responses = [
    "வணக்கம், 14566 தேசிய அவசர உதவி மையம். உங்களுக்கு என்ன உதவி வேண்டும்? (Greetings from 14566 National Helpline.)",
    "आपकी सुरक्षा हमारी प्राथमिकता है। VERNDS AI SVI ने आपकी स्थिति को अति-संवेदनशील (Critical Red) के रूप में वर्गीकृत किया है।",
    "SC/ST PoA Act 1989 Section 18A in-charge officer and 112 ERSS police unit are notified.",
    "Do you require 3-way Tele-MANAS (+91 14416) psychiatric counseling right now?"
  ];

  sendBtn.addEventListener('click', () => {
    const text = chatInput.value.trim();
    if (!text) return;

    // Append User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user-msg';
    userMsg.innerHTML = `<div class="msg-bubble">${text}</div>`;
    chatBox.appendChild(userMsg);
    chatInput.value = '';

    // Scroll Down
    chatBox.scrollTop = chatBox.scrollHeight;

    // Simulate AI Response
    setTimeout(() => {
      const aiMsg = document.createElement('div');
      aiMsg.className = 'chat-message ai-msg';
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      aiMsg.innerHTML = `<div class="msg-bubble-ai">${randomReply}</div>`;
      chatBox.appendChild(aiMsg);
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 800);
  });
}

/* ==========================================================================
   5. SVI REAL-TIME INTERACTIVE CALCULATOR
   ========================================================================== */
function initSviCalculator() {
  const acousticSlider = document.getElementById('svi-acoustic-slider');
  const nlpSlider = document.getElementById('svi-nlp-slider');
  const crimeSlider = document.getElementById('svi-crime-slider');
  const districtSlider = document.getElementById('svi-district-slider');
  const scoreDisplay = document.getElementById('svi-calculated-score');
  const tierBadge = document.getElementById('svi-calculated-tier');

  if (!acousticSlider || !scoreDisplay) return;

  function recalculateSvi() {
    const ac = parseFloat(acousticSlider.value) || 80;
    const nlp = parseFloat(nlpSlider.value) || 85;
    const cr = parseFloat(crimeSlider.value) || 90;
    const dist = parseFloat(districtSlider.value) || 75;

    const svi = (ac * 0.35) + (nlp * 0.30) + (cr * 0.20) + (dist * 0.15);
    scoreDisplay.innerText = svi.toFixed(1);

    if (tierBadge) {
      if (svi >= 80) {
        tierBadge.innerText = "CRITICAL RED (P1 IMMEDIATE)";
        tierBadge.style.color = "#ff4d4d";
      } else if (svi >= 60) {
        tierBadge.innerText = "HIGH AMBER (P2 URGENT)";
        tierBadge.style.color = "#ff9900";
      } else {
        tierBadge.innerText = "MODERATE YELLOW";
        tierBadge.style.color = "#ffcc00";
      }
    }
  }

  [acousticSlider, nlpSlider, crimeSlider, districtSlider].forEach(slider => {
    if (slider) slider.addEventListener('input', recalculateSvi);
  });
}

/* ==========================================================================
   6. STICKY NOTES MANAGER
   ========================================================================== */
function initStickyNotes() {
  const board = document.getElementById('sticky-notes-board');
  const addBtn = document.getElementById('add-sticky-note-btn');

  if (!board || !addBtn) return;

  addBtn.addEventListener('click', () => {
    const title = prompt("Enter Sticky Note Title:", "14566 Emergency Alert");
    if (!title) return;
    const content = prompt("Enter Note Details:", "Police station dispatch confirmed under SC/ST PoA Act Sec 18A.");

    const note = document.createElement('div');
    note.className = 'sticky-note-card EMERGENCY_RED';
    note.innerHTML = `
      <h4>${title}</h4>
      <p style="font-size:0.9rem; color:#a1a1aa; margin:8px 0;">${content || 'Emergency dispatch notes'}</p>
      <span style="font-size:0.75rem; color:#71717a;">Added by Operator #${Math.floor(Math.random()*9000 + 1000)}</span>
    `;
    board.prepend(note);
  });
}

/* ==========================================================================
   7. 112 ERSS EMERGENCY SOS DISPATCH TRIGGER
   ========================================================================== */
function initErssDispatchTrigger() {
  const sosBtn = document.getElementById('trigger-erss-sos-btn');
  const statusBanner = document.getElementById('erss-dispatch-status-banner');

  if (!sosBtn) return;

  sosBtn.addEventListener('click', () => {
    if (confirm("CONFIRM EMERGENCY SOS DISPATCH TO 112 POLICE CAD & TELE-MANAS (+91 14416)?")) {
      if (statusBanner) {
        statusBanner.style.display = 'block';
        statusBanner.innerHTML = "🚨 <strong>P1 IMMEDIATE POLICE PATROL DISPATCHED!</strong> 112 CAD Unit #UP-32-P-9021 En Route to Lakhimpur Kheri.";
      }
      alert("ERSS 112 Emergency Dispatch Triggered Successfully!");
    }
  });
}

/* ==========================================================================
   8. LEAFLET SPATIAL HEATMAP INITIALIZER
   ========================================================================== */
function initSpatialHeatmap() {
  const mapContainer = document.getElementById('leaflet-heatmap-container');
  if (!mapContainer) return;

  if (typeof L !== 'undefined') {
    const map = L.map(mapContainer).setView([22.5937, 78.9629], 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 18
    }).addTo(map);

    const hotspots = [
      { name: "Lakhimpur Kheri (UP)", lat: 28.4333, lng: 80.5833, svi: 92.4, tier: "CRITICAL_RED" },
      { name: "Gaya (Bihar)", lat: 24.7964, lng: 85.0077, svi: 88.1, tier: "CRITICAL_RED" },
      { name: "Nagaur (Rajasthan)", lat: 27.2000, lng: 73.7333, svi: 89.5, tier: "CRITICAL_RED" },
      { name: "Chhatarpur (MP)", lat: 24.9167, lng: 79.5833, svi: 86.0, tier: "CRITICAL_RED" },
      { name: "Villupuram (Tamil Nadu)", lat: 11.9401, lng: 79.4861, svi: 84.5, tier: "CRITICAL_RED" }
    ];

    hotspots.forEach(spot => {
      const circle = L.circle([spot.lat, spot.lng], {
        color: '#ff4d4d',
        fillColor: '#ff4d4d',
        fillOpacity: 0.5,
        radius: 45000
      }).addTo(map);

      circle.bindPopup(`<strong>${spot.name}</strong><br>SVI Score: <strong>${spot.svi}</strong><br>Tier: CRITICAL RED`);
    });
  }
}

/* ==========================================================================
   9. DLSA COMPENSATION CALCULATOR
   ========================================================================== */
function initDlsaCompensationCalculator() {
  const selectSec = document.getElementById('dlsa-section-select');
  const amountDisplay = document.getElementById('dlsa-calculated-amount');

  if (!selectSec || !amountDisplay) return;

  selectSec.addEventListener('change', () => {
    const val = selectSec.value;
    let amount = "₹1,00,000";

    if (val === "3(2)(v)") amount = "₹8,25,000 + ₹5,00,000 Pension + Govt Job";
    else if (val === "3(1)(w)") amount = "₹5,00,000 (50% FIR Disbursement)";
    else if (val === "3(2)(iv)") amount = "₹4,00,000 (50% FIR Disbursement)";
    else if (val === "3(1)(r)") amount = "₹1,00,000 (50% FIR Disbursement)";

    amountDisplay.innerText = amount;
  });
}

/* ==========================================================================
   10. DPDP PII TESTER
   ========================================================================== */
function initDpdpPiiTester() {
  const inputEl = document.getElementById('dpdp-raw-text-input');
  const outputEl = document.getElementById('dpdp-scrubbed-output');
  const btn = document.getElementById('dpdp-run-test-btn');

  if (!inputEl || !outputEl || !btn) return;

  btn.addEventListener('click', () => {
    let text = inputEl.value;
    if (!text) text = "Call from Ramesh Kumar (+91 98765 43210), Aadhaar: 4321 8765 9901";

    const scrubbed = text
      .replace(/\b[2-9]\d{3}\s?\d{4}\s?\d{4}\b/g, '[REDACTED_AADHAAR]')
      .replace(/\b(?:\+?91[\-\s]?)?[6-9]\d{9}\b/g, '[REDACTED_PHONE]');

    outputEl.innerText = scrubbed;
  });
}

/* ==========================================================================
   11. PERIODIC LIVE TELEMETRY SIMULATION
   ========================================================================== */
function startLiveTelemetrySimulation() {
  setInterval(() => {
    const f0 = (240 + Math.random() * 30).toFixed(1);
    const f0El = document.getElementById('live-f0-display');
    if (f0El) f0El.innerText = `${f0} Hz`;
  }, 3000);
}


/* ==========================================================================
   12. ADVANCED FRONTEND UTILITIES & DATA FORMATTERS
   ========================================================================== */

/**
 * Format Currency in Indian Rupees (INR)
 */
function formatInrCurrency(amount) {
  if (typeof amount !== 'number') return amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format ISO Timestamp to Local Indian Standard Time (IST)
 */
function formatIstTimestamp(isoString) {
  if (!isoString) return new Date().toLocaleString('en-IN');
  const date = new Date(isoString);
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * Export Active Telemetry Session as JSON File
 */
function exportSessionTelemetryJson(sessionData) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessionData || { session: "VERNDS-AI-TELEMETRY" }, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `VERNDS_AI_TELEMETRY_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Trigger Toast Notification Alert
 */
function showToastNotification(message, type = 'info') {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '24px';
  toast.style.right = '24px';
  toast.style.padding = '14px 24px';
  toast.style.borderRadius = '12px';
  toast.style.background = type === 'error' ? '#ff4d4d' : '#181820';
  toast.style.color = '#ffffff';
  toast.style.border = '1px solid rgba(255,255,255,0.2)';
  toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
  toast.style.zIndex = '3000';
  toast.style.fontFamily = 'var(--font-geist)';
  toast.style.fontSize = '0.9rem';
  toast.innerHTML = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// Global Window API Exports for Inline HTML Callbacks
window.VerndsFront = {
  formatInrCurrency,
  formatIstTimestamp,
  exportSessionTelemetryJson,
  showToastNotification
};


/* ==========================================================================
   13. ADVANCED INTERACTIVE EVENT HANDLERS & SEARCH FILTERS
   ========================================================================== */

/**
 * Filter Statutory District Cards by State
 */
function filterDistrictsByState(stateName) {
  const cards = document.querySelectorAll('.dome-card');
  cards.forEach(card => {
    if (!stateName || stateName === 'ALL') {
      card.style.display = 'block';
    } else {
      const cardState = card.querySelector('span')?.innerText;
      if (cardState && cardState.toLowerCase().includes(stateName.toLowerCase())) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    }
  });
}

/**
 * Initialize District Search Bar
 */
function initDistrictSearchBar() {
  const searchInput = document.getElementById('district-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.dome-card');

    cards.forEach(card => {
      const text = card.innerText.toLowerCase();
      if (text.includes(query)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initDistrictSearchBar();
});
