export interface StrokePoint {
  x: number;
  y: number;
  pressure: number;
  time: number;
  velocity?: number;
}

export interface Stroke {
  id: string;
  points: StrokePoint[];
  color?: string;
  width?: number;
}

export interface StrokeMetrics {
  strokeCount: number;
  slantAngleDeg: number;
  baselineSlopeDeg: number;
  avgPressure: number;
  pressureVariance: number;
  totalLengthPx: number;
  aspectRatio: number;
  penLifts: number;
  curvatureIndex: number;
  zoneDistribution?: {
    upper: number;
    middle: number;
    lower: number;
  };
  sampleType?: 'signature' | 'handwriting' | 'scan';
}

export interface KeystrokeEvent {
  key: string;
  code: string;
  downTime: number;
  upTime: number;
  dwellTimeMs: number;
  flightTimeMs: number;
}

export interface KeystrokeMetrics {
  avgDwellTimeMs: number;
  avgFlightTimeMs: number;
  jitterVariance: number;
  cadenceEntropy: number;
  wpm: number;
  hesitationCount: number;
  backspaceRate: number;
  totalKeystrokes: number;
}

export interface PsychometricsData {
  primaryGoal: string;
  stressLevel: string;
  decisionStyle: string;
  focusChallenges: string;
}

export interface CognitiveIndices {
  executiveControl: number;
  emotionalStability: number;
  ambitionSlantVector: number;
  subconsciousStressIndex: number;
  cognitiveSpeed: number;
  riskAppetite: number;
  neuroMotorStability: number;
  creativeExpansiveness: number;
}

export interface DeepGraphoTrait {
  trait: string;
  indicator: string;
  psychologicalMeaning: string;
  severity: 'optimal' | 'moderate' | 'critical';
  score: number;
  remediationHint: string;
}

export interface KeystrokeDynamicsInsight {
  cognitiveLoadAssessment: string;
  hesitationPhenomenon: string;
  neuroCadenceState: string;
  flightTimeInterpretation: string;
}

export interface SignatureAnalysis {
  publicPersonaVsInnerSelf: string;
  vulnerabilities: string[];
  strengths: string[];
  structuralFlaws: string[];
}

export interface AlternateSignature {
  id: string;
  name: string;
  archetype: string;
  purpose: string;
  targetMindsetShift: string;
  practiceDifficulty: 'easy' | 'moderate' | 'advanced';
  keyModifications: string[];
  svgPathD: string;
}

export interface MotorRewiringDrill {
  id: string;
  name: string;
  targetTrait: string;
  instructions: string;
  durationDays: number;
  dailyRepetitions: number;
  neuroMechanism: string;
  drillType: string;
}

export interface GraphotherapyRemediation {
  coreObjective: string;
  alternateSignatures: AlternateSignature[];
  motorRewiringDrills: MotorRewiringDrill[];
  affirmationProtocol: string;
}

export interface BiometricReport {
  executiveSummary: string;
  subconsciousArchetype: string;
  archetypeDescription: string;
  cognitiveIndices: CognitiveIndices;
  deepGraphoTraits: DeepGraphoTrait[];
  keystrokeDynamicsInsight: KeystrokeDynamicsInsight;
  signatureAnalysis: SignatureAnalysis;
  graphotherapyRemediation: GraphotherapyRemediation;
}

export interface RemediationProgress {
  drillId: string;
  completedDays: number;
  dailyCompletions: Record<string, number>; // dateString -> count
  lastPracticed: string;
}

export interface SignaturePracticeScore {
  accuracyPercentage: number;
  slantMatchPercentage: number;
  baselineMatchPercentage: number;
  speedFluidityScore: number;
  feedback: string;
}
