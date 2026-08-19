export interface KnowledgeEntry {
  id: string;
  category: 'Slant Physics' | 'Zone Geometry' | 'Pressure & Haptics' | 'Baseline Trajectory' | 'Signature Archetypes' | 'Keystroke Micro-Dynamics';
  title: string;
  subheading: string;
  scientificPrinciple: string;
  psychologicalVector: string;
  optimalMarker: string;
  pathologyMarker: string;
  remediationAction: string;
  iconName: string;
}

export const GRAPHOLOGY_KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    id: 'k-slant',
    category: 'Slant Physics',
    title: 'Stroke Slant Vector (θ Angle)',
    subheading: 'Measurement of emotional expressiveness vs. cognitive reserve',
    scientificPrinciple: 'Angular inclination of down-strokes relative to the vertical 90° Cartesian plane. Calculated via linear regression on downward vectors.',
    psychologicalVector: 'Positive slant (+10° to +25°) indicates forward emotional empathy, extroverted drive, and social responsiveness. Negative slant (<-5°) reflects subconscious withdrawal, intense self-reliance, and guarded affect.',
    optimalMarker: '+12° to +18° Rightward (Calculated emotional equilibrium & proactive drive)',
    pathologyMarker: '> +45° (Hysteric impulsivity) or < -20° (Deep emotional suppression)',
    remediationAction: 'Graphotherapy verticalization & progressive forward tilt drill (+15° calibration).',
    iconName: 'Compass',
  },
  {
    id: 'k-baseline',
    category: 'Baseline Trajectory',
    title: 'Dynamic Baseline Gradient (Slope Δy/Δx)',
    subheading: 'Neuro-motor indicator of mental stamina and daily motivational buoyancy',
    scientificPrinciple: 'The virtual horizontal trajectory line formed by the baseline contact points of letters across an unlined plane.',
    psychologicalVector: 'Ascending baselines (+4° to +12°) reflect high neuro-dopaminergic motivation, optimism, and executive ambition. Descending baselines (<-3°) correlate with cognitive burnout and emotional fatigue.',
    optimalMarker: '+6° to +10° Ascending (Undaunted optimistic stamina without manic disconnection)',
    pathologyMarker: '< -5° Falling slope (Severe cognitive exhaustion or depression markers)',
    remediationAction: 'The 21-Day +8° Ascending Matrix drill using unlined calibration guides.',
    iconName: 'TrendingUp',
  },
  {
    id: 'k-pressure',
    category: 'Pressure & Haptics',
    title: 'Pen Kinetic Pressure & Density',
    subheading: 'Physiological vitality, sensory intensity, and emotional retention depth',
    scientificPrinciple: 'Force applied per unit area against the writing surface, measured via digital pointer pressure or optical ink density width variations.',
    psychologicalVector: 'Heavy pressure anchors deep sensory memories, unshakeable conviction, and physiological stamina, but risks emotional resentment. Light pressure reflects intellectual agility, spiritual sensitivity, and low physical friction.',
    optimalMarker: 'Moderate-heavy (0.65 - 0.80) with dynamic rhythmic stroke modulation',
    pathologyMarker: 'Extreme static furrowing (>0.95 with zero variance - high muscle tension)',
    remediationAction: 'Tactile relaxation breathing paired with rhythmic loop decompression.',
    iconName: 'Gauge',
  },
  {
    id: 'k-zones',
    category: 'Zone Geometry',
    title: 'Tri-Zonal Spatial Balance (Upper / Middle / Lower)',
    subheading: 'Freudian distribution of Ideation (Superego), Daily Living (Ego), and Instinct (Id)',
    scientificPrinciple: 'Height ratios between Upper Zone (t, l, b, h stems), Middle Zone (a, o, e, m cores), and Lower Zone (g, y, j, p descenders).',
    psychologicalVector: 'Dominant upper zone indicates philosophical ambition and intellectual curiosity. Dominant middle zone signals social immediacy and present-moment focus. Dominant lower zone reflects physical drive, material ambitions, and instinctual security.',
    optimalMarker: 'Balanced ratio: 35% Upper : 40% Middle : 25% Lower',
    pathologyMarker: 'Hypertrophied lower loops with backward knots (Instinctual anxiety & paranoia)',
    remediationAction: 'Apex T-bar elevation and lower-zone loop streamlining.',
    iconName: 'Layers',
  },
  {
    id: 'k-keystroke-dwell',
    category: 'Keystroke Micro-Dynamics',
    title: 'Keystroke Dwell Time (Hold Latency)',
    subheading: 'Keydown to keyup duration reflecting neuro-muscular firmness and cognitive commitment',
    scientificPrinciple: 'Time in milliseconds a key remains depressed before release. Normal physiological range: 60ms - 150ms.',
    psychologicalVector: 'Prolonged dwell times (>180ms) indicate cognitive load, deep analytical deliberation, or motor hesitation. Swift dwell times (<85ms) indicate fluent automaticity and unhesitating executive confidence.',
    optimalMarker: '75ms - 105ms with low intra-stroke standard deviation (<15ms)',
    pathologyMarker: 'Erratic dwell spikes (>250ms on non-punctuation keys)',
    remediationAction: 'Metronome cadence entrainment and continuous lexical flow practice.',
    iconName: 'Clock',
  },
  {
    id: 'k-keystroke-flight',
    category: 'Keystroke Micro-Dynamics',
    title: 'Inter-Key Flight Latency & Jitter Variance',
    subheading: 'Synaptic processing interval between successive motor actions',
    scientificPrinciple: 'Interval between the release of key (n) and the pressing of key (n+1). Jitter variance measures the variance of this latency across sentences.',
    psychologicalVector: 'Low flight variance signals harmonic executive flow and clear neuro-cognitive pathways. High jitter variance with sudden pauses (>400ms) reveals internal self-censorship, perfectionism, or sudden cognitive anxiety spikes.',
    optimalMarker: '110ms - 160ms with Jitter Variance < 180 ms²',
    pathologyMarker: 'Flight Variance > 500 ms² with high hesitation burst frequency (>6 per 100 chars)',
    remediationAction: 'Cognitive fluency writing sprints without live backspace editing.',
    iconName: 'Activity',
  },
];
