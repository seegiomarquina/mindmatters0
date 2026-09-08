# -*- coding: utf-8 -*-
"""
MindMatters AI — "The Mind, Decoded"
Official 24-Second Cinematic Trailer Cut (V3 Master)
Tone Reference: High-tension "gangster-epic" trailer energy (Yash Toxic trailer grammar)
Key Updates:
- 0:02-0:04: Dropped the navy box/grid; ink line animates directly on dark canvas.
- 0:16-0:19: THE REVEAL: No ring, no circle, no box, no sliding rectangle.
             A pinpoint of gold light ignites dead-center, bursting into radiating shafts
             that illuminate and uncover "M I N D M A T T E R S" left-to-right.
             ("AI" dropped from the wordmark as requested).
- 0:19-0:21: Soft ambient glow behind tagline "Every Stroke Tells A Story."
- 0:22-0:24: Polished credit card: "A PROJECT BY" above "CHRIS & ADITTYA" with hairline rule.
"""

import os
import math
import wave
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

WIDTH = 1920
HEIGHT = 1080
FPS = 30
DURATION_SEC = 24.0
TOTAL_FRAMES = int(FPS * DURATION_SEC)

# Color definitions
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

FONT_TRAILER_TEXT = get_font(52, bold=True, serif=True)
FONT_TITLE_HERO = get_font(92, bold=True, serif=True)
FONT_TITLE_CHAR = get_font(92, bold=True, serif=True)
FONT_TAGLINE = get_font(38, bold=False, serif=True)
FONT_HUD_LABEL = get_font(22, bold=True, serif=False)
FONT_HUD_VAL = get_font(30, bold=True, serif=False)
FONT_CREDIT_SUB = get_font(24, bold=False, serif=True)
FONT_CREDIT_NAMES = get_font(42, bold=True, serif=True)
FONT_URL = get_font(28, bold=False, serif=False)

def safe_rect(draw, x0, y0, x1, y1, fill=None, outline=None, width=1):
    rx0, rx1 = min(x0, x1), max(x0, x1)
    ry0, ry1 = min(y0, y1), max(y0, y1)
    draw.rectangle([rx0, ry0, rx1, ry1], fill=fill, outline=outline, width=width)

def render_frame(frame_idx):
    t = frame_idx / FPS
    img = Image.new("RGBA", (WIDTH, HEIGHT), COLOR_OBSIDIAN)
    draw = ImageDraw.Draw(img)

    # ------------------------------------------------------------
    # SHOT 1: 0:00–0:02 (Cold open — notebook lines, pen tip & ink bloom)
    # ------------------------------------------------------------
    if t < 2.0:
        local_t = t / 2.0
        
        # Aged parchment background
        draw.rectangle([0, 0, WIDTH, HEIGHT], fill=COLOR_PARCHMENT)
        
        # Ruled notebook lines
        line_spacing = 90
        for ly in range(60, HEIGHT + 100, line_spacing):
            draw.line([(0, ly), (WIDTH, ly)], fill=(70, 90, 140, 60), width=2)
        # Margin line
        draw.line([(260, 0), (260, HEIGHT)], fill=(200, 60, 60, 90), width=2)

        # Pen nib touching paper with organic ink bloom
        nib_cx, nib_cy = WIDTH // 2 - 80, HEIGHT // 2 + 40
        bloom_r = int(min(70, local_t * 90))
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
        text_y = int(HEIGHT * 0.20 + (1 - min(1.0, local_t * 3.0)) * 40)
        draw.text((WIDTH // 2, text_y), "Every stroke...", fill=COLOR_INK, font=FONT_TRAILER_TEXT, anchor="mm")

    # ------------------------------------------------------------
    # SHOT 2: 0:02–0:04 (Signature Graphology directly on plain dark background — NO NAVY BOX)
    # ------------------------------------------------------------
    elif t < 4.0:
        local_t = (t - 2.0) / 2.0
        
        # Pure dark obsidian background (matching rest of trailer, no navy box!)
        pad_x, pad_y = 200, 240

        # Dynamic signature spline directly on dark canvas
        pts_count = int(min(650, local_t * 750))
        sig_pts = []
        for i in range(pts_count):
            u = i / 38.0
            sx = pad_x + i * 2.4 + math.sin(u * 2.5) * 70
            sy = HEIGHT // 2 + math.sin(u * 1.5) * 160 + math.cos(u * 3.2) * 80
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


        # Vector velocity & loop annotations directly on background
        if local_t > 0.3:
            draw.text((WIDTH // 2, HEIGHT - 180), "VELOCITY: 340 px/s  |  SLANT: +18.4° RIGHT  |  PRESSURE: 0.88 FIRM", fill=COLOR_GOLD_MUTED, font=FONT_HUD_LABEL, anchor="mm")

        # Text: "...tells a story."
        draw.text((WIDTH // 2, 130), "...tells a story.", fill=COLOR_GOLD_BRIGHT, font=FONT_TRAILER_TEXT, anchor="mm")

    # ------------------------------------------------------------
    # SHOT 3: 0:04–0:06 (Hard cut, glitch flash — telemetry numbers ticking)
    # ------------------------------------------------------------
    elif t < 6.0:
        local_t = (t - 4.0) / 2.0
        
        # Glitch flash frame at 4.0s
        if local_t < 0.10:
            safe_rect(draw, 0, 0, WIDTH, HEIGHT, fill=(240, 240, 255, 220))

        # Film-grain / VHS scanlines
        glitch_bar_y = int((local_t * 8.0 % 1.0) * HEIGHT)
        safe_rect(draw, 0, glitch_bar_y - 25, WIDTH, glitch_bar_y + 25, fill=(40, 70, 110, 80))
        for vy in range(0, HEIGHT, 8):
            draw.line([(0, vy), (WIDTH, vy)], fill=(0, 0, 0, 40), width=1)
        
        # Rapidly ticking telemetry
        vel_tick = int(240 + (local_t * 140) % 100 + math.sin(t * 80) * 15)
        slant_tick = 16.0 + (local_t * 4.0) % 3.0
        
        # Clean telemetry layout on dark canvas
        hx, hy = WIDTH // 2, HEIGHT // 2 + 30
        draw.text((hx - 300, hy - 80), "STROKE VELOCITY:", fill=COLOR_GOLD_MUTED, font=FONT_HUD_LABEL, anchor="mm")
        draw.text((hx - 300, hy - 35), f"{vel_tick} px/sec", fill=COLOR_GOLD_BRIGHT, font=FONT_HUD_VAL, anchor="mm")

        draw.text((hx + 300, hy - 80), "SLANT MOMENT:", fill=COLOR_GOLD_MUTED, font=FONT_HUD_LABEL, anchor="mm")
        draw.text((hx + 300, hy - 35), f"+{slant_tick:.1f}° RIGHT", fill=COLOR_CYAN_GLOW, font=FONT_HUD_VAL, anchor="mm")

        draw.text((hx - 300, hy + 70), "PRESSURE PROFILE:", fill=COLOR_GOLD_MUTED, font=FONT_HUD_LABEL, anchor="mm")
        draw.text((hx - 300, hy + 115), "0.88 FIRM [EQUILIBRIUM]", fill=(34, 197, 94), font=FONT_HUD_VAL, anchor="mm")

        draw.text((hx + 300, hy + 70), "MICRO-TREMOR INDEX:", fill=COLOR_GOLD_MUTED, font=FONT_HUD_LABEL, anchor="mm")
        draw.text((hx + 300, hy + 115), "0.04% [OPTIMAL FOCUS]", fill=COLOR_WHITE, font=FONT_HUD_VAL, anchor="mm")

        draw.text((hx, hy + 200), "STATUS: REAL-TIME BIOMETRIC VECTOR DECODING", fill=COLOR_RED_LASER, font=FONT_HUD_LABEL, anchor="mm")

        # Text: "Your hand—"
        draw.text((WIDTH // 2, 130), "Your hand—", fill=COLOR_GOLD_BRIGHT, font=FONT_TRAILER_TEXT, anchor="mm")

    # ------------------------------------------------------------
    # SHOT 4: 0:06–0:08 (Keystroke Cadence equalizer bars — pulsing with Beat Drop #1)
    # ------------------------------------------------------------
    elif t < 8.0:
        local_t = (t - 6.0) / 2.0
        
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
            bh = int(80 + math.sin(b * 0.5 + local_t * 18) * 110 + math.sin(local_t * 24) * 60)
            bh = max(20, min(380, bh))
            b_col = COLOR_GOLD_BRIGHT if b % 2 == 0 else COLOR_CYAN
            safe_rect(draw, bx, base_y - bh, bx + bar_w, base_y, fill=b_col)

        draw.text((WIDTH // 2, base_y + 40), "CADENCE: 58 WPM  |  DWELL LATENCY: 42.8 ms  |  FLIGHT INTERVAL: 112.4 ms", fill=COLOR_CYAN_GLOW, font=FONT_HUD_LABEL, anchor="mm")

        # Text: "Your rhythm—"
        draw.text((WIDTH // 2, 130), "Your rhythm—", fill=COLOR_GOLD_BRIGHT, font=FONT_TRAILER_TEXT, anchor="mm")

    # ------------------------------------------------------------
    # SHOT 5: 0:08–0:10 (Fast bar-chart zoom + red/gold flash frames, Beat Drop #2)
    # ------------------------------------------------------------
    elif t < 10.0:
        local_t = (t - 8.0) / 2.0
        
        if local_t < 0.12:
            safe_rect(draw, 0, 0, WIDTH, HEIGHT, fill=(200, 160, 50, 180))

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
            draw.line([(cx, cy), (cx + int(math.cos(angle) * 260 * zoom), cy + int(math.sin(angle) * 260 * zoom))], fill=(100, 120, 160, 80), width=1)
            draw.text((cx + int(math.cos(angle) * 290 * zoom), cy + int(math.sin(angle) * 290 * zoom)), axes_labels[ai], fill=COLOR_GOLD_MUTED, font=FONT_HUD_LABEL, anchor="mm")

        if len(pts) > 2:
            draw.polygon(pts, fill=(212, 175, 95, 80), outline=COLOR_GOLD_BRIGHT, width=3)

        draw.text((cx, cy), "91", fill=COLOR_WHITE, font=FONT_TITLE_HERO, anchor="mm")
        draw.text((cx, cy + 55), "MIND SCORE", fill=COLOR_GOLD_BRIGHT, font=FONT_HUD_LABEL, anchor="mm")

        # Text: "Your mind—"
        draw.text((WIDTH // 2, 130), "Your mind—", fill=COLOR_GOLD_BRIGHT, font=FONT_TRAILER_TEXT, anchor="mm")

    # ------------------------------------------------------------
    # SHOT 6: 0:10–0:12 (OpenCV grid scan — laser line sweeping handwriting boxes)
    # ------------------------------------------------------------
    elif t < 12.0:
        local_t = (t - 10.0) / 2.0
        
        pad_x, pad_y, pad_w, pad_h = 240, 220, 1440, 680
        safe_rect(draw, pad_x, pad_y, pad_x + pad_w, pad_y + pad_h, fill=(244, 238, 226), outline=COLOR_INK, width=2)
        
        # Handwritten document lines
        for l_idx in range(6):
            ly = pad_y + 90 + l_idx * 90
            draw.line([(pad_x + 60, ly), (pad_x + 1380, ly)], fill=(30, 35, 50, 150), width=3)
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
    # SHOT 7: 0:12–0:15 (RAPID montage across 3 modalities — clean, unbordered)
    # ------------------------------------------------------------
    elif t < 15.0:
        sub_phase = int(t - 12.0)
        since_cut = (t - 12.0) % 1.0
        if since_cut < 0.10:
            safe_rect(draw, 0, 0, WIDTH, HEIGHT, fill=(255, 255, 255, 220))
        
        if sub_phase == 0:
            draw.text((WIDTH // 2, 360), "MODALITY 01 : SIGNATURE GRAPHOLOGY", fill=COLOR_GOLD_BRIGHT, font=FONT_TRAILER_TEXT, anchor="mm")
            draw.text((WIDTH // 2, 480), "VELOCITY: 412 px/sec  |  SLANT: +18.4°  |  PRESSURE: 0.88", fill=COLOR_CYAN_GLOW, font=FONT_HUD_VAL, anchor="mm")
            draw.text((WIDTH // 2, 600), "MOTOR PROFILE: FLUID CONTINUOUS HARMONICS", fill=COLOR_WHITE, font=FONT_HUD_LABEL, anchor="mm")
        elif sub_phase == 1:
            draw.text((WIDTH // 2, 360), "MODALITY 02 : KEYSTROKE DYNAMICS", fill=COLOR_CYAN_GLOW, font=FONT_TRAILER_TEXT, anchor="mm")
            draw.text((WIDTH // 2, 480), "DWELL: 42.8 ms  |  FLIGHT: 108.6 ms  |  CADENCE: 58 WPM", fill=COLOR_GOLD_BRIGHT, font=FONT_HUD_VAL, anchor="mm")
            draw.text((WIDTH // 2, 600), "COGNITIVE LOAD: EQUILIBRIUM / SUSTAINED FOCUS", fill=COLOR_WHITE, font=FONT_HUD_LABEL, anchor="mm")
        else:
            draw.text((WIDTH // 2, 360), "MODALITY 03 : OPENCV MORPHOLOGY", fill=COLOR_RED_LASER, font=FONT_TRAILER_TEXT, anchor="mm")
            draw.text((WIDTH // 2, 480), "DESKEW: -2.1°  |  INK DENSITY: 0.38  |  SPACING: 24.8 px", fill=COLOR_WHITE, font=FONT_HUD_VAL, anchor="mm")
            draw.text((WIDTH // 2, 600), "CLINICAL MULTIMODAL DOSSIER COMPILED", fill=(34, 197, 94), font=FONT_HUD_VAL, anchor="mm")

        # Let it breathe visually without text

    # ------------------------------------------------------------
    # SHOT 8: 0:15–0:16 (Hard cut to black — Total silence trailer "gasp" beat)
    # ------------------------------------------------------------
    elif t < 16.0:
        # Complete pitch black.
        pass

    # ------------------------------------------------------------
    # SHOT 9: 0:16–0:19 (THE REVEAL — Pinpoint of gold light bursts into radiating shafts,
    # uncovering "M I N D M A T T E R S" left-to-right. NO "AI", NO BOX, NO RING, NO SLIDING RECTANGLE)
    # ------------------------------------------------------------
    elif t < 19.0:
        local_t = (t - 16.0) / 3.0
        cx, cy = WIDTH // 2, HEIGHT // 2 - 30

        # Title wordmark: "M I N D M A T T E R S" (dropped "AI")
        title_word = "M I N D M A T T E R S"
        title_chars = list(title_word)
        num_chars = len(title_chars)
        
        # Calculate individual character horizontal positions
        total_text_w = 1100
        char_spacing = total_text_w / max(1, (num_chars - 1))
        char_xs = [int(cx - total_text_w // 2 + i * char_spacing) for i in range(num_chars)]

        # Phase 1: 16.0s - 16.2s (Pinpoint of gold light ignites dead-center)
        if local_t < 0.10:
            pin_t = local_t / 0.10
            r_pin = int(pin_t * 12)
            draw.ellipse([cx - r_pin, cy - r_pin, cx + r_pin, cy + r_pin], fill=COLOR_WHITE)
            draw.ellipse([cx - r_pin * 2, cy - r_pin * 2, cx + r_pin * 2, cy + r_pin * 2], outline=COLOR_GOLD_BRIGHT, width=2)

        # Phase 2 & 3: 16.2s - 18.0s (Light bursts outward into thin radiating shafts,
        # sweeping across letterforms left-to-right to illuminate and uncover each character)
        else:
            burst_t = (local_t - 0.10) / 0.90
            
            # Radiating light shafts cutting through darkness
            num_shafts = 28
            shaft_max_r = 1300
            for s in range(num_shafts):
                angle = s * (2 * math.pi / num_shafts) + burst_t * 0.4
                # Length expands outward with time
                s_len = min(shaft_max_r, int(burst_t * 1.6 * shaft_max_r * (0.8 + 0.4 * math.sin(s * 3))))
                sx = cx + int(math.cos(angle) * s_len)
                sy = cy + int(math.sin(angle) * s_len)
                # Shaft alpha fades as burst settles
                shaft_alpha = int(max(0, min(180, (1.0 - burst_t * 0.7) * 220)))
                shaft_col = (250, 226, 160, shaft_alpha) if s % 2 == 0 else (212, 175, 95, shaft_alpha // 2)
                draw.line([(cx, cy), (sx, sy)], fill=shaft_col, width=int(1 + (s % 3)))

            # Left-to-right light uncover wave:
            # Sweeps across from char_xs[0] to char_xs[-1]
            sweep_x = int(char_xs[0] - 120 + burst_t * 1.5 * (total_text_w + 240))

            # Draw each letter with its illumination based on the light sweep
            for i, ch in enumerate(title_chars):
                char_x = char_xs[i]
                dist_to_sweep = sweep_x - char_x
                
                # Letter uncovered once sweep passes it
                if dist_to_sweep >= 0:
                    # When light front is right on top of letter, it blazes intense white-gold
                    if dist_to_sweep < 80:
                        specular = 1.0 - (dist_to_sweep / 80.0)
                        col = (
                            int(COLOR_GOLD_BRIGHT[0] * (1 - specular) + 255 * specular),
                            int(COLOR_GOLD_BRIGHT[1] * (1 - specular) + 255 * specular),
                            int(COLOR_GOLD_BRIGHT[2] * (1 - specular) + 255 * specular),
                        )
                        # Specular glow
                        draw.text((char_x, cy), ch, fill=(255, 255, 255, 120), font=FONT_TITLE_CHAR, anchor="mm")
                    else:
                        col = COLOR_GOLD_BRIGHT
                    
                    # Drop shadow
                    draw.text((char_x + 2, cy + 2), ch, fill=(25, 18, 10), font=FONT_TITLE_CHAR, anchor="mm")
                    # Main letterform
                    draw.text((char_x, cy), ch, fill=col, font=FONT_TITLE_CHAR, anchor="mm")

            # Center ambient glow settling as the shafts calm down
            if burst_t > 0.4:
                glow_alpha = int(min(60, (burst_t - 0.4) * 100))
                draw.ellipse([cx - 450, cy - 80, cx + 450, cy + 80], fill=(212, 175, 95, glow_alpha))

    # ------------------------------------------------------------
    # SHOT 10: 0:19–0:21 (Light settles into soft ambient glow behind tagline, title holds)
    # ------------------------------------------------------------
    elif t < 21.0:
        local_t = (t - 19.0) / 2.0
        cx, cy = WIDTH // 2, HEIGHT // 2 - 40
        
        # Soft ambient glow behind title & tagline (NO BOXES, NO SHAPES)
        draw.ellipse([cx - 500, cy - 90, cx + 500, cy + 120], fill=(212, 175, 95, 30))

        # Title: MINDMATTERS (bold, steady gold)
        title_word = "M I N D M A T T E R S"
        title_chars = list(title_word)
        total_text_w = 1100
        char_spacing = total_text_w / max(1, (len(title_chars) - 1))
        for i, ch in enumerate(title_chars):
            char_x = int(cx - total_text_w // 2 + i * char_spacing)
            draw.text((char_x + 2, cy + 2), ch, fill=(25, 18, 10), font=FONT_TITLE_CHAR, anchor="mm")
            draw.text((char_x, cy), ch, fill=COLOR_GOLD_BRIGHT, font=FONT_TITLE_CHAR, anchor="mm")

        # Tagline settling under logo: "Every Stroke Tells A Story."
        tagline_y = cy + 95
        tag_alpha = int(min(255, local_t * 2.5 * 255))
        draw.text((cx, tagline_y), "Every Stroke Tells A Story.", fill=(212, 175, 95, tag_alpha), font=FONT_TAGLINE, anchor="mm")

    # ------------------------------------------------------------
    # SHOT 11: 0:21–0:22 (Fade to black, tiny cursor blink / URL)
    # ------------------------------------------------------------
    elif t < 22.0:
        local_t = (t - 21.0) / 1.0
        # Dark black frame with subtle URL
        draw.text((WIDTH // 2 - 12, HEIGHT // 2), "mindmatters.ai", fill=COLOR_GOLD_MUTED, font=FONT_URL, anchor="mm")
        # Blinking cursor
        if int(local_t * 6) % 2 == 0:
            draw.line([(WIDTH // 2 + 105, HEIGHT // 2 - 16), (WIDTH // 2 + 105, HEIGHT // 2 + 16)], fill=COLOR_CYAN_GLOW, width=2)

    # ------------------------------------------------------------
    # SHOT 12: 0:22–0:24 (Credit Card Polished: A PROJECT BY CHRIS & ADITTYA)
    # ------------------------------------------------------------
    else:
        local_t = (t - 22.0) / 2.0
        
        # Pure dark obsidian carbon background (no borders, no boxes!)
        cx, cy = WIDTH // 2, HEIGHT // 2
        
        # Fade in text over 0.4s
        credit_alpha = int(min(255, max(0, local_t * 2.5 * 255)))
        col_sub = (int(COLOR_GOLD_MUTED[0] * (credit_alpha / 255.0)),
                   int(COLOR_GOLD_MUTED[1] * (credit_alpha / 255.0)),
                   int(COLOR_GOLD_MUTED[2] * (credit_alpha / 255.0)))
        col_main = (int(COLOR_GOLD_BRIGHT[0] * (credit_alpha / 255.0)),
                    int(COLOR_GOLD_BRIGHT[1] * (credit_alpha / 255.0)),
                    int(COLOR_GOLD_BRIGHT[2] * (credit_alpha / 255.0)))

        # 1. "A PROJECT BY" (smaller, wide letter-spacing, muted gold)
        draw.text((cx, cy - 40), "A   P R O J E C T   B Y", fill=col_sub, font=FONT_CREDIT_SUB, anchor="mm")

        # 2. "CHRIS & ADITTYA" (larger, warm gold, serif)
        draw.text((cx, cy + 20), "C H R I S   &   A D I T T Y A", fill=col_main, font=FONT_CREDIT_NAMES, anchor="mm")

        # 3. Faint sweep of light passing left to right across names
        if local_t < 0.7:
            sweep_progress = local_t / 0.7
            sweep_x = cx - 350 + int(sweep_progress * 700)
            safe_rect(draw, sweep_x - 15, cy - 50, sweep_x + 15, cy + 50, fill=(255, 255, 255, int(45 * (1 - sweep_progress))))

        # 4. Hairline gold rule that draws itself left to right under "CHRIS & ADITTYA"
        rule_progress = min(1.0, max(0.0, (local_t - 0.2) / 0.6))
        rule_max_w = 440
        rule_w = int(rule_max_w * rule_progress)
        rule_y = cy + 58
        if rule_w > 0:
            rule_alpha = int(min(200, credit_alpha))
            draw.line([(cx - rule_max_w // 2, rule_y), (cx - rule_max_w // 2 + rule_w, rule_y)], fill=(212, 175, 95, rule_alpha), width=2)

        # Holds calmly for the full 2 seconds as requested

    return np.array(img.convert("RGB"))

def generate_toxic_trailer_audio_v3(duration, sample_rate=44100):
    total_samples = int(duration * sample_rate)
    t = np.linspace(0, duration, total_samples, endpoint=False)
    audio = np.zeros(total_samples, dtype=np.float64)

    # 1. (0:00–0:02): Soft pen-scratch foley + reverb tail
    mask_scratch = (t >= 0.0) & (t < 2.0)
    scratch_len = np.sum(mask_scratch)
    ts = t[mask_scratch]
    scratch_noise = (np.random.randn(scratch_len) * 0.20) * (1 + np.sin(2 * np.pi * 14 * ts)) * np.exp(-ts * 0.3)
    audio[mask_scratch] += scratch_noise

    # 2. (0:02–0:04): Rising tension string swell (low cello harmonics rising 60Hz -> 130Hz)
    mask_string = (t >= 2.0) & (t < 4.0)
    t_str = t[mask_string] - 2.0
    str_freq = 60.0 + (t_str / 2.0) * 70.0
    string_swell = (0.28 * np.sin(2 * np.pi * str_freq * t_str) + 0.16 * np.sin(2 * np.pi * str_freq * 2 * t_str)) * (t_str / 2.0)
    audio[mask_string] += string_swell

    # 3. (0:04–0:06): Industrial glitch hit at 4.0s + data blips
    glitch_idx = int(4.0 * sample_rate)
    glitch_len = int(0.25 * sample_rate)
    tg = np.linspace(0, 0.25, glitch_len)
    audio[glitch_idx:glitch_idx + glitch_len] += 0.55 * (np.random.randn(glitch_len) * np.exp(-tg * 18))
    for blip_t in np.arange(4.3, 5.9, 0.14):
        b_idx = int(blip_t * sample_rate)
        b_len = int(0.03 * sample_rate)
        tb = np.linspace(0, 0.03, b_len)
        audio[b_idx:b_idx + b_len] += 0.25 * np.sin(2 * np.pi * 1850 * tb) * np.exp(-tb * 120)

    # 4. (0:06–0:08): Beat drop #1 (heavy kick, distorted bass)
    kick1_idx = int(6.0 * sample_rate)
    k1_len = int(1.4 * sample_rate)
    tk1 = np.linspace(0, 1.4, k1_len)
    kick1 = 0.85 * np.sin(2 * np.pi * (55.0 * np.exp(-tk1 * 3.5)) * tk1) * np.exp(-tk1 * 2.2)
    audio[kick1_idx:kick1_idx + k1_len] += np.tanh(kick1 * 2.2) * 0.8

    # 5. (0:08–0:10): Beat drop #2, sharper, faster
    kick2_idx = int(8.0 * sample_rate)
    k2_len = int(1.2 * sample_rate)
    tk2 = np.linspace(0, 1.2, k2_len)
    kick2 = 0.9 * np.sin(2 * np.pi * (70.0 * np.exp(-tk2 * 4.0)) * tk2) * np.exp(-tk2 * 2.6)
    audio[kick2_idx:kick2_idx + k2_len] += np.tanh(kick2 * 2.5) * 0.8

    # 6. (0:10–0:12): Rising riser + metallic scrape
    mask_rise = (t >= 10.0) & (t < 12.0)
    tr = t[mask_rise] - 10.0
    riser_freq = 110.0 * (16.0 ** (tr / 2.0))
    riser = 0.35 * np.sin(2 * np.pi * riser_freq * tr) * (tr / 2.0)
    scrape = 0.15 * (np.sin(2 * np.pi * 880 * tr) * np.sin(2 * np.pi * 1320 * tr)) * (tr / 2.0)
    audio[mask_rise] += (riser + scrape)

    # 7. (0:12–0:15): 3 quick bass stabs at 12.0s, 13.0s, 14.0s
    for stab_t in [12.0, 13.0, 14.0]:
        s_idx = int(stab_t * sample_rate)
        s_len = int(0.6 * sample_rate)
        ts = np.linspace(0, 0.6, s_len)
        stab = 0.75 * np.sin(2 * np.pi * 50 * ts) * np.exp(-ts * 5.0)
        audio[s_idx:s_idx + s_len] += np.tanh(stab * 2.0) * 0.75

    # 8. (0:15–0:16): Total silence (the trailer "gasp" beat)
    # audio in [15.0, 16.0] remains 0.0

    # 9. (0:16–0:19): Massive bass hit + orchestral horn stab as light bursts outward
    slam_idx = int(16.2 * sample_rate)
    slam_len = int(4.5 * sample_rate)
    tslam = np.linspace(0, 4.5, slam_len)
    sub_boom = 0.94 * np.sin(2 * np.pi * (36.0 * np.exp(-tslam * 0.6)) * tslam) * np.exp(-tslam * 0.7)
    horn = 0.58 * (np.sin(2 * np.pi * 55 * tslam) + 0.38 * np.sin(2 * np.pi * 110 * tslam) + 0.22 * np.sin(2 * np.pi * 165 * tslam)) * np.exp(-tslam * 1.0)
    braam_hit = np.tanh((sub_boom + horn) * 2.2) * 0.92
    audio[slam_idx:slam_idx + slam_len] += braam_hit

    # 10. (0:19–0:21): Sustained low drone resolving tension
    mask_drone = (t >= 19.0) & (t < 21.5)
    td = t[mask_drone] - 19.0
    audio[mask_drone] += 0.25 * np.sin(2 * np.pi * 55 * td) * np.exp(-td * 0.4)

    # 11. (0:21–0:22): Final soft click/heartbeat at 21.5s
    click_idx = int(21.5 * sample_rate)
    c_len = int(0.04 * sample_rate)
    tc = np.linspace(0, 0.04, c_len)
    audio[click_idx:click_idx + c_len] += 0.3 * np.sin(2 * np.pi * 800 * tc) * np.exp(-tc * 150)

    # 12. (0:22–0:24): Silence & soft drone tail fading out
    mask_end = (t >= 22.0) & (t < 24.0)
    te = t[mask_end] - 22.0
    audio[mask_end] += 0.15 * np.sin(2 * np.pi * 50 * te) * np.exp(-te * 1.1)

    # Normalize cleanly
    audio = np.clip(audio, -0.98, 0.98)
    audio_int16 = (audio * 32767).astype(np.int16)
    stereo = np.column_stack((audio_int16, audio_int16))
    return stereo, sample_rate

def main():
    print(f"Rendering MindMatters Master 24s Trailer Cut ({TOTAL_FRAMES} frames @ {FPS} fps, 1080p)...")
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    
    temp_video = "temp_toxic_v3_vid.mp4"
    temp_audio = "temp_toxic_v3_aud.wav"
    output_video = "mindmatters_trailer_v3.mp4"
    
    # 1. Synthesize audio mix
    stereo_pcm, srate = generate_toxic_trailer_audio_v3(DURATION_SEC)
    with wave.open(temp_audio, 'wb') as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(srate)
        wav.writeframes(stereo_pcm.tobytes())
    print("Master soundtrack & SFX mix synthesized.")

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
    print(f"Successfully generated master trailer: {output_video}")

    # Copy to static and artifacts
    import shutil
    shutil.copy(output_video, "backend/static/mindmatters_trailer_v3.mp4")
    shutil.copy(output_video, r"C:\Users\adity\.gemini\antigravity\brain\93e354ed-6dce-4b95-886a-41e980fdcfc9\mindmatters_trailer_v3.mp4")

    # Cleanup temp files
    if os.path.exists(temp_video): os.remove(temp_video)
    if os.path.exists(temp_audio): os.remove(temp_audio)

if __name__ == "__main__":
    main()
