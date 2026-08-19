from typing import Optional
from schemas.schemas import (
    SignatureAnalysisResponse,
    TypingAnalysisResponse,
    HandwritingAnalysisResponse
)

# =========================================================================
# COMPOSITE MIND SCORE CALCULATION FORMULA:
#
# Mind Score (0-100) = 0.3 * signature_score + 0.4 * typing_score + 0.3 * handwriting_score
#
# Component calculations:
# 1. signature_score:
#    Derived from graphological stability:
#    score = 0.5 * confidence + 0.5 * consistency - 0.2 * (stress_indicator - 50)
#
# 2. typing_score:
#    Derived from keystroke dynamics and cognitive cadence:
#    score = 0.7 * focus_score + 0.3 * (100 - stress_score)
#
# 3. handwriting_score:
#    Derived from geometric consistency and spacing balance:
#    score = 0.7 * formation_consistency + (20 if line_spacing != "tight" else 0) + (10 if slant == "right" else 0)
# =========================================================================

def calculate_mind_score(
    signature_res: Optional[SignatureAnalysisResponse] = None,
    typing_res: Optional[TypingAnalysisResponse] = None,
    handwriting_res: Optional[HandwritingAnalysisResponse] = None
) -> int:
    components = []
    
    # 1. Signature Component (Weight: 0.30)
    if signature_res:
        sig_traits = signature_res.traits
        sig_score = (sig_traits.confidence * 0.5) + (sig_traits.consistency * 0.5) - ((sig_traits.stress_indicator - 50) * 0.2)
        sig_score = max(20.0, min(100.0, sig_score))
        components.append((sig_score, 0.30))
        
    # 2. Typing Component (Weight: 0.40)
    if typing_res:
        typ_score = (typing_res.focus_score * 0.70) + ((100.0 - typing_res.stress_score) * 0.30)
        typ_score = max(20.0, min(100.0, typ_score))
        components.append((typ_score, 0.40))
        
    # 3. Handwriting Component (Weight: 0.30)
    if handwriting_res:
        hw_traits = handwriting_res.traits
        hw_base = hw_traits.formation_consistency * 0.75
        bonus = 15 if hw_traits.line_spacing in ["medium", "wide"] else 0
        if hw_traits.slant in ["right", "upright"]:
            bonus += 10
        hw_score = max(20.0, min(100.0, hw_base + bonus))
        components.append((hw_score, 0.30))

    if not components:
        # Default baseline calibrated score
        return 74

    total_weight = sum(w for _, w in components)
    weighted_sum = sum(score * w for score, w in components)
    final_score = int(round(weighted_sum / total_weight))
    
    return int(max(10, min(99, final_score)))
