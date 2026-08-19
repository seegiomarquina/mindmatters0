import { KeystrokeEvent, KeystrokeMetrics } from '../types';

export function calculateKeystrokeMetrics(
  events: KeystrokeEvent[],
  totalWordsTyped: number = 0,
  backspaceCount: number = 0,
  elapsedDurationSec: number = 10
): KeystrokeMetrics {
  if (!events || events.length === 0) {
    return {
      avgDwellTimeMs: 110,
      avgFlightTimeMs: 145,
      jitterVariance: 240,
      cadenceEntropy: 1.85,
      wpm: 68,
      hesitationCount: 1,
      backspaceRate: 0.04,
      totalKeystrokes: 0,
    };
  }

  let dwellSum = 0;
  let flightSum = 0;
  let validFlightCount = 0;
  let hesitationCount = 0;
  const flightTimes: number[] = [];

  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    dwellSum += Math.max(ev.dwellTimeMs, 10);

    if (i > 0) {
      const flight = ev.flightTimeMs;
      if (flight > 0 && flight < 3000) {
        flightSum += flight;
        validFlightCount++;
        flightTimes.push(flight);

        if (flight > 420) {
          hesitationCount++;
        }
      }
    }
  }

  const avgDwellTimeMs = Number((dwellSum / events.length).toFixed(1));
  const avgFlightTimeMs = validFlightCount > 0 ? Number((flightSum / validFlightCount).toFixed(1)) : 150;

  // Jitter Variance calculation (standard deviation/variance of flight latencies)
  let varianceSum = 0;
  flightTimes.forEach((f) => {
    const diff = f - avgFlightTimeMs;
    varianceSum += diff * diff;
  });
  const jitterVariance = validFlightCount > 1 ? Number((varianceSum / validFlightCount).toFixed(1)) : 180;

  // Cadence Entropy calculation (binned histogram entropy)
  const binCount = 8;
  const bins = new Array(binCount).fill(0);
  const minF = 30;
  const maxF = 600;
  const binWidth = (maxF - minF) / binCount;

  flightTimes.forEach((f) => {
    const binIdx = Math.min(Math.max(Math.floor((f - minF) / binWidth), 0), binCount - 1);
    bins[binIdx]++;
  });

  let cadenceEntropy = 0;
  const totalBins = validFlightCount || 1;
  bins.forEach((count) => {
    if (count > 0) {
      const p = count / totalBins;
      cadenceEntropy -= p * Math.log2(p);
    }
  });

  const minutes = Math.max(elapsedDurationSec / 60, 0.1);
  const words = Math.max(totalWordsTyped, events.length / 5);
  const wpm = Math.round(words / minutes);
  const backspaceRate = Number((backspaceCount / Math.max(events.length, 1)).toFixed(3));

  return {
    avgDwellTimeMs,
    avgFlightTimeMs,
    jitterVariance,
    cadenceEntropy: Number(cadenceEntropy.toFixed(2)),
    wpm: Math.max(15, Math.min(160, wpm)),
    hesitationCount,
    backspaceRate,
    totalKeystrokes: events.length,
  };
}

export const SAMPLE_PROMPT_PARAGRAPHS = [
  "True cognitive sovereignty begins with deliberate execution. Every keystroke and pen stroke is a mirror of subconscious neural intent and executive decision fortitude.",
  "High performance leaders balance rigorous analytical precision with decisive lateral velocity, turning micro-hesitations into rhythmic momentum and relentless clarity.",
  "The architecture of mental mastery requires continuous neuro-motor rewiring. Through targeted graphotherapy and cadence entrainment, we calibrate peak performance.",
];
