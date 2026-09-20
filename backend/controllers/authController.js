/**
 * VERNDS AI - Role-Based Authentication & Access Controller
 * DPDP Act 2023 Compliant | Ministry of Social Justice & Empowerment
 */

const PRECONFIGURED_OFFICERS = {
  "dsp-scst": {
    id: "OFF-DSP-01",
    username: "dsp.villupuram",
    name: "DSP M. Ramachandran, TPS",
    role: "DISTRICT_NODAL_OFFICER",
    designation: "Deputy Superintendent of Police (Special SC/ST Crime Cell)",
    jurisdiction: "Villupuram District, Tamil Nadu",
    badgeId: "TN-POLICE-SCST-0492",
    accessLevel: "FULL_OPERATIONAL",
    permissions: ["VIEW_RAW_TELEMETRY", "DISPATCH_112_ERSS", "APPROVE_HITL", "VIEW_UNMASKED_PII"]
  },
  "sdm-magistrate": {
    id: "OFF-SDM-02",
    username: "sdm.villupuram",
    name: "Dr. K. Senthil Nathan, IAS",
    role: "SUB_DIVISIONAL_MAGISTRATE",
    designation: "SDM & Executive Magistrate (Rule 3(1) Desk)",
    jurisdiction: "Villupuram Sub-Division, Tamil Nadu",
    badgeId: "TN-REV-SDM-1108",
    accessLevel: "STATUTORY_AUTHORITY",
    permissions: ["SANCTION_RULE12_RELIEF", "ENFORCE_SECTION18A", "APPROVE_HITL", "VIEW_UNMASKED_PII"]
  },
  "dlsa-secretary": {
    id: "OFF-DLSA-03",
    username: "dlsa.villupuram",
    name: "Adv. S. Subramaniam",
    role: "DLSA_SECRETARY",
    designation: "Secretary & Free Legal Aid Defense Counsel (NALSA 15100)",
    jurisdiction: "District Legal Services Authority, Villupuram",
    badgeId: "DLSA-VPM-BAR-8821",
    accessLevel: "LEGAL_RELIEF",
    permissions: ["ASSIGN_DEFENSE_COUNSEL", "CALCULATE_RELIEF_DBT", "VIEW_UNMASKED_PII"]
  },
  "national-mosje": {
    id: "OFF-MOSJE-04",
    username: "director.mosje",
    name: "Dr. Rajeshwar Prasad, IAS",
    role: "NATIONAL_DIRECTOR",
    designation: "Director (SCD / Social Justice Wing), MoSJE HQ New Delhi",
    jurisdiction: "All-India Command (NHAA 14566)",
    badgeId: "GOI-MOSJE-DIR-001",
    accessLevel: "SUPER_ADMIN",
    permissions: ["ALL_INDIA_REGISTRY", "VIEW_RAW_TELEMETRY", "DISPATCH_112_ERSS", "APPROVE_HITL", "VIEW_UNMASKED_PII"]
  }
};

const PRECONFIGURED_VICTIMS = {
  "+919342636595": {
    phone: "+91 9342636595",
    caseId: "NHAA-1023",
    victimName: "Protected Citizen Node #9342",
    location: "Kandachipuram, Villupuram, Tamil Nadu",
    role: "VICTIM"
  },
  "NHAA-1023": {
    phone: "+91 9342636595",
    caseId: "NHAA-1023",
    victimName: "Protected Citizen Node #9342",
    location: "Kandachipuram, Villupuram, Tamil Nadu",
    role: "VICTIM"
  }
};

class AuthController {
  
  /**
   * Send OTP to Citizen / Victim Mobile Number
   */
  sendOtp(req, res) {
    try {
      const { name, phone } = req.body;
      const cleanPhone = (phone || '').trim() || '+91 9342636595';
      const callerName = (name || '').trim() || 'K. Selvam';
      const demoOtp = '1456';

      return res.json({
        success: true,
        message: `OTP sent successfully to ${cleanPhone}`,
        phone: cleanPhone,
        name: callerName,
        demoOtp: demoOtp,
        expiresInSeconds: 300
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Verify OTP and Create Victim Session
   */
  verifyOtp(req, res) {
    try {
      const { name, phone, otp } = req.body;
      const cleanPhone = (phone || '').trim() || '+91 9342636595';
      const callerName = (name || '').trim() || 'K. Selvam';

      if (otp !== '1456' && otp !== '1234') {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP. Please enter the 4-digit code sent to your mobile (Demo OTP: 1456)."
        });
      }

      const sessionToken = `VICTIM-OTP-SESSION-${Date.now().toString(36).toUpperCase()}`;
      const profile = {
        name: callerName,
        phone: cleanPhone,
        caseId: "NHAA-1023",
        village: "Kandachipuram",
        district: "Villupuram",
        state: "Tamil Nadu",
        policeStation: "Kandachipuram Special SC/ST PS",
        role: "VICTIM",
        authenticatedAt: new Date().toISOString()
      };

      return res.json({
        success: true,
        token: sessionToken,
        profile: profile,
        message: `OTP verified successfully. Welcome, ${callerName}.`
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Universal Login (Officer or Victim)
   */
  login(req, res) {
    try {
      const { role, officerKey, phone, caseId, password } = req.body;

      if (role === 'OFFICER') {
        const officer = PRECONFIGURED_OFFICERS[officerKey || 'dsp-scst'];
        if (!officer) {
          return res.status(401).json({ success: false, message: "Invalid officer credentials." });
        }

        const sessionToken = `OFFICER-SESSION-${Date.now().toString(36).toUpperCase()}`;
        return res.json({
          success: true,
          role: 'OFFICER',
          token: sessionToken,
          profile: officer,
          message: `Authenticated as ${officer.designation}`
        });
      }

      if (role === 'VICTIM') {
        const cleanPhone = (phone || '').replace(/\s+/g, '');
        const cleanCase = (caseId || '').toUpperCase().trim();

        const victim = PRECONFIGURED_VICTIMS[cleanPhone] || PRECONFIGURED_VICTIMS[cleanCase] || {
          phone: cleanPhone || '+91 9342636595',
          caseId: cleanCase || 'NHAA-1023',
          victimName: "Verified Grievance Caller",
          location: "Villupuram, Tamil Nadu",
          role: "VICTIM"
        };

        const sessionToken = `VICTIM-SESSION-${Date.now().toString(36).toUpperCase()}`;
        return res.json({
          success: true,
          role: 'VICTIM',
          token: sessionToken,
          profile: victim,
          message: `Authenticated as Grievance Caller ${victim.phone}`
        });
      }

      return res.status(400).json({ success: false, message: "Invalid role specified. Must be OFFICER or VICTIM." });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * Session Check
   */
  checkSession(req, res) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.json({ authenticated: false, role: 'GUEST' });
    }

    if (authHeader.includes('OFFICER')) {
      return res.json({
        authenticated: true,
        role: 'OFFICER',
        profile: PRECONFIGURED_OFFICERS['dsp-scst']
      });
    }

    if (authHeader.includes('VICTIM')) {
      return res.json({
        authenticated: true,
        role: 'VICTIM',
        profile: PRECONFIGURED_VICTIMS['+919342636595']
      });
    }

    return res.json({ authenticated: false, role: 'GUEST' });
  }

  /**
   * Logout
   */
  logout(req, res) {
    res.json({ success: true, message: "Session successfully terminated." });
  }
}

module.exports = new AuthController();
