import io
import os
import cv2
import numpy as np
import pytest
from fastapi.testclient import TestClient

from main import app
from db.database import init_db

# Initialize database tables
init_db()

client = TestClient(app)

def create_valid_handwriting_image() -> bytes:
    """Generates a valid synthetic handwriting scan with realistic strokes and tilt."""
    img = np.ones((400, 800, 3), dtype=np.uint8) * 255
    font = cv2.FONT_HERSHEY_SIMPLEX
    cv2.putText(img, "MindMatters Multimodal Behavioral Analysis", (40, 80), font, 0.85, (25, 25, 25), 2, cv2.LINE_AA)
    cv2.putText(img, "Academic Research Prototype & Grapho-Kinetic Metrics", (40, 150), font, 0.75, (30, 30, 30), 2, cv2.LINE_AA)
    cv2.putText(img, "Optical stroke-width proxy via distance transform", (40, 220), font, 0.75, (20, 20, 20), 2, cv2.LINE_AA)
    cv2.putText(img, "Cognitive cadence and rhythmic regularity telemetry", (40, 290), font, 0.75, (35, 35, 35), 2, cv2.LINE_AA)
    
    # Apply subtle tilt
    center = (400, 200)
    M = cv2.getRotationMatrix2D(center, -3.0, 1.0)
    rotated = cv2.warpAffine(img, M, (800, 400), borderValue=(255, 255, 255))
    
    success, encoded = cv2.imencode(".png", rotated)
    assert success
    return encoded.tobytes()

def create_valid_signature_image() -> bytes:
    """Generates a valid synthetic cursive signature image with varied stroke dynamics."""
    img = np.ones((300, 600, 3), dtype=np.uint8) * 255
    pts = np.array([
        [60, 180], [100, 120], [140, 210], [180, 140],
        [230, 160], [290, 110], [340, 220], [420, 150], [520, 190]
    ], np.int32)
    pts = pts.reshape((-1, 1, 2))
    cv2.polylines(img, [pts], isClosed=False, color=(20, 20, 20), thickness=4, lineType=cv2.LINE_AA)
    cv2.line(img, (80, 230), (510, 215), (25, 25, 25), 3, cv2.LINE_AA)
    
    success, encoded = cv2.imencode(".png", img)
    assert success
    return encoded.tobytes()

def create_blank_image(color_val: int = 255) -> bytes:
    """Generates an all-white or all-black featureless canvas."""
    img = np.ones((400, 400, 3), dtype=np.uint8) * color_val
    success, encoded = cv2.imencode(".png", img)
    assert success
    return encoded.tobytes()

def create_undersized_image() -> bytes:
    """Generates an undersized image below minimum 50x50 threshold."""
    img = np.ones((25, 25, 3), dtype=np.uint8) * 200
    success, encoded = cv2.imencode(".png", img)
    assert success
    return encoded.tobytes()

# =========================================================================
# 1. Health & Database Connectivity Tests
# =========================================================================

def test_1_health_endpoints():
    r1 = client.get("/health")
    assert r1.status_code == 200
    data1 = r1.json()
    assert data1["status"] == "ok"
    assert data1["database"] == "connected"

    r2 = client.get("/api/v1/health")
    assert r2.status_code == 200
    data2 = r2.json()
    assert data2["status"] == "ok"

# =========================================================================
# 2. Handwriting Pipeline Tests (Positive & Negative)
# =========================================================================

def test_2_handwriting_valid_scan():
    img_bytes = create_valid_handwriting_image()
    files = {"file": ("test_hw.png", io.BytesIO(img_bytes), "image/png")}
    
    res = client.post("/api/v1/handwriting/analyze", files=files)
    assert res.status_code == 200, f"Expected 200, got: {res.text}"
    data = res.json()
    
    # Assert top-level keys
    assert data["analysis_id"] is not None
    assert data["confidence_score"] >= 0.70
    assert data["dominant_pattern"] is not None

    # Assert 10+ measurable biometric features
    meas = data["measurable_features"]
    assert "slant_angle_deg" in meas
    assert "ink_density" in meas
    assert "writing_area_ratio" in meas
    assert "component_count" in meas
    assert "avg_char_height_px" in meas
    assert "avg_char_width_px" in meas
    assert "avg_word_gap_px" in meas
    assert "avg_line_spacing_px" in meas
    assert "baseline_slope_deg" in meas
    assert "baseline_jitter" in meas
    assert "contour_complexity" in meas
    assert "pressure_proxy" in meas
    assert "regularity_score" in meas

    # Assert qualitative traits
    traits = data["traits"]
    assert traits["letter_size"] in ["small", "medium", "large"]
    assert traits["slant"] in ["left", "upright", "right"]
    assert traits["pressure_estimate"] in ["light", "medium", "firm"]

def test_3_handwriting_rejection_blank_canvas():
    # Test all-white canvas (zero ink)
    white_bytes = create_blank_image(255)
    files = {"file": ("blank_white.png", io.BytesIO(white_bytes), "image/png")}
    res = client.post("/api/v1/handwriting/analyze", files=files)
    assert res.status_code == 400
    assert "blank" in res.json()["detail"].lower() or "contrast" in res.json()["detail"].lower() or "ink" in res.json()["detail"].lower()

    # Test all-black canvas
    black_bytes = create_blank_image(0)
    files = {"file": ("blank_black.png", io.BytesIO(black_bytes), "image/png")}
    res_b = client.post("/api/v1/handwriting/analyze", files=files)
    assert res_b.status_code == 400

def test_4_handwriting_rejection_undersized():
    small_bytes = create_undersized_image()
    files = {"file": ("tiny.png", io.BytesIO(small_bytes), "image/png")}
    res = client.post("/api/v1/handwriting/analyze", files=files)
    assert res.status_code == 400
    assert "too small" in res.json()["detail"].lower() or "dimensions" in res.json()["detail"].lower()

def test_5_handwriting_rejection_corrupted_bytes():
    corrupted_bytes = b"NOT_A_VALID_IMAGE_HEADER_CORRUPTED_BYTES_12345678"
    files = {"file": ("corrupt.png", io.BytesIO(corrupted_bytes), "image/png")}
    res = client.post("/api/v1/handwriting/analyze", files=files)
    assert res.status_code == 400
    assert "failed to decode" in res.json()["detail"].lower() or "corrupted" in res.json()["detail"].lower()

# =========================================================================
# 3. Signature Pipeline Tests (Positive & Negative)
# =========================================================================

def test_6_signature_valid_image():
    sig_bytes = create_valid_signature_image()
    files = {"file": ("signature.png", io.BytesIO(sig_bytes), "image/png")}
    
    res = client.post("/api/v1/signature/analyze", files=files)
    assert res.status_code == 200, f"Expected 200, got: {res.text}"
    data = res.json()

    assert data["analysis_id"] is not None
    meas = data["measurable_features"]
    assert "stroke_width_px" in meas
    assert "stroke_variance" in meas
    assert "median_angle_deg" in meas
    assert "baseline_jitter" in meas
    assert "aspect_ratio" in meas

    traits = data["traits"]
    assert 0 <= traits["confidence"] <= 100
    assert 0 <= traits["consistency"] <= 100
    assert traits["pressure_level"] in ["low", "medium", "high"]

def test_7_signature_rejection_blank():
    blank_bytes = create_blank_image(255)
    files = {"file": ("blank_sig.png", io.BytesIO(blank_bytes), "image/png")}
    res = client.post("/api/v1/signature/analyze", files=files)
    assert res.status_code == 400

# =========================================================================
# 4. Keystroke Dynamics Telemetry Tests (Positive & Negative)
# =========================================================================

def test_8_typing_valid_sequence():
    sample_keystrokes = [
        {"key": "M", "keydown": 100.0, "keyup": 175.0},
        {"key": "i", "keydown": 220.0, "keyup": 290.0},
        {"key": "n", "keydown": 350.0, "keyup": 430.0},
        {"key": "d", "keydown": 480.0, "keyup": 550.0},
        {"key": " ", "keydown": 600.0, "keyup": 660.0},
        {"key": "M", "keydown": 720.0, "keyup": 795.0},
        {"key": "a", "keydown": 840.0, "keyup": 910.0},
        {"key": "t", "keydown": 960.0, "keyup": 1030.0},
        {"key": "t", "keydown": 1080.0, "keyup": 1150.0},
        {"key": "e", "keydown": 1200.0, "keyup": 1270.0},
        {"key": "r", "keydown": 1320.0, "keyup": 1390.0},
        {"key": "s", "keydown": 1440.0, "keyup": 1510.0},
    ]
    res = client.post("/api/v1/typing/analyze", json={"keystrokes": sample_keystrokes})
    assert res.status_code == 200, f"Expected 200, got: {res.text}"
    data = res.json()

    assert data["typing_speed_wpm"] > 0
    assert data["avg_dwell_time_ms"] > 0
    assert data["avg_flight_time_ms"] > 0
    assert 0 <= data["stress_score"] <= 100
    assert 0 <= data["focus_score"] <= 100

    meas = data["measurable_features"]
    assert meas["total_keystrokes"] == 12
    assert "cadence_entropy" in meas
    assert "hesitation_count" in meas

def test_9_typing_rejection_single_keystroke():
    single_key = [{"key": "A", "keydown": 100.0, "keyup": 180.0}]
    res = client.post("/api/v1/typing/analyze", json={"keystrokes": single_key})
    assert res.status_code == 400

def test_10_typing_rejection_inverted_timestamps():
    inverted_keys = [
        {"key": "A", "keydown": 200.0, "keyup": 100.0}, # keyup < keydown (invalid)
        {"key": "B", "keydown": 300.0, "keyup": 250.0}, # keyup < keydown (invalid)
    ]
    res = client.post("/api/v1/typing/analyze", json={"keystrokes": inverted_keys})
    assert res.status_code == 400

# =========================================================================
# 5. Multimodal Score Fusion & Status Tracking Tests
# =========================================================================

def test_11_multimodal_strict_fusion_complete():
    sig_result = {
        "traits": {"confidence": 80, "consistency": 75, "stress_indicator": 35, "pressure_level": "medium", "slant": "right"},
        "measurable_features": {"stroke_width_px": 3.2, "stroke_variance": 0.5, "median_angle_deg": 14.0, "baseline_jitter": 5.0, "aspect_ratio": 2.4, "contour_count": 8}
    }
    typ_result = {
        "focus_score": 85,
        "stress_score": 30,
        "typing_speed_wpm": 55.0,
        "avg_dwell_time_ms": 75.0,
        "avg_flight_time_ms": 110.0
    }
    hw_result = {
        "traits": {"formation_consistency": 80, "line_spacing": "medium", "slant": "right", "letter_size": "medium", "pressure_estimate": "medium"},
        "measurable_features": {"regularity_score": 80.0}
    }

    payload = {
        "user_name": "Test Subject Complete",
        "signature_result": sig_result,
        "typing_result": typ_result,
        "handwriting_result": hw_result
    }

    res = client.post("/api/v1/reports/generate", json=payload)
    assert res.status_code == 200
    data = res.json()

    assert data["status"] == "complete"
    assert data["formula_version"] == "2.1.0-strict"
    assert len(data["modalities_analyzed"]) == 3
    assert len(data["uncalibrated_modalities"]) == 0
    assert 50 <= data["mind_score"] <= 99

def test_12_multimodal_partial_provisional_handling():
    sig_result = {
        "traits": {"confidence": 75, "consistency": 70, "stress_indicator": 40, "pressure_level": "medium", "slant": "right"}
    }
    typ_result = {
        "focus_score": 70,
        "stress_score": 40,
        "typing_speed_wpm": 40.0
    }

    payload = {
        "user_name": "Test Subject Partial",
        "signature_result": sig_result,
        "typing_result": typ_result,
        "handwriting_result": None
    }

    res = client.post("/api/v1/reports/generate", json=payload)
    assert res.status_code == 200
    data = res.json()

    assert data["status"] == "partial_provisional"
    assert "handwriting" in data["uncalibrated_modalities"]
    assert "signature" in data["modalities_analyzed"]
    assert "typing" in data["modalities_analyzed"]

# =========================================================================
# 6. PDF Generation, XML Sanitization & Download Tests
# =========================================================================

def test_13_pdf_generation_sanitization_and_download():
    # Name contains special XML/HTML characters to test escaping robustness
    special_name = "<Dr. Jane & John Doe (PhD & MD) <test>>"
    
    payload = {
        "user_name": special_name,
        "signature_result": {
            "traits": {"confidence": 78, "consistency": 70, "stress_indicator": 40, "pressure_level": "medium", "slant": "right"}
        },
        "typing_result": {
            "focus_score": 75,
            "stress_score": 35,
            "typing_speed_wpm": 48.0,
            "avg_dwell_time_ms": 78.0,
            "avg_flight_time_ms": 115.0
        }
    }

    res = client.post("/api/v1/reports/generate", json=payload)
    assert res.status_code == 200, f"PDF report generation failed: {res.text}"
    report_data = res.json()
    report_id = report_data["report_id"]

    dl_res = client.get(f"/api/v1/reports/download/{report_id}")
    assert dl_res.status_code == 200
    assert dl_res.headers.get("content-type") == "application/pdf"
    assert len(dl_res.content) > 50000, f"PDF content size unexpectedly small: {len(dl_res.content)} bytes"

# =========================================================================
# 7. Database Persistence & Lifecycle Deletion
# =========================================================================

def test_14_database_lifecycle():
    img_bytes = create_valid_handwriting_image()
    files = {"file": ("lifecycle_test.png", io.BytesIO(img_bytes), "image/png")}
    create_res = client.post("/api/v1/handwriting/analyze", files=files)
    assert create_res.status_code == 200
    analysis_id = create_res.json()["analysis_id"]

    detail_res = client.get(f"/api/v1/analyses/{analysis_id}")
    assert detail_res.status_code == 200
    assert detail_res.json()["id"] == analysis_id

    del_res = client.delete(f"/api/v1/analyses/{analysis_id}")
    assert del_res.status_code == 200

    after_del = client.get(f"/api/v1/analyses/{analysis_id}")
    assert after_del.status_code == 404

if __name__ == "__main__":
    pytest.main(["-v", __file__])
