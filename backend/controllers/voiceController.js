const VoiceController = {
  analyzeVoice(req, res) {
    const { pitchVariance = 35.4, pauseRatio = 0.32, volumeSpikes = 4 } = req.body;
    let pitchScore = Math.min(100, Math.round((pitchVariance / 50) * 100));
    let pauseScore = Math.min(100, Math.round((pauseRatio / 0.5) * 100));
    let acousticDistressScore = Math.round((pitchScore * 0.4) + (pauseScore * 0.4) + (volumeSpikes * 3.6));

    res.json({
      success: true,
      acousticBiomarkers: {
        avgPitchHz: 210,
        pitchVarianceHz: pitchVariance,
        pauseRatioPercent: Math.round(pauseRatio * 100),
        jitterShimmerEstimate: acousticDistressScore > 65 ? "High (0.078)" : "Normal (0.024)",
        speechEnergy: acousticDistressScore > 60 ? "Tremulous / Unstable" : "Steady"
      },
      acousticDistressScore,
      indicators: {
        speechFreezingDetected: pauseRatio > 0.38,
        highVocalTremorDetected: pitchVariance > 30
      }
    });
  }
};

module.exports = VoiceController;
