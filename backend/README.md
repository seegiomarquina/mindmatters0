# MindMatters.ai: Real Backend Engine Documentation & Viva Defense Guide

> **Academic Research Edition (v2.1.0-strict)**  
> *Final-Year Bachelor of Data Science Capstone Project*  
> *Multimodal Behavioral Telemetry, Computer Vision & Kinematic Sensor Fusion*

---

## 1. System Architecture Overview

MindMatters.ai is an asynchronous, high-throughput multimodal behavioral analytics platform built with **FastAPI**, **OpenCV**, **NumPy**, **SQLAlchemy**, and **ReportLab**.

```
                           +----------------------------------------+
                           |     Client Applications (React SPA)    |
                           +----------------------------------------+
                                       |              |
                    Binary Images (Multipart)    JSON Telemetry
                                       v              v
+-----------------------------------------------------------------------------------+
|                            FastAPI Modular Gateway Layer                          |
|  * CORS Middleware  * Input Validation  * Route Aliasing (/api/v1 & root routes)  |
+-----------------------------------------------------------------------------------+
       |                               |                              |
       v                               v                              v
+-----------------------+   +-----------------------+   +---------------------------+
| Handwriting Processor |   |   Signature Engine    |   | Keystroke Cadence Engine  |
| * 50x50px & Blank Chk |   | * Spline Moments      |   | * Monotonic Timestamps    |
| * CLAHE & Otsu Thresh |   | * Distance Transform  |   | * Clamped Dwell [15-1200] |
| * Deskew Affine Warp  |   | * Stroke Width & Var  |   | * Shannon Cadence Entropy |
| * 10+ Morpho Metrics  |   | * Aspect Ratio        |   | * Hesitation Detection    |
+-----------------------+   +-----------------------+   +---------------------------+
       \                               |                             /
        \                              |                            /
         v                             v                           v
+-----------------------------------------------------------------------------------+
|                        Multimodal Score Fusion Service                            |
|       Formula: Mind Score = 0.30 * S_sig + 0.40 * S_typ + 0.30 * S_hw             |
|       Status Handling: 'complete' (all 3) | 'partial_provisional' (1-2 present)    |
+-----------------------------------------------------------------------------------+
                                       |
                     +-----------------+-----------------+
                     v                                   v
+-------------------------------------+   +-------------------------------------+
|        Relational Persistence       |   |        ReportLab PDF Engine         |
| * SQLite / PostgreSQL (SQLAlchemy)  |   | * HTML-escaped text sanitization    |
| * Cascading Delete Lifecycle        |   | * Matplotlib dynamic radar charts   |
| * JSON Extracted Features Storage   |   | * Formal Academic Research Dossier  |
+-------------------------------------+   +-------------------------------------+
```

---

## 2. Multimodal Pipelines & Mathematical Formulations

### A. Handwriting Morphology Pipeline (`services/handwriting_analyzer.py`)

1. **Preprocessing & Quality Validation**:
   - Minimum dimensions: $w \ge 50\text{px}, h \ge 50\text{px}$.
   - Blank / uniform canvas rejection: intensity standard deviation $\sigma < 3.0$ or foreground ink ratio $< 0.05\%$.
   - Contrast enhancement: Contrast Limited Adaptive Histogram Equalization (**CLAHE**) with clip limit 2.0 on 8x8 grid.
   - Binarization: Otsu's inverted thresholding ($\text{THRESH\_BINARY\_INV} + \text{THRESH\_OTSU}$).
   - Deskewing: Minimum area bounding rectangle $\text{minAreaRect}$ across active ink coordinates with affine warp matrix $M$.

2. **Extracted Mathematical Metrics**:
   - **Slant Angle ($\theta$)**: Fit ellipse on contours ($A > 35\text{px}^2$) using second-order moments:
     $$\theta = \frac{1}{2} \arctan\left(\frac{2\mu'_{11}}{\mu'_{20} - \mu'_{02}}\right)$$
   - **Contour Complexity (Isoperimetric Quotient $Q$)**:
     $$Q = \frac{P^2}{4\pi A}$$
     Measures perimeter-to-area convolution ($Q=1$ for a circle; convoluted loops $> 3.0$).
   - **Optical Stroke-Width Proxy ($T_{\text{stroke}}$)**:
     $$T_{\text{stroke}} = 2 \times \frac{1}{N} \sum_{(x,y) \in \text{Ink}} D_{L_2}(x, y)$$
     Computed via 8-bit Euclidean distance transform ($L_2$ metric).
   - **Baseline Slope & Residual Jitter**:
     Linear regression ($y = mx + c$) fitted across the lower baseline points of text components:
     $$m = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sum (x_i - \bar{x})^2}, \quad \text{Jitter} = \sqrt{\frac{1}{N}\sum (y_i - (mx_i + c))^2}$$
   - **Regularity Metric**:
     $$\text{Regularity} = \text{clip}\left(100 - \left(40 \cdot \frac{\sigma_h}{\mu_h} + 30 \cdot \frac{\sigma_w}{\mu_w} + \min(30, 0.8\sigma_{\theta})\right), 35, 96\right)$$

### B. Signature Biometrics Pipeline (`services/signature_analyzer.py`)

- **Aspect Ratio**: $AR = \frac{w_{\text{envelope}}}{\max(1, h_{\text{envelope}})}$
- **Stroke Width Variance**: Standard deviation of distance transform values across the signature trace, measuring pen stability.
- **Directional Trend**: Median ellipse orientation of primary connected strokes.
- **Motor Consistency Index**:
  $$\text{Consistency} = \text{clip}\left(100 - (1.8 \cdot \sigma_{\text{centroid\_y}} + 8.0 \cdot \sigma_{\text{stroke}}), 35, 95\right)$$

### C. Keystroke Dynamics Telemetry (`services/typing_analyzer.py`)

- **Dwell Time**: $D_i = t_{\text{up}, i} - t_{\text{down}, i}$, physiological clamping $[15\text{ms}, 1200\text{ms}]$.
- **Flight Time**: $F_i = \max(0, \min(t_{\text{down}, i} - t_{\text{up}, i-1}, 2500\text{ms}))$.
- **Typing Speed (WPM)**:
  $$\text{WPM} = \frac{\text{Keystrokes} / 5.0}{(t_{\text{final}} - t_{\text{initial}}) / 60000}$$
- **Cadence Shannon Entropy ($H$)**:
  $$H = -\sum_{k=1}^{K} p_k \log_2(p_k)$$
  Calculated across an 8-bin probability density histogram of normalized flight times. Higher entropy signifies erratic, non-rhythmic typing; lower entropy indicates rhythmic muscle memory.

### D. Multimodal Sensor Fusion Service (`services/report_service.py`)

$$\text{Composite Mind Score} = 0.30 \times S_{\text{sig}} + 0.40 \times S_{\text{typ}} + 0.30 \times S_{\text{hw}}$$

Where component scores are normalized to $[20, 99]$:
- $S_{\text{sig}} = 0.45 \cdot \text{Fluidity} + 0.45 \cdot \text{Consistency} - 0.20 \cdot (\text{Stress} - 50)$
- $S_{\text{typ}} = 0.65 \cdot \text{Focus} + 0.25 \cdot (100 - \text{Stress}) + \min(20, \text{WPM} / 4.0)$
- $S_{\text{hw}} = 0.80 \cdot \text{Consistency} + \text{Bonus}_{\text{spacing}} + \text{Bonus}_{\text{slant}}$

**Status Tracking**:
- `status: "complete"` when all 3 modalities are present.
- `status: "partial_provisional"` when 1 or 2 are omitted, explicitly listing `uncalibrated_modalities`.

---

## 3. API Contract Reference

| Method | Endpoint | Description | Request Body | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Service & DB health check | None | `200` |
| `POST` | `/api/v1/handwriting/analyze` | 10+ morphological feature extraction | Multipart (`file`) | `200`, `400`, `413` |
| `POST` | `/api/v1/signature/analyze` | Signature geometry & stroke analysis | Multipart (`file`) | `200`, `400`, `413` |
| `POST` | `/api/v1/typing/analyze` | Keystroke dynamics & cadence telemetry | JSON (`keystrokes: [...]`) | `200`, `400` |
| `POST` | `/api/v1/reports/generate` | Sensor fusion & PDF compilation | JSON (multimodal results) | `200`, `400`, `500` |
| `GET` | `/api/v1/reports/download/{id}` | Download generated PDF report | None | `200`, `404` |
| `GET` | `/api/v1/analyses` | Historical analyses paginated list | Query params (`page`, `size`) | `200` |
| `GET` | `/api/v1/analyses/{id}` | Detailed analysis record with metrics | Path param | `200`, `404` |
| `DELETE`| `/api/v1/analyses/{id}` | Cascading deletion of sample & analysis| Path param | `200`, `404` |

---

## 4. Local Verification & Reproduction Commands

### Run Automated Test Suite
Inside `backend/`:
```bash
# Full test suite covering positive, negative, and edge cases
python -m pytest tests/test_rigorous_verification.py -v

# Regression integration verification
python test_backend.py
```

### Run Server Locally
```bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

---

## 5. Technical Viva Defense Guide: 10 Likely Questions & Model Answers

### Q1: How can you claim to measure "pen pressure" from a scanned 2D image?
> **Model Answer**: "We do not claim to measure biological or piezoelectric force (Newtons), which is physically impossible from flat 2D raster images without specialized hardware sensors. Instead, we compute an **optical stroke-width proxy** using OpenCV's Euclidean distance transform ($L_2$ norm). This calculates the radius of the maximal inscribed circle at each ink pixel. Thicker strokes indicate higher apparent line thickness, and we make this distinction explicitly clear in our academic documentation."

### Q2: Why did you use CLAHE and Otsu's thresholding instead of standard global binarization?
> **Model Answer**: "Standard global binarization assumes uniform illumination across the page, which fails for real-world mobile camera photos where shadows and paper creases occur. CLAHE (Contrast Limited Adaptive Histogram Equalization) operates on localized $8\times 8$ tiles to amplify local contrast without amplifying background noise, and Otsu's algorithm automatically determines the optimal global threshold by maximizing inter-class variance between ink and paper."

### Q3: How does your deskewing algorithm work when handwriting has irregular baselines?
> **Model Answer**: "We extract coordinates of all binarized foreground pixels and compute the minimum area bounding rectangle using `cv2.minAreaRect`. We normalize the resulting orientation angle to $[-45^\circ, +45^\circ]$. If a consistent tilt between $0.5^\circ$ and $30^\circ$ is detected, we construct a 2D rotation matrix around the image center and perform affine transformation using cubic interpolation. For baseline jitter, we fit a linear regression across component base anchors and compute the root-mean-square error of the residuals."

### Q4: What is the Isoperimetric Quotient and why is it useful in handwriting analysis?
> **Model Answer**: "The Isoperimetric Quotient is defined as $Q = \frac{P^2}{4\pi A}$, where $P$ is contour perimeter and $A$ is enclosed area. For a perfect circle, $Q = 1.0$. As a handwritten stroke becomes more complex, convoluted, or looped, the perimeter grows disproportionately to area, yielding higher values ($Q > 3.0$). It serves as an invariant geometric descriptor of letterform convolution."

### Q5: How do you measure rhythm in keystroke dynamics, and what is Cadence Shannon Entropy?
> **Model Answer**: "Rather than looking solely at average typing speed, cognitive rhythm is captured by the predictability of inter-key flight times. We bin normalized flight times into an 8-bin probability distribution $p_k$ and calculate the Shannon entropy:
> $$H = -\sum_{k} p_k \log_2(p_k)$$
> A lower entropy indicates consistent cadence and automated motor execution, whereas high entropy indicates frequent hesitations, pauses, or cognitive search latencies."

### Q6: What is 'rollover typing' and how does your system handle negative flight times?
> **Model Answer**: "In fast touch-typing, users often press the next key before releasing the current key (rollover). In raw timestamps, this produces $t_{\text{down}, i} < t_{\text{up}, i-1}$, which would yield a negative flight time. Our pipeline handles this gracefully: we sort events strictly by $t_{\text{down}}$ and clamp inter-key release-to-press latency to zero ($\max(0, \dots)$) for flight time calculations while preserving dwell times independently."

### Q7: What is the scientific rationale for the 0.30 / 0.40 / 0.30 multimodal weights?
> **Model Answer**: "Keystroke dynamics receives the highest weight (40%) because it provides dynamic, millisecond-accurate temporal telemetry directly captured during active cognition. Handwriting and signature analysis each contribute 30% to assess spatial morphology, baseline stability, and motor fluidity. This balance ensures that dynamic temporal data and spatial geometric data are both represented without one completely overpowering the other."

### Q8: How does your system handle missing modalities without introducing statistical bias?
> **Model Answer**: "Previous prototypes silently substituted synthetic defaults or renormalized weights without notifying the consumer. In our v2.1-strict engine, we execute the exact formula when all 3 inputs are present ($status = \text{'complete'}$). If an input is omitted, the system computes a provisional score over the available modalities, but returns an explicit status flag $status = \text{'partial\_provisional'}$ along with an array of `uncalibrated_modalities`, maintaining full transparency."

### Q9: How did you safeguard your PDF generation against injection attacks?
> **Model Answer**: "ReportLab uses an internal XML-like parser for its `Paragraph` flowables. If a user's name or metadata contains unescaped characters such as `&`, `<`, or `>`, the parser crashes with an XML syntax error. We integrated `html.escape()` across all dynamic user strings (`user_name`, `report_id`, archetype labels) before interpolating into ReportLab flowables, ensuring crash-free rendering."

### Q10: Is MindMatters.ai intended as a clinical or medical diagnostic system?
> **Model Answer**: "Absolutely not. MindMatters.ai is strictly an **academic research prototype** exploring the intersection of computer vision, kinematic feature extraction, and behavioral telemetry. Scanned features and keystroke latencies are computational proxies for motor habits, not clinical biomarkers. Every report includes prominent disclaimers stating that the system does not provide medical, psychological, or psychiatric diagnoses."
