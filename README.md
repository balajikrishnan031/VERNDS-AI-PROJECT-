# Vernds AI - Real-Time Stress & Trauma Assessment Engine

**Problem Statement ID:** 26093  
**Organization:** Ministry of Social Justice and Empowerment (MoSJE)  
**Helpline:** National Helpline Against Atrocities (NHAA - 14566)  
**Theme:** MedTech / BioTech / HealthTech (Software)  

---

## Overview
**Vernds AI** is an AI-enabled real-time psychological stress, trauma, fear, anxiety, and vulnerability assessment engine designed for victims and complainants belonging to Scheduled Castes (SC) and Scheduled Tribes (ST) accessing **NHAA (14566)**, IVRS, Chatbot, Mobile App, or Integrated Web Portals.

---

## Key Features

1. **Voice Acoustic Biomarker Engine:**
   - Real-time extraction of F0 pitch variance, vocal tremor (jitter/shimmer), and speech freezing pause ratios (>35% silence).

2. **Multilingual NLP & Location NER Extractor:**
   - Evaluates text/speech narratives in 10+ Indian languages (Hindi, Tamil, Telugu, Odia, Marathi, Bengali, Kannada, Gujarati, Punjabi, English).
   - Automatically extracts victim address, district, and village location names.

3. **Stress Vulnerability Index (SVI: 0 - 100):**
   - Standardized scoring model categorizing risk into **Low (0-25)**, **Moderate (26-50)**, **High (51-75)**, and **Critical (76-100)**.

4. **Automated Emergency Dispatch Protocol:**
   - Auto-triggers Webhook alerts to **112 Emergency Police Control Room (ERSS)**.
   - SIP Auto Hot-Bridge call line transfer to **Tele-MANAS Emergency Doctor (+91 14416)** in < 3 seconds.
   - Flagging for **Witness Protection Scheme (PoA Act Sec 15A)** and DLSA legal aid.

5. **Role-Based 15-Page Web Application:**
   - 14566 Operator Console, Victim Web App, MoSJE All-India Heatmap Dashboard, Specialist Workspace, Sticky Notes Board, and Ethical AI Privacy Center.

---

## Enterprise Project Structure

```
e:\SIH\
├── backend/                  # Express REST API, Controllers, Services & Models
│   ├── config/               # Database Read/Write Persistence Config
│   ├── controllers/          # Telephony, NLP, Voice, SVI, Case & Dispatch Controllers
│   ├── models/               # Case & SVI Data Models
│   ├── routes/               # Modular REST API Routes
│   └── services/             # NER Location & Emotion AI Services
├── database/                 # Persistent Data Store (samvedna_db.json)
├── frontend/                 # 15-Page Dynamic Single Page Web App
└── server.js                 # Server Entrypoint
```

---

## How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   node server.js
   ```

3. Open in Browser:
   `http://localhost:3000`
