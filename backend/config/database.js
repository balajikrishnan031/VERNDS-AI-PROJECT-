const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../database/samvedna_db.json');

const Database = {
  read() {
    try {
      const data = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error("Database read error:", err);
      return { cases: [], analytics: {} };
    }
  },

  write(data) {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (err) {
      console.error("Database write error:", err);
      return false;
    }
  },

  addCase(caseObj) {
    const db = this.read();
    db.cases.unshift(caseObj);
    db.analytics.totalAssessedVictims += 1;
    if (caseObj.sviScore >= 76) db.analytics.riskDistribution.critical += 1;
    else if (caseObj.sviScore >= 51) db.analytics.riskDistribution.high += 1;
    else if (caseObj.sviScore >= 26) db.analytics.riskDistribution.moderate += 1;
    else db.analytics.riskDistribution.low += 1;

    this.write(db);
    return caseObj;
  }
};

module.exports = Database;
