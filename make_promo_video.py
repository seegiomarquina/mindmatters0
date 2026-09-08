# -*- coding: utf-8 -*-
"""
MindMatters AI - High-Production Promo & Commercial Ad Video Generator
Generates a 1080p 30fps cinematic promotional video with motion graphics,
biometric telemetry overlays, animated charts, and synchronized ambient audio.
"""

import os
import math
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

WIDTH = 1920
HEIGHT = 1080
FPS = 30
DURATION_SEC = 25
TOTAL_FRAMES = FPS * DURATION_SEC

# Color Palette (Parchment & High-Tech Ink)
COLOR_BG_DARK = (27, 27, 47)         # #1B1B2F
COLOR_BG_LIGHT = (244, 236, 221)     # #F4ECDD
COLOR_INK = (27, 27, 47)
COLOR_GOLD = (201, 162, 75)          # #C9A24B
COLOR_WAX = (161, 61, 61)            # #A13D3D
COLOR_SEPIA = (139, 94, 52)          # #8B5E34
COLOR_TEAL = (20, 184, 166)          # #14B8A6
COLOR_CYAN = (14, 165, 233)          # #0EA5E9
COLOR_WHITE = (255, 255, 255)

def get_font(size, bold=False, serif=True):
    try:
        if serif:
            font_path = "C:/Windows/Fonts/georgiab.ttf" if bold else "C:/Windows/Fonts/georgia.ttf"
        else:
            font_path = "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"
        if not os.path.exists(font_path):
            font_path = "C:/Windows/Fonts/arial.ttf"
        return ImageFont.truetype(font_path, size)
    except Exception:
        return ImageFont.load_default()

FONT_TITLE = get_font(72, bold=True, serif=True)
FONT_SUBTITLE = get_font(34, bold=False, serif=True)
FONT_HEAD = get_font(48, bold=True, serif=True)
FONT_BODY = get_font(28, bold=False, serif=False)
FONT_HUD = get_font(22, bold=True, serif=False)
FONT_CTA = get_font(42, bold=True, serif=True)
FONT_SCORE = get_font(84, bold=True, serif=True)

def ease_in_out(t):
    return 0.5 * (1 - math.cos(math.pi * t))

def ease_out(t):
    return math.sin(t * math.pi / 2)

def safe_rect(draw, x0, y0, x1, y1, fill=None, outline=None, width=1):
    rx0 = min(x0, x1)
    rx1 = max(x0, x1)
    ry0 = min(y0, y1)
    ry1 = max(y0, y1)
    draw.rectangle([rx0, ry0, rx1, ry1], fill=fill, outline=outline, width=width)

def draw_hud_box(draw, x, y, w, h, title, lines, accent_color=COLOR_GOLD):
    # Translucent card background
    safe_rect(draw, x, y, x + w, y + h, fill=(232, 223, 201, 230), outline=COLOR_INK, width=2)
    # Header tag
    safe_rect(draw, x, y, x + w, y + 36, fill=COLOR_INK)
    draw.text((x + 12, y + 7), title, fill=COLOR_GOLD, font=FONT_HUD)
    # Lines
    curr_y = y + 48
    for label, val, val_col in lines:
        draw.text((x + 16, curr_y), label, fill=COLOR_SEPIA, font=FONT_HUD)
        bbox = draw.textbbox((0, 0), str(val), font=FONT_HUD)
        val_w = bbox[2] - bbox[0]
        draw.text((x + w - val_w - 16, curr_y), str(val), fill=val_col, font=FONT_HUD)
        curr_y += 32

def render_frame(frame_idx):
    t = frame_idx / FPS
    img = Image.new("RGBA", (WIDTH, HEIGHT), COLOR_BG_LIGHT)
    draw = ImageDraw.Draw(img)

    # Grid overlay
    for gy in range(0, HEIGHT, 40):
        draw.line([(0, gy), (WIDTH, gy)], fill=(59, 75, 107, 18), width=1)

    # ========================================================
    # SCENE 1: THE HOOK & BRAND REVEAL (0s to 5s)
    # ========================================================
    if t < 5.0:
        local_t = t / 5.0
        
        # Floating background glyphs with parallax drift
        glyph_y = int(300 - local_t * 50)
        draw.text((120, glyph_y), "ॐ", fill=(139, 94, 52, 25), font=get_font(160, serif=True))
        draw.text((1600, glyph_y + 100), "Ψ", fill=(139, 94, 52, 25), font=get_font(140, serif=True))

        # Main Title & Subtitle
        title_y = int(HEIGHT * 0.36 + (1 - ease_out(min(1.0, local_t * 1.5))) * 60)
        draw.text((WIDTH // 2, title_y), "MindMatters AI", fill=COLOR_INK, font=FONT_TITLE, anchor="mm")
        
        tagline_y = title_y + 75
        draw.text((WIDTH // 2, tagline_y), "Every Stroke Tells A Story.", fill=COLOR_WAX, font=FONT_SUBTITLE, anchor="mm")
        
        sub_y = tagline_y + 55
        draw.text((WIDTH // 2, sub_y), "Multimodal Graphology & Keystroke Cognitive Intelligence", fill=COLOR_SEPIA, font=FONT_BODY, anchor="mm")

        # Golden Flourish animation
        progress = min(1.0, local_t * 1.8)
        max_x = int(WIDTH * 0.35 + progress * (WIDTH * 0.30))
        pts = []
        for fx in range(int(WIDTH * 0.35), max_x, 4):
            fy = sub_y + 50 + int(math.sin((fx - WIDTH * 0.35) * 0.03) * 12)
            pts.append((fx, fy))
        if len(pts) > 1:
            draw.line(pts, fill=COLOR_GOLD, width=4)

        # Nib dot follow
        if pts:
            nx, ny = pts[-1]
            draw.ellipse([nx - 6, ny - 6, nx + 6, ny + 6], fill=COLOR_WAX)

    # ========================================================
    # SCENE 2: MODALITY 1 — SIGNATURE GRAPHOLOGY (5s to 10s)
    # ========================================================
    elif t < 10.0:
        local_t = (t - 5.0) / 5.0
        
        # Header
        draw.text((120, 80), "MODALITY 01", fill=COLOR_WAX, font=FONT_HUD)
        draw.text((120, 115), "Signature Graphology & Stroke Kinetics", fill=COLOR_INK, font=FONT_HEAD)
        draw.line([(120, 175), (WIDTH - 120, 175)], fill=COLOR_GOLD, width=2)

        # Signature Canvas Area
        pad_x, pad_y, pad_w, pad_h = 120, 220, 1050, 680
        safe_rect(draw, pad_x, pad_y, pad_x + pad_w, pad_y + pad_h, fill=(232, 223, 201, 180), outline=COLOR_INK, width=2)
        draw.text((pad_x + 30, pad_y + 25), "LIVE INK PAD - REAL-TIME PEN PRESSURE CALIBRATION", fill=COLOR_SEPIA, font=FONT_HUD)

        # Draw an animated mathematical signature spline
        sig_progress = min(1.0, local_t * 1.6)
        sig_points = []
        total_steps = int(400 * sig_progress)
        for i in range(total_steps):
            u = i / 60.0
            sx = pad_x + 100 + i * 2.1 + math.sin(u * 2.5) * 40
            sy = pad_y + 360 + math.sin(u * 1.8) * 110 + math.cos(u * 3.2) * 50
            sig_points.append((sx, sy))

        if len(sig_points) > 1:
            draw.line(sig_points, fill=COLOR_INK, width=4)
            # Leading nib
            lx, ly = sig_points[-1]
            draw.ellipse([lx - 8, ly - 8, lx + 8, ly + 8], fill=COLOR_WAX)
            # Pressure ripple
            draw.ellipse([lx - 18, ly - 18, lx + 18, ly + 18], outline=(161, 61, 61, 100), width=2)

        # Baseline alignment guide
        draw.line([(pad_x + 80, pad_y + 490), (pad_x + 900, pad_y + 475)], fill=COLOR_GOLD, width=2)
        draw.text((pad_x + 910, pad_y + 465), "+14.2° Slant Angle", fill=COLOR_SEPIA, font=FONT_HUD)

        # Right HUD Telemetry Box
        hud_lines = [
            ("Stroke Velocity:", f"{int(340 + math.sin(local_t * 10) * 45)} px/sec", COLOR_INK),
            ("Slant Moment:", "+18.4° Right Slant", COLOR_WAX),
            ("Pressure Proxy:", "0.82 Firm Equilibrium", COLOR_GOLD),
            ("Curvature Complexity:", "0.76 Harmonic", COLOR_INK),
            ("Confidence Index:", "88% Calibrated", COLOR_WAX),
        ]
        draw_hud_box(draw, 1220, 220, 580, 260, "COMPUTER VISION TELEMETRY", hud_lines)

        # Second Insight Card
        insight_lines = [
            ("Dominant Trait:", "Executive Focus", COLOR_WAX),
            ("Latent Stress:", "Low / Controlled (24%)", (6, 95, 70)),
            ("Motor Cadence:", "Fluid Continuous Loops", COLOR_INK),
        ]
        draw_hud_box(draw, 1220, 520, 580, 200, "GRAPHOLOGICAL PROFILE", insight_lines)

    # ========================================================
    # SCENE 3: MODALITY 2 — KEYSTROKE DYNAMICS (10s to 15s)
    # ========================================================
    elif t < 15.0:
        local_t = (t - 10.0) / 5.0
        
        # Header
        draw.text((120, 80), "MODALITY 02", fill=COLOR_WAX, font=FONT_HUD)
        draw.text((120, 115), "Keystroke Cadence & Dwell Dynamics", fill=COLOR_INK, font=FONT_HEAD)
        draw.line([(120, 175), (WIDTH - 120, 175)], fill=COLOR_GOLD, width=2)

        # Typing Waveform Area
        pad_x, pad_y, pad_w, pad_h = 120, 220, 1050, 680
        safe_rect(draw, pad_x, pad_y, pad_x + pad_w, pad_y + pad_h, fill=(232, 223, 201, 180), outline=COLOR_INK, width=2)
        draw.text((pad_x + 30, pad_y + 25), "BEHAVIORAL CADENCE EQUALIZER & FLIGHT LATENCY", fill=COLOR_SEPIA, font=FONT_HUD)

        # Equalizer Bars
        num_bars = 24
        bar_w = 28
        bar_gap = 12
        start_bx = pad_x + 60
        base_y = pad_y + 460
        for b in range(num_bars):
            bx = start_bx + b * (bar_w + bar_gap)
            bar_height = max(15, int(70 + math.sin(local_t * 12 + b * 0.4) * 60 + math.cos(b * 0.8) * 35))
            bar_top = base_y - bar_height
            color = COLOR_INK if b % 3 == 0 else (COLOR_WAX if b % 3 == 1 else COLOR_GOLD)
            safe_rect(draw, bx, bar_top, bx + bar_w, base_y, fill=color)

        # Live Flight-Time Waveform
        wave_pts = []
        for wx in range(pad_x + 60, pad_x + 980, 8):
            wy = pad_y + 580 + int(math.sin((wx * 0.04) + local_t * 14) * 35)
            wave_pts.append((wx, wy))
        if len(wave_pts) > 1:
            draw.line(wave_pts, fill=COLOR_WAX, width=3)

        draw.text((pad_x + 60, pad_y + 630), "-- Dwell Time (Key-Down)   -- Flight Time (Key-Interval)", fill=COLOR_SEPIA, font=FONT_HUD)

        # Right Telemetry Box
        hud_lines = [
            ("Typing Velocity:", f"{int(52 + math.sin(local_t * 6) * 4)} WPM", COLOR_INK),
            ("Avg Dwell Latency:", "72.4 ms (Crisp)", COLOR_WAX),
            ("Avg Flight Interval:", "108.6 ms (Steady)", COLOR_GOLD),
            ("Cadence Entropy:", "0.84 Stable", COLOR_INK),
            ("Focus Rating:", "91% Sustained", (6, 95, 70)),
        ]
        draw_hud_box(draw, 1220, 220, 580, 260, "KEYSTROKE BIOMETRIC TELEMETRY", hud_lines)

        insight_lines = [
            ("Cognitive Rhythm:", "High Attention Equilibrium", (6, 95, 70)),
            ("Fatigue Index:", "Optimal / Negligible (18%)", COLOR_INK),
            ("Neuro-Motor Stability:", "94% Precision", COLOR_WAX),
        ]
        draw_hud_box(draw, 1220, 520, 580, 200, "CADENCE SYNTHESIS", insight_lines)

    # ========================================================
    # SCENE 4: MODALITY 3 — HANDWRITING MORPHOLOGY (15s to 20s)
    # ========================================================
    elif t < 20.0:
        local_t = (t - 15.0) / 5.0
        
        # Header
        draw.text((120, 80), "MODALITY 03", fill=COLOR_WAX, font=FONT_HUD)
        draw.text((120, 115), "OpenCV Handwriting Feature Extraction", fill=COLOR_INK, font=FONT_HEAD)
        draw.line([(120, 175), (WIDTH - 120, 175)], fill=COLOR_GOLD, width=2)

        # Document Scan Area
        pad_x, pad_y, pad_w, pad_h = 120, 220, 1050, 680
        safe_rect(draw, pad_x, pad_y, pad_x + pad_w, pad_y + pad_h, fill=(248, 243, 232), outline=COLOR_INK, width=2)
        
        # Simulated handwritten lines
        for line_idx in range(6):
            ly = pad_y + 100 + line_idx * 80
            draw.line([(pad_x + 60, ly), (pad_x + 950, ly + int(math.sin(line_idx) * 4))], fill=(27, 27, 47, 160), width=3)
            # Simulated word bounding boxes
            for w_idx in range(5):
                wx = pad_x + 60 + w_idx * 180
                safe_rect(draw, wx, ly - 28, wx + 140, ly + 14, outline=(201, 162, 75, 180), width=1)

        # Sweeping Laser Scanner Line
        scan_y = int(pad_y + local_t * pad_h)
        draw.line([(pad_x, scan_y), (pad_x + pad_w, scan_y)], fill=COLOR_WAX, width=4)
        safe_rect(draw, pad_x, max(pad_y, scan_y - 20), pad_x + pad_w, min(pad_y + pad_h, scan_y + 20), fill=(161, 61, 61, 35))
        draw.text((pad_x + 30, max(pad_y + 10, scan_y - 30)), "LASER CV MORPHOLOGY SCAN", fill=COLOR_WAX, font=FONT_HUD)

        # Right Telemetry Box
        hud_lines = [
            ("Deskew Angle:", "-2.1° Corrected", COLOR_INK),
            ("Ink Density Proxy:", "0.38 Uniform", COLOR_WAX),
            ("Line Spacing Stability:", "24.8 px Regular", COLOR_GOLD),
            ("Baseline Jitter:", "0.08 Minimal", (6, 95, 70)),
            ("Contour Complexity:", "0.82 Methodical", COLOR_INK),
        ]
        draw_hud_box(draw, 1220, 220, 580, 260, "OPENCV 10+ MEASURABLE METRICS", hud_lines)

        insight_lines = [
            ("Dominant Classification:", "Structured & Linear", COLOR_WAX),
            ("Formation Consistency:", "86% Calibrated", (6, 95, 70)),
            ("Subconscious Archetype:", "Pragmatic Architect", COLOR_INK),
        ]
        draw_hud_box(draw, 1220, 520, 580, 200, "MORPHOLOGICAL SYNTHESIS", insight_lines)

    # ========================================================
    # SCENE 5: THE CLIMAX & CALL-TO-ACTION (20s to 25s)
    # ========================================================
    else:
        local_t = (t - 20.0) / 5.0
        
        # Header
        draw.text((WIDTH // 2, 80), "MINDMATTERS AI", fill=COLOR_INK, font=FONT_HEAD, anchor="mm")
        draw.text((WIDTH // 2, 130), "Multimodal Sensor Fusion & Vector Dossier", fill=COLOR_SEPIA, font=FONT_SUBTITLE, anchor="mm")
        draw.line([(WIDTH // 2 - 300, 160), (WIDTH // 2 + 300, 160)], fill=COLOR_GOLD, width=2)

        # Center Left: Composite Mind Score Gauge
        gauge_cx, gauge_cy, gauge_r = 500, 430, 160
        draw.ellipse([gauge_cx - gauge_r, gauge_cy - gauge_r, gauge_cx + gauge_r, gauge_cy + gauge_r], fill=(232, 223, 201), outline=COLOR_INK, width=4)
        
        score_val = min(88, int(local_t * 110))
        draw.text((gauge_cx, gauge_cy - 20), str(score_val), fill=(6, 95, 70), font=FONT_SCORE, anchor="mm")
        draw.text((gauge_cx, gauge_cy + 55), "/ 100", fill=COLOR_SEPIA, font=FONT_BODY, anchor="mm")
        draw.text((gauge_cx, gauge_cy + 95), "OPTIMAL COGNITIVE EQUILIBRIUM", fill=COLOR_WAX, font=FONT_HUD, anchor="mm")

        # Center Right: Dossier Preview Card
        dossier_x, dossier_y, dossier_w, dossier_h = 1000, 240, 720, 420
        safe_rect(draw, dossier_x, dossier_y, dossier_x + dossier_w, dossier_y + dossier_h, fill=COLOR_WHITE, outline=COLOR_INK, width=3)
        safe_rect(draw, dossier_x, dossier_y, dossier_x + dossier_w, dossier_y + 48, fill=COLOR_INK)
        draw.text((dossier_x + 20, dossier_y + 12), "CLINICAL BIOMETRIC DOSSIER - PDF EXPORT", fill=COLOR_GOLD, font=FONT_HUD)
        
        # Simulated dossier inner chart & badges
        safe_rect(draw, dossier_x + 30, dossier_y + 70, dossier_x + 320, dossier_y + 240, fill=(244, 236, 221), outline=COLOR_SEPIA, width=1)
        draw.text((dossier_x + 50, dossier_y + 90), "5-Trait Radar Profile", fill=COLOR_INK, font=FONT_HUD)
        draw.text((dossier_x + 50, dossier_y + 130), "• Executive Control: 92%\n• Cadence Stability: 88%\n• Slant Ambition: 84%", fill=COLOR_SEPIA, font=FONT_HUD)
        
        safe_rect(draw, dossier_x + 350, dossier_y + 70, dossier_x + 690, dossier_y + 240, fill=(244, 236, 221), outline=COLOR_SEPIA, width=1)
        draw.text((dossier_x + 370, dossier_y + 90), "Keystroke Waveform", fill=COLOR_INK, font=FONT_HUD)
        draw.text((dossier_x + 370, dossier_y + 130), "• Typing Speed: 52 WPM\n• Focus Score: 91%\n• Stress Index: 18%", fill=COLOR_SEPIA, font=FONT_HUD)

        safe_rect(draw, dossier_x + 30, dossier_y + 260, dossier_x + 690, dossier_y + 380, fill=(232, 223, 201), outline=COLOR_WAX, width=1)
        draw.text((dossier_x + 50, dossier_y + 280), "Recommendation: Balanced cognitive stamina with steady cadence.", fill=COLOR_INK, font=FONT_HUD)
        draw.text((dossier_x + 50, dossier_y + 320), "Status: Verified & Encrypted Multi-Biometric Vector Record", fill=(6, 95, 70), font=FONT_HUD)

        # Big Call To Action Button
        cta_y = 800
        cta_btn_w = 640
        cta_btn_h = 90
        cta_x = (WIDTH - cta_btn_w) // 2
        
        # Pulsing CTA button
        pulse = math.sin(local_t * 8) * 3
        safe_rect(draw, cta_x - pulse, cta_y - pulse, cta_x + cta_btn_w + pulse, cta_y + cta_btn_h + pulse, fill=COLOR_WAX, outline=COLOR_INK, width=3)
        draw.text((WIDTH // 2, cta_y + 45), "TRY THE LIVE DEMO NOW", fill=COLOR_WHITE, font=FONT_CTA, anchor="mm")

        # Sub-CTA link
        draw.text((WIDTH // 2, cta_y + 125), "Instant Multi-Biometric Calibration & Free Vector PDF Dossier", fill=COLOR_SEPIA, font=FONT_BODY, anchor="mm")

    return np.array(img.convert("RGB"))

def generate_audio(duration, sample_rate=44100):
    total_samples = int(duration * sample_rate)
    t = np.linspace(0, duration, total_samples, endpoint=False)
    
    # Cinematic warm ambient drone + rhythmic sub pulse + rising harmonics
    bass = 0.35 * np.sin(2 * np.pi * 55 * t) + 0.25 * np.sin(2 * np.pi * 110 * t)
    
    # 120 BPM rhythmic pulse (every 0.5s)
    beat_env = np.exp(-((t % 0.5) * 12))
    pulse = 0.3 * np.sin(2 * np.pi * 130 * t) * beat_env
    
    # Shimmer harmonic
    shimmer = 0.12 * np.sin(2 * np.pi * 440 * (1 + 0.05 * np.sin(2 * np.pi * 0.4 * t)) * t)
    
    # Climax riser in last 6 seconds
    riser_t = np.clip((t - 18.0) / 7.0, 0, 1)
    riser = 0.2 * np.sin(2 * np.pi * (220 + riser_t * 440) * t) * riser_t
    
    audio = bass + pulse + shimmer + riser
    
    # Fade in & fade out
    fade_in = np.clip(t / 1.5, 0, 1)
    fade_out = np.clip((duration - t) / 2.0, 0, 1)
    audio = audio * fade_in * fade_out
    
    # Normalize to 16-bit PCM
    audio = np.clip(audio, -1.0, 1.0)
    audio_int16 = (audio * 32767).astype(np.int16)
    
    # Make stereo
    stereo = np.column_stack((audio_int16, audio_int16))
    return stereo, sample_rate

def main():
    print(f"Generating MindMatters AI 1080p promo video ({TOTAL_FRAMES} frames @ {FPS} fps)...")
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    
    temp_video = "temp_video.mp4"
    temp_audio = "temp_audio.wav"
    output_video = "mindmatters_promo_ad.mp4"
    
    # 1. Generate audio WAV
    stereo_pcm, srate = generate_audio(DURATION_SEC)
    import wave
    with wave.open(temp_audio, 'wb') as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(srate)
        wav.writeframes(stereo_pcm.tobytes())
    print("Audio track synthesized.")

    # 2. Open FFmpeg pipe for high quality video encoding
    cmd_video = [
        ffmpeg_exe, "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "medium",
        "-crf", "18",
        temp_video
    ]
    
    proc = subprocess.Popen(cmd_video, stdin=subprocess.PIPE)
    for f in range(TOTAL_FRAMES):
        frame_rgb = render_frame(f)
        proc.stdin.write(frame_rgb.tobytes())
        if f % 150 == 0:
            print(f"Rendered frame {f}/{TOTAL_FRAMES} ({(f/TOTAL_FRAMES)*100:.1f}%)")
            
    proc.stdin.close()
    proc.wait()
    print("Video track rendered.")

    # 3. Merge audio and video into final output MP4
    cmd_merge = [
        ffmpeg_exe, "-y",
        "-i", temp_video,
        "-i", temp_audio,
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        output_video
    ]
    subprocess.run(cmd_merge, check=True)
    print(f"Successfully generated final promo video: {output_video}")

    # Cleanup temp files
    if os.path.exists(temp_video): os.remove(temp_video)
    if os.path.exists(temp_audio): os.remove(temp_audio)

if __name__ == "__main__":
    main()
