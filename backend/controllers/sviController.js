const SviModel = require('../models/SviModel');

const SviController = {
  calculateSvi(req, res) {
    const { acousticScore = 50, nlpScore = 50, crimeSeverity = 70, socialIsolation = 60, repeatVictim = false } = req.body;
    const result = SviModel.calculateSVI(acousticScore, nlpScore, crimeSeverity, socialIsolation, repeatVictim);
    res.json({ success: true, ...result });
  }
};

module.exports = SviController;
