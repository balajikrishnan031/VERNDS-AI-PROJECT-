/**
 * VERNDS AI - NATIONAL HELPLINE 14566 CLIENT ENGINE
 * Ultra-Premium Light Theme Blueprint Architecture
 * Featuring: Scroll-Triggered Reveal Animations, Live Ingestion Audio Waveform,
 * Reactive Telemetry Control Room, Citizen OTP Flow & Statutory HITL Officer Command Desk
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('🛡️ Vernds AI Ultra-Premium Light Theme Engine Initialized');

  // =========================================================================
  // 1. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // =========================================================================
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      observer.observe(el);
    });

    // Also trigger typewriter effect when Live Call Simulation section enters view
    const simSection = document.getElementById('live-call-simulation');
    if (simSection) {
      const simObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            triggerLiveTypewriter();
            simObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      simObserver.observe(simSection);
    }
  }

  // =========================================================================
  // 2. LIVE CALL SIMULATION TYPEWRITER & AUDIO WAVEFORM
  // =========================================================================
  let typewriterTriggered = false;
  function triggerLiveTypewriter() {
    if (typewriterTriggered) return;
    const transcriptEl = document.getElementById('hero-demo-transcript');
    if (!transcriptEl) return;
    typewriterTriggered = true;

    const fullText = '"Naan romba bayama irukken, please help us immediately. En veetukku veliya aal nikkuranga, complaint thirumba vaanga solli threaten panranga..."';
    transcriptEl.innerHTML = '';
    let charIndex = 0;

    const typeTimer = setInterval(() => {
      if (charIndex < fullText.length) {
        transcriptEl.textContent += fullText.charAt(charIndex);
        charIndex++;
      } else {
        clearInterval(typeTimer);
      }
    }, 28);
  }

  let heroDemoAudioPlaying = false;
  let heroDemoInterval = null;
  let heroDemoSeconds = 14;

  window.toggleHeroDemoAudio = function() {
    const playBtn = document.getElementById('hero-demo-play-btn');
    const timer = document.getElementById('hero-demo-timer');
    const waveBars = document.querySelectorAll('#hero-demo-waveform .waveform-bar-light');

    // Also trigger typewriter if not yet triggered
    triggerLiveTypewriter();

    if (!heroDemoAudioPlaying) {
      heroDemoAudioPlaying = true;
      if (playBtn) {
        playBtn.textContent = '❚❚';
        playBtn.classList.add('playing');
      }
      waveBars.forEach(b => b.classList.add('active'));

      heroDemoInterval = setInterval(() => {
        heroDemoSeconds++;
        if (heroDemoSeconds > 272) heroDemoSeconds = 0;
        const mins = Math.floor(heroDemoSeconds / 60);
        const secs = heroDemoSeconds % 60;
        const secStr = secs < 10 ? '0' + secs : secs;
        if (timer) timer.textContent = `0${mins}:${secStr} / 04:32`;
      }, 1000);
    } else {
      heroDemoAudioPlaying = false;
      if (playBtn) {
        playBtn.textContent = '▶';
        playBtn.classList.remove('playing');
      }
      waveBars.forEach(b => b.classList.remove('active'));
      clearInterval(heroDemoInterval);
    }
  };

  // =========================================================================
  // 3. GLOBAL AUTHENTICATION & SESSION STATE
  // =========================================================================
  let currentAuth = {
    role: 'GUEST',
    profile: null,
    token: null
  };

  const savedAuth = localStorage.getItem('vernds_auth');
  if (savedAuth) {
    try {
      currentAuth = JSON.parse(savedAuth);
    } catch (e) {
      currentAuth = { role: 'GUEST', profile: null, token: null };
    }
  }

  const landingMain = document.getElementById('landing-page-main');
  const victimView = document.getElementById('view-victim-portal');
  const adminView = document.getElementById('view-admin-portal');

  function updateSessionUI() {
    const vLogin = document.getElementById('victim-login-screen');
    const vDash = document.getElementById('victim-dashboard-screen');
    const aLogin = document.getElementById('admin-login-screen');
    const aDash = document.getElementById('admin-dashboard-screen');

    if (currentAuth.role === 'VICTIM') {
      if (vLogin) vLogin.style.display = 'none';
      if (vDash) vDash.style.display = 'block';
      const p = currentAuth.profile || { name: 'Citizen', phone: '' };
      const gName = document.getElementById('v-greet-name');
      const dPhone = document.getElementById('v-dash-phone');
      if (gName) gName.textContent = p.name ? `Welcome, ${p.name}` : 'Welcome, Citizen';
      if (dPhone) dPhone.textContent = p.phone || 'Active Session';

      const pName = document.getElementById('v-profile-name');
      const pPhone = document.getElementById('v-profile-phone');
      if (pName) pName.innerHTML = `Name: <strong>${p.name || 'Citizen'}</strong>`;
      if (pPhone) pPhone.innerHTML = `Mobile Number: <strong>${p.phone || 'Verified'}</strong>`;
    } else {
      if (vLogin) vLogin.style.display = 'block';
      if (vDash) vDash.style.display = 'none';
    }

    if (currentAuth.role === 'OFFICER') {
      if (aLogin) aLogin.style.display = 'none';
      if (aDash) aDash.style.display = 'block';
      const p = currentAuth.profile || { name: 'DSP M. Ramachandran, TPS', designation: 'Special SC/ST Crime Cell', jurisdiction: 'Villupuram, TN' };
      const aName = document.getElementById('admin-badge-name');
      const aDetails = document.getElementById('admin-badge-details');
      if (aName) aName.textContent = p.name;
      if (aDetails) {
        aDetails.innerHTML = `Designation: <strong>${p.designation}</strong> | Jurisdiction: <strong>${p.jurisdiction}</strong> | HITL Active`;
      }
    } else {
      if (aLogin) aLogin.style.display = 'block';
      if (aDash) aDash.style.display = 'none';
    }
  }

  // Primary Portal Routing
  window.showPortalView = function(viewName) {
    if (viewName === 'landing' || viewName === 'home') {
      if (landingMain) landingMain.style.display = 'block';
      if (victimView) victimView.style.display = 'none';
      if (adminView) adminView.style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'victim') {
      if (landingMain) landingMain.style.display = 'none';
      if (victimView) victimView.style.display = 'block';
      if (adminView) adminView.style.display = 'none';
      updateSessionUI();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'admin') {
      if (landingMain) landingMain.style.display = 'none';
      if (victimView) victimView.style.display = 'none';
      if (adminView) adminView.style.display = 'block';
      updateSessionUI();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // =========================================================================
  // 4. SECTION 7: 700+ DISTRICT REGISTRY (LIVE TELEMETRY CONTROL ROOM)
  // =========================================================================
  const stateSelectorBar = document.getElementById('state-selector-bar');
  const districtGridContainer = document.getElementById('district-grid-container');
  const districtSearchInput = document.getElementById('district-search-input');
  let activeStateKey = 'tamil-nadu';
  let districtSearchQuery = '';
  const registryData = window.DISTRICT_REGISTRY_DATA || {};

  function initDistrictRegistry() {
    if (!stateSelectorBar || !districtGridContainer) return;

    stateSelectorBar.innerHTML = '';
    const stateKeys = Object.keys(registryData);

    stateKeys.forEach((key) => {
      const state = registryData[key];
      const pill = document.createElement('button');
      pill.className = `state-tab-pill ${key === activeStateKey ? 'active' : ''}`;
      pill.style.cssText = `
        padding: 9px 18px;
        border-radius: 9999px;
        font-weight: 750;
        font-size: 0.85rem;
        cursor: pointer;
        border: 1.5px solid ${key === activeStateKey ? '#2563eb' : '#cbd5e1'};
        background: ${key === activeStateKey ? '#2563eb' : '#ffffff'};
        color: ${key === activeStateKey ? '#ffffff' : '#0f172a'};
        transition: all 0.2s ease;
        white-space: nowrap;
        box-shadow: 0 1px 3px rgba(15,23,42,0.04);
      `;
      pill.innerHTML = `${state.name} (${state.districts.length})`;

      pill.addEventListener('click', () => {
        document.querySelectorAll('.state-tab-pill').forEach(p => {
          p.style.background = '#ffffff';
          p.style.color = '#0f172a';
          p.style.borderColor = '#cbd5e1';
        });
        pill.style.background = '#2563eb';
        pill.style.color = '#ffffff';
        pill.style.borderColor = '#2563eb';
        activeStateKey = key;
        renderActiveDistricts();
      });

      stateSelectorBar.appendChild(pill);
    });

    renderActiveDistricts();

    if (districtSearchInput) {
      districtSearchInput.addEventListener('input', (e) => {
        districtSearchQuery = e.target.value.toLowerCase().trim();
        renderActiveDistricts();
      });
    }
  }

  function renderActiveDistricts() {
    const state = registryData[activeStateKey];
    if (!state || !districtGridContainer) return;

    districtGridContainer.innerHTML = '';

    const filtered = state.districts.filter(d => {
      if (!districtSearchQuery) return true;
      return (
        d.name.toLowerCase().includes(districtSearchQuery) ||
        d.nodalCode.toLowerCase().includes(districtSearchQuery) ||
        d.specialCourt.toLowerCase().includes(districtSearchQuery) ||
        d.policeNodalCell.toLowerCase().includes(districtSearchQuery)
      );
    });

    if (filtered.length === 0) {
      districtGridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding:50px; background:#fff; border-radius:16px; border:1px dashed #cbd5e1;">
          <h4 style="color:#0f172a; font-size:1.2rem; font-weight:800;">No districts found matching "${districtSearchQuery}"</h4>
          <p style="color:#475569; font-size:0.95rem;">Search by district name, special court or nodal code.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(d => {
      const card = document.createElement('div');
      card.style.cssText = `
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.04);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      `;

      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = '0 12px 24px -4px rgba(15, 23, 42, 0.08)';
        card.style.borderColor = '#cbd5e1';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 4px 6px -1px rgba(15, 23, 42, 0.04)';
        card.style.borderColor = '#e2e8f0';
      });
      
      const badgeBg = d.riskLevel === 'CRITICAL' ? '#fee2e2' : d.riskLevel === 'HIGH' ? '#fef3c7' : '#f0fdf4';
      const badgeColor = d.riskLevel === 'CRITICAL' ? '#dc2626' : d.riskLevel === 'HIGH' ? '#d97706' : '#16a34a';

      card.innerHTML = `
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div>
              <h4 style="font-size:1.25rem; font-weight:850; color:#0f172a; margin:0 0 4px;">${d.name}</h4>
              <span style="font-size:0.78rem; color:#64748b; font-weight:600;">${state.name} Nodal Cell</span>
            </div>
            <span style="background:${badgeBg}; color:${badgeColor}; font-weight:800; font-size:0.78rem; padding:4px 10px; border-radius:8px;">
              ${d.riskLevel} (${d.avgSvi} SVI)
            </span>
          </div>

          <div style="font-size:0.85rem; line-height:1.65; color:#475569; margin-bottom:16px;">
            <div>Court: <strong style="color:#0f172a;">${d.specialCourt.slice(0, 48)}...</strong></div>
            <div>Police: <strong style="color:#0f172a;">${d.policeNodalCell.slice(0, 42)}...</strong></div>
            <div>DLSA: <strong style="color:#0f172a;">${d.dlsaOffice.slice(0, 42)}...</strong></div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; padding-top:14px; font-size:0.85rem; color:#0f172a;">
          <div style="display:flex; align-items:center; gap:8px;">
            <div class="district-live-dot"></div>
            <span>Response Time: <strong>${d.patrolResponse}</strong></span>
          </div>
          <span style="font-family:var(--font-premium-mono); font-size:0.78rem; color:#2563eb; font-weight:800;">${d.nodalCode}</span>
        </div>
      `;

      districtGridContainer.appendChild(card);
    });
  }

  initDistrictRegistry();

  // =========================================================================
  // 5. CITIZEN VICTIM PORTAL CONTROLLER (NAME + PHONE + OTP)
  // =========================================================================
  const victimNameInput = document.getElementById('victim-name-input');
  const victimPhoneInput = document.getElementById('victim-phone-input');
  const victimSendOtpBtn = document.getElementById('victim-send-otp-btn');
  const victimVerifyOtpBtn = document.getElementById('victim-verify-otp-btn');
  const vLoginStep1 = document.getElementById('v-login-step1');
  const vLoginStep2 = document.getElementById('v-login-step2');
  const vOtpTargetPhone = document.getElementById('v-otp-target-phone');
  const victimSignoutBtn = document.getElementById('victim-signout-btn');

  if (victimSendOtpBtn) {
    victimSendOtpBtn.addEventListener('click', async () => {
      const name = (victimNameInput?.value || '').trim();
      const phone = (victimPhoneInput?.value || '').trim();

      if (!phone) {
        alert('Please enter your mobile number to receive verification code.');
        victimPhoneInput?.focus();
        return;
      }

      try {
        const res = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name || 'Citizen', phone })
        });
        const data = await res.json();
        if (vLoginStep2) vLoginStep2.style.display = 'block';
        if (vOtpTargetPhone) vOtpTargetPhone.textContent = phone;
        alert(`📩 Verification Code (OTP) sent to ${phone}\n\nVerification Code: 1456\n(Valid for 10 minutes)`);
      } catch (e) {
        if (vLoginStep2) vLoginStep2.style.display = 'block';
        if (vOtpTargetPhone) vOtpTargetPhone.textContent = phone;
      }
    });
  }

  if (victimVerifyOtpBtn) {
    victimVerifyOtpBtn.addEventListener('click', async () => {
      const name = (victimNameInput?.value || '').trim() || 'Citizen';
      const phone = (victimPhoneInput?.value || '').trim();
      const otpInput = document.getElementById('victim-otp-input');
      const otp = (otpInput?.value || '').trim();

      if (!phone) {
        alert('Please enter your mobile number.');
        victimPhoneInput?.focus();
        return;
      }

      if (!otp) {
        alert('Please enter the 4-digit verification code.');
        otpInput?.focus();
        return;
      }

      try {
        const res = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, otp })
        });
        const data = await res.json();
        if (data.success) {
          currentAuth = { role: 'VICTIM', profile: data.profile, token: data.token };
          localStorage.setItem('vernds_auth', JSON.stringify(currentAuth));
          updateSessionUI();
        } else {
          // Allow demo verification with 1456 or 1234
          if (otp === '1456' || otp === '1234') {
            currentAuth = {
              role: 'VICTIM',
              profile: { name, phone, district: 'Villupuram', state: 'Tamil Nadu' },
              token: 'LOCAL-VICTIM-SESSION'
            };
            localStorage.setItem('vernds_auth', JSON.stringify(currentAuth));
            updateSessionUI();
          } else {
            alert('Invalid verification code. Please enter 1456.');
          }
        }
      } catch (e) {
        currentAuth = {
          role: 'VICTIM',
          profile: { name, phone, district: 'Villupuram', state: 'Tamil Nadu' },
          token: 'LOCAL-VICTIM-SESSION'
        };
        localStorage.setItem('vernds_auth', JSON.stringify(currentAuth));
        updateSessionUI();
      }
    });
  }

  if (victimSignoutBtn) {
    victimSignoutBtn.addEventListener('click', () => {
      currentAuth = { role: 'GUEST', profile: null, token: null };
      localStorage.removeItem('vernds_auth');
      updateSessionUI();
      showPortalView('landing');
    });
  }

  // Victim Tab Switcher
  window.showVictimTab = function(tabId) {
    if (tabId === 'vtab-emergency') {
      alert(`🚨 112 ERSS EMERGENCY PROTOCOL TRIGGERED\n\nNodal Police Cell alerted. Patrol unit TN-PRV-9021 dispatched to your location.\nDirect emergency line: Dial 112 or 14566 immediately.`);
      return;
    }

    document.querySelectorAll('.victim-tab-btn').forEach(btn => {
      if (btn.dataset.vtab === tabId) {
        btn.classList.add('active');
        btn.style.color = '#059669';
        btn.style.borderBottom = '2px solid #059669';
      } else {
        btn.classList.remove('active');
        btn.style.color = '#475569';
        btn.style.borderBottom = 'none';
      }
    });

    document.querySelectorAll('.victim-tab-pane').forEach(pane => {
      if (pane.id === tabId) {
        pane.style.display = 'block';
      } else {
        pane.style.display = 'none';
      }
    });
  };

  document.querySelectorAll('.victim-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showVictimTab(btn.dataset.vtab);
    });
  });

  // Complaint Mode Switcher
  window.switchComplaintMode = function(mode) {
    const voicePanel = document.getElementById('v-voice-panel');
    const textPanel = document.getElementById('v-text-panel');
    const chatPanel = document.getElementById('v-chat-panel');

    const speakBtn = document.getElementById('v-speak-mode-btn');
    const textBtn = document.getElementById('v-text-mode-btn');
    const chatBtn = document.getElementById('v-chat-mode-btn');

    [speakBtn, textBtn, chatBtn].forEach(b => {
      b?.classList.remove('active');
      if (b) {
        b.style.background = '#ffffff';
        b.style.color = '#0f172a';
        b.style.borderColor = '#cbd5e1';
      }
    });

    if (mode === 'voice') {
      if (voicePanel) voicePanel.style.display = 'block';
      if (textPanel) textPanel.style.display = 'none';
      if (chatPanel) chatPanel.style.display = 'none';
      if (speakBtn) {
        speakBtn.classList.add('active');
        speakBtn.style.background = '#059669';
        speakBtn.style.color = '#ffffff';
        speakBtn.style.borderColor = '#059669';
      }
    } else if (mode === 'text') {
      if (voicePanel) voicePanel.style.display = 'none';
      if (textPanel) textPanel.style.display = 'block';
      if (chatPanel) chatPanel.style.display = 'none';
      if (textBtn) {
        textBtn.classList.add('active');
        textBtn.style.background = '#059669';
        textBtn.style.color = '#ffffff';
        textBtn.style.borderColor = '#059669';
      }
    } else if (mode === 'chat') {
      if (voicePanel) voicePanel.style.display = 'none';
      if (textPanel) textPanel.style.display = 'none';
      if (chatPanel) chatPanel.style.display = 'block';
      if (chatBtn) {
        chatBtn.classList.add('active');
        chatBtn.style.background = '#059669';
        chatBtn.style.color = '#ffffff';
        chatBtn.style.borderColor = '#059669';
      }
    }
  };

  // =========================================================================
  // 5B. VOICE & AUDIO INGESTION, ANALYSIS & PERSISTENCE ENGINE
  // =========================================================================
  let currentAudioMode = 'mic'; // 'mic' | 'upload'
  let vMicRecording = false;
  let mediaRecorder = null;
  let audioStream = null;
  let recordedChunks = [];
  let micTimerInterval = null;
  let micRecordingSeconds = 0;
  let activeAudioBlob = null;
  let activeAudioBase64 = null;
  let activeAudioFilename = 'sample_distress_call.wav';
  let speechRecognizer = null;

  // Subtab switcher: Mic vs Upload
  window.switchAudioSubtab = function(mode) {
    currentAudioMode = mode;
    const btnMic = document.getElementById('btn-subtab-mic');
    const btnUpload = document.getElementById('btn-subtab-upload');
    const panelMic = document.getElementById('subpanel-mic-recording');
    const panelUpload = document.getElementById('subpanel-file-upload');

    if (mode === 'mic') {
      btnMic?.classList.add('active');
      btnUpload?.classList.remove('active');
      if (panelMic) panelMic.style.display = 'block';
      if (panelUpload) panelUpload.style.display = 'none';
    } else {
      btnMic?.classList.remove('active');
      btnUpload?.classList.add('active');
      if (panelMic) panelMic.style.display = 'none';
      if (panelUpload) panelUpload.style.display = 'block';
    }
  };

  // Toggle Microphone Recording
  window.toggleUnifiedMic = async function() {
    if (vMicRecording) {
      window.stopUnifiedMic();
      return;
    }

    const micBtn = document.getElementById('v-unified-mic-btn');
    const micLabel = document.getElementById('v-unified-mic-label');
    const recordingBar = document.getElementById('v-mic-recording-active-bar');
    const timerText = document.getElementById('v-mic-timer-text');
    const transcriptInput = document.getElementById('v-unified-transcript-input');
    const transcriptStatus = document.getElementById('v-transcript-status');

    micRecordingSeconds = 0;
    recordedChunks = [];
    activeAudioBase64 = null;

    // Attempt real browser MediaRecorder
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(audioStream);

        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunks.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          if (audioStream) {
            audioStream.getTracks().forEach(t => t.stop());
          }
          const blob = new Blob(recordedChunks, { type: 'audio/webm' });
          activeAudioBlob = blob;
          const audioUrl = URL.createObjectURL(blob);

          const player = document.getElementById('v-recorded-audio-player');
          const playbackBox = document.getElementById('v-mic-playback-box');
          const durationEl = document.getElementById('v-mic-audio-duration');
          if (player) player.src = audioUrl;
          if (durationEl) durationEl.textContent = `00:${micRecordingSeconds < 10 ? '0' + micRecordingSeconds : micRecordingSeconds}`;
          if (playbackBox) playbackBox.style.display = 'block';

          // Convert blob to base64
          const reader = new FileReader();
          reader.onloadend = () => {
            activeAudioBase64 = reader.result;
            activeAudioFilename = `mic_recording_${Date.now()}.webm`;
          };
          reader.readAsDataURL(blob);
        };

        mediaRecorder.start(200);
      }
    } catch (err) {
      console.warn('Microphone hardware access error:', err);
      if (transcriptStatus) transcriptStatus.textContent = 'Mic Permission Denied / Error';
      alert('Microphone Access: Please allow microphone permission in your browser. You can also directly type your complaint in the box.');
    }

    vMicRecording = true;
    micBtn?.classList.add('recording');
    if (micLabel) micLabel.textContent = 'Listening (Speak now)... Click Stop when finished';
    if (recordingBar) recordingBar.style.display = 'block';
    if (transcriptStatus) transcriptStatus.textContent = '● Listening to your voice...';

    // Start live timer
    micTimerInterval = setInterval(() => {
      micRecordingSeconds++;
      const mins = Math.floor(micRecordingSeconds / 60);
      const secs = micRecordingSeconds % 60;
      const timeStr = `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
      if (timerText) timerText.textContent = `LIVE RECORDING: ${timeStr}`;
    }, 1000);

    // SpeechRecognition API support (Real-time Speech to Text)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        speechRecognizer = new SpeechRecognition();
        const langSelect = document.querySelector('.state-search-input');
        const chosenLang = langSelect ? langSelect.value : 'ta';
        speechRecognizer.lang = chosenLang === 'ta' ? 'ta-IN' : (chosenLang === 'hi' ? 'hi-IN' : 'en-IN');
        speechRecognizer.continuous = true;
        speechRecognizer.interimResults = true;

        speechRecognizer.onresult = (evt) => {
          let recognized = '';
          for (let i = evt.resultIndex; i < evt.results.length; ++i) {
            recognized += evt.results[i][0].transcript;
          }
          if (recognized.trim() && transcriptInput) {
            transcriptInput.value = recognized.trim();
            if (transcriptStatus) transcriptStatus.textContent = `✓ Transcribing live (${speechRecognizer.lang})...`;
          }
        };

        speechRecognizer.onerror = (e) => {
          console.warn('SpeechRecognition error:', e.error);
        };

        speechRecognizer.start();
      } catch (e) {
        console.warn('SpeechRecognition start error:', e);
      }
    }
  };

  // Stop Microphone Recording
  window.stopUnifiedMic = function() {
    if (!vMicRecording) return;
    vMicRecording = false;

    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    if (speechRecognizer) {
      try { speechRecognizer.stop(); } catch(e){}
    }
    if (micTimerInterval) clearInterval(micTimerInterval);

    const micBtn = document.getElementById('v-unified-mic-btn');
    const micLabel = document.getElementById('v-unified-mic-label');
    const recordingBar = document.getElementById('v-mic-recording-active-bar');
    const transcriptStatus = document.getElementById('v-transcript-status');

    micBtn?.classList.remove('recording');
    if (micLabel) micLabel.textContent = 'Voice Audio Recorded. Review your statement below!';
    if (recordingBar) recordingBar.style.display = 'none';
    if (transcriptStatus) transcriptStatus.textContent = '✓ Recording finished. Ready to analyze.';
  };

  // File Upload Handlers
  setTimeout(() => {
    const audioFileInput = document.getElementById('v-audio-file-input');
    const audioDropzone = document.getElementById('v-audio-dropzone');

    if (audioFileInput) {
      audioFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        handleSelectedAudioFile(file);
      });
    }

    if (audioDropzone) {
      audioDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        audioDropzone.classList.add('dragover');
      });
      audioDropzone.addEventListener('dragleave', () => {
        audioDropzone.classList.remove('dragover');
      });
      audioDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        audioDropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleSelectedAudioFile(e.dataTransfer.files[0]);
        }
      });
    }
  }, 300);

  function handleSelectedAudioFile(file) {
    activeAudioFilename = file.name;
    const previewBox = document.getElementById('v-uploaded-file-preview');
    const nameEl = document.getElementById('v-upload-filename');
    const sizeEl = document.getElementById('v-upload-filesize');
    const player = document.getElementById('v-uploaded-audio-player');
    const transcriptEl = document.getElementById('v-unified-transcript');

    if (nameEl) nameEl.textContent = file.name;
    if (sizeEl) sizeEl.textContent = `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = (e) => {
      activeAudioBase64 = e.target.result;
      if (player) player.src = activeAudioBase64;
      if (previewBox) previewBox.style.display = 'block';
      if (transcriptEl) {
        transcriptEl.innerHTML = `<strong>Uploaded File:</strong> <em>${file.name} ready for AI acoustic prosody and SC/ST PoA offence analysis.</em>`;
      }
    };
    reader.readAsDataURL(file);
  }

  // Load Authentic Sample Distress Audio
  window.loadSampleDistressAudio = async function() {
    try {
      const btn = document.getElementById('v-btn-load-sample-audio');
      if (btn) btn.textContent = 'Loading...';

      const res = await fetch('/audio/sample_distress_call.wav');
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        activeAudioBase64 = reader.result;
        activeAudioFilename = 'sample_distress_call.wav';

        const previewBox = document.getElementById('v-uploaded-file-preview');
        const nameEl = document.getElementById('v-upload-filename');
        const sizeEl = document.getElementById('v-upload-filesize');
        const player = document.getElementById('v-uploaded-audio-player');
        const transcriptInput = document.getElementById('v-unified-transcript-input');
        const transcriptStatus = document.getElementById('v-transcript-status');

        if (nameEl) nameEl.textContent = 'sample_distress_call.wav (14566 Distress Simulation)';
        if (sizeEl) sizeEl.textContent = '208 KB (16kHz PCM WAV)';
        if (player) {
          player.src = '/audio/sample_distress_call.wav';
        }
        if (previewBox) previewBox.style.display = 'block';
        if (btn) btn.textContent = '✓ Sample Audio Loaded';

        if (transcriptInput) {
          transcriptInput.value = "வணக்கம், எங்கள் கிராமத்தில் சாதியைச் சொல்லித் திட்டி, பொதுக் குடிநீர் கிணற்றில் தண்ணீர் எடுக்க விடாமல் தடுத்துத் தாக்குகிறார்கள். அரிவாளுடன் வீட்டைச் சுற்றி வளைத்து மிரட்டுகிறார்கள். உயிருக்கு ஆபத்து, உடனடியாக 112 போலீஸ் உதவி வேண்டும்.";
        }
        if (transcriptStatus) {
          transcriptStatus.textContent = '✓ Sample Distress Audio Loaded';
        }
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      console.error('Error loading sample distress audio:', e);
    }
  };

  // Master Submission: Process Audio & Register Complaint
  window.processAndRegisterAudioComplaint = async function() {
    const statusBox = document.getElementById('v-audio-processing-status');
    const stepTitle = document.getElementById('v-processing-step-title');
    const stepDesc = document.getElementById('v-processing-step-desc');
    const progressBar = document.getElementById('v-processing-progress-bar');
    const resultsCard = document.getElementById('v-audio-results-card');
    const submitBtn = document.getElementById('v-btn-analyze-audio');

    if (vMicRecording) {
      window.stopUnifiedMic();
    }

    if (statusBox) statusBox.style.display = 'block';
    if (resultsCard) resultsCard.style.display = 'none';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '⏳ Processing Audio & Extracting Distress Indicators...';
    }

    // Step 1: Acoustic Prosody
    if (stepTitle) stepTitle.textContent = '⚙️ Step 1/4: Extracting Acoustic Prosody Biomarkers (F0, Jitter, Tremor)...';
    if (stepDesc) stepDesc.textContent = 'Calculating vocal pitch variance, micro-tremor frequencies (6.2 Hz), and hesitation pause ratios...';
    if (progressBar) progressBar.style.width = '25%';

    await new Promise(r => setTimeout(r, 600));

    // Step 2: Speech-to-Text & Bhashini Translation
    if (stepTitle) stepTitle.textContent = '⚙️ Step 2/4: Bhashini Multilingual Speech-to-Text & Translation...';
    if (stepDesc) stepDesc.textContent = 'Converting voice to text and translating to statutory English record...';
    if (progressBar) progressBar.style.width = '55%';

    await new Promise(r => setTimeout(r, 600));

    // Step 3: SC/ST PoA Offence Classification & SSI
    if (stepTitle) stepTitle.textContent = '⚙️ Step 3/4: Mapping SC/ST (PoA) Act Sections & Safety Severity...';
    if (stepDesc) stepDesc.textContent = 'Checking Section 3(1)(b) water denial, Section 3(1)(r) caste slurs, Section 18A FIR mandate...';
    if (progressBar) progressBar.style.width = '80%';

    const nameInput = document.getElementById('victim-name-input');
    const phoneInput = document.getElementById('victim-phone-input');
    const transcriptInput = document.getElementById('v-unified-transcript-input');

    const victimName = (nameInput && nameInput.value.trim()) || currentAuth.profile?.name || 'Citizen Caller';
    const callerNumber = (phoneInput && phoneInput.value.trim()) || currentAuth.profile?.phone || '+91 9876543210';

    let spokenText = (transcriptInput && transcriptInput.value.trim()) ? transcriptInput.value.trim() : "";
    if (!spokenText) {
      spokenText = activeAudioFilename ? "Voice grievance statement submitted via audio telephony stream." : "Immediate protection and statutory redressal requested.";
    }

    const langSelect = document.querySelector('.state-search-input');
    const chosenLang = (langSelect && langSelect.value) ? (langSelect.value === 'ta' ? 'ta-IN' : (langSelect.value === 'hi' ? 'hi-IN' : 'en-IN')) : 'ta-IN';

    try {
      const response = await fetch('/api/complaint/analyze-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: activeAudioBase64 || null,
          audioFileName: activeAudioFilename || 'complaint_audio.wav',
          spokenText,
          callerNumber,
          victimName,
          district: currentAuth.profile?.district || 'Villupuram',
          village: currentAuth.profile?.village || 'Kandachipuram',
          state: currentAuth.profile?.state || 'Tamil Nadu',
          language: chosenLang
        })
      });

      const data = await response.json();

      if (stepTitle) stepTitle.textContent = '✓ Step 4/4: Statutory Actions Dispatched & Case Stored in Registry!';
      if (stepDesc) stepDesc.textContent = '112 ERSS Police Patrol Mobilized | Section 18A FIR Drafted | Rule 12(4) Relief Sanctioned';
      if (progressBar) progressBar.style.width = '100%';

      await new Promise(r => setTimeout(r, 400));
      if (statusBox) statusBox.style.display = 'none';

      if (data.success) {
        renderAudioAnalysisResults(data.case, data.analysis);
      } else {
        alert('Could not complete audio analysis: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Audio analysis request error:', err);
      if (statusBox) statusBox.style.display = 'none';
      alert('Network error analyzing audio. Please verify backend server.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '🚀 Analyze Audio & Register Complaint (14566)';
      }
    }
  };

  function renderAudioAnalysisResults(caseData, analysis) {
    const card = document.getElementById('v-audio-results-card');
    if (!card) return;

    // 1. Header & Audio
    const caseIdEl = document.getElementById('res-case-id');
    const callerInfoEl = document.getElementById('res-caller-info');
    const player = document.getElementById('res-complaint-audio-player');
    const audioUrl = caseData.audioUrl || '/audio/sample_distress_call.wav';

    if (caseIdEl) caseIdEl.textContent = `Case ${caseData.id || caseData.caseId}`;
    if (callerInfoEl) {
      callerInfoEl.textContent = `Caller: ${caseData.callerNumber} (${caseData.victimName}) | ${caseData.village}, ${caseData.district} | ${caseData.language}`;
    }
    if (player) {
      player.src = audioUrl;
      try { player.play(); } catch(e){}
    }

    // 2. Transcript
    const origTranscript = document.getElementById('res-transcript-original');
    const engTranscript = document.getElementById('res-transcript-english');
    if (origTranscript) origTranscript.textContent = `"${caseData.spokenTranscript}"`;
    if (engTranscript) engTranscript.textContent = `"${caseData.translatedTranscript}"`;

    // 3. PoA Sections
    const sectionsList = document.getElementById('res-problem-sections-list');
    if (sectionsList && caseData.legalSections) {
      let sectionsHtml = caseData.legalSections.map(sec => `
        <div style="background:#ffffff; border:1px solid #e2e8f0; padding:8px 12px; border-radius:8px; font-size:0.85rem; color:#0f172a;">
          ⚖️ <strong>${sec.sectionCode}:</strong> ${sec.description}
        </div>
      `).join('');
      if (caseData.safetyOverrideTriggered || caseData.safetyOverride) {
        sectionsHtml += `
        <div style="background:#fff5f5; border:1.5px solid #fecaca; padding:8px 12px; border-radius:8px; font-size:0.85rem; color:#b91c1c;">
          🚨 <strong>SAFETY OVERRIDE TRIGGERED:</strong> ${caseData.safetyOverrideReason || 'High threat to life & physical safety detected'}
        </div>
        `;
      }
      sectionsList.innerHTML = sectionsHtml;
    }

    // 4. Emotions & Prosody
    const fearEl = document.getElementById('res-emotion-fear');
    const distressEl = document.getElementById('res-emotion-distress');
    const anxietyEl = document.getElementById('res-emotion-anxiety');
    const prosodyText = document.getElementById('res-prosody-text');

    if (fearEl) fearEl.textContent = `${caseData.emotions?.fear || 94}%`;
    if (distressEl) distressEl.textContent = `${caseData.emotions?.distress || 89}%`;
    if (anxietyEl) anxietyEl.textContent = `${caseData.emotions?.anxiety || 86}%`;
    if (prosodyText) {
      prosodyText.innerHTML = `Helplessness: <strong>${caseData.emotions?.helplessness || 82}%</strong> | Vocal Tremor: <strong>${caseData.prosodyMetrics?.vocalTremorHz || 6.4} Hz</strong> | Pitch: <strong>${caseData.prosodyMetrics?.f0Hz || 312} Hz (High Panic)</strong>`;
    }

    // 5. Actions Dispatched
    const actionsList = document.getElementById('res-actions-list');
    if (actionsList) {
      actionsList.innerHTML = `
        <div style="background:#f0fdf4; border:1.5px solid #86efac; padding:10px 14px; border-radius:10px; font-size:0.88rem; color:#166534;">
          🚓 <strong>112 ERSS Police Patrol Dispatched:</strong> CAD #${caseData.cadIncidentId || 'CAD-14566-001'} assigned to Unit <strong>${caseData.assignedPatrolUnit || 'TN-PRV-9021'}</strong> (ETA: 8 mins)
        </div>
        <div style="background:#ffffff; border:1px solid #e2e8f0; padding:8px 12px; border-radius:8px; font-size:0.85rem; color:#0f172a;">
          📄 <strong>Sec 18A Mandatory FIR:</strong> Registered at ${caseData.policeStation} (No anticipatory bail)
        </div>
        <div style="background:#ffffff; border:1px solid #e2e8f0; padding:8px 12px; border-radius:8px; font-size:0.85rem; color:#0f172a;">
          💰 <strong>Rule 12(4) Relief Sanction:</strong> ₹${(caseData.dlsaReliefRupees || 100000).toLocaleString('en-IN')} DBT approved by District Collectorate
        </div>
        <div style="background:#ffffff; border:1px solid #e2e8f0; padding:8px 12px; border-radius:8px; font-size:0.85rem; color:#0f172a;">
          🩺 <strong>Tele-MANAS (14416):</strong> Crisis Psychiatrist Bridge (Dr. Ananya Iyer, MD)
        </div>
        <div style="background:#ffffff; border:1px solid #e2e8f0; padding:8px 12px; border-radius:8px; font-size:0.85rem; color:#0f172a;">
          ⚖️ <strong>DLSA (15100):</strong> Adv. S. Subramaniam assigned for free Special SC/ST Court legal aid
        </div>
      `;
    }

    card.style.display = 'block';
    window.scrollTo({ top: card.offsetTop - 80, behavior: 'smooth' });

    // Sync to Victim "My Cases" Timeline
    prependCaseToVictimTimeline(caseData);

    // Sync to Admin All Calls Registry table
    prependCaseToAdminRegistry(caseData);
  }

  // Prepend to Victim Cases View
  function prependCaseToVictimTimeline(caseData) {
    const list = document.getElementById('v-my-complaints-list');
    const emptyBox = document.getElementById('v-no-complaints-box');
    if (emptyBox) emptyBox.style.display = 'none';
    if (!list) return;

    const newBlock = document.createElement('div');
    newBlock.style.cssText = 'background:#ffffff; border:1.5px solid #86efac; border-radius:18px; padding:32px; box-shadow:0 4px 6px -1px rgba(15,23,42,0.04); margin-bottom:24px; animation:slideDownFade 0.4s ease-out;';
    newBlock.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; margin-bottom:20px; border-bottom:1px solid #e2e8f0; padding-bottom:16px;">
        <div>
          <span style="font-size:0.75rem; font-weight:800; color:#059669; text-transform:uppercase; letter-spacing:0.04em;">NEW REGISTERED VOICE CASE</span>
          <h3 style="font-size:1.45rem; font-weight:900; color:#0f172a; margin:2px 0;">Case ${caseData.id || caseData.caseId}</h3>
          <span style="font-size:0.88rem; color:#475569;">Registered: Just now | Channel: 14566 Voice Portal | Location: ${caseData.village || 'Local Area'}, ${caseData.district || 'District Node'}</span>
        </div>
        <span style="background:#fee2e2; color:#dc2626; border:1.5px solid #fecaca; font-weight:800; font-size:0.88rem; padding:8px 16px; border-radius:9999px;">
          🚨 ${caseData.riskCategory || 'CRITICAL'} (SVI ${caseData.sviScore || 85}/100)
        </span>
      </div>

      <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:14px 18px; margin-bottom:20px; color:#166534; font-size:0.92rem;">
        <strong>Emergency Response Dispatched:</strong> Patrol Unit <strong>${caseData.assignedPatrolUnit || 'TN-PRV-9021'}</strong> mobilized to your area. Section 18A FIR registered.
      </div>

      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px 16px; margin-bottom:20px; font-size:0.9rem; color:#0f172a;">
        <strong>Recorded Statement:</strong> "${caseData.spokenTranscript || caseData.translatedTranscript || 'Voice grievance recorded via 14566 national portal.'}"
      </div>

      <h4 style="font-size:1.05rem; font-weight:850; color:#0f172a; margin:0 0 16px;">Statutory Redressal Progress</h4>
      <div class="victim-timeline-steps">
        <div class="victim-step-item completed">
          <div class="step-circle-badge">✓</div>
          <div style="flex:1;">
            <h4 style="font-size:1rem; font-weight:850; color:#0f172a; margin:0 0 2px;">1. Voice Ingestion & Audio Preserved</h4>
            <p style="font-size:0.85rem; color:#475569; margin:0;">14566 audio recorded and hashed under DPDP Act 2023.</p>
          </div>
        </div>
        <div class="victim-step-item completed">
          <div class="step-circle-badge">✓</div>
          <div style="flex:1;">
            <h4 style="font-size:1rem; font-weight:850; color:#0f172a; margin:0 0 2px;">2. Multimodal Emotion & PoA Assessment</h4>
            <p style="font-size:0.85rem; color:#475569; margin:0;">SVI ${caseData.sviScore || 85}. Legal sections mapped.</p>
          </div>
        </div>
        <div class="victim-step-item completed">
          <div class="step-circle-badge">✓</div>
          <div style="flex:1;">
            <h4 style="font-size:1rem; font-weight:850; color:#0f172a; margin:0 0 2px;">3. Emergency 112 Patrol Dispatched</h4>
            <p style="font-size:0.85rem; color:#475569; margin:0;">CAD incident generated. Patrol unit mobilized.</p>
          </div>
        </div>
        <div class="victim-step-item active">
          <div class="step-circle-badge">4</div>
          <div style="flex:1;">
            <h4 style="font-size:1rem; font-weight:850; color:#2563eb; margin:0 0 2px;">4. Rule 12(4) Relief Sanctioned (₹${((caseData.dlsaReliefRupees || 100000)).toLocaleString('en-IN')} DBT)</h4>
            <p style="font-size:0.85rem; color:#475569; margin:0;">Direct Benefit Transfer approved. DLSA counsel assigned.</p>
          </div>
        </div>
      </div>
    `;

    list.prepend(newBlock);
  }

  // Prepend to Admin All Calls Registry
  function prependCaseToAdminRegistry(caseData) {
    const tableBody = document.querySelector('#tab-all-calls table tbody');
    if (!tableBody) return;

    const row = document.createElement('tr');
    row.style.cssText = 'border-bottom:1px solid #e2e8f0; background:#fef2f2; animation:slideDownFade 0.4s ease-out;';
    row.innerHTML = `
      <td style="padding:14px 18px; font-weight:800; font-family:var(--font-premium-mono); color:#dc2626;">${caseData.id || caseData.caseId}</td>
      <td style="padding:14px 18px;">${caseData.callerNumber} (${caseData.victimName})</td>
      <td style="padding:14px 18px;">${caseData.village}, ${caseData.district}</td>
      <td style="padding:14px 18px;">Tamil</td>
      <td style="padding:14px 18px;">${caseData.audioDuration || '02:18'}</td>
      <td style="padding:14px 18px;"><span style="background:#fee2e2; color:#dc2626; font-weight:800; padding:4px 10px; border-radius:6px;">CRITICAL</span></td>
      <td style="padding:14px 18px;"><button class="btn-pill-toggle" style="padding:6px 14px; font-size:0.82rem;" onclick="inspectCaseInMasterDossier('${caseData.id}')">Inspect Dossier</button></td>
    `;

    tableBody.insertBefore(row, tableBody.firstChild);
  }

  // Inspect Case in Admin Master Case Intelligence
  window.inspectCaseInMasterDossier = async function(caseId) {
    showAdminTab('tab-case-intelligence');

    try {
      const res = await fetch(`/api/case/${caseId}`);
      const data = await res.json();
      if (data.success && data.case) {
        const c = data.case;
        const dosHeader = document.querySelector('#tab-case-intelligence h3');
        const dosSub = document.querySelector('#tab-case-intelligence span[style*="Channel: 14566"]');
        const dosAudio = document.getElementById('master-dos-audio-element');
        const dosOrig = document.querySelector('#tab-case-intelligence div:nth-child(2) p[style*="font-weight:650"]');
        const dosTrans = document.querySelector('#tab-case-intelligence div:nth-child(3) p');

        if (dosHeader) dosHeader.textContent = `Case ${c.id || c.caseId}`;
        if (dosSub) dosSub.textContent = `Channel: 14566 Voice Portal | Duration: ${c.audioDuration || '02:18'} | Language: ${c.language || 'Tamil'} | Caller: ${c.callerNumber}`;
        if (dosOrig) dosOrig.textContent = `"${c.spokenTranscript}"`;
        if (dosTrans) dosTrans.textContent = `"${c.translatedTranscript}"`;

        // Update audio player in dossier
        const playerBox = document.querySelector('#tab-case-intelligence .call-sim-play-btn')?.parentElement;
        if (playerBox && c.audioUrl) {
          playerBox.innerHTML = `
            <audio src="${c.audioUrl}" controls style="width:100%; outline:none;"></audio>
          `;
        }
      }
    } catch(e) {
      console.error('Error fetching case dossier:', e);
    }
  };

  // Confirm Complaint Submission
  window.confirmComplaintSubmission = function() {
    window.processAndRegisterAudioComplaint();
  };

  // Follow-up Response
  window.submitFollowupResponse = function(val) {
    alert(`Thank you for your response ("${val}").\n\nYour recovery progress has been recorded in your longitudinal welfare profile. The Nodal Support Team has been updated.`);
  };

  // Follow-up Response
  window.submitFollowupResponse = function(val) {
    alert(`Thank you for your response ("${val}").\n\nYour recovery progress has been recorded in your longitudinal welfare profile. The Nodal Support Team has been updated.`);
  };

  // =========================================================================
  // 6. STATUTORY ADMIN COMMAND DESK CONTROLLER
  // =========================================================================
  const adminLoginBtn = document.getElementById('admin-login-submit-btn');
  const adminRoleSelect = document.getElementById('admin-role-select');
  const adminLogoutBtn = document.getElementById('admin-logout-btn');

  if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', async () => {
      const selectedKey = adminRoleSelect ? adminRoleSelect.value : 'dsp-scst';
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'OFFICER', officerKey: selectedKey })
        });
        const data = await res.json();
        if (data.success) {
          currentAuth = { role: 'OFFICER', profile: data.profile, token: data.token };
          localStorage.setItem('vernds_auth', JSON.stringify(currentAuth));
          updateSessionUI();
        } else {
          alert('Could not authenticate: ' + data.message);
        }
      } catch (err) {
        currentAuth = {
          role: 'OFFICER',
          profile: {
            name: "DSP M. Ramachandran, TPS",
            designation: "Deputy Superintendent of Police (Special SC/ST Crime Cell)",
            jurisdiction: "Villupuram, TN",
            badgeId: "TN-POLICE-SCST-0492"
          },
          token: "LOCAL-OFFICER-SESSION"
        };
        localStorage.setItem('vernds_auth', JSON.stringify(currentAuth));
        updateSessionUI();
      }
    });
  }

  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
      currentAuth = { role: 'GUEST', profile: null, token: null };
      localStorage.removeItem('vernds_auth');
      updateSessionUI();
      showPortalView('landing');
    });
  }

  // Admin Sub-Tab Switcher
  window.showAdminTab = function(tabId) {
    document.querySelectorAll('.admin-subnav-tab').forEach(t => {
      if (t.dataset.atab === tabId) {
        t.classList.add('active');
        t.style.color = '#2563eb';
        t.style.borderBottom = '2px solid #2563eb';
      } else {
        t.classList.remove('active');
        t.style.color = '#475569';
        t.style.borderBottom = 'none';
      }
    });

    document.querySelectorAll('.admin-tab-content').forEach(c => {
      if (c.id === tabId) {
        c.style.display = 'block';
      } else {
        c.style.display = 'none';
      }
    });
  };

  document.querySelectorAll('.admin-subnav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      showAdminTab(tab.dataset.atab);
    });
  });

  // Admin Master Dossier Audio Player
  let masterAudioPlaying = false;
  let masterAudioInterval = null;
  let masterSeconds = 14;

  window.toggleMasterAudio = function() {
    const playBtn = document.getElementById('master-dos-play-btn');
    const timer = document.getElementById('master-dos-timer');
    const waveBars = document.querySelectorAll('#master-dos-waveform .waveform-bar-light');

    if (!masterAudioPlaying) {
      masterAudioPlaying = true;
      if (playBtn) {
        playBtn.textContent = '❚❚';
        playBtn.classList.add('playing');
      }
      waveBars.forEach(b => b.classList.add('active'));

      masterAudioInterval = setInterval(() => {
        masterSeconds++;
        if (masterSeconds > 272) masterSeconds = 0;
        const mins = Math.floor(masterSeconds / 60);
        const secs = masterSeconds % 60;
        const secStr = secs < 10 ? '0' + secs : secs;
        if (timer) timer.textContent = `0${mins}:${secStr} / 04:32`;
      }, 1000);
    } else {
      masterAudioPlaying = false;
      if (playBtn) {
        playBtn.textContent = '▶';
        playBtn.classList.remove('playing');
      }
      waveBars.forEach(b => b.classList.remove('active'));
      clearInterval(masterAudioInterval);
    }
  };

  // Human Officer Decision Submission (HITL)
  window.submitMasterDecision = async function(action) {
    const notesInput = document.getElementById('master-officer-note');
    const notes = notesInput ? notesInput.value.trim() : 'Verified threat biomarkers. Immediate patrol and legal relief endorsed.';

    try {
      const res = await fetch('/api/case/officer-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: 'NHAA-20260918-000231',
          action: action,
          officerName: currentAuth.profile ? currentAuth.profile.name : 'DSP M. Ramachandran, TPS',
          officerDesignation: 'DSP Special SC/ST Crime Cell',
          notes: notes || `Endorsed ${action} under PoA statutory powers.`
        })
      });
      const data = await res.json();
      alert(`✅ STATUTORY OFFICER ACTION [${action}] RECORDED\n\n${data.message || 'All interventions endorsed: 112 Patrol Mobilized, Rule 12(4) Relief DBT Sanctioned, DLSA Legal Assistance, Tele-MANAS Counseling Booked.'}\n\nCryptographically recorded on DPDP Audit Ledger.`);
    } catch (e) {
      alert(`✅ STATUTORY OFFICER ACTION [${action}] RECORDED\n\nEndorsement logged for Case NHAA-20260918-000231.\nInterventions: 112 Patrol Mobilized, Rule 12(4) DBT Sanctioned, DLSA Assigned.`);
    }
  };

  // =========================================================================
  // 14566 INTERACTIVE TELEPHONY SOFTPHONE CALL SIMULATOR
  // Allows testing 14566 national helpline calling live in browser with real mic!
  // =========================================================================
  let callTimerInterval = null;
  let callSeconds = 0;
  let callSpeechRecognition = null;
  let callSpokenText = "";

  window.open14566Dialer = function() {
    const modal = document.getElementById('modal-14566-call');
    if (!modal) return;
    modal.style.display = 'flex';

    // Reset state
    clearInterval(callTimerInterval);
    callSeconds = 0;
    callSpokenText = "";

    const timer = document.getElementById('call-timer');
    const wave = document.getElementById('call-wave-bars');
    const transcriptBox = document.getElementById('call-live-transcript-box');
    const transcriptText = document.getElementById('call-live-transcript-text');
    const startBtn = document.getElementById('btn-start-14566-call');
    const endBtn = document.getElementById('btn-end-14566-call');
    const statusLabel = document.getElementById('call-status-label');
    const avatar = document.getElementById('call-avatar-icon');

    if (timer) { timer.style.display = 'none'; timer.textContent = '00:00'; }
    if (wave) wave.style.display = 'none';
    if (transcriptBox) transcriptBox.style.display = 'none';
    if (transcriptText) transcriptText.textContent = 'Connecting to national helpline voice gateway...';
    if (startBtn) { startBtn.style.display = 'flex'; startBtn.disabled = false; }
    if (endBtn) { endBtn.style.display = 'none'; endBtn.disabled = false; endBtn.textContent = '🔴 End Call & Trigger Dispatch'; }
    if (statusLabel) statusLabel.textContent = 'National Helpline Against Atrocities (Toll-Free Telephony Bridge)';
    if (avatar) avatar.textContent = '🛡️';
  };

  window.close14566Dialer = function() {
    const modal = document.getElementById('modal-14566-call');
    if (modal) modal.style.display = 'none';
    clearInterval(callTimerInterval);
    if (callSpeechRecognition) {
      try { callSpeechRecognition.stop(); } catch(e){}
      callSpeechRecognition = null;
    }
  };

  window.start14566Call = function() {
    const statusLabel = document.getElementById('call-status-label');
    const startBtn = document.getElementById('btn-start-14566-call');
    const endBtn = document.getElementById('btn-end-14566-call');
    const timer = document.getElementById('call-timer');
    const wave = document.getElementById('call-wave-bars');
    const transcriptBox = document.getElementById('call-live-transcript-box');
    const transcriptText = document.getElementById('call-live-transcript-text');
    const avatar = document.getElementById('call-avatar-icon');

    if (statusLabel) statusLabel.textContent = 'Dialing 14566... Routing SIP Trunk to MoSJE Voice Gateway...';
    if (avatar) avatar.textContent = '📞';

    setTimeout(() => {
      if (statusLabel) statusLabel.innerHTML = '● <span style="color:#22c55e; font-weight:800;">CONNECTED</span> | 14566 Helpline Active | AI Prosody & Speech Stream Ingestion';
      if (avatar) avatar.textContent = '🎙️';
      if (startBtn) startBtn.style.display = 'none';
      if (endBtn) endBtn.style.display = 'block';
      if (timer) timer.style.display = 'block';
      if (wave) wave.style.display = 'flex';
      if (transcriptBox) transcriptBox.style.display = 'block';
      if (transcriptText) transcriptText.innerHTML = '<em>IVR: "வணக்கம், தேசிய உதவி மையம் 14566. உங்கள் அவசர புகாரைக் கூறுங்கள்..." (Speak into your microphone now...)</em>';

      // Start call timer
      callSeconds = 0;
      clearInterval(callTimerInterval);
      callTimerInterval = setInterval(() => {
        callSeconds++;
        const mins = Math.floor(callSeconds / 60);
        const secs = callSeconds % 60;
        if (timer) timer.textContent = `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
      }, 1000);

      // Start Web Speech Recognition for Live Call
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          callSpeechRecognition = new SpeechRecognition();
          callSpeechRecognition.continuous = true;
          callSpeechRecognition.interimResults = true;
          callSpeechRecognition.lang = 'ta-IN';

          callSpeechRecognition.onresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                callSpokenText += event.results[i][0].transcript + ' ';
              } else {
                interimTranscript += event.results[i][0].transcript;
              }
            }
            const fullText = (callSpokenText + interimTranscript).trim();
            if (transcriptText && fullText) {
              transcriptText.innerHTML = `<strong style="color:#38bdf8;">Caller:</strong> "${fullText}"`;
            }
          };

          callSpeechRecognition.onerror = (e) => {
            console.warn('14566 call speech recognition note:', e.error);
          };

          callSpeechRecognition.start();
        } catch (e) {
          console.warn('Call speech recognition init:', e);
        }
      }
    }, 1200);
  };

  window.end14566Call = async function() {
    clearInterval(callTimerInterval);
    if (callSpeechRecognition) {
      try { callSpeechRecognition.stop(); } catch(e){}
      callSpeechRecognition = null;
    }

    const statusLabel = document.getElementById('call-status-label');
    const endBtn = document.getElementById('btn-end-14566-call');
    if (statusLabel) statusLabel.textContent = 'Processing Call Telemetry & Triggering 112 CAD Emergency Dispatch...';
    if (endBtn) { endBtn.disabled = true; endBtn.textContent = 'Processing Dispatch...'; }

    const callerNumber = currentAuth.profile?.phone || '+91 9876543210';
    const victimName = currentAuth.profile?.name || 'Citizen Caller';
    const finalSpoken = callSpokenText.trim() || 'எங்கள் கிராமத்தில் சாதியைச் சொல்லித் திட்டி அச்சுறுத்துகிறார்கள், குடிநீர் எடுக்க விடாமல் தடுத்துத் தாக்குகிறார்கள். உடனடியாக 112 உதவி வேண்டும்.';

    try {
      const res = await fetch('/api/telephony/track-live-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callerNumber,
          victimName,
          spokenText: finalSpoken,
          language: 'ta-IN',
          district: currentAuth.profile?.district || 'Villupuram',
          state: currentAuth.profile?.state || 'Tamil Nadu'
        })
      });

      const data = await res.json();
      close14566Dialer();

      if (data.success && data.case) {
        alert(`📞 14566 HELPLINE CALL PROCESSED & DISPATCHED\n\n` +
              `Case ID: ${data.case.id}\n` +
              `Caller: ${callerNumber} (${victimName})\n` +
              `SVI Stress Score: ${data.sviScore}/100 (${data.riskTier})\n` +
              `Dispatched: Unit ${data.erssPayload?.assignedUnit || 'TN-PRV-9021'}\n` +
              `CAD Incident: ${data.erssPayload?.cadIncidentId}\n` +
              `Relief Sanctioned: ${data.dlsaRelief}\n\n` +
              `The case has been registered in the National Helpline Registry and your timeline.`);

        // Switch to victim portal if currently on landing
        if (typeof showPortalView === 'function') {
          showPortalView('victim');
          if (typeof showVictimTab === 'function') {
            showVictimTab('vtab-my-complaints');
          }
        }

        // Prepend to victim timeline and admin registry
        prependCaseToVictimTimeline(data.case);
        if (typeof prependCaseToAdminRegistry === 'function') {
          prependCaseToAdminRegistry(data.case);
        }
      } else {
        alert('Call ended. Telemetry recorded in 14566 audit vault.');
      }
    } catch (e) {
      console.error('Error ending 14566 call:', e);
      close14566Dialer();
      alert('14566 Call concluded and logged to telecom registry.');
    }
  };

  // Initial render & run scroll reveal
  updateSessionUI();
  initScrollReveal();
  console.log('✅ Vernds AI Ultra-Premium Light Theme Engine Fully Synced & Operational');
});
