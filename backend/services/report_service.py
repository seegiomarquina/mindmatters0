import os
import uuid
import json
from typing import Optional, Dict, Any, Tuple
from sqlalchemy.orm import Session
from core.config import settings
from db.models import Report, Analysis
from schemas.report import (
    ReportGenerateRequest, ReportGenerateResponse, ReportDetailResponse
)
from utils.pdf_generator import generate_pdf_report

class ReportService:
    def calculate_multimodal_mind_score(
        self,
        signature_data: Optional[Dict[str, Any]],
        typing_data: Optional[Dict[str, Any]],
        handwriting_data: Optional[Dict[str, Any]]
    ) -> Tuple[int, str, str, Dict[str, Any], str, list, list]:
        """
        Multimodal Sensor Fusion Formula:
        Composite Mind Score (0-100) = 0.30 * S_sig + 0.40 * S_typ + 0.30 * S_hw

        Component Scores:
        1. S_sig (Signature):
           Derived from stroke stability and motor continuity:
           S_sig = (confidence * 0.45) + (consistency * 0.45) - ((stress - 50.0) * 0.20)
        2. S_typ (Typing):
           Derived from dwell/flight latency and rhythm regularity:
           S_typ = (focus * 0.65) + ((100.0 - stress) * 0.25) + min(20.0, wpm / 4.0)
        3. S_hw (Handwriting):
           Derived from formation consistency and spatial geometry:
           S_hw = (consistency * 0.80) + (12.0 if spacing in [medium, wide] else 0) + (8.0 if slant in [right, upright] else 0)

        Status Handling:
        - When all 3 modalities are present: status = 'complete'
        - When 1 or 2 are missing: status = 'partial_provisional'
        """
        modalities_analyzed = []
        uncalibrated_modalities = []
        components = []

        # 1. Signature component (Weight: 0.30)
        if signature_data:
            traits = signature_data.get("traits", {})
            conf = float(traits.get("confidence", 75))
            cons = float(traits.get("consistency", 70))
            stress = float(traits.get("stress_indicator", 40))
            sig_score = (conf * 0.45) + (cons * 0.45) - ((stress - 50.0) * 0.20)
            sig_score = float(np_clip(sig_score, 20.0, 99.0))
            components.append((sig_score, 0.30))
            modalities_analyzed.append("signature")
        else:
            sig_score = 75.0
            uncalibrated_modalities.append("signature")

        # 2. Typing component (Weight: 0.40)
        if typing_data:
            focus = float(typing_data.get("focus_score", 75))
            stress = float(typing_data.get("stress_score", 35))
            wpm = float(typing_data.get("typing_speed_wpm", 45.0))
            typ_score = (focus * 0.65) + ((100.0 - stress) * 0.25) + (min(20.0, wpm / 4.0))
            typ_score = float(np_clip(typ_score, 20.0, 99.0))
            components.append((typ_score, 0.40))
            modalities_analyzed.append("typing")
        else:
            typ_score = 75.0
            uncalibrated_modalities.append("typing")

        # 3. Handwriting component (Weight: 0.30)
        if handwriting_data:
            traits = handwriting_data.get("traits", {})
            consistency = float(traits.get("formation_consistency", 72))
            spacing = traits.get("line_spacing", "medium")
            slant = traits.get("slant", "right")
            bonus = 12.0 if spacing in ["medium", "wide"] else 0.0
            if slant in ["right", "upright"]:
                bonus += 8.0
            hw_score = (consistency * 0.80) + bonus
            hw_score = float(np_clip(hw_score, 20.0, 99.0))
            components.append((hw_score, 0.30))
            modalities_analyzed.append("handwriting")
        else:
            hw_score = 75.0
            uncalibrated_modalities.append("handwriting")

        # Status classification
        if len(modalities_analyzed) == 3:
            status_str = "complete"
            mind_score = int(round(0.30 * sig_score + 0.40 * typ_score + 0.30 * hw_score))
        elif len(modalities_analyzed) > 0:
            status_str = "partial_provisional"
            total_weight = sum(w for _, w in components)
            mind_score = int(round(sum(s * w for s, w in components) / total_weight))
        else:
            status_str = "uncalibrated"
            mind_score = 74

        mind_score = int(np_clip(mind_score, 15, 99))

        # Determine dominant subconscious archetype
        if mind_score >= 85:
            archetype = "Sovereign Strategist (High Executive Equilibrium)"
        elif mind_score >= 70:
            archetype = "Adaptive Polymath (Agile Cognitive Cadence)"
        elif mind_score >= 55:
            archetype = "Pragmatic Architect (Systematic Linear Focus)"
        else:
            archetype = "Intensive Processor (High Subconscious Drive)"

        # Cognitive Indices breakdown
        cognitive_indices = {
            "executiveControl": round(float(np_clip(mind_score * 0.95 + 4, 30, 98)), 1),
            "emotionalStability": round(float(np_clip((100 - (typing_data.get('stress_score', 40) if typing_data else 40)) * 0.8 + 20, 25, 96)), 1),
            "ambitionSlantVector": round(float(np_clip(sig_score * 0.9 + 10, 35, 97)), 1),
            "subconsciousStressIndex": round(float(np_clip(typing_data.get('stress_score', 38) if typing_data else 38, 10, 90)), 1),
            "cognitiveSpeed": round(float(np_clip((typing_data.get('typing_speed_wpm', 45) if typing_data else 45) * 1.6 + 15, 30, 99)), 1),
            "neuroMotorStability": round(float(np_clip((handwriting_data.get('traits', {}).get('formation_consistency', 74) if handwriting_data else 74) * 0.9 + 8, 30, 96)), 1),
        }

        # Executive summary text
        summary = (
            f"Academic Research Prototype: Subject exhibits an integrated Mind Score of {mind_score}/100 "
            f"with classification as '{archetype}' [{status_str}]. "
            f"Kinetic and grapho-motor indicators reflect {cognitive_indices['neuroMotorStability']}% motor consistency, "
            f"synchronized with an estimated executive control rating of {cognitive_indices['executiveControl']}%. "
            f"Keystroke dynamic latency and stroke geometry indicate robust focus retention with controlled latent stress."
        )

        return mind_score, archetype, summary, cognitive_indices, status_str, modalities_analyzed, uncalibrated_modalities

    def create_report(
        self,
        payload: ReportGenerateRequest,
        user_id: Optional[str] = None,
        db: Optional[Session] = None
    ) -> ReportGenerateResponse:
        report_id = f"MM-{uuid.uuid4().hex[:6].upper()}"
        user_name = payload.user_name or "Anonymous"

        def to_dict(obj):
            if obj is None:
                return None
            if hasattr(obj, 'model_dump'):
                return obj.model_dump()
            if isinstance(obj, dict):
                return obj
            return None

        sig_dict = to_dict(payload.signature_result)
        typ_dict = to_dict(payload.typing_result)
        hw_dict = to_dict(payload.handwriting_result)

        mind_score, archetype, summary, indices, status_str, analyzed, uncalibrated = self.calculate_multimodal_mind_score(
            signature_data=sig_dict,
            typing_data=typ_dict,
            handwriting_data=hw_dict
        )

        # Generate PDF
        pdf_path = generate_pdf_report(
            report_id=report_id,
            user_name=user_name,
            mind_score=mind_score,
            signature_data=sig_dict,
            typing_data=typ_dict,
            handwriting_data=hw_dict,
            output_dir=settings.REPORTS_DIR
        )

        download_url = f"{settings.API_V1_PREFIX}/reports/download/{report_id}"
        pdf_filename = f"{report_id}.pdf"

        # Persist report in DB
        if db:
            report_obj = Report(
                id=report_id,
                analysis_id=payload.analysis_id,
                user_id=user_id,
                user_name=user_name,
                mind_score=mind_score,
                dominant_archetype=archetype,
                executive_summary=summary,
                cognitive_indices_json=json.dumps(indices),
                traits_json=json.dumps({
                    "signature": sig_dict,
                    "typing": typ_dict,
                    "handwriting": hw_dict,
                    "status": status_str,
                    "formula_version": "2.1.0-strict",
                    "modalities_analyzed": analyzed,
                    "uncalibrated_modalities": uncalibrated
                }),
                pdf_filename=pdf_filename,
                pdf_path=pdf_path,
                download_url=download_url
            )
            db.add(report_obj)
            db.commit()
            db.refresh(report_obj)

        return ReportGenerateResponse(
            report_id=report_id,
            mind_score=mind_score,
            dominant_archetype=archetype,
            executive_summary=summary,
            download_url=download_url,
            status=status_str,
            formula_version="2.1.0-strict",
            modalities_analyzed=analyzed,
            uncalibrated_modalities=uncalibrated
        )

def np_clip(val: float, low: float, high: float) -> float:
    return max(low, min(high, val))

report_service = ReportService()
