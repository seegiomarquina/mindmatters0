# -*- coding: utf-8 -*-
"""
MindMatters AI — "The Mind, Decoded"
Official 26-Second Dark "Gangster-Epic" Cinematic Trailer Cut
Tone Reference: High-tension, dark, heavy-beat-into-silence-into-slam trailer energy
Full HD 1080p with synthesized Foley, 808 kicks, Shepard riser, brass trailer slam, and credit slate.
"""

import os
import math
import wave
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import imageio_ffmpeg

WIDTH = 1920
HEIGHT = 1080
FPS = 30
DURATION_SEC = 26.0
TOTAL_FRAMES = int(FPS * DURATION_SEC)

POSTER_PATH = "C:/Users/adity/.gemini/antigravity/brain/93e354ed-6dce-4b95-886a-41e980fdcfc9/.user_uploaded/media_1787639207430.png"

# Color Palette: Deep Obsidian, Aged Parchment, Champagne Gold, Glowing Red/Laser, Electric Cyan
COLOR_OBSIDIAN = (6, 8, 12)
COLOR_PARCHMENT = (244, 236, 221)
COLOR_INK = (18, 20, 32)
COLOR_GOLD = (212, 175, 95)
COLOR_GOLD_BRIGHT = (250, 226, 160)
COLOR_GOLD_MUTED = (160, 132, 78)
COLOR_RED_LASER = (239, 68, 68)
COLOR_CYAN = (14, 165, 233)
COLOR_CYAN_GLOW = (56, 189, 248)
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

FONT_PSI_HUGE = get_font(180, bold=True, serif=True)
FONT_PSI_GIANT = get_font(280, bold=True, serif=True)
FONT_TRAILER_TEXT = get_font(52, bold=True, serif=True)
FONT_TITLE_HERO = get_font(84, bold=True, serif=True)
FONT_TAGLINE = get_font(38, bold=False, serif=True)
FONT_HUD_LABEL = get_font(22, bold=True, serif=False)
FONT_HUD_VAL = get_font(30, bold=True, serif=False)
FONT_CREDIT_SUB = get_font(24, bold=False, serif=True)
FONT_CREDIT_NAMES = get_font(42, bold=True, serif=True)
FONT_URL = get_font(28, bold=False, serif=False)

# Load poster mesh graphic if available
poster_crop = None
if os.path.exists(POSTER_PATH):
    try:
        p_raw = Image.open(POSTER_PATH).convert("RGBA")
        pw, ph = p_raw.size
        poster_crop = p_raw.crop((int(pw * 0.05), int(ph * 0.22), int(pw * 0.95), int(ph * 0.82)))
    except Exception as e:
        print("Notice: Poster crop not available:", e)

def safe_rect(draw, x0, y0, x1, y1, fill=None, outline=None, width=1):
    rx0, rx1 = min(x0, x1), max(x0, x1)
    ry0, ry1 = min(y0, y1), max(y0, y1)
    draw.rectangle([rx0, ry0, rx1, ry1], fill=fill, outline=outline, width=width)

def draw_hud_bracket(draw, x, y, w, h, color=COLOR_CYAN, size=20):
    draw.line([(x, y + size), (x, y), (x + size, y)], fill=color, width=2)
    draw.line([(x + w - size, y), (x + w, y), (x + w, y + size)], fill=color, width=2)
    draw.line([(x, y + h - size), (x, y + h), (x + size, y + h)], fill=color, width=2)
    draw.line([(x + w - size, y + h), (x + w, y + h), (x + w, y + h - size)], fill=color, width=2)

def render_frame(frame_idx):
    t = frame_idx / FPS
    img = Image.new("RGBA", (WIDTH, HEIGHT), COLOR_OBSIDIAN)
    draw = ImageDraw.Draw(img)

    # ------------------------------------------------------------
    # SHOT 1: 0:00–0:02 (Black frame -> slow zoom into Ψ glyph, barely lit)
    # ------------------------------------------------------------
    if t < 2.0:
        local_t = t / 2.0
        # Zoom from scale 0.85 to 1.15
        zoom = 0.85 + local_t * 0.3
        alpha = int(min(220, max(0, (local_t - 0.2) * 280)))
        
        # Subtle glowing radial ring behind psi
        r_ring = int(140 * zoom)
        draw.ellipse(
            [WIDTH // 2 - r_ring, HEIGHT // 2 - r_ring, WIDTH // 2 + r_ring, HEIGHT // 2 + r_ring],
            outline=(212, 175, 95, int(alpha * 0.3)), width=2
        )
        # Barely lit gold Ψ
        psi_col = (int(COLOR_GOLD[0] * (alpha / 255.0)),
                   int(COLOR_GOLD[1] * (alpha / 255.0)),
                   int(COLOR_GOLD[2] * (alpha / 255.0)))
        draw.text((WIDTH // 2, HEIGHT // 2), "Ψ", fill=psi_col, font=FONT_PSI_HUGE, anchor="mm")

    # ------------------------------------------------------------
    # SHOT 2: 0:02–0:04 (Quick flash: notebook lines, pen tip touching paper)
    # ------------------------------------------------------------
    elif t < 4.0:
        local_t = (t - 2.0) / 2.0
        
        # Aged parchment background with subtle texture
        draw.rectangle([0, 0, WIDTH, HEIGHT], fill=COLOR_PARCHMENT)
        
        # Close-up ruled notebook lines
        line_spacing = 90
        for ly in range(60, HEIGHT + 100, line_spacing):
            draw.line([(0, ly), (WIDTH, ly)], fill=(70, 90, 140, 60), width=2)
        # Margin red line
        draw.line([(260, 0), (260, HEIGHT)], fill=(200, 60, 60, 90), width=2)

        # Pen nib touching paper with expanding ink bloom
        nib_cx, nib_cy = WIDTH // 2 - 80, HEIGHT // 2 + 40
        bloom_r = int(min(65, local_t * 80))
        draw.ellipse([nib_cx - bloom_r, nib_cy - bloom_r, nib_cx + bloom_r, nib_cy + bloom_r], fill=COLOR_INK)
        
        # Ink stroke leading out from pen tip
        stroke_progress = min(1.0, local_t * 1.6)
        stroke_pts = []
        for i in range(int(300 * stroke_progress)):
            u = i / 30.0
            sx = nib_cx + i * 2.8
            sy = nib_cy - math.sin(u * 2.2) * 35 - i * 0.2
            stroke_pts.append((sx, sy))
        if len(stroke_pts) > 1:
            draw.line(stroke_pts, fill=COLOR_INK, width=6)

        # Fountain pen metallic nib triangle
        nib_poly = [
            (nib_cx, nib_cy),
            (nib_cx - 160, nib_cy - 240),
            (nib_cx - 80, nib_cy - 290),
            (nib_cx + 40, nib_cy - 270)
        ]
        draw.polygon(nib_poly, fill=(40, 42, 55), outline=COLOR_GOLD, width=3)
        draw.line([(nib_cx, nib_cy), (nib_cx - 70, nib_cy - 250)], fill=COLOR_GOLD, width=3)

        # On-Screen Text: "Every stroke..."
        text_y = int(HEIGHT * 0.20 + (1 - min(1.0, local_t * 3)) * 40)
        draw.text((WIDTH // 2, text_y), "Every stroke...", fill=COLOR_INK, font=FONT_TRAILER_TEXT, anchor="mm")

    # ------------------------------------------------------------
    # SHOT 3: 0:04–0:06 (Signature Graphology chart — fast animating line)
    # ------------------------------------------------------------
    elif t < 6.0:
        local_t = (t - 4.0) / 2.0
        
        # Dark graphology grid
        for gy in range(0, HEIGHT, 50):
            draw.line([(0, gy), (WIDTH, gy)], fill=(30, 45, 70, 40), width=1)
        for gx in range(0, WIDTH, 50):
            draw.line([(gx, 0), (gx, HEIGHT)], fill=(30, 45, 70, 40), width=1)

        # Signature Canvas Area
        pad_x, pad_y, pad_w, pad_h = 240, 220, 1440, 680
        safe_rect(draw, pad_x, pad_y, pad_x + pad_w, pad_y + pad_h, fill=(10, 14, 22, 220), outline=COLOR_GOLD_MUTED, width=2)
        draw_hud_bracket(draw, pad_x, pad_y, pad_w, pad_h, color=COLOR_GOLD, size=28)

        # Fast animating signature spline
        pts_count = int(min(600, local_t * 700))
        sig_pts = []
        for i in range(pts_count):
            u = i / 40.0
            sx = pad_x + 140 + i * 2.0 + math.sin(u * 2.6) * 60
            sy = pad_y + 340 + math.sin(u * 1.5) * 140 + math.cos(u * 3.2) * 70
            sig_pts.append((sx, sy))

        if len(sig_pts) > 1:
            for seg in range(len(sig_pts) - 1):
                p_ratio = (math.sin(seg * 0.06) + 1) / 2.0
                col = (
                    int(COLOR_CYAN[0] * (1 - p_ratio) + COLOR_GOLD_BRIGHT[0] * p_ratio),
                    int(COLOR_CYAN[1] * (1 - p_ratio) + COLOR_GOLD_BRIGHT[1] * p_ratio),
                    int(COLOR_CYAN[2] * (1 - p_ratio) + COLOR_GOLD_BRIGHT[2] * p_ratio),
                )
                draw.line([sig_pts[seg], sig_pts[seg + 1]], fill=col, width=5)


        # Vector velocity & loop annotations
        if local_t > 0.35:
            safe_rect(draw, pad_x + 300, pad_y + 180, pad_x + 650, pad_y + 490, outline=(14, 165, 233, 160), width=1)
            draw.text((pad_x + 315, pad_y + 195), "LOOP TRAJECTORY [VELOCITY: 340 px/s]", fill=COLOR_CYAN, font=FONT_HUD_LABEL)

        # Text: "...tells a story."
        draw.text((WIDTH // 2, 130), "...tells a story.", fill=COLOR_GOLD_BRIGHT, font=FONT_TRAILER_TEXT, anchor="mm")

    # ------------------------------------------------------------
    # SHOT 4: 0:06–0:08 (Hard cut, glitch flash — telemetry numbers rapidly ticking)
    # ------------------------------------------------------------
    elif t < 8.0:
        local_t = (t - 6.0) / 2.0
        
        # Glitch scanlines & noise bars
        glitch_bar_y = int((local_t * 6.0 % 1.0) * HEIGHT)
        safe_rect(draw, 0, glitch_bar_y - 30, WIDTH, glitch_bar_y + 30, fill=(30, 60, 100, 70))
        
        # Large rapidly ticking numbers
        vel_tick = int(240 + (local_t * 120) % 100 + math.sin(t * 80) * 15)
        slant_tick = 16.0 + (local_t * 4.0) % 3.0
        
        # Center HUD Matrix
        hud_w, hud_h = 1000, 480
        hx, hy = (WIDTH - hud_w) // 2, (HEIGHT - hud_h) // 2 + 30
        safe_rect(draw, hx, hy, hx + hud_w, hy + hud_h, fill=(12, 18, 28, 240), outline=COLOR_CYAN, width=2)
        draw_hud_bracket(draw, hx, hy, hud_w, hud_h, color=COLOR_CYAN_GLOW, size=32)

        draw.text((hx + 50, hy + 60), "STROKE VELOCITY:", fill=COLOR_GOLD_MUTED, font=FONT_HUD_LABEL)
        draw.text((hx + 50, hy + 100), f"{vel_tick} px/sec", fill=COLOR_GOLD_BRIGHT, font=FONT_HUD_VAL)

        draw.text((hx + 550, hy + 60), "SLANT MOMENT:", fill=COLOR_GOLD_MUTED, font=FONT_HUD_LABEL)
        draw.text((hx + 550, hy + 100), f"+{slant_tick:.1f}° RIGHT", fill=COLOR_CYAN_GLOW, font=FONT_HUD_VAL)

        draw.text((hx + 50, hy + 220), "PRESSURE PROFILE:", fill=COLOR_GOLD_MUTED, font=FONT_HUD_LABEL)
        draw.text((hx + 50, hy + 260), "0.88 FIRM [EQUILIBRIUM]", fill=(34, 197, 94), font=FONT_HUD_VAL)

        draw.text((hx + 550, hy + 220), "MICRO-TREMOR INDEX:", fill=COLOR_GOLD_MUTED, font=FONT_HUD_LABEL)
        draw.text((hx + 550, hy + 260), "0.04% [OPTIMAL FOCUS]", fill=COLOR_WHITE, font=FONT_HUD_VAL)

        draw.text((hx + 50, hy + 380), "STATUS: REAL-TIME BIOMETRIC VECTOR DECODING", fill=COLOR_RED_LASER, font=FONT_HUD_LABEL)

        # Text: "Your hand—"
        draw.text((WIDTH // 2, 130), "Your hand—", fill=COLOR_GOLD_BRIGHT, font=FONT_TRAILER_TEXT, anchor="mm")

    # ------------------------------------------------------------
    # SHOT 5: 0:08–0:10 (Keystroke Cadence equalizer bars — pulsing in sync with Beat Drop #1)
    # ------------------------------------------------------------
    elif t < 10.0:
        local_t = (t - 8.0) / 2.0
        
        # Heavy pulsating background rhythm
        pulse_brightness = int(max(0, math.sin(local_t * math.pi * 4)) * 35)
        safe_rect(draw, 0, 0, WIDTH, HEIGHT, fill=(pulse_brightness, pulse_brightness // 2, 0, 40))

        # Equalizer bar chart
        num_bars = 28
        bar_w = 34
        gap = 14
        start_x = (WIDTH - (num_bars * (bar_w + gap))) // 2
        base_y = HEIGHT // 2 + 240
        
        for b in range(num_bars):
            bx = start_x + b * (bar_w + gap)
            # Beat pulse modulation
            bh = int(80 + math.sin(b * 0.5 + local_t * 18) * 110 + math.sin(local_t * 24) * 60)
            bh = max(20, min(380, bh))
            b_col = COLOR_GOLD_BRIGHT if b % 2 == 0 else COLOR_CYAN
            safe_rect(draw, bx, base_y - bh, bx + bar_w, base_y, fill=b_col)

        # Dwell & flight time telemetry text
        draw.text((WIDTH // 2, base_y + 40), "CADENCE: 58 WPM  |  DWELL LATENCY: 42.8 ms  |  FLIGHT INTERVAL: 112.4 ms", fill=COLOR_CYAN_GLOW, font=FONT_HUD_LABEL, anchor="mm")

        # Text: "Your rhythm—"
        draw.text((WIDTH // 2, 130), "Your rhythm—", fill=COLOR_GOLD_BRIGHT, font=FONT_TRAILER_TEXT, anchor="mm")

    # ------------------------------------------------------------
    # SHOT 6: 0:10–0:12 (Fast bar-chart zoom + red/gold flash frames, Beat Drop #2)
    # ------------------------------------------------------------
    elif t < 12.0:
        local_t = (t - 10.0) / 2.0
        
        # Flash frame on beat drop #2 (first 0.15s)
        if local_t < 0.12:
            safe_rect(draw, 0, 0, WIDTH, HEIGHT, fill=(200, 160, 50, 180))

        # Fast radar chart / cognitive gauge zoom
        zoom = 1.0 + local_t * 0.4
        cx, cy = WIDTH // 2, HEIGHT // 2 + 30
        
        # 5-Axis Radar Chart Polygon
        axes_labels = ["Executive Control", "Motor Cadence", "Slant Ambition", "Pressure Balance", "Focus Stamina"]
        scores = [0.92, 0.88, 0.84, 0.90, 0.94]
        pts = []
        for ai in range(5):
            angle = -math.pi / 2 + ai * (2 * math.pi / 5)
            r_ax = 240 * scores[ai] * zoom
            ax = cx + int(math.cos(angle) * r_ax)
            ay = cy + int(math.sin(angle) * r_ax)
            pts.append((ax, ay))
            # Draw axis spokes
            draw.line([(cx, cy), (cx + int(math.cos(angle) * 260 * zoom), cy + int(math.sin(angle) * 260 * zoom))], fill=(100, 120, 160, 80), width=1)
            draw.text((cx + int(math.cos(angle) * 290 * zoom), cy + int(math.sin(angle) * 290 * zoom)), axes_labels[ai], fill=COLOR_GOLD_MUTED, font=FONT_HUD_LABEL, anchor="mm")

        if len(pts) > 2:
            draw.polygon(pts, fill=(212, 175, 95, 80), outline=COLOR_GOLD_BRIGHT, width=3)

        # Center Composite Score
        draw.text((cx, cy), "91", fill=COLOR_WHITE, font=FONT_TITLE_HERO, anchor="mm")
        draw.text((cx, cy + 55), "MIND SCORE", fill=COLOR_GOLD_BRIGHT, font=FONT_HUD_LABEL, anchor="mm")

        # Text: "Your mind—"
        draw.text((WIDTH // 2, 130), "Your mind—", fill=COLOR_GOLD_BRIGHT, font=FONT_TRAILER_TEXT, anchor="mm")

    # ------------------------------------------------------------
    # SHOT 7: 0:12–0:14 (OpenCV grid scan — laser line sweeping across handwriting boxes)
    # ------------------------------------------------------------
    elif t < 14.0:
        local_t = (t - 12.0) / 2.0
        
        # Document Scan Canvas Area
        pad_x, pad_y, pad_w, pad_h = 240, 220, 1440, 680
        safe_rect(draw, pad_x, pad_y, pad_x + pad_w, pad_y + pad_h, fill=(244, 238, 226), outline=COLOR_INK, width=2)
        
        # Handwritten document lines
        for l_idx in range(6):
            ly = pad_y + 90 + l_idx * 90
            draw.line([(pad_x + 60, ly), (pad_x + 1380, ly)], fill=(30, 35, 50, 150), width=3)
            # OpenCV word bounding boxes
            for w_idx in range(6):
                wx = pad_x + 80 + w_idx * 210
                safe_rect(draw, wx, ly - 35, wx + 170, ly + 20, outline=(14, 165, 233, 200), width=2)

        # Sweeping Red Laser Line
        laser_y = int(pad_y + (local_t * 1.5 % 1.0) * pad_h)
        draw.line([(pad_x, laser_y), (pad_x + pad_w, laser_y)], fill=COLOR_RED_LASER, width=4)
        safe_rect(draw, pad_x, max(pad_y, laser_y - 30), pad_x + pad_w, min(pad_y + pad_h, laser_y + 30), fill=(239, 68, 68, 50))
        draw.text((pad_x + 30, max(pad_y + 10, laser_y - 35)), "OPENCV 10+ BIOMETRIC EXTRACTION SCAN", fill=COLOR_RED_LASER, font=FONT_HUD_LABEL)

        # Text: "—leaves nothing hidden."
        draw.text((WIDTH // 2, 130), "—leaves nothing hidden.", fill=COLOR_GOLD_BRIGHT, font=FONT_TRAILER_TEXT, anchor="mm")

    # ------------------------------------------------------------
    # SHOT 8: 0:14–0:17 (RAPID montage: 3 modality dashboards overlapping / whip-panning)
    # ------------------------------------------------------------
    elif t < 17.0:
        local_t = (t - 14.0) / 3.0
        # Beat cuts at 14.0s (modality 1), 15.0s (modality 2), 16.0s (modality 3)
        sub_phase = int((t - 14.0)) # 0, 1, or 2
        
        # Glitch hit on each second boundary
        since_cut = (t - 14.0) % 1.0
        if since_cut < 0.10:
            safe_rect(draw, 0, 0, WIDTH, HEIGHT, fill=(255, 255, 255, 200))
        
        # Sub-montage 0: Signature Kinetics
        if sub_phase == 0:
            draw_hud_bracket(draw, 300, 200, 1320, 680, color=COLOR_GOLD, size=36)
            draw.text((WIDTH // 2, 320), "MODALITY 01 : SIGNATURE GRAPHOLOGY", fill=COLOR_GOLD_BRIGHT, font=FONT_TRAILER_TEXT, anchor="mm")
            draw.text((WIDTH // 2, 440), "VELOCITY: 412 px/sec  |  SLANT: +18.4°  |  PRESSURE: 0.88", fill=COLOR_CYAN_GLOW, font=FONT_HUD_VAL, anchor="mm")
            draw.text((WIDTH // 2, 560), "MOTOR PROFILE: FLUID CONTINUOUS HARMONICS", fill=COLOR_WHITE, font=FONT_HUD_LABEL, anchor="mm")
        # Sub-montage 1: Keystroke Rhythm
        elif sub_phase == 1:
            draw_hud_bracket(draw, 300, 200, 1320, 680, color=COLOR_CYAN, size=36)
            draw.text((WIDTH // 2, 320), "MODALITY 02 : KEYSTROKE DYNAMICS", fill=COLOR_CYAN_GLOW, font=FONT_TRAILER_TEXT, anchor="mm")
            draw.text((WIDTH // 2, 440), "DWELL: 42.8 ms  |  FLIGHT: 108.6 ms  |  CADENCE: 58 WPM", fill=COLOR_GOLD_BRIGHT, font=FONT_HUD_VAL, anchor="mm")
            draw.text((WIDTH // 2, 560), "COGNITIVE LOAD: EQUILIBRIUM / SUSTAINED FOCUS", fill=COLOR_WHITE, font=FONT_HUD_LABEL, anchor="mm")
        # Sub-montage 2: Document CV
        else:
            draw_hud_bracket(draw, 300, 200, 1320, 680, color=COLOR_RED_LASER, size=36)
            draw.text((WIDTH // 2, 320), "MODALITY 03 : OPENCV MORPHOLOGY", fill=COLOR_RED_LASER, font=FONT_TRAILER_TEXT, anchor="mm")
            draw.text((WIDTH // 2, 440), "DESKEW: -2.1°  |  INK DENSITY: 0.38  |  SPACING: 24.8 px", fill=COLOR_WHITE, font=FONT_HUD_VAL, anchor="mm")
            draw.text((WIDTH // 2, 560), "CLINICAL MULTIMODAL DOSSIER COMPILED", fill=(34, 197, 94), font=FONT_HUD_VAL, anchor="mm")

        # Let it breathe visually without title text as instructed

    # ------------------------------------------------------------
    # SHOT 9: 0:17–0:18 (Hard cut to black — total silence ½ sec trailer gasp)
    # ------------------------------------------------------------
    elif t < 18.0:
        # Pure pitch black. Total void.
        pass

    # ------------------------------------------------------------
    # SHOT 10: 0:18–0:21 (Ψ glyph slams into center frame + MINDMATTERS AI title slam)
    # ------------------------------------------------------------
    elif t < 21.0:
        local_t = (t - 18.0) / 3.0
        
        # Massive impact zoom snap
        zoom = 1.0 + max(0.0, (1 - min(1.0, local_t * 4.0))) * 0.35
        
        # Expanding shockwave ripple
        shock_r = int(local_t * 1100)
        draw.ellipse([WIDTH // 2 - shock_r, HEIGHT // 2 - shock_r, WIDTH // 2 + shock_r, HEIGHT // 2 + shock_r], outline=(212, 175, 95, max(0, int((1 - local_t) * 200))), width=4)

        # Huge background Ψ glyph (barely visible glowing silhouette)
        draw.text((WIDTH // 2, HEIGHT // 2 - 20), "Ψ", fill=(50, 42, 22), font=FONT_PSI_GIANT, anchor="mm")

        # Center poster crop mesh graphic if available
        if poster_crop:
            cw, ch = poster_crop.size
            disp_h = int(480 * zoom)
            disp_w = int(cw * (disp_h / ch))
            crop_resized = poster_crop.resize((disp_w, disp_h), Image.Resampling.BILINEAR)
            paste_x = (WIDTH - disp_w) // 2
            paste_y = (HEIGHT - disp_h) // 2 + 30
            img.paste(crop_resized, (paste_x, paste_y), crop_resized)

        # Title: MINDMATTERS AI (letter by letter build or heavy metallic slam)
        full_title = "M I N D M A T T E R S   A I"
        chars_to_show = len(full_title) if local_t > 0.4 else int(len(full_title) * (local_t / 0.4))
        shown_title = full_title[:chars_to_show]
        
        title_y = int(HEIGHT * 0.22)
        # Drop shadow & embossed text
        draw.text((WIDTH // 2 + 3, title_y + 3), shown_title, fill=(30, 20, 10), font=FONT_TITLE_HERO, anchor="mm")
        draw.text((WIDTH // 2, title_y), shown_title, fill=COLOR_GOLD_BRIGHT, font=FONT_TITLE_HERO, anchor="mm")

    # ------------------------------------------------------------
    # SHOT 11: 0:21–0:23 (Tagline settles under the logo)
    # ------------------------------------------------------------
    elif t < 23.0:
        local_t = (t - 21.0) / 2.0
        
        # Golden neural mesh in background
        if poster_crop:
            cw, ch = poster_crop.size
            disp_h = 480
            disp_w = int(cw * (disp_h / ch))
            crop_resized = poster_crop.resize((disp_w, disp_h), Image.Resampling.BILINEAR)
            paste_x = (WIDTH - disp_w) // 2
            paste_y = (HEIGHT - disp_h) // 2 + 30
            img.paste(crop_resized, (paste_x, paste_y), crop_resized)

        # Title: MINDMATTERS AI
        title_y = int(HEIGHT * 0.22)
        draw.text((WIDTH // 2, title_y), "M I N D M A T T E R S   A I", fill=COLOR_GOLD_BRIGHT, font=FONT_TITLE_HERO, anchor="mm")

        # Tagline settling under logo with smooth fade-in
        tagline_y = title_y + 80
        tag_alpha = int(min(255, local_t * 2.5 * 255))
        draw.text((WIDTH // 2, tagline_y), "Every Stroke Tells A Story.", fill=(212, 175, 95, tag_alpha), font=FONT_TAGLINE, anchor="mm")

    # ------------------------------------------------------------
    # SHOT 12: 0:23–0:24 (Fade to black, tiny cursor blink / URL)
    # ------------------------------------------------------------
    elif t < 24.0:
        local_t = (t - 23.0) / 1.0
        # Dark black frame
        # Centered blinking cursor or handle
        draw.text((WIDTH // 2 - 12, HEIGHT // 2), "mindmatters.ai", fill=COLOR_GOLD_MUTED, font=FONT_URL, anchor="mm")
        if int(local_t * 6) % 2 == 0:
            draw.line([(WIDTH // 2 + 105, HEIGHT // 2 - 16), (WIDTH // 2 + 105, HEIGHT // 2 + 16)], fill=COLOR_CYAN_GLOW, width=2)

    # ------------------------------------------------------------
    # SHOT 13: 0:24–0:26 (Producer credit beat: A PROJECT BY ADITYA & CHRIS)
    # ------------------------------------------------------------
    else:
        local_t = (t - 24.0) / 2.0
        
        # Pure dark obsidian carbon background
        # Understated, elegant gold tracking font, centered, no border
        credit_alpha = int(min(255, max(0, local_t * 3.0 * 255)))
        col_sub = (int(COLOR_GOLD_MUTED[0] * (credit_alpha / 255.0)),
                   int(COLOR_GOLD_MUTED[1] * (credit_alpha / 255.0)),
                   int(COLOR_GOLD_MUTED[2] * (credit_alpha / 255.0)))
        col_main = (int(COLOR_GOLD_BRIGHT[0] * (credit_alpha / 255.0)),
                    int(COLOR_GOLD_BRIGHT[1] * (credit_alpha / 255.0)),
                    int(COLOR_GOLD_BRIGHT[2] * (credit_alpha / 255.0)))

        draw.text((WIDTH // 2, HEIGHT // 2 - 35), "A   P R O J E C T   B Y", fill=col_sub, font=FONT_CREDIT_SUB, anchor="mm")
        draw.text((WIDTH // 2, HEIGHT // 2 + 25), "A D I T Y A   &   C H R I S", fill=col_main, font=FONT_CREDIT_NAMES, anchor="mm")

    return np.array(img.convert("RGB"))

def generate_toxic_trailer_audio(duration, sample_rate=44100):
    total_samples = int(duration * sample_rate)
    t = np.linspace(0, duration, total_samples, endpoint=False)
    audio = np.zeros(total_samples, dtype=np.float64)

    # 1. (0:00–0:02): Low sub-bass thud at 1.4s
    thud_idx = int(1.4 * sample_rate)
    thud_len = int(1.2 * sample_rate)
    ti = np.linspace(0, 1.2, thud_len)
    audio[thud_idx:thud_idx + thud_len] += 0.7 * np.sin(2 * np.pi * 44 * ti) * np.exp(-ti * 2.8)

    # 2. (0:02–0:04): Soft pen-scratch foley
    mask_scratch = (t >= 2.0) & (t < 4.0)
    scratch_len = np.sum(mask_scratch)
    ts = t[mask_scratch] - 2.0
    scratch_noise = (np.random.randn(scratch_len) * 0.18) * (1 + np.sin(2 * np.pi * 14 * ts))
    audio[mask_scratch] += scratch_noise

    # 3. (0:04–0:06): Rising tension string swell (sawtooth harmonic ramping)
    mask_string = (t >= 4.0) & (t < 6.0)
    t_str = t[mask_string] - 4.0
    str_freq = 65.0 + (t_str / 2.0) * 80.0
    string_swell = (0.25 * np.sin(2 * np.pi * str_freq * t_str) + 0.15 * np.sin(2 * np.pi * str_freq * 2 * t_str)) * (t_str / 2.0)
    audio[mask_string] += string_swell

    # 4. (0:06–0:08): Industrial glitch hit at 6.0s + data blips
    glitch_idx = int(6.0 * sample_rate)
    glitch_len = int(0.25 * sample_rate)
    tg = np.linspace(0, 0.25, glitch_len)
    audio[glitch_idx:glitch_idx + glitch_len] += 0.5 * (np.random.randn(glitch_len) * np.exp(-tg * 18))
    # Rapid data blips
    for blip_t in np.arange(6.3, 7.9, 0.14):
        b_idx = int(blip_t * sample_rate)
        b_len = int(0.03 * sample_rate)
        tb = np.linspace(0, 0.03, b_len)
        audio[b_idx:b_idx + b_len] += 0.25 * np.sin(2 * np.pi * 1850 * tb) * np.exp(-tb * 120)

    # 5. (0:08–0:10): Beat drop #1 (heavy kick, distorted bass)
    kick1_idx = int(8.0 * sample_rate)
    k1_len = int(1.4 * sample_rate)
    tk1 = np.linspace(0, 1.4, k1_len)
    kick1 = 0.85 * np.sin(2 * np.pi * (55.0 * np.exp(-tk1 * 3.5)) * tk1) * np.exp(-tk1 * 2.2)
    # Distortion
    audio[kick1_idx:kick1_idx + k1_len] += np.tanh(kick1 * 2.2) * 0.8

    # 6. (0:10–0:12): Beat drop #2, sharper, faster
    kick2_idx = int(10.0 * sample_rate)
    k2_len = int(1.2 * sample_rate)
    tk2 = np.linspace(0, 1.2, k2_len)
    kick2 = 0.9 * np.sin(2 * np.pi * (70.0 * np.exp(-tk2 * 4.0)) * tk2) * np.exp(-tk2 * 2.6)
    audio[kick2_idx:kick2_idx + k2_len] += np.tanh(kick2 * 2.5) * 0.8

    # 7. (0:12–0:14): Rising riser + metallic scrape
    mask_rise = (t >= 12.0) & (t < 14.0)
    tr = t[mask_rise] - 12.0
    riser_freq = 110.0 * (16.0 ** (tr / 2.0))
    riser = 0.35 * np.sin(2 * np.pi * riser_freq * tr) * (tr / 2.0)
    scrape = 0.15 * (np.sin(2 * np.pi * 880 * tr) * np.sin(2 * np.pi * 1320 * tr)) * (tr / 2.0)
    audio[mask_rise] += (riser + scrape)

    # 8. (0:14–0:17): 3 quick bass stabs at 14.0s, 15.0s, 16.0s
    for stab_t in [14.0, 15.0, 16.0]:
        s_idx = int(stab_t * sample_rate)
        s_len = int(0.6 * sample_rate)
        ts = np.linspace(0, 0.6, s_len)
        stab = 0.75 * np.sin(2 * np.pi * 50 * ts) * np.exp(-ts * 5.0)
        audio[s_idx:s_idx + s_len] += np.tanh(stab * 2.0) * 0.75

    # 9. (0:17–0:18): Total Silence (the trailer "gasp" beat)
    # audio in [17.0, 18.0] remains 0.0

    # 10. (0:18–0:21): Massive bass hit + orchestral horn stab (Braam)
    slam_idx = int(18.0 * sample_rate)
    slam_len = int(4.5 * sample_rate)
    tslam = np.linspace(0, 4.5, slam_len)
    # Heavy 38Hz sub boom
    sub_boom = 0.9 * np.sin(2 * np.pi * (38.0 * np.exp(-tslam * 0.6)) * tslam) * np.exp(-tslam * 0.7)
    # Orchestral horn braam (cluster 55Hz + 110Hz + 165Hz with heavy saturation)
    horn = 0.5 * (np.sin(2 * np.pi * 55 * tslam) + 0.35 * np.sin(2 * np.pi * 110 * tslam) + 0.2 * np.sin(2 * np.pi * 165 * tslam)) * np.exp(-tslam * 1.0)
    braam_hit = np.tanh((sub_boom + horn) * 2.2) * 0.9
    audio[slam_idx:slam_idx + slam_len] += braam_hit

    # 11. (0:21–0:23): Sustained low drone resolving tension
    mask_drone = (t >= 21.0) & (t < 23.5)
    td = t[mask_drone] - 21.0
    audio[mask_drone] += 0.25 * np.sin(2 * np.pi * 55 * td) * np.exp(-td * 0.4)

    # 12. (0:23–0:24): Final soft click/heartbeat at 23.5s
    click_idx = int(23.5 * sample_rate)
    c_len = int(0.04 * sample_rate)
    tc = np.linspace(0, 0.04, c_len)
    audio[click_idx:click_idx + c_len] += 0.3 * np.sin(2 * np.pi * 800 * tc) * np.exp(-tc * 150)

    # 13. (0:24–0:26): Silence & low drone tail fading out
    mask_end = (t >= 24.0) & (t < 26.0)
    te = t[mask_end] - 24.0
    audio[mask_end] += 0.15 * np.sin(2 * np.pi * 50 * te) * np.exp(-te * 1.1)

    # Normalize cleanly
    audio = np.clip(audio, -0.98, 0.98)
    audio_int16 = (audio * 32767).astype(np.int16)
    stereo = np.column_stack((audio_int16, audio_int16))
    return stereo, sample_rate

def main():
    print(f"Rendering MindMatters 'The Mind, Decoded' ({TOTAL_FRAMES} frames @ {FPS} fps, 1080p)...")
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    
    temp_video = "temp_toxic_vid.mp4"
    temp_audio = "temp_toxic_aud.wav"
    output_video = "mindmatters_toxic_trailer.mp4"
    
    # 1. Synthesize audio mix
    stereo_pcm, srate = generate_toxic_trailer_audio(DURATION_SEC)
    with wave.open(temp_audio, 'wb') as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(srate)
        wav.writeframes(stereo_pcm.tobytes())
    print("Toxic soundtrack & SFX mix synthesized.")

    # 2. Pipe frames to FFmpeg
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
        "-preset", "fast",
        "-crf", "17",
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
    print("Video stream rendered.")

    # 3. Merge audio & video
    cmd_merge = [
        ffmpeg_exe, "-y",
        "-i", temp_video,
        "-i", temp_audio,
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "256k",
        "-shortest",
        output_video
    ]
    subprocess.run(cmd_merge, check=True)
    print(f"Successfully generated official trailer: {output_video}")

    # Copy to static and artifacts
    import shutil
    shutil.copy(output_video, "backend/static/mindmatters_toxic_trailer.mp4")
    shutil.copy(output_video, r"C:\Users\adity\.gemini\antigravity\brain\93e354ed-6dce-4b95-886a-41e980fdcfc9\mindmatters_toxic_trailer.mp4")

    # Cleanup temp files
    if os.path.exists(temp_video): os.remove(temp_video)
    if os.path.exists(temp_audio): os.remove(temp_audio)

if __name__ == "__main__":
    main()
