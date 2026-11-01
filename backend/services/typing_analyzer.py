import json
import numpy as np
from typing import List, Optional
from sqlalchemy.orm import Session
from schemas.typing import (
    KeystrokeItem, TypingAnalysisResponse, TypingMeasurableFeatures
)
from fastapi import HTTPException, status
from db.models import Analysis, ExtractedFeatures

class TypingAnalyzer:
    """
    Keystroke Dynamics & Temporal Telemetry Engine.
    
    Extracts cognitive cadence and motor timing metrics from raw browser keyboard events:
    - Dwell Time: Duration between keydown and keyup for each key (t_up - t_down)
    - Flight Time: Inter-key latency between consecutive keyup and the next keydown (t_down[i] - t_up[i-1])
    - Cadence Shannon Entropy: H = -sum(p_i * log2(p_i)) of flight-time distribution, measuring rhythmic predictability
    - Typing Speed (WPM): Standardized words-per-minute = (total_keys / 5.0) / (duration_minutes)
    - Hesitation Frequency: Count of inter-key flight transitions exceeding 400ms cognitive latency
    - Motor Regularity / Focus Index: Variance-penalized score derived from dwell and flight consistency

    VALIDATION:
    Enforces keyup >= keydown, filters negative/zero durations, and requires at least 2 valid events.
    """
    def analyze(
        self,
        keystrokes: List[KeystrokeItem],
        user_id: Optional[str] = None,
        db: Optional[Session] = None
    ) -> TypingAnalysisResponse:
        if not keystrokes or len(keystrokes) < 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Keystroke sequence must contain at least 2 events."
            )

        # 1. Filter and validate monotonic timestamp events
        valid_keys = []
        for k in keystrokes:
            if not k.key:
                continue
            if k.keydown is None or k.keyup is None:
                continue
            # Monotonicity check: keyup must be >= keydown
            if k.keyup < k.keydown:
                continue
            duration = k.keyup - k.keydown
            if duration <= 0:
                continue
            valid_keys.append(k)

        if len(valid_keys) < 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient valid keystroke events. At least 2 events with keyup >= keydown and duration > 0 are required."
            )

        dwell_times = []
        flight_times = []
        backspace_count = 0
        hesitation_count = 0

        # Sort strictly by keydown timestamp
        sorted_keys = sorted(valid_keys, key=lambda k: k.keydown)

        for i, k in enumerate(sorted_keys):
            # Clamp dwell to physiological limits [15ms, 1200ms]
            dwell = max(15.0, min(k.keyup - k.keydown, 1200.0))
            dwell_times.append(dwell)

            if k.key in ["Backspace", "Delete"]:
                backspace_count += 1

            if i > 0:
                prev_k = sorted_keys[i - 1]
                # Clamped inter-key flight time (rollover typing handles negative as 0ms)
                flight = max(0.0, min(k.keydown - prev_k.keyup, 2500.0))
                flight_times.append(flight)
                if flight > 400.0:
                    hesitation_count += 1

        avg_dwell = float(np.mean(dwell_times)) if dwell_times else 80.0
        avg_flight = float(np.mean(flight_times)) if flight_times else 110.0
        backspace_rate = float(backspace_count / len(sorted_keys)) if sorted_keys else 0.0

        # WPM computation: standard 5 keystrokes per word
        total_duration_ms = max(500.0, sorted_keys[-1].keyup - sorted_keys[0].keydown)
        total_duration_min = total_duration_ms / 60000.0
        wpm = float((len(sorted_keys) / 5.0) / total_duration_min)
        wpm = round(float(np.clip(wpm, 5.0, 160.0)), 1)

        dwell_std = float(np.std(dwell_times)) if len(dwell_times) > 1 else 15.0
        flight_std = float(np.std(flight_times)) if len(flight_times) > 1 else 30.0

        # Entropy / Cadence Shannon entropy proxy
        hist, _ = np.histogram(flight_times, bins=8, density=True)
        hist = hist[hist > 0]
        cadence_entropy = round(float(-np.sum(hist * np.log2(hist))), 2) if len(hist) > 0 else 1.5

        # Stress calculation
        stress_raw = (backspace_rate * 250.0) + (dwell_std * 0.4) + (flight_std * 0.15)
        stress_score = int(np.clip(stress_raw + 15, 10, 95))

        # Focus calculation
        dwell_optimality = max(0, 100 - abs(avg_dwell - 85.0) * 1.2)
        rhythm_consistency = max(0, 100 - (dwell_std * 1.5 + flight_std * 0.2))
        focus_raw = (rhythm_consistency * 0.5) + (dwell_optimality * 0.3) + ((1.0 - backspace_rate) * 20.0)
        focus_score = int(np.clip(focus_raw, 20, 98))

        measurable = TypingMeasurableFeatures(
            total_keystrokes=len(sorted_keys),
            dwell_time_std_ms=round(dwell_std, 1),
            flight_time_std_ms=round(flight_std, 1),
            cadence_entropy=cadence_entropy,
            hesitation_count=hesitation_count
        )

        analysis_id = None
        if db:
            analysis_obj = Analysis(
                sample_id=None,
                user_id=user_id,
                sample_type="typing",
                status="completed",
                model_version="2.0.0",
                confidence_score=0.91,
                dominant_pattern=f"{wpm} WPM, Focus: {focus_score}%, Stress: {stress_score}%",
                traits_json=json.dumps({
                    "avg_dwell_time_ms": avg_dwell,
                    "avg_flight_time_ms": avg_flight,
                    "backspace_rate": backspace_rate,
                    "typing_speed_wpm": wpm,
                    "stress_score": stress_score,
                    "focus_score": focus_score
                })
            )
            db.add(analysis_obj)
            db.flush()
            analysis_id = analysis_obj.id

            features_obj = ExtractedFeatures(
                analysis_id=analysis_id,
                regularity_score=float(focus_score),
                raw_metrics_json=json.dumps(measurable.model_dump())
            )
            db.add(features_obj)
            db.commit()
            db.refresh(analysis_obj)

        return TypingAnalysisResponse(
            analysis_id=analysis_id,
            avg_dwell_time_ms=round(avg_dwell, 1),
            avg_flight_time_ms=round(avg_flight, 1),
            backspace_rate=round(backspace_rate, 2),
            typing_speed_wpm=wpm,
            stress_score=stress_score,
            focus_score=focus_score,
            measurable_features=measurable
        )

typing_analyzer = TypingAnalyzer()
