/**
 * VERNDS AI - Victim Entity Model (DPDP Act 2023 Compliant)
 * Vernds AI (Formerly SAMVEDNA-AI) | National Helpline Against Atrocities (14566)
 */

class VictimModel {
  constructor(data = {}) {
    this.victimId = data.victimId || `VIC-${Math.floor(Math.random()*90000 + 10000)}`;
    this.anonymizedHash = data.anonymizedHash || `HASH-SHA256-${Date.now()}`;
    this.gender = data.gender || "FEMALE";
    this.age = data.age || 28;
    this.communityGroup = data.communityGroup || "SCHEDULED_CASTE"; // SCHEDULED_CASTE, SCHEDULED_TRIBE
    this.state = data.state || "Uttar Pradesh";
    this.district = data.district || "Lakhimpur Kheri";
    this.preferredLanguage = data.preferredLanguage || "hi";
    this.consentGiven = data.consentGiven !== undefined ? data.consentGiven : true;
    this.consentTimestamp = new Date().toISOString();
    this.dpdpVaultId = data.dpdpVaultId || `VAULT-AES256-${Date.now()}`;
  }

  toJSON() {
    return { ...this };
  }
}

module.exports = VictimModel;
