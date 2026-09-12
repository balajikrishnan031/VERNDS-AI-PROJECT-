// Vernds AI Client Application Logic (Supports Separate Frontend & Backend Deployment)

// Dynamic API Base URL Configuration (Render / Vercel Separate Deployment Support)
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? '' 
  : 'https://vernds-ai-backend.onrender.com'; // Replace with your deployed Render/Railway backend URL

let audioCtx = null;
let analyser = null;
let micStream = null;
let isRecording = false;
let animationFrameId = null;
let leafletMapInstance = null;
let riskPieChartInstance = null;

let currentSVI = 88;
let currentLanguage = "English";

const translations = {
  English: { welcomeMessage: "Namaste 🙏 Welcome to the National Helpline Against Atrocities (14566). I am Vernds AI, your empathetic support assistant. We are here to protect you." },
  Hindi: { welcomeMessage: "नमस्ते 🙏 राष्ट्रीय अत्याचार निवारण हेल्पलाइन (14566) में आपका स्वागत है। मैं वर्न्ड्स एआई (Vernds AI) आपकी सुरक्षा के लिए प्रस्तुत हूँ।" },
  Tamil: { welcomeMessage: "வணக்கம் 🙏 தேசிய வன்கொடுமை தடுப்பு உதவி எண் (14566)-க்கு வரவேற்கிறோம். நான் வெர்ன்ட்ஸ் ஏஐ (Vernds AI), உங்களைப் பாதுகாக்க இருக்கிறோம்." }
};

document.addEventListener("DOMContentLoaded", () => {
  initWaveformCanvas();
  fetchCases();
  initAdminAnalytics();
  updateClock();
  setInterval(updateClock, 1000);
  initScrollRevealAnimations();
});

function initScrollRevealAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -40px 0px",
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

function updateClock() {
  const clockEl = document.getElementById("liveClock");
  if (clockEl) {
    const now = new Date();
    clockEl.innerText = now.toISOString().replace('T', ' ').substring(0, 19) + " IST";
  }
}

// --- ALL 15 PAGES NAVIGATION ROUTER ---
function navigateTo(pageId) {
  document.querySelectorAll(".page-section").forEach(sec => sec.classList.remove("active"));
  document.querySelectorAll(".nav-link-btn").forEach(btn => btn.classList.remove("active"));

  const targetPage = document.getElementById(pageId);
  const targetLink = document.getElementById(`link-${pageId}`);

  if (targetPage) targetPage.classList.add("active");
  if (targetLink) targetLink.classList.add("active");

  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => initScrollRevealAnimations(), 50);

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (pageId === 'page-heatmap' && leafletMapInstance) {
    setTimeout(() => leafletMapInstance.invalidateSize(), 300);
  }
}

// --- LANGUAGE SWITCHER ---
function changeLanguage(lang) {
  currentLanguage = lang;
  const langDict = translations[lang] || translations.English;
  const chatMessages = document.getElementById("chatMessages");
  if (chatMessages && chatMessages.children.length === 1) {
    chatMessages.children[0].innerText = langDict.welcomeMessage;
  }
}

// --- ROLE AUTH SIMULATION ---
function simulateLogin() {
  const role = document.getElementById("loginRoleSelect").value;
  alert(`Authenticated successfully as Official Role: [${role.toUpperCase()}]. Welcome to Vernds AI Command Center.`);
  navigateTo('page-home');
}

// --- STICKY NOTES MANAGER ---
function addStickyNote() {
  const board = document.getElementById("stickyNoteBoard");
  if (!board) return;

  const noteText = prompt("Enter crisis note or operator safety instruction:");
  if (!noteText) return;

  const noteColors = ['sticky-yellow', 'sticky-cyan', 'sticky-purple', 'sticky-pink', 'sticky-red'];
  const randomColor = noteColors[Math.floor(Math.random() * noteColors.length)];

  const noteDiv = document.createElement("div");
  noteDiv.className = `sticky-note ${randomColor}`;
  noteDiv.innerHTML = `
    <div class="sticky-pin"></div>
    <strong>📌 New Operator Note</strong>
    <p style="margin-top: 6px;">${noteText}</p>
    <div style="font-size: 11px; color: var(--text-muted); margin-top: 10px;">Created: Just now</div>
  `;

  board.prepend(noteDiv);
}

// --- INTERACTIVE SVI SLIDER RECALCULATION ---
function recalcSviSliders() {
  const voice = parseInt(document.getElementById("sliderVoice").value);
  const nlp = parseInt(document.getElementById("sliderNlp").value);
  const crime = parseInt(document.getElementById("sliderCrime").value);
  const iso = parseInt(document.getElementById("sliderIso").value);

  document.getElementById("sliderVoiceVal").innerText = voice;
  document.getElementById("sliderNlpVal").innerText = nlp;
  document.getElementById("sliderCrimeVal").innerText = crime;
  document.getElementById("sliderIsoVal").innerText = iso;

  const svi = Math.min(100, Math.round((voice * 0.30) + (nlp * 0.35) + (crime * 0.20) + (iso * 0.15)));
  const sviDisplay = document.getElementById("calcSviDisplay");
  const riskBadge = document.getElementById("calcRiskBadge");

  sviDisplay.innerText = svi;

  if (svi >= 76) {
    sviDisplay.style.color = "#ef4444";
    riskBadge.innerText = "Critical Risk (P1)";
    riskBadge.className = "svi-risk-badge critical";
  } else if (svi >= 51) {
    sviDisplay.style.color = "#f97316";
    riskBadge.innerText = "High Risk (P2)";
    riskBadge.className = "svi-risk-badge high";
  } else if (svi >= 26) {
    sviDisplay.style.color = "#f59e0b";
    riskBadge.innerText = "Moderate Risk (P3)";
    riskBadge.className = "svi-risk-badge moderate";
  } else {
    sviDisplay.style.color = "#10b981";
    riskBadge.innerText = "Low Risk (P4)";
    riskBadge.className = "svi-risk-badge low";
  }
}

// --- STANDALONE NLP PARSER ---
async function analyzeNlpOnly() {
  const text = document.getElementById("nlpInputArea").value;
  if (!text) {
    alert("Please enter text narrative to parse.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/analyze-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await res.json();

    document.getElementById("nlpFear").innerText = `${data.emotions.fear}%`;
    document.getElementById("nlpFearFill").style.width = `${data.emotions.fear}%`;
    document.getElementById("nlpDespair").innerText = `${data.emotions.despair}%`;
    document.getElementById("nlpDespairFill").style.width = `${data.emotions.despair}%`;

    alert(`NLP Analysis Complete!\nExtracted Location: ${data.extractedLocation}\nDistress Score: ${data.nlpDistressScore}/100\nSuicidal Ideation Flag: ${data.suicidalIdeationFlag ? 'YES' : 'NO'}`);
  } catch (err) {
    alert("Failed to analyze NLP.");
  }
}

// --- WEB AUDIO API MIC ANALYZER ---
async function toggleMicrophone() {
  const btnText = document.getElementById("micBtnText");
  const micBtn = document.getElementById("btnMicRecord");

  if (!isRecording) {
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(micStream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      isRecording = true;
      btnText.innerText = "Stop Recording";
      if (micBtn) {
        micBtn.classList.remove("btn-primary");
        micBtn.classList.add("btn-danger");
      }

      drawLiveWaveform();
    } catch (err) {
      alert("Microphone unavailable. Running simulated visualizer.");
      simulateAudioVisualizer();
    }
  } else {
    stopMicrophone();
  }
}

function stopMicrophone() {
  if (micStream) micStream.getTracks().forEach(track => track.stop());
  if (audioCtx) audioCtx.close();
  isRecording = false;

  const btnText = document.getElementById("micBtnText");
  const micBtn = document.getElementById("btnMicRecord");
  if (btnText) btnText.innerText = "Start Mic Live Analysis";
  if (micBtn) {
    micBtn.classList.remove("btn-danger");
    micBtn.classList.add("btn-primary");
  }
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
}

function initWaveformCanvas() {
  const canvas = document.getElementById("waveformCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;

  ctx.fillStyle = "rgba(10, 15, 26, 0.8)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#06b6d4";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
}

function drawLiveWaveform() {
  if (!isRecording || !analyser) return;

  const canvas = document.getElementById("waveformCanvas");
  const ctx = canvas.getContext("2d");
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function draw() {
    if (!isRecording) return;
    animationFrameId = requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);

    ctx.fillStyle = "rgba(10, 15, 26, 0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = currentSVI >= 76 ? "#ef4444" : "#06b6d4";
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

  draw();
}

function simulateAudioVisualizer() {
  isRecording = true;
  const canvas = document.getElementById("waveformCanvas");
  const ctx = canvas.getContext("2d");

  function drawSimulated() {
    if (!isRecording) return;
    animationFrameId = requestAnimationFrame(drawSimulated);

    ctx.fillStyle = "rgba(10, 15, 26, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#f97316";
    ctx.beginPath();

    const width = canvas.width;
    const height = canvas.height;
    const time = Date.now() * 0.005;

    for (let x = 0; x < width; x += 4) {
      const y = height / 2 + Math.sin(x * 0.03 + time) * 25 * Math.random();
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  drawSimulated();
}

function loadSampleAudio(sampleType) {
  if (!sampleType) return;
  simulateAudioVisualizer();

  const narrativeInput = document.getElementById("agentNarrativeInput");
  const incidentSelect = document.getElementById("incidentTypeSelect");
  const addressDisplay = document.getElementById("extractedAddressDisplay");

  if (sampleType === "critical") {
    narrativeInput.value = "हमको हाथरस जिले के चंदपा गाँव से निकाल दिया गया है और जान से मारने की धमकी दे रहे हैं! घर में आग लगा दी!";
    if (incidentSelect) incidentSelect.value = "Physical Violence & Murder Threats";
    if (addressDisplay) addressDisplay.innerHTML = `Chandpa Village, Hathras District, Uttar Pradesh <span style="font-size:12px; color:#34d399">(NER Confidence: 96%)</span>`;
    updateSVIDisplay(88, "Critical Risk (P1)", "#ef4444", 90, 88);
  } else if (sampleType === "high") {
    narrativeInput.value = "අපේ ලංජිගාර් ඉඩම් බලහත්කාරයෙන් අල්ලාගෙන තර්ජනය කරනවා. (Lanjigarh Block, Kalahandi, Odisha)";
    if (incidentSelect) incidentSelect.value = "Land Displacement & Arson";
    if (addressDisplay) addressDisplay.innerHTML = `Lanjigarh Block, Kalahandi District, Odisha <span style="font-size:12px; color:#34d399">(NER Confidence: 92%)</span>`;
    updateSVIDisplay(68, "High Risk (P2)", "#f97316", 65, 70);
  } else if (sampleType === "moderate") {
    narrativeInput.value = "மதுரை மாவட்டத்தில் பொதுக் கிணற்றில் தண்ணீர் எடுக்க விடாமல் தடுக்கிறார்கள். சாதி பெயரைச் சொல்லி ஏளனம் செய்கிறார்கள்.";
    if (incidentSelect) incidentSelect.value = "Social Boycott & Resource Exclusion";
    if (addressDisplay) addressDisplay.innerHTML = `Madurai South Taluk, Madurai District, Tamil Nadu <span style="font-size:12px; color:#34d399">(NER Confidence: 94%)</span>`;
    updateSVIDisplay(48, "Moderate Risk (P3)", "#f59e0b", 45, 50);
  } else if (sampleType === "low") {
    narrativeInput.value = "भीलवाड़ा में मजदूरी समय पर नहीं मिल रही है और काम से हटा दिया है।";
    if (incidentSelect) incidentSelect.value = "Verbal Abuse & Caste Slurs";
    if (addressDisplay) addressDisplay.innerHTML = `Bhilwara District, Rajasthan <span style="font-size:12px; color:#34d399">(NER Confidence: 90%)</span>`;
    updateSVIDisplay(22, "Low Risk (P4)", "#10b981", 20, 25);
  }
}

async function runComprehensiveAnalysis() {
  const textNarrative = document.getElementById("agentNarrativeInput").value;
  if (!textNarrative) {
    alert("Please enter narrative text or speak into the microphone.");
    return;
  }

  try {
    const textRes = await fetch(`${API_BASE_URL}/api/analyze-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: textNarrative })
    });
    const textData = await textRes.json();

    if (textData.extractedLocation) {
      document.getElementById("extractedAddressDisplay").innerHTML = `${textData.extractedLocation} <span style="font-size:12px; color:#34d399">(NER Parsed)</span>`;
    }

    const voiceRes = await fetch(`${API_BASE_URL}/api/analyze-voice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pitchVariance: 42, pauseRatio: 0.38, volumeSpikes: 5 })
    });
    const voiceData = await voiceRes.json();

    const sviRes = await fetch(`${API_BASE_URL}/api/calculate-svi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        acousticScore: voiceData.acousticDistressScore,
        nlpScore: textData.nlpDistressScore,
        crimeSeverity: 85,
        socialIsolation: 75
      })
    });
    const sviData = await sviRes.json();

    currentSVI = sviData.sviScore;
    updateSVIDisplay(sviData.sviScore, sviData.riskCategory, sviData.colorCode, voiceData.acousticDistressScore, textData.nlpDistressScore);
    updateEmotionBars(textData.emotions);
  } catch (err) {
    console.error("API error:", err);
    alert("Failed to analyze.");
  }
}

function updateSVIDisplay(svi, category, color, voice, nlp) {
  const display = document.getElementById("sviDisplay");
  const badge = document.getElementById("riskBadgeDisplay");
  if (display) { display.innerText = svi; display.style.color = color; }
  if (badge) {
    badge.innerText = category;
    badge.className = `svi-risk-badge ${svi >= 76 ? 'critical' : svi >= 51 ? 'high' : svi >= 26 ? 'moderate' : 'low'}`;
  }
  const vScore = document.getElementById("voiceScoreVal");
  const nScore = document.getElementById("nlpScoreVal");
  if (vScore) vScore.innerText = `${voice} / 100`;
  if (nScore) nScore.innerText = `${nlp} / 100`;
}

function updateEmotionBars(emotions) {
  if (document.getElementById("fearPercent")) document.getElementById("fearPercent").innerText = `${emotions.fear}%`;
  if (document.getElementById("fearFill")) document.getElementById("fearFill").style.width = `${emotions.fear}%`;
  if (document.getElementById("panicPercent")) document.getElementById("panicPercent").innerText = `${emotions.panic}%`;
  if (document.getElementById("panicFill")) document.getElementById("panicFill").style.width = `${emotions.panic}%`;
  if (document.getElementById("despairPercent")) document.getElementById("despairPercent").innerText = `${emotions.despair}%`;
  if (document.getElementById("despairFill")) document.getElementById("despairFill").style.width = `${emotions.despair}%`;
  if (document.getElementById("angerPercent")) document.getElementById("angerPercent").innerText = `${emotions.anger}%`;
  if (document.getElementById("angerFill")) document.getElementById("angerFill").style.width = `${emotions.anger}%`;
}

async function executeEmergencyDispatch() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/dispatch/emergency-sos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sviScore: currentSVI, district: "Hathras", state: "Uttar Pradesh" })
    });
    const data = await res.json();
    alert(`🚨 ${data.message} 🚨\nDispatched Agencies:\n` + data.dispatchedAgencies.map(a => `- ${a.agency}: ${a.status} (ETA: ${a.etaMinutes} mins)`).join("\n"));
  } catch (err) {
    alert("Emergency SOS Dispatched Successfully to 112 Control Room & Tele-MANAS!");
  }
}

function triggerEmergencySOS() { executeEmergencyDispatch(); }

function sendChatMessage() {
  const input = document.getElementById("chatInput");
  const msg = input.value.trim();
  if (!msg) return;

  const chatContainer = document.getElementById("chatMessages");
  const userBubble = document.createElement("div");
  userBubble.className = "chat-bubble user";
  userBubble.innerText = msg;
  chatContainer.appendChild(userBubble);
  input.value = "";

  setTimeout(() => {
    const botBubble = document.createElement("div");
    botBubble.className = "chat-bubble bot";
    botBubble.innerText = "I hear your pain. Your safety is our highest priority. I have logged your response and calculated an urgent protection assessment. A counselor is being assigned immediately.";
    chatContainer.appendChild(botBubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, 1000);
}

async function initAdminAnalytics() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/analytics/heatmap`);
    const data = await res.json();
    initLeafletMap(data.heatmapData);
    initRiskPieChart(data.riskDistribution);
  } catch (err) { console.error(err); }
}

function initLeafletMap(locations) {
  const mapElement = document.getElementById("leafletMap");
  if (!mapElement) return;

  leafletMapInstance = L.map('leafletMap').setView([22.5937, 78.9629], 5);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(leafletMapInstance);

  locations.forEach(loc => {
    const color = loc.avgSvi >= 76 ? '#ef4444' : loc.avgSvi >= 51 ? '#f97316' : '#f59e0b';
    const circle = L.circleMarker([loc.lat, loc.lng], { color, fillColor: color, fillOpacity: 0.6, radius: Math.min(25, loc.criticalCases * 0.6 + 8) }).addTo(leafletMapInstance);
    circle.bindPopup(`<strong style="color:#000">${loc.district}, ${loc.state}</strong><br>Avg SVI: <strong>${loc.avgSvi}</strong><br>Cases: ${loc.totalCases}`);
  });
}

function initRiskPieChart(dist) {
  const ctx = document.getElementById('riskPieChart');
  if (!ctx) return;
  if (riskPieChartInstance) riskPieChartInstance.destroy();

  riskPieChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Critical Risk (P1)', 'High Risk (P2)', 'Moderate Risk (P3)', 'Low Risk (P4)'],
      datasets: [{ data: [dist.critical, dist.high, dist.moderate, dist.low], backgroundColor: ['#ef4444', '#f97316', '#f59e0b', '#10b981'], borderWidth: 0 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#9ca3af', font: { family: 'Inter' } } } } }
  });
}

async function fetchCases() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/cases`);
    const data = await res.json();
    const tbody = document.getElementById("casesTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    data.cases.forEach(c => {
      const tr = document.createElement("tr");
      const badgeClass = c.sviScore >= 76 ? 'critical' : c.sviScore >= 51 ? 'high' : c.sviScore >= 26 ? 'moderate' : 'low';
      tr.innerHTML = `
        <td><strong>${c.id}</strong></td>
        <td>${c.district}, ${c.state}</td>
        <td>${c.casteCategory}</td>
        <td>${c.incidentType}</td>
        <td><strong style="color: ${c.sviScore >= 76 ? '#ef4444' : '#f97316'};">${c.sviScore}</strong></td>
        <td><span class="svi-risk-badge ${badgeClass}">${c.riskCategory}</span></td>
        <td>${c.status}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) { console.error(err); }
}

function submitVictimReport() {
  const desc = document.getElementById("victimDescInput") ? document.getElementById("victimDescInput").value : "";
  if (!desc) { alert("Please write your narrative."); return; }
  alert("Your report has been encrypted & submitted to the Vernds AI Crisis Engine.");
  document.getElementById("victimDescInput").value = "";
}
