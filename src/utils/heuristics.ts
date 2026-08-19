import { BiometricReport, StrokeMetrics, KeystrokeMetrics, PsychometricsData } from '../types';

export function calculateDeterministicBiometricReport(payload: {
  strokeMetrics: StrokeMetrics;
  keystrokeMetrics: KeystrokeMetrics;
  psychometrics?: PsychometricsData;
}): BiometricReport {
  const { strokeMetrics, keystrokeMetrics } = payload;

  const baselineSlope = strokeMetrics.baselineSlopeDeg || 4.5;
  const slantAngle = strokeMetrics.slantAngleDeg || 14.5;

  const ambitionSlantVector = Math.min(100, Math.max(25, 45 + baselineSlope * 4.2 + (slantAngle > 0 ? 15 : -10)));
  const subconsciousStressIndex = Math.min(96, Math.max(18, 25 + (keystrokeMetrics.jitterVariance > 200 ? 25 : 10) + (keystrokeMetrics.hesitationCount * 6)));
  const executiveControl = Math.min(98, Math.max(30, 85 - subconsciousStressIndex * 0.35 + (baselineSlope > 2 ? 10 : 0)));
  const emotionalStability = Math.min(95, Math.max(25, 78 - Math.abs(slantAngle - 18) * 0.8));
  const cognitiveSpeed = Math.min(99, Math.max(35, keystrokeMetrics.wpm * 1.2 + 10));
  const riskAppetite = Math.min(92, Math.max(20, 40 + baselineSlope * 3.5));
  const neuroMotorStability = Math.min(96, Math.max(25, 90 - (keystrokeMetrics.jitterVariance / 100)));
  const creativeExpansiveness = Math.min(95, Math.max(30, 50 + slantAngle * 1.5));

  let subconsciousArchetype = 'The Strategic Visionary';
  let archetypeDescription = 'Demonstrates a powerful synthesis of forward-thrusting ambition with deep analytical deliberation.';

  if (ambitionSlantVector > 75 && executiveControl > 70) {
    subconsciousArchetype = 'The Apex Enterprise Leader';
    archetypeDescription = 'Characterized by high directional velocity and forward-slanting trajectory (+theta) signaling executive commanding presence.';
  } else if (subconsciousStressIndex > 65) {
    subconsciousArchetype = 'The Hyper-Deliberate Strategist';
    archetypeDescription = 'Exhibits micro-hesitation bursts in flight latency and variable pen pressure, reflecting internal perfectionism.';
  } else if (creativeExpansiveness > 75) {
    subconsciousArchetype = 'The Lateral Innovation Catalyst';
    archetypeDescription = 'Marked by fluid loops and rapid flight transitions, indicating intuitive lateral problem solving.';
  }

  const execSummary = 'MindMatters Biometric Synthesis confirms ' + subconsciousArchetype + ' profile. Multimodal analysis reveals an Executive Control Index of ' + Math.round(executiveControl) + '/100 with an Ambition Slant Vector of ' + Math.round(ambitionSlantVector) + '/100.';

  return {
    executiveSummary: execSummary,
    subconsciousArchetype,
    archetypeDescription,
    cognitiveIndices: {
      executiveControl: Math.round(executiveControl),
      emotionalStability: Math.round(emotionalStability),
      ambitionSlantVector: Math.round(ambitionSlantVector),
      subconsciousStressIndex: Math.round(subconsciousStressIndex),
      cognitiveSpeed: Math.round(cognitiveSpeed),
      riskAppetite: Math.round(riskAppetite),
      neuroMotorStability: Math.round(neuroMotorStability),
      creativeExpansiveness: Math.round(creativeExpansiveness),
    },
    deepGraphoTraits: [
      {
        trait: 'Baseline Angle Trajectory',
        indicator: baselineSlope.toFixed(1) + ' deg Ascending Gradient',
        psychologicalMeaning: 'Reflects emotional resilience, mental stamina, and daily motivational buoyancy.',
        severity: 'optimal',
        score: Math.round(ambitionSlantVector),
        remediationHint: 'Train the +8 deg ascending baseline drill to sustain cognitive energy.',
      },
      {
        trait: 'Stroke Slant Vector',
        indicator: slantAngle.toFixed(1) + ' deg Forward Orientation',
        psychologicalMeaning: 'Measures responsiveness to external stimuli and proactive momentum.',
        severity: 'optimal',
        score: Math.round(executiveControl),
        remediationHint: 'Maintain balanced 12 deg to 16 deg slant.',
      },
    ],
    keystrokeDynamicsInsight: {
      cognitiveLoadAssessment: 'Mean dwell time of ' + keystrokeMetrics.avgDwellTimeMs.toFixed(1) + 'ms with ' + keystrokeMetrics.hesitationCount + ' hesitation pauses.',
      hesitationPhenomenon: 'Uniform latency distribution signals confident executive processing.',
      neuroCadenceState: 'Harmonic executive flow state.',
      flightTimeInterpretation: 'Flight time averaging ' + keystrokeMetrics.avgFlightTimeMs.toFixed(1) + 'ms reflects rapid neuro-motor synaptic firing.',
    },
    signatureAnalysis: {
      publicPersonaVsInnerSelf: 'Your public signature projects decisive authority and strategic independence.',
      vulnerabilities: ['Occasional reluctance to delegate high-stakes operations.'],
      strengths: ['Ascending terminal stroke vectors preserve proactive forward momentum.'],
      structuralFlaws: ['Retraced hook in initial letter creates subconscious friction.'],
    },
    graphotherapyRemediation: {
      coreObjective: 'Rewire subconscious cognitive drag and elevate goal horizons through ascending vector geometry.',
      alternateSignatures: [
        {
          id: 'sig-ascent-leader',
          name: 'The Ascending Sovereign Signature',
          archetype: 'Executive Growth & Undaunted Ambition',
          purpose: 'Engineered with a +12 deg ascending vector baseline to stimulate executive confidence.',
          targetMindsetShift: 'From cautious risk mitigation to proactive sovereign execution.',
          practiceDifficulty: 'moderate',
          keyModifications: ['Tilt entire baseline upward by 10 to 14 deg.', 'Amplify initial capital letter by 25%.'],
          svgPathD: 'M 20 70 Q 45 15, 65 65 Q 75 35, 95 60 Q 115 25, 140 55 L 180 40 M 15 80 L 195 62',
        },
      ],
      motorRewiringDrills: [
        {
          id: 'drill-ascending-baseline',
          name: 'The +8 deg Ascending Baseline Cadence Drill',
          targetTrait: 'Optimism & Sustained Neuro-Motor Stamina',
          instructions: 'Trace continuous rhythmic loops maintaining an unswerving +8 deg upward trajectory.',
          durationDays: 21,
          dailyRepetitions: 25,
          neuroMechanism: 'Counters motor-cortex fatigue signals and instills proactive behavioral inertia.',
          drillType: 'Trajectory Stabilization',
        },
      ],
      affirmationProtocol: 'I command my subconscious state through deliberate neuro-motor precision.',
    },
  };
}
