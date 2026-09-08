import io
import cv2
import numpy as np
import httpx
from fastapi.testclient import TestClient
from main import app
from db.database import init_db

# Initialize database tables
init_db()

client = TestClient(app)

def create_sample_handwriting_image() -> bytes:
    """Generates a synthetic handwriting scan for end-to-end verification."""
    # Create white canvas 400x800
    img = np.ones((400, 800, 3), dtype=np.uint8) * 255
    
    # Draw simulated handwritten lines with slight tilt
    font = cv2.FONT_HERSHEY_SIMPLEX
    cv2.putText(img, "MindMatters AI Cognitive Assessment", (50, 80), font, 0.9, (20, 20, 20), 2, cv2.LINE_AA)
    cv2.putText(img, "Measurable handwriting morphology test sample", (50, 150), font, 0.8, (25, 25, 25), 2, cv2.LINE_AA)
    cv2.putText(img, "Precision biometrics with real OpenCV extraction", (50, 220), font, 0.8, (15, 15, 15), 2, cv2.LINE_AA)
    cv2.putText(img, "Cadence, slant, pressure and spatial spacing", (50, 290), font, 0.8, (30, 30, 30), 2, cv2.LINE_AA)
    
    # Slight rotation to test deskewing and slant detection
    center = (400, 200)
    M = cv2.getRotationMatrix2D(center, -3.5, 1.0)
    rotated = cv2.warpAffine(img, M, (800, 400), borderValue=(255, 255, 255))
    
    # Encode as PNG bytes
    success, encoded_png = cv2.imencode(".png", rotated)
    assert success, "Failed to encode image to PNG"
    return encoded_png.tobytes()

def test_1_health():
    print("\n--- Testing Health Endpoints ---")
    r1 = client.get("/health")
    assert r1.status_code == 200, f"Health check failed: {r1.text}"
    print("[PASS] GET /health status:", r1.json())

    r2 = client.get("/api/v1/health")
    assert r2.status_code == 200
    print("[PASS] GET /api/v1/health status:", r2.json())

def test_2_handwriting_analysis():
    print("\n--- Testing Real Handwriting Upload & Feature Extraction ---")
    img_bytes = create_sample_handwriting_image()
    files = {
        "file": ("test_handwriting.png", io.BytesIO(img_bytes), "image/png")
    }
    
    res = client.post("/api/v1/handwriting/analyze", files=files)
    assert res.status_code == 200, f"Handwriting analysis failed: {res.text}"
    data = res.json()
    
    print("[PASS] Analysis ID:", data.get("analysis_id"))
    print("[PASS] Dominant Pattern:", data.get("dominant_pattern"))
    print("[PASS] Confidence Score:", data.get("confidence_score"))
    
    traits = data.get("traits", {})
    print("[PASS] Qualitative Traits:", traits)
    
    measurable = data.get("measurable_features", {})
    print("[PASS] 10+ Measurable Biometric Features:")
    for k, v in measurable.items():
        print(f"   * {k}: {v}")

    assert data["analysis_id"] is not None
    assert "slant_angle_deg" in measurable
    assert "ink_density" in measurable
    assert "avg_char_height_px" in measurable
    assert "avg_line_spacing_px" in measurable
    assert "regularity_score" in measurable
    
    return data["analysis_id"]

def test_3_analyses_history_and_detail(analysis_id: str):
    print("\n--- Testing Analyses History & Details Endpoints ---")
    # List history
    res_list = client.get("/api/v1/analyses")
    assert res_list.status_code == 200
    list_data = res_list.json()
    print(f"[PASS] GET /api/v1/analyses returned {list_data['total']} total records")
    assert list_data["total"] >= 1
    
    # Get detail
    res_detail = client.get(f"/api/v1/analyses/{analysis_id}")
    assert res_detail.status_code == 200
    detail_data = res_detail.json()
    print(f"[PASS] GET /api/v1/analyses/{analysis_id} retrieved successfully:")
    print(f"   * Status: {detail_data['status']}")
    print(f"   * Measurable metrics present: {bool(detail_data['measurable_features'])}")
    assert detail_data["measurable_features"] is not None

def test_4_signature_analysis():
    print("\n--- Testing Signature Analysis ---")
    img_bytes = create_sample_handwriting_image()
    files = {
        "file": ("test_signature.png", io.BytesIO(img_bytes), "image/png")
    }
    res = client.post("/api/v1/signature/analyze", files=files)
    assert res.status_code == 200, f"Signature analysis failed: {res.text}"
    data = res.json()
    print("[PASS] Signature traits:", data.get("traits"))
    print("[PASS] Signature measurable:", data.get("measurable_features"))
    return data

def test_5_typing_analysis():
    print("\n--- Testing Typing Dynamics Analysis ---")
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
    assert res.status_code == 200, f"Typing analysis failed: {res.text}"
    data = res.json()
    print("[PASS] Typing telemetry response:", data)
    assert "typing_speed_wpm" in data
    assert "focus_score" in data
    return data

def test_6_report_generation_and_download(sig_res, typ_res, hw_id):
    print("\n--- Testing Report Generation & PDF Download ---")
    payload = {
        "user_name": "Test Subject Alpha",
        "signature_result": sig_res,
        "typing_result": typ_res,
        "analysis_id": hw_id
    }
    res = client.post("/api/v1/reports/generate", json=payload)
    assert res.status_code == 200, f"Report generation failed: {res.text}"
    report_data = res.json()
    report_id = report_data["report_id"]
    print("[PASS] Generated Report ID:", report_id)
    print("[PASS] Fused Mind Score:", report_data["mind_score"])
    print("[PASS] Dominant Archetype:", report_data.get("dominant_archetype"))
    print("[PASS] Download URL:", report_data["download_url"])

    # Test PDF download
    pdf_res = client.get(f"/api/v1/reports/download/{report_id}")
    assert pdf_res.status_code == 200, f"PDF download failed: {pdf_res.text}"
    assert pdf_res.headers.get("content-type") == "application/pdf"
    assert len(pdf_res.content) > 1000, "Downloaded PDF is too small or empty"
    print(f"[PASS] PDF successfully downloaded ({len(pdf_res.content)} bytes)")

def test_7_auth():
    print("\n--- Testing User Auth (Register, Login, Profile) ---")
    import random
    test_email = f"user_{random.randint(1000, 9999)}@mindmatters.ai"
    test_pwd = "SuperSecretPassword123!"

    # 1. Register
    reg_res = client.post("/api/v1/auth/register", json={
        "email": test_email,
        "password": test_pwd,
        "full_name": "Dr. Cognitive Tester"
    })
    assert reg_res.status_code == 201, f"Registration failed: {reg_res.text}"
    user_data = reg_res.json()
    print("[PASS] Registered user:", user_data["email"])

    # 2. Login
    login_res = client.post("/api/v1/auth/login", json={
        "email": test_email,
        "password": test_pwd
    })
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    token_data = login_res.json()
    token = token_data["access_token"]
    print("[PASS] Issued JWT token:", token[:25] + "...")

    # 3. Profile /me
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    print("[PASS] Authenticated /me response:", me_res.json())

def test_8_deletion_lifecycle(analysis_id: str):
    print("\n--- Testing Analysis Deletion Lifecycle ---")
    del_res = client.delete(f"/api/v1/analyses/{analysis_id}")
    assert del_res.status_code == 200
    print("[PASS] DELETE /api/v1/analyses response:", del_res.json())

    # Verify not found
    get_res = client.get(f"/api/v1/analyses/{analysis_id}")
    assert get_res.status_code == 404
    print("[PASS] Confirmed deletion from database.")

if __name__ == "__main__":
    print("=================================================================")
    print("MINDMATTERS REAL BACKEND ROADMAP - AUTOMATED VERIFICATION SUITE")
    print("=================================================================")
    test_1_health()
    hw_id = test_2_handwriting_analysis()
    test_3_analyses_history_and_detail(hw_id)
    sig_res = test_4_signature_analysis()
    typ_res = test_5_typing_analysis()
    test_6_report_generation_and_download(sig_res, typ_res, hw_id)
    test_7_auth()
    test_8_deletion_lifecycle(hw_id)
    print("\n=================================================================")
    print("ALL ROADMAP TESTS PASSED WITH 100% SUCCESS!")
    print("=================================================================")
