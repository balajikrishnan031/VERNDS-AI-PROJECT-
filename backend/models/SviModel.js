// Stress Vulnerability Index (SVI) Model & Risk Classifier

const SviModel = {
  calculateSVI(acousticScore = 50, nlpScore = 50, crimeSeverity = 70, socialIsolation = 60, repeatVictim = false) {
    let baseSVI = (acousticScore * 0.30) + (nlpScore * 0.35) + (crimeSeverity * 0.20) + (socialIsolation * 0.15);
    if (repeatVictim) baseSVI += 8;
    let finalSVI = Math.min(100, Math.round(baseSVI + 10));

    let riskCategory = "Low Risk";
    let colorCode = "#10B981";
    let priorityLevel = "P4";

    if (finalSVI >= 76) {
      riskCategory = "Critical Risk";
      colorCode = "#EF4444";
      priorityLevel = "P1 - Immediate Crisis Dispatch";
    } else if (finalSVI >= 51) {
      riskCategory = "High Risk";
      colorCode = "#F97316";
      priorityLevel = "P2 - High Priority Escalation";
    } else if (finalSVI >= 26) {
      riskCategory = "Moderate Risk";
      colorCode = "#FBBF24";
      priorityLevel = "P3 - Standard Escalation";
    }

    let recommendations = [];
    if (finalSVI >= 76) {
      recommendations = [
        "CRISIS ALERT: Dispatch Local 112 Police Control Room & SP Office (ETA: 8 min)",
        "SIP Auto Hot-Bridge to Tele-MANAS Emergency Psychiatric Hotline (14416)",
        "Alert District Protection Officer & SC/ST Cell",
        "Activate Witness Protection Protocol (PoA Act Section 15A)"
      ];
    } else if (finalSVI >= 51) {
      recommendations = [
        "Assign DLSA Senior Legal Aid Advocate within 4 hours",
        "Schedule Priority Tele-Counselling call with Psychologist (within 6 hrs)",
        "Escalate Case to District Nodal Officer & Social Justice Officer"
      ];
    } else {
      recommendations = [
        "Schedule Tele-Counselling Call within 24 Hours",
        "Log Grievance on NHAA Integrated Portal"
      ];
    }

    return {
      sviScore: finalSVI,
      riskCategory,
      colorCode,
      priorityLevel,
      componentScores: { acousticScore, nlpScore, crimeSeverity, socialIsolation },
      recommendations
    };
  }
};

module.exports = SviModel;
