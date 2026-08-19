import { Stroke, StrokeMetrics, KeystrokeMetrics, BiometricReport } from '../types';

export interface SampleProfile {
  id: string;
  name: string;
  role: string;
  category: string;
  tagline: string;
  strokeMetrics: StrokeMetrics;
  keystrokeMetrics: KeystrokeMetrics;
  sampleStrokes: Stroke[];
  reportPreview: Partial<BiometricReport>;
}

export const SAMPLE_PROFILES: SampleProfile[] = [
  {
    id: 'profile-apex-ceo',
    name: 'Vikramaditya Roy',
    role: 'Managing Partner & Enterprise Founder',
    category: 'High-Authority Executive',
    tagline: 'High ascending trajectory with high T-bar anchors & rapid flight cadence',
    strokeMetrics: {
      strokeCount: 4,
      slantAngleDeg: 22.4,
      baselineSlopeDeg: 8.5,
      avgPressure: 0.82,
      pressureVariance: 0.038,
      totalLengthPx: 1240,
      aspectRatio: 2.85,
      penLifts: 3,
      curvatureIndex: 1.42,
      zoneDistribution: { upper: 45, middle: 40, lower: 15 },
      sampleType: 'signature',
    },
    keystrokeMetrics: {
      avgDwellTimeMs: 88.5,
      avgFlightTimeMs: 112.4,
      jitterVariance: 142.0,
      cadenceEntropy: 1.62,
      wpm: 84,
      hesitationCount: 1,
      backspaceRate: 0.02,
      totalKeystrokes: 184,
    },
    sampleStrokes: [
      {
        id: 's1',
        points: [
          { x: 30, y: 190, pressure: 0.7, time: 0 },
          { x: 60, y: 70, pressure: 0.9, time: 80 },
          { x: 90, y: 180, pressure: 0.85, time: 160 },
          { x: 120, y: 90, pressure: 0.8, time: 240 },
          { x: 150, y: 170, pressure: 0.75, time: 320 },
        ],
      },
      {
        id: 's2',
        points: [
          { x: 170, y: 160, pressure: 0.7, time: 360 },
          { x: 210, y: 150, pressure: 0.65, time: 420 },
          { x: 240, y: 140, pressure: 0.75, time: 480 },
          { x: 280, y: 130, pressure: 0.8, time: 540 },
          { x: 320, y: 110, pressure: 0.9, time: 620 },
        ],
      },
      {
        id: 's3',
        points: [
          { x: 25, y: 215, pressure: 0.85, time: 680 },
          { x: 180, y: 200, pressure: 0.9, time: 780 },
          { x: 340, y: 180, pressure: 0.95, time: 890 },
          { x: 360, y: 165, pressure: 0.9, time: 940 },
        ],
      },
    ],
    reportPreview: {
      subconsciousArchetype: 'The Apex Enterprise Leader',
      cognitiveIndices: {
        executiveControl: 94,
        emotionalStability: 88,
        ambitionSlantVector: 92,
        subconsciousStressIndex: 32,
        cognitiveSpeed: 89,
        riskAppetite: 84,
        neuroMotorStability: 91,
        creativeExpansiveness: 78,
      },
    },
  },
  {
    id: 'profile-creative-catalyst',
    name: 'Ananya Deshmukh',
    role: 'Principal Design Architect & AI Strategist',
    category: 'Lateral Innovation',
    tagline: 'Expansive open loops, variable slant elasticity, and fluid keystroke cadence',
    strokeMetrics: {
      strokeCount: 6,
      slantAngleDeg: 14.8,
      baselineSlopeDeg: 4.2,
      avgPressure: 0.58,
      pressureVariance: 0.065,
      totalLengthPx: 1420,
      aspectRatio: 2.1,
      penLifts: 5,
      curvatureIndex: 1.85,
      zoneDistribution: { upper: 30, middle: 52, lower: 18 },
      sampleType: 'signature',
    },
    keystrokeMetrics: {
      avgDwellTimeMs: 104.2,
      avgFlightTimeMs: 135.0,
      jitterVariance: 210.5,
      cadenceEntropy: 2.15,
      wpm: 72,
      hesitationCount: 3,
      backspaceRate: 0.045,
      totalKeystrokes: 210,
    },
    sampleStrokes: [
      {
        id: 's1',
        points: [
          { x: 40, y: 160, pressure: 0.5, time: 0 },
          { x: 70, y: 90, pressure: 0.6, time: 90 },
          { x: 100, y: 70, pressure: 0.65, time: 180 },
          { x: 130, y: 120, pressure: 0.55, time: 260 },
          { x: 160, y: 155, pressure: 0.5, time: 330 },
        ],
      },
      {
        id: 's2',
        points: [
          { x: 180, y: 150, pressure: 0.55, time: 380 },
          { x: 220, y: 110, pressure: 0.6, time: 460 },
          { x: 260, y: 145, pressure: 0.5, time: 540 },
          { x: 300, y: 95, pressure: 0.65, time: 630 },
          { x: 330, y: 130, pressure: 0.5, time: 710 },
        ],
      },
    ],
    reportPreview: {
      subconsciousArchetype: 'The Lateral Innovation Catalyst',
      cognitiveIndices: {
        executiveControl: 82,
        emotionalStability: 79,
        ambitionSlantVector: 78,
        subconsciousStressIndex: 44,
        cognitiveSpeed: 86,
        riskAppetite: 79,
        neuroMotorStability: 84,
        creativeExpansiveness: 95,
      },
    },
  },
  {
    id: 'profile-high-stress-analyst',
    name: 'Siddharth Iyer',
    role: 'Quantitative Risk & Portfolio Director',
    category: 'Analytical Strain Profile',
    tagline: 'High pressure variance, micro-hesitations, and compressed lower zone',
    strokeMetrics: {
      strokeCount: 7,
      slantAngleDeg: -4.5,
      baselineSlopeDeg: -1.8,
      avgPressure: 0.89,
      pressureVariance: 0.098,
      totalLengthPx: 980,
      aspectRatio: 1.7,
      penLifts: 6,
      curvatureIndex: 0.92,
      zoneDistribution: { upper: 20, middle: 65, lower: 15 },
      sampleType: 'signature',
    },
    keystrokeMetrics: {
      avgDwellTimeMs: 142.0,
      avgFlightTimeMs: 198.5,
      jitterVariance: 485.0,
      cadenceEntropy: 2.85,
      wpm: 54,
      hesitationCount: 8,
      backspaceRate: 0.095,
      totalKeystrokes: 165,
    },
    sampleStrokes: [
      {
        id: 's1',
        points: [
          { x: 50, y: 170, pressure: 0.9, time: 0 },
          { x: 70, y: 110, pressure: 0.95, time: 110 },
          { x: 90, y: 175, pressure: 0.9, time: 210 },
        ],
      },
      {
        id: 's2',
        points: [
          { x: 105, y: 165, pressure: 0.85, time: 260 },
          { x: 125, y: 130, pressure: 0.9, time: 340 },
          { x: 145, y: 170, pressure: 0.88, time: 420 },
        ],
      },
    ],
    reportPreview: {
      subconsciousArchetype: 'The Hyper-Deliberate Strategist',
      cognitiveIndices: {
        executiveControl: 71,
        emotionalStability: 64,
        ambitionSlantVector: 62,
        subconsciousStressIndex: 78,
        cognitiveSpeed: 65,
        riskAppetite: 42,
        neuroMotorStability: 68,
        creativeExpansiveness: 55,
      },
    },
  },
];
