# -*- coding: utf-8 -*-
"""
MindMatters AI — "The Mind, Decoded"
Official 24-Second Master Cinematic Reveal
Exact implementation of the 10/10 truth-reveal screenplay:
- 0:00-0:02: Cold open on black -> pen touches paper, ink begins moving. "EVERY STROKE..."
- 0:02-0:04: Ink line floats in dark space, subtle particles. "TELLS A STORY."
- 0:04-0:06: Hard cut, rapid flashing classified telemetry. "YOUR HAND..."
- 0:06-0:08: Keystroke bars as gigantic structures, heavy percussion. "YOUR RHYTHM..."
- 0:08-0:10: High-speed montage, extreme zooms, distorted "YOUR MIND..."
- 0:10-0:12: Everything disappears to black. Thin scanning line decodes handwriting. "LEAVES NOTHING HIDDEN."
- 0:12-0:15: Rapid 0.3-0.5s montage across modalities -> freezes on a single handwritten line. No text. Massive rise.
- 0:15-0:16.5: TOTAL SILENCE. 1.5s pure black void.
- 0:16.5-0:19.5: THE REVELATION. Microscopic pinpoint of light ignites center-frame, bursts into hundreds of thin rays uncovering "MINDMATTERS" letter-by-letter left to right. Massive BOOM + horn braam.
- 0:19.5-0:21.5: "EVERY STROKE TELLS A STORY." with subtle light sweep over engraved metal.
- 0:21.5-0:22: Black. Single tiny ink droplet falls and taps bottom.
- 0:22-0:24: Dark subtle paper texture. Thin line of light draws itself, revealing "A PROJECT BY" above "CHRIS & ADITTYA" (double T).
"""

import os
import math
import wave
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import imageio_ffmpeg

WIDTH = 1920
HEIGHT = 1080
FPS = 30
DURATION_SEC = 24.0
TOTAL_FRAMES = int(FPS * DURATION_SEC)

COLOR_BLACK = (0, 0, 0)
COLOR_OBSIDIAN = (5, 7, 10)
COLOR_PARCHMENT = (242, 234, 218)
COLOR_INK = (14, 16, 26)
COLOR_GOLD = (212, 175, 95)
COLOR_GOLD_BRIGHT = (252, 230, 165)
COLOR_GOLD_MUTED = (155, 128, 74)
COLOR_CYAN = (14, 165, 233)
COLOR_CYAN_GLOW = (56, 189, 248)
COLOR_RED_LASER = (239, 68, 68)
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

FONT_HERO_TITLE = get_font(96, bold=True, serif=True)
FONT_TRAILER_SUB = get_font(54, bold=True, serif=True)
FONT_TAGLINE = get_font(38, bold=False, serif=True)
FONT_HUD_LABEL = get_font(24, bold=True, serif=False)
FONT_HUD_VAL = get_font(32, bold=True, serif=False)
FONT_CREDIT_SUB = get_font(24, bold=False, serif=True)
FONT_CREDIT_NAMES = get_font(46, bold=True, serif=True)

def safe_rect(draw, x0, y0, x1, y1, fill=None, outline=None, width=1):
    rx0, rx1 = min(x0, x1), max(x0, x1)
    ry0, ry1 = min(y0, y1), max(y0, y1)
    draw.rectangle([rx0, ry0, rx1, ry1], fill=fill, outline=outline, width=width)

def render_frame(frame_idx):
    t = frame_idx / FPS
    img = Image.new("RGBA", (WIDTH, HEIGHT), COLOR_OBSIDIAN)
    draw = ImageDraw.Draw(img)

    # =========================================================================
    # 0:00–0:02 — THE FIRST CLUE (Cold open, paper & pen close-up, ink stroke)
    # =========================================================================
    if t < 2.0:
        local_t = t / 2.0
        # Extreme close-up of rough paper with visible fibers
        draw.rectangle([0, 0, WIDTH, HEIGHT], fill=COLOR_PARCHMENT)
        
        # Subtle organic paper fibers
        for f_idx in range(60):
            fx = (f_idx * 173) % WIDTH
            fy = (f_idx * 89) % HEIGHT
            flen = 15 + (f_idx % 25)
            draw.line([(fx, fy), (fx + flen, fy + 4)], fill=(210, 200, 180, 70), width=1)

        # Notebook lines
        for ly in range(80, HEIGHT + 100, 95):
            draw.line([(0, ly), (WIDTH, ly)], fill=(75, 95, 145, 60), width=2)
        draw.line([(260, 0), (260, HEIGHT)], fill=(210, 65, 65, 85), width=2)

        # Pen touching paper
        nib_cx, nib_cy = WIDTH // 2 - 80, HEIGHT // 2 + 50
        bloom_r = int(min(65, local_t * 85))
        draw.ellipse([nib_cx - bloom_r, nib_cy - bloom_r, nib_cx + bloom_r, nib_cy + bloom_r], fill=COLOR_INK)
        
        # Single ink stroke moving
        stroke_progress = min(1.0, local_t * 1.5)
        pts = []
        for i in range(int(320 * stroke_progress)):
            u = i / 32.0
            sx = nib_cx + i * 2.7
            sy = nib_cy - math.sin(u * 2.1) * 38 - i * 0.15
            pts.append((sx, sy))
        if len(pts) > 1:
            draw.line(pts, fill=COLOR_INK, width=7)

        # Pen nib triangle
        nib_poly = [
            (nib_cx, nib_cy),
            (nib_cx - 160, nib_cy - 240),
            (nib_cx - 80, nib_cy - 290),
            (nib_cx + 40, nib_cy - 270)
        ]
        draw.polygon(nib_poly, fill=(35, 38, 50), outline=COLOR_GOLD, width=3)
        draw.line([(nib_cx, nib_cy), (nib_cx - 70, nib_cy - 250)], fill=COLOR_GOLD, width=3)

        # Text appears slowly: "EVERY STROKE..."
        text_alpha = int(min(255, local_t * 1.8 * 255))
        draw.text((WIDTH // 2, int(HEIGHT * 0.20)), "EVERY STROKE...", fill=(18, 20, 32, text_alpha), font=FONT_TRAILER_SUB, anchor="mm")

    # =========================================================================
    # 0:02–0:04 — THE STORY (Ink lines floating in dark space, discovered, particles)
    # =========================================================================
    elif t < 4.0:
        local_t = (t - 2.0) / 2.0
        
        # Dark void background
        # Floating subtle golden dust particles
        for p in range(40):
            px = int((p * 109 + local_t * 50) % WIDTH)
            py = int((p * 71 + math.sin(local_t * 3 + p) * 30) % HEIGHT)
            draw.point((px, py), fill=(212, 175, 95, 120))

        # Floating handwriting ink spline discovered in space
        pts_count = int(min(700, local_t * 800))
        sig_pts = []
        for i in range(pts_count):
            u = i / 40.0
            sx = 180 + i * 2.3 + math.sin(u * 2.4) * 65
            sy = HEIGHT // 2 + math.sin(u * 1.4) * 160 + math.cos(u * 3.1) * 75
            sig_pts.append((sx, sy))

        N = len(sig_pts)
        if N > 1:
            # RAW STROKE ONLY: All tracker layers, lead-point circles, and point emitters deleted completely
            for seg in range(N - 1):
                p_ratio = (math.sin(seg * 0.05) + 1) / 2.0
                col = (
                    int(COLOR_CYAN[0] * (1 - p_ratio) + COLOR_GOLD_BRIGHT[0] * p_ratio),
                    int(COLOR_CYAN[1] * (1 - p_ratio) + COLOR_GOLD_BRIGHT[1] * p_ratio),
                    int(COLOR_CYAN[2] * (1 - p_ratio) + COLOR_GOLD_BRIGHT[2] * p_ratio),
                )
                draw.line([sig_pts[seg], sig_pts[seg + 1]], fill=col, width=4)

        # Text: "TELLS A STORY." (appears as ink completes stroke)
        if local_t > 0.3:
            t_alpha = int(min(255, (local_t - 0.3) * 2.0 * 255))
            draw.text((WIDTH // 2, 130), "TELLS A STORY.", fill=(250, 226, 160, t_alpha), font=FONT_TRAILER_SUB, anchor="mm")

    # =========================================================================
    # 0:04–0:06 — THE HAND (Classified evidence flashing: 296 px/sec, +18.4°, etc.)
    # =========================================================================
    elif t < 6.0:
        local_t = (t - 4.0) / 2.0
        
        # Glitch hit at 4.0s
        if local_t < 0.08:
            safe_rect(draw, 0, 0, WIDTH, HEIGHT, fill=(245, 245, 255, 230))

        # Film-grain / scanlines
        for vy in range(0, HEIGHT, 6):
            draw.line([(0, vy), (WIDTH, vy)], fill=(0, 0, 0, 45), width=1)
        
        # Rapidly cycling classified evidence data
        cycle = int(t * 14)
        v_vals = ["296 px/sec", "312 px/sec", "284 px/sec", "296 px/sec"]
        s_vals = ["+18.4°", "+17.9°", "+18.4°", "+19.1°"]
        curr_v = v_vals[cycle % len(v_vals)]
        curr_s = s_vals[cycle % len(s_vals)]

        cx, cy = WIDTH // 2, HEIGHT // 2 + 20
        # Classified tags
        draw.text((cx - 320, cy - 80), "BASELINE VELOCITY", fill=COLOR_GOLD_MUTED, font=FONT_HUD_LABEL, anchor="mm")
        draw.text((cx - 320, cy - 35), curr_v, fill=COLOR_GOLD_BRIGHT, font=FONT_HUD_VAL, anchor="mm")

        draw.text((cx + 320, cy - 80), "SLANT MOMENT", fill=COLOR_GOLD_MUTED, font=FONT_HUD_LABEL, anchor="mm")
        draw.text((cx + 320, cy - 35), curr_s, fill=COLOR_CYAN_GLOW, font=FONT_HUD_VAL, anchor="mm")

        draw.text((cx - 320, cy + 75), "PRESSURE PROFILE", fill=COLOR_GOLD_MUTED, font=FONT_HUD_LABEL, anchor="mm")
        draw.text((cx - 320, cy + 120), "0.88 FIRM", fill=(34, 197, 94), font=FONT_HUD_VAL, anchor="mm")

        draw.text((cx + 320, cy + 75), "MICRO-TREMOR", fill=COLOR_GOLD_MUTED, font=FONT_HUD_LABEL, anchor="mm")
        draw.text((cx + 320, cy + 120), "0.04% ACTIVE", fill=COLOR_WHITE, font=FONT_HUD_VAL, anchor="mm")

        # Text: "YOUR HAND..."
        draw.text((WIDTH // 2, 130), "YOUR HAND...", fill=COLOR_GOLD_BRIGHT, font=FONT_TRAILER_SUB, anchor="mm")

    # =========================================================================
    # 0:06–0:08 — THE RHYTHM (Keystroke equalizer bars as gigantic structures, BOOM BOOM)
    # =========================================================================
    elif t < 8.0:
        local_t = (t - 6.0) / 2.0
        
        # Heavy screen pulse on bass hits
        pulse_val = int(max(0, math.sin(local_t * math.pi * 4)) * 30)
        safe_rect(draw, 0, 0, WIDTH, HEIGHT, fill=(pulse_val, pulse_val // 2, 0, 35))

        # Massive towering equalizer bars
        num_bars = 24
        bar_w = 42
        gap = 18
        start_x = (WIDTH - (num_bars * (bar_w + gap))) // 2
        base_y = HEIGHT // 2 + 260
        
        for b in range(num_bars):
            bx = start_x + b * (bar_w + gap)
            bh = int(100 + math.sin(b * 0.4 + local_t * 20) * 160 + math.sin(local_t * 26) * 90)
            bh = max(30, min(480, bh))
            b_col = COLOR_GOLD_BRIGHT if b % 2 == 0 else COLOR_CYAN
            safe_rect(draw, bx, base_y - bh, bx + bar_w, base_y, fill=b_col)

        # Flashing metric tags between bars: SPEED, PAUSE, RHYTHM, CORRECTION
        tags = ["SPEED", "PAUSE", "RHYTHM", "CORRECTION"]
        tag_str = "    •    ".join(tags)
        draw.text((WIDTH // 2, base_y + 45), tag_str, fill=COLOR_GOLD_MUTED, font=FONT_HUD_LABEL, anchor="mm")

        # Text: "YOUR RHYTHM..."
        draw.text((WIDTH // 2, 130), "YOUR RHYTHM...", fill=COLOR_GOLD_BRIGHT, font=FONT_TRAILER_SUB, anchor="mm")

    # =========================================================================
    # 0:08–0:10 — THE MIND (Fastest section, extreme zoom, distortion, escalating impacts)
    # =========================================================================
    elif t < 10.0:
        local_t = (t - 8.0) / 2.0
        
        # Beat impact flash
        if local_t < 0.10:
            safe_rect(draw, 0, 0, WIDTH, HEIGHT, fill=(230, 180, 60, 190))

        # Rapid camera zoom & shake
        shake_x = int(math.sin(t * 70) * 12)
        shake_y = int(math.cos(t * 60) * 8)
        cx, cy = WIDTH // 2 + shake_x, HEIGHT // 2 + 30 + shake_y
        zoom = 1.0 + local_t * 0.6
        
        # 5-Axis Radar Chart expanding rapidly
        scores = [0.92, 0.88, 0.84, 0.90, 0.94]
        pts = []
        for ai in range(5):
            angle = -math.pi / 2 + ai * (2 * math.pi / 5)
            r_ax = 240 * scores[ai] * zoom
            ax = cx + int(math.cos(angle) * r_ax)
            ay = cy + int(math.sin(angle) * r_ax)
            pts.append((ax, ay))
            draw.line([(cx, cy), (cx + int(math.cos(angle) * 260 * zoom), cy + int(math.sin(angle) * 260 * zoom))], fill=(120, 140, 180, 90), width=2)
        if len(pts) > 2:
            draw.polygon(pts, fill=(212, 175, 95, 90), outline=COLOR_GOLD_BRIGHT, width=3)

        draw.text((cx, cy), "91", fill=COLOR_WHITE, font=FONT_HERO_TITLE, anchor="mm")

        # Text: "YOUR MIND..." with brief horizontal glitch distortion
        mind_distort_x = int(math.sin(local_t * 40) * 8) if (local_t > 0.4 and local_t < 0.8) else 0
        draw.text((WIDTH // 2 + mind_distort_x, 130), "YOUR MIND...", fill=COLOR_GOLD_BRIGHT, font=FONT_TRAILER_SUB, anchor="mm")

    # =========================================================================
    # 0:10–0:12 — NOTHING REMAINS HIDDEN (Thin scanning line decodes handwriting on black)
    # =========================================================================
    elif t < 12.0:
        local_t = (t - 10.0) / 2.0
        
        # Pure dark canvas with subtle document lines
        pad_x, pad_y, pad_w, pad_h = 240, 200, 1440, 680
        
        # Handwritten note lines emerging directly on dark background
        for l_idx in range(6):
            ly = pad_y + 80 + l_idx * 100
            draw.line([(pad_x + 80, ly), (pad_x + 1360, ly)], fill=(45, 55, 75, 160), width=3)
            # Word bounding boxes emerging as scan line passes
            for w_idx in range(6):
                wx = pad_x + 90 + w_idx * 210
                box_y = ly - 35
                # Revealed only if laser has passed this line
                laser_curr_y = pad_y + int((local_t * 1.4 % 1.0) * pad_h)
                if laser_curr_y > box_y:
                    safe_rect(draw, wx, box_y, wx + 170, box_y + 60, outline=(14, 165, 233, 180), width=2)

        # Thin laser scanning line
        laser_y = pad_y + int((local_t * 1.4 % 1.0) * pad_h)
        draw.line([(pad_x, laser_y), (pad_x + pad_w, laser_y)], fill=COLOR_RED_LASER, width=3)
        safe_rect(draw, pad_x, max(pad_y, laser_y - 25), pad_x + pad_w, min(pad_y + pad_h, laser_y + 25), fill=(239, 68, 68, 40))
        draw.text((pad_x + 30, max(pad_y + 10, laser_y - 30)), "CONTOURS  •  BASELINE  •  DENSITY  •  COMPLEXITY", fill=COLOR_RED_LASER, font=FONT_HUD_LABEL)

        # Text: "LEAVES NOTHING HIDDEN."
        draw.text((WIDTH // 2, 120), "LEAVES NOTHING HIDDEN.", fill=COLOR_GOLD_BRIGHT, font=FONT_TRAILER_SUB, anchor="mm")

    # =========================================================================
    # 0:12–0:15 — THE TRUTH (Rapid 0.3-0.5s montage -> freezes on a single line. No text.)
    # =========================================================================
    elif t < 15.0:
        local_t = (t - 12.0) / 3.0
        # 12.0 to 14.5: rapid cycle through HANDWRITING -> SIGNATURE -> KEYSTROKES -> DATA -> ANALYSIS -> HUMAN
        if t < 14.5:
            phase = int((t - 12.0) / 0.42) % 6
            since_cut = (t - 12.0) % 0.42
            # Flash on cut
            if since_cut < 0.08:
                safe_rect(draw, 0, 0, WIDTH, HEIGHT, fill=(255, 255, 255, 210))
            
            labels = ["HANDWRITING DECODED", "SIGNATURE KINETICS", "KEYSTROKE DYNAMICS", "DATA INTEGRITY", "BEHAVIORAL ANALYSIS", "HUMAN COGNITION"]
            curr_label = labels[phase]
            draw.text((WIDTH // 2, HEIGHT // 2), curr_label, fill=COLOR_GOLD_BRIGHT, font=FONT_TRAILER_SUB, anchor="mm")
            # Telemetry readout
            draw.text((WIDTH // 2, HEIGHT // 2 + 70), "VELOCITY: 312 px/s  |  DWELL: 42.8 ms  |  EQUILIBRIUM: 91%", fill=COLOR_CYAN_GLOW, font=FONT_HUD_VAL, anchor="mm")
        # 14.5 to 15.0: Everything freezes. A single handwritten line remains. Camera moves toward it.
        else:
            freeze_t = (t - 14.5) / 0.5
            zoom = 1.0 + freeze_t * 0.15
            # Single elegant gold/ink handwritten line in darkness (RAW STROKE ONLY - ZERO DOTS/CIRCLES/EMITTERS)
            line_w = int(600 * zoom)
            lx0 = (WIDTH - line_w) // 2
            lx1 = lx0 + line_w
            ly = HEIGHT // 2
            body_w = max(1, int(4 * zoom))
            draw.line([(lx0, ly), (lx1, ly)], fill=COLOR_GOLD_BRIGHT, width=body_w)

    # =========================================================================
    # 0:15–0:16.5 — SILENCE (1.5 seconds pure black void. Total silence.)
    # =========================================================================
    elif t < 16.5:
        # Complete pure black. Void.
        pass

    # =========================================================================
    # 0:16.5–0:19.5 — THE REVELATION (Light burst reveals MINDMATTERS letter by letter)
    # =========================================================================
    elif t < 19.5:
        local_t = (t - 16.5) / 3.0
        cx, cy = WIDTH // 2, HEIGHT // 2 - 25

        title_word = "M I N D M A T T E R S"
        title_chars = list(title_word)
        num_chars = len(title_chars)
        total_text_w = 1140
        char_spacing = total_text_w / max(1, (num_chars - 1))
        char_xs = [int(cx - total_text_w // 2 + i * char_spacing) for i in range(num_chars)]

        # 16.5s to 16.7s: Microscopic point of warm light ignites center-frame
        if local_t < 0.08:
            pin_progress = local_t / 0.08
            r_pin = max(2, int(pin_progress * 10))
            draw.ellipse([cx - r_pin, cy - r_pin, cx + r_pin, cy + r_pin], fill=COLOR_WHITE)
            draw.ellipse([cx - r_pin * 2, cy - r_pin * 2, cx + r_pin * 2, cy + r_pin * 2], outline=COLOR_GOLD_BRIGHT, width=2)

        # 16.7s to 18.5s: FLASH & hundreds of thin radiating rays burst outward, uncovering letters left to right
        else:
            burst_t = (local_t - 0.08) / 0.92
            
            # Radiating light shafts cutting through darkness
            num_shafts = 36
            shaft_max_r = 1350
            for s in range(num_shafts):
                angle = s * (2 * math.pi / num_shafts) + burst_t * 0.35
                s_len = min(shaft_max_r, int(burst_t * 1.7 * shaft_max_r * (0.8 + 0.4 * math.sin(s * 2.5))))
                sx = cx + int(math.cos(angle) * s_len)
                sy = cy + int(math.sin(angle) * s_len)
                shaft_alpha = int(max(0, min(200, (1.0 - burst_t * 0.65) * 240)))
                shaft_col = (252, 230, 165, shaft_alpha) if s % 2 == 0 else (212, 175, 95, shaft_alpha // 2)
                draw.line([(cx, cy), (sx, sy)], fill=shaft_col, width=int(1 + (s % 3)))

            # Light uncover sweep front moving left-to-right across letters
            sweep_x = int(char_xs[0] - 140 + burst_t * 1.45 * (total_text_w + 280))

            # Reveal each letter as light sweeps over it
            for i, ch in enumerate(title_chars):
                char_x = char_xs[i]
                dist = sweep_x - char_x
                
                # Letter uncovered
                if dist >= 0:
                    # Specular blaze when light touches it
                    if dist < 90:
                        spec = 1.0 - (dist / 90.0)
                        col = (
                            int(COLOR_GOLD_BRIGHT[0] * (1 - spec) + 255 * spec),
                            int(COLOR_GOLD_BRIGHT[1] * (1 - spec) + 255 * spec),
                            int(COLOR_GOLD_BRIGHT[2] * (1 - spec) + 255 * spec),
                        )
                        draw.text((char_x, cy), ch, fill=(255, 255, 255, 140), font=FONT_HERO_TITLE, anchor="mm")
                    else:
                        col = COLOR_GOLD_BRIGHT

                    # Drop shadow + letterform
                    draw.text((char_x + 3, cy + 3), ch, fill=(20, 15, 8), font=FONT_HERO_TITLE, anchor="mm")
                    draw.text((char_x, cy), ch, fill=col, font=FONT_HERO_TITLE, anchor="mm")

            # Soft ambient glow settling behind title
            if burst_t > 0.4:
                glow_alpha = int(min(65, (burst_t - 0.4) * 110))
                draw.ellipse([cx - 480, cy - 80, cx + 480, cy + 80], fill=(212, 175, 95, glow_alpha))

    # =========================================================================
    # 0:19.5–0:21.5 — THE PHILOSOPHY ("EVERY STROKE TELLS A STORY." subtle light sweep)
    # =========================================================================
    elif t < 21.5:
        local_t = (t - 19.5) / 2.0
        cx, cy = WIDTH // 2, HEIGHT // 2 - 40
        
        # Soft ambient glow behind title & tagline
        draw.ellipse([cx - 520, cy - 85, cx + 520, cy + 120], fill=(212, 175, 95, 32))

        # Title: MINDMATTERS (steady gold)
        title_word = "M I N D M A T T E R S"
        title_chars = list(title_word)
        total_text_w = 1140
        char_spacing = total_text_w / max(1, (len(title_chars) - 1))
        for i, ch in enumerate(title_chars):
            char_x = int(cx - total_text_w // 2 + i * char_spacing)
            draw.text((char_x + 3, cy + 3), ch, fill=(20, 15, 8), font=FONT_HERO_TITLE, anchor="mm")
            draw.text((char_x, cy), ch, fill=COLOR_GOLD_BRIGHT, font=FONT_HERO_TITLE, anchor="mm")

        # Tagline: "EVERY STROKE TELLS A STORY."
        tagline_y = cy + 95
        tag_alpha = int(min(255, local_t * 2.8 * 255))
        draw.text((cx, tagline_y), "EVERY STROKE TELLS A STORY.", fill=(212, 175, 95, tag_alpha), font=FONT_TAGLINE, anchor="mm")

    # =========================================================================
    # 0:21.5–0:22 — THE LAST BREATH (Black, single ink droplet falls and taps bottom)
    # =========================================================================
    elif t < 22.0:
        local_t = (t - 21.5) / 0.5
        # Single ink droplet falling from top to bottom
        drop_y = int(local_t * HEIGHT)
        drop_r = 5
        draw.ellipse([WIDTH // 2 - drop_r, drop_y - drop_r * 2, WIDTH // 2 + drop_r, drop_y + drop_r * 2], fill=COLOR_GOLD_BRIGHT)

    # =========================================================================
    # 0:22–0:24 — THE CREDITS REVEAL (A PROJECT BY CHRIS & ADITTYA with light sweep)
    # =========================================================================
    else:
        local_t = (t - 22.0) / 2.0
        cx, cy = WIDTH // 2, HEIGHT // 2
        
        credit_alpha = int(min(255, max(0, local_t * 2.8 * 255)))
        col_sub = (int(COLOR_GOLD_MUTED[0] * (credit_alpha / 255.0)),
                   int(COLOR_GOLD_MUTED[1] * (credit_alpha / 255.0)),
                   int(COLOR_GOLD_MUTED[2] * (credit_alpha / 255.0)))
        col_main = (int(COLOR_GOLD_BRIGHT[0] * (credit_alpha / 255.0)),
                    int(COLOR_GOLD_BRIGHT[1] * (credit_alpha / 255.0)),
                    int(COLOR_GOLD_BRIGHT[2] * (credit_alpha / 255.0)))

        # 1. "A PROJECT BY"
        draw.text((cx, cy - 45), "A   P R O J E C T   B Y", fill=col_sub, font=FONT_CREDIT_SUB, anchor="mm")

        # 2. "CHRIS & ADITTYA" (Double T!)
        draw.text((cx, cy + 20), "C H R I S   &   A D I T T Y A", fill=col_main, font=FONT_CREDIT_NAMES, anchor="mm")

        # 3. Faint light sweep passing left to right
        if local_t < 0.7:
            sweep_progress = local_t / 0.7
            sweep_x = cx - 380 + int(sweep_progress * 760)
            safe_rect(draw, sweep_x - 15, cy - 50, sweep_x + 15, cy + 50, fill=(255, 255, 255, int(45 * (1 - sweep_progress))))

        # 4. Hairline gold rule drawing underneath
        rule_progress = min(1.0, max(0.0, (local_t - 0.2) / 0.6))
        rule_max_w = 480
        rule_w = int(rule_max_w * rule_progress)
        rule_y = cy + 62
        if rule_w > 0:
            draw.line([(cx - rule_max_w // 2, rule_y), (cx - rule_max_w // 2 + rule_w, rule_y)], fill=(212, 175, 95, int(min(220, credit_alpha))), width=2)

    return np.array(img.convert("RGB"))

def generate_cinematic_master_audio(duration, sample_rate=44100):
    total_samples = int(duration * sample_rate)
    t = np.linspace(0, duration, total_samples, endpoint=False)
    audio = np.zeros(total_samples, dtype=np.float64)

    # 1. (0:00–0:02): Soft breathing atmosphere + pen-scratch foley + deep 40Hz sub pulse
    mask_s1 = (t >= 0.0) & (t < 2.0)
    ts1 = t[mask_s1]
    # Breathing air
    breath = 0.10 * np.sin(2 * np.pi * 0.5 * ts1) * (np.random.randn(len(ts1)) * 0.15)
    # Pen scratch
    scratch = (np.random.randn(len(ts1)) * 0.20) * (1 + np.sin(2 * np.pi * 15 * ts1)) * np.exp(-ts1 * 0.4)
    # Deep sub-bass pulse at 1.0s
    sub_pulse = 0.5 * np.sin(2 * np.pi * 42 * ts1) * np.exp(-((ts1 - 1.0) ** 2) * 6.0)
    audio[mask_s1] += (breath + scratch + sub_pulse)

    # 2. (0:02–0:04): Low string cello rise + distant metallic resonance
    mask_s2 = (t >= 2.0) & (t < 4.0)
    ts2 = t[mask_s2] - 2.0
    str_freq = 60.0 + (ts2 / 2.0) * 70.0
    cello = (0.28 * np.sin(2 * np.pi * str_freq * ts2) + 0.16 * np.sin(2 * np.pi * str_freq * 2 * ts2)) * (ts2 / 2.0)
    metal = 0.12 * (np.sin(2 * np.pi * 920 * ts2) + np.sin(2 * np.pi * 1380 * ts2)) * np.exp(-ts2 * 1.5)
    audio[mask_s2] += (cello + metal)

    # 3. (0:04–0:06): 3 rapid data clicks + BOOM at 5.5s
    for blip_t in [4.2, 4.6, 5.0]:
        b_idx = int(blip_t * sample_rate)
        b_len = int(0.03 * sample_rate)
        tb = np.linspace(0, 0.03, b_len)
        audio[b_idx:b_idx + b_len] += 0.35 * np.sin(2 * np.pi * 1900 * tb) * np.exp(-tb * 140)
    # Boom at 5.5s
    b_idx = int(5.5 * sample_rate)
    b_len = int(1.2 * sample_rate)
    tb = np.linspace(0, 1.2, b_len)
    audio[b_idx:b_idx + b_len] += 0.85 * np.sin(2 * np.pi * 50 * tb) * np.exp(-tb * 2.8)

    # 4. (0:06–0:08): Heavy percussion: BOOM at 6.0s, BOOM at 7.0s
    for kick_t in [6.0, 7.0]:
        k_idx = int(kick_t * sample_rate)
        k_len = int(1.2 * sample_rate)
        tk = np.linspace(0, 1.2, k_len)
        kick = 0.9 * np.sin(2 * np.pi * (60.0 * np.exp(-tk * 3.5)) * tk) * np.exp(-tk * 2.4)
        audio[k_idx:k_idx + k_len] += np.tanh(kick * 2.4) * 0.85

    # 5. (0:08–0:10): Escalating impacts at 8.0s, 8.8s, 9.6s
    for imp_t in [8.0, 8.8, 9.6]:
        i_idx = int(imp_t * sample_rate)
        i_len = int(0.9 * sample_rate)
        ti = np.linspace(0, 0.9, i_len)
        impact = 0.88 * np.sin(2 * np.pi * 70 * ti) * np.exp(-ti * 3.5)
        audio[i_idx:i_idx + i_len] += np.tanh(impact * 2.5) * 0.85

    # 6. (0:10–0:12): Scanning tone + huge cinematic riser sweep
    mask_rise = (t >= 10.0) & (t < 12.0)
    tr = t[mask_rise] - 10.0
    riser_freq = 90.0 * (24.0 ** (tr / 2.0))
    riser = 0.40 * np.sin(2 * np.pi * riser_freq * tr) * (tr / 2.0)
    scan_tone = 0.18 * np.sin(2 * np.pi * 2400 * tr) * (1 + np.sin(2 * np.pi * 16 * tr))
    audio[mask_rise] += (riser + scan_tone)

    # 7. (0:12–0:15): Massive escalating orchestral hits at 12.0s, 12.8s, 13.6s, 14.4s -> CUT AT 14.8s
    for stab_t in [12.0, 12.8, 13.6, 14.4]:
        s_idx = int(stab_t * sample_rate)
        s_len = int(0.5 * sample_rate)
        ts = np.linspace(0, 0.5, s_len)
        stab = 0.85 * np.sin(2 * np.pi * 55 * ts) * np.exp(-ts * 6.0)
        audio[s_idx:s_idx + s_len] += np.tanh(stab * 2.2) * 0.8

    # 8. (0:15–0:16.5): TOTAL SILENCE (1.5 seconds)
    # audio in [15.0, 16.5] is strictly 0.0

    # 9. (0:16.5–0:19.5): BOOOOOOM! Deep sub-drop + brass horn braam + choir harmonic
    slam_idx = int(16.7 * sample_rate)
    slam_len = int(4.5 * sample_rate)
    tslam = np.linspace(0, 4.5, slam_len)
    sub_boom = 0.95 * np.sin(2 * np.pi * (34.0 * np.exp(-tslam * 0.5)) * tslam) * np.exp(-tslam * 0.65)
    horn = 0.60 * (np.sin(2 * np.pi * 55 * tslam) + 0.38 * np.sin(2 * np.pi * 110 * tslam) + 0.22 * np.sin(2 * np.pi * 165 * tslam)) * np.exp(-tslam * 0.9)
    choir = 0.25 * (np.sin(2 * np.pi * 220 * tslam) + np.sin(2 * np.pi * 330 * tslam)) * np.exp(-tslam * 1.2)
    braam = np.tanh((sub_boom + horn + choir) * 2.2) * 0.95
    audio[slam_idx:slam_idx + slam_len] += braam

    # 10. (0:19.5–0:21.5): Sustained low note + subtle heartbeat
    mask_p = (t >= 19.5) & (t < 21.5)
    tp = t[mask_p] - 19.5
    low_note = 0.24 * np.sin(2 * np.pi * 55 * tp) * np.exp(-tp * 0.3)
    # Heartbeat at 20.2s and 21.2s
    for hb_t in [20.2, 21.2]:
        hb_idx = int(hb_t * sample_rate)
        hb_len = int(0.12 * sample_rate)
        thb = np.linspace(0, 0.12, hb_len)
        audio[hb_idx:hb_idx + hb_len] += 0.3 * np.sin(2 * np.pi * 45 * thb) * np.exp(-thb * 25.0)
    audio[mask_p] += low_note

    # 11. (0:21.5–0:22.0): Single droplet TAP at 21.8s
    tap_idx = int(21.8 * sample_rate)
    tap_len = int(0.04 * sample_rate)
    ttap = np.linspace(0, 0.04, tap_len)
    audio[tap_idx:tap_idx + tap_len] += 0.35 * np.sin(2 * np.pi * 950 * ttap) * np.exp(-ttap * 180)

    # 12. (0:22.0–0:24.0): Silence & soft drone tail fading out
    mask_c = (t >= 22.0) & (t < 24.0)
    tc = t[mask_c] - 22.0
    audio[mask_c] += 0.14 * np.sin(2 * np.pi * 50 * tc) * np.exp(-tc * 1.0)

    # Normalize cleanly
    audio = np.clip(audio, -0.98, 0.98)
    audio_int16 = (audio * 32767).astype(np.int16)
    stereo = np.column_stack((audio_int16, audio_int16))
    return stereo, sample_rate

def main():
    print(f"Rendering MindMatters Master 24s Reveal ({TOTAL_FRAMES} frames @ {FPS} fps, 1080p)...")
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    
    temp_video = "temp_master_vid.mp4"
    temp_audio = "temp_master_aud.wav"
    output_video = "mindmatters_cinematic_reveal_24s.mp4"
    
    # 1. Synthesize audio
    stereo_pcm, srate = generate_cinematic_master_audio(DURATION_SEC)
    with wave.open(temp_audio, 'wb') as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(srate)
        wav.writeframes(stereo_pcm.tobytes())
    print("Soundtrack & SFX mix synthesized.")

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
    targets = [
        "backend/static/mindmatters_cinematic_reveal_24s.mp4",
        "backend/static/mindmatters_trailer_24s.mp4",
        "backend/static/mindmatters_toxic_trailer.mp4",
        "mindmatters_trailer_24s.mp4",
        "mindmatters_toxic_trailer.mp4",
        r"C:\Users\adity\.gemini\antigravity\brain\93e354ed-6dce-4b95-886a-41e980fdcfc9\mindmatters_cinematic_reveal_24s.mp4",
        r"C:\Users\adity\.gemini\antigravity\brain\93e354ed-6dce-4b95-886a-41e980fdcfc9\mindmatters_trailer_24s.mp4",
        r"C:\Users\adity\.gemini\antigravity\brain\93e354ed-6dce-4b95-886a-41e980fdcfc9\mindmatters_toxic_trailer.mp4",
    ]
    for tg in targets:
        try:
            shutil.copy(output_video, tg)
        except Exception as e:
            print(f"Copy to {tg} failed: {e}")

    # Cleanup temp files
    if os.path.exists(temp_video): os.remove(temp_video)
    if os.path.exists(temp_audio): os.remove(temp_audio)

if __name__ == "__main__":
    main()
