# -*- coding: utf-8 -*-
"""
MindMatters AI - Official 7.8-Second Cinematic Teaser Cut
Rendered in 1080p 60fps with motion graphics, laser vector heatmaps,
glitch transitions, neural mesh emblem, and synthesized cinematic sound design.
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
FPS = 60
DURATION_SEC = 7.8
TOTAL_FRAMES = int(FPS * DURATION_SEC)

POSTER_PATH = "C:/Users/adity/.gemini/antigravity/brain/93e354ed-6dce-4b95-886a-41e980fdcfc9/.user_uploaded/media_1787639207430.png"

# Color Definitions
COLOR_BG_DEEP = (7, 10, 15)          # Obsidian / Navy Deep #070A0F
COLOR_GOLD = (212, 175, 95)          # Champagne Gold #D4AF5F
COLOR_GOLD_BRIGHT = (248, 224, 158)  # Glowing Gold #F8E09E
COLOR_CYAN = (14, 165, 233)          # Cyan Telemetry #0EA5E9
COLOR_CYAN_GLOW = (56, 189, 248)
COLOR_RED_LASER = (239, 68, 68)      # Laser Scan #EF4444
COLOR_WHITE = (255, 255, 255)
COLOR_MUTED_GOLD = (168, 140, 84)

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

FONT_TITLE_HERO = get_font(88, bold=True, serif=True)
FONT_TITLE_SUB = get_font(32, bold=False, serif=True)
FONT_CREDIT_TITLE = get_font(76, bold=True, serif=True)
FONT_CREDIT_SUB = get_font(26, bold=False, serif=True)
FONT_CREDIT_NAMES = get_font(40, bold=True, serif=True)
FONT_UPPER_HOOK = get_font(42, bold=True, serif=True)
FONT_HUD_LABEL = get_font(20, bold=True, serif=False)
FONT_HUD_VAL = get_font(26, bold=True, serif=False)
FONT_REVEAL = get_font(30, bold=True, serif=True)

# Load poster emblem if available
poster_crop = None
if os.path.exists(POSTER_PATH):
    try:
        p_raw = Image.open(POSTER_PATH).convert("RGBA")
        # Crop the central neural mesh graphic (around 25% to 80% height)
        pw, ph = p_raw.size
        poster_crop = p_raw.crop((int(pw * 0.05), int(ph * 0.22), int(pw * 0.95), int(ph * 0.82)))
    except Exception as e:
        print("Poster load notice:", e)

def safe_rect(draw, x0, y0, x1, y1, fill=None, outline=None, width=1):
    rx0, rx1 = min(x0, x1), max(x0, x1)
    ry0, ry1 = min(y0, y1), max(y0, y1)
    draw.rectangle([rx0, ry0, rx1, ry1], fill=fill, outline=outline, width=width)

def draw_hud_bracket(draw, x, y, w, h, color=COLOR_CYAN, size=16):
    # Corner brackets
    draw.line([(x, y + size), (x, y), (x + size, y)], fill=color, width=2)
    draw.line([(x + w - size, y), (x + w, y), (x + w, y + size)], fill=color, width=2)
    draw.line([(x, y + h - size), (x, y + h), (x + size, y + h)], fill=color, width=2)
    draw.line([(x + w - size, y + h), (x + w, y + h), (x + w, y + h - size)], fill=color, width=2)

def render_frame(frame_idx):
    t = frame_idx / FPS
    img = Image.new("RGBA", (WIDTH, HEIGHT), COLOR_BG_DEEP)
    draw = ImageDraw.Draw(img)

    # Ambient subtle background grid lines
    grid_alpha = 15
    for gy in range(0, HEIGHT, 60):
        draw.line([(0, gy), (WIDTH, gy)], fill=(14, 165, 233, grid_alpha), width=1)
    for gx in range(0, WIDTH, 60):
        draw.line([(gx, 0), (gx, HEIGHT)], fill=(14, 165, 233, grid_alpha), width=1)

    # ------------------------------------------------------------
    # SHOT 1: 0.0s – 1.8s (Macro Keystroke Velocity & Telemetry)
    # ------------------------------------------------------------
    if t < 1.8:
        local_t = t / 1.8
        
        # Upper Center Text: "EVERY STROKE REVEALS..."
        text_alpha = int(min(255, local_t * 5 * 255))
        draw.text((WIDTH // 2, 130), "EVERY STROKE REVEALS...", fill=COLOR_GOLD_BRIGHT, font=FONT_UPPER_HOOK, anchor="mm")
        
        # Central Cybernetic Keystroke HUD
        hud_cx, hud_cy = WIDTH // 2, HEIGHT // 2 + 30
        
        # High-speed mechanical switch visualization
        key_press_phase = (t * 8.0) % 1.0
        press_offset = int(math.sin(key_press_phase * math.pi) * 18)
        
        # Mechanical Keycap Frame
        kw, kh = 220, 160
        kx = hud_cx - kw // 2
        ky = hud_cy - kh // 2 + press_offset
        
        draw_hud_bracket(draw, kx - 30, ky - 30, kw + 60, kh + 60, color=COLOR_CYAN, size=24)
        safe_rect(draw, kx, ky, kx + kw, ky + kh, fill=(18, 26, 38, 220), outline=COLOR_CYAN_GLOW, width=3)
        draw.text((hud_cx, ky + 45), "[ KEY_PRESS ]", fill=COLOR_CYAN, font=FONT_HUD_LABEL, anchor="mm")
        
        dwell_live = 38.4 + math.sin(t * 30) * 4.2
        draw.text((hud_cx, ky + 95), f"{dwell_live:.1f} ms", fill=COLOR_WHITE, font=FONT_HUD_VAL, anchor="mm")

        # Telemetry Dials Left & Right
        # Left HUD: Velocity & Cadence
        left_x, left_y = 260, hud_cy - 120
        draw_hud_bracket(draw, left_x, left_y, 340, 240, color=COLOR_CYAN, size=20)
        draw.text((left_x + 20, left_y + 35), "KEYSTROKE VELOCITY", fill=COLOR_MUTED_GOLD, font=FONT_HUD_LABEL)
        cpm_val = int(580 + math.sin(t * 24) * 45)
        draw.text((left_x + 20, left_y + 75), f"{cpm_val} CPM", fill=COLOR_GOLD_BRIGHT, font=FONT_HUD_VAL)
        
        draw.text((left_x + 20, left_y + 130), "DWELL ENTROPY", fill=COLOR_MUTED_GOLD, font=FONT_HUD_LABEL)
        draw.text((left_x + 20, left_y + 170), "0.924 [STABLE]", fill=COLOR_CYAN_GLOW, font=FONT_HUD_VAL)

        # Right HUD: Neuro-Motor Trace
        right_x, right_y = WIDTH - 600, hud_cy - 120
        draw_hud_bracket(draw, right_x, right_y, 340, 240, color=COLOR_CYAN, size=20)
        draw.text((right_x + 20, right_y + 35), "NEURO-MOTOR CADENCE", fill=COLOR_MUTED_GOLD, font=FONT_HUD_LABEL)
        draw.text((right_x + 20, right_y + 75), "SYNCHRONIZED", fill=(34, 197, 94), font=FONT_HUD_VAL)
        
        draw.text((right_x + 20, right_y + 130), "LATENT COGNITIVE LOAD", fill=COLOR_MUTED_GOLD, font=FONT_HUD_LABEL)
        draw.text((right_x + 20, right_y + 170), "OPTIMAL (19%)", fill=COLOR_GOLD_BRIGHT, font=FONT_HUD_VAL)

        # High-speed particle streams across screen
        for p in range(25):
            px = int((p * 97 + t * 900) % WIDTH)
            py = int((p * 61 + math.sin(t * 10 + p) * 80) % HEIGHT)
            draw.ellipse([px - 2, py - 2, px + 2, py + 2], fill=COLOR_CYAN_GLOW)

    # ------------------------------------------------------------
    # SHOT 2: 1.8s – 3.8s (Graphology Analysis & Laser Vector Heatmap)
    # ------------------------------------------------------------
    elif t < 3.8:
        local_t = (t - 1.8) / 2.0
        
        # Upper Center Text: "...WHAT THE MIND HIDES."
        draw.text((WIDTH // 2, 130), "...WHAT THE MIND HIDES.", fill=COLOR_GOLD_BRIGHT, font=FONT_UPPER_HOOK, anchor="mm")
        
        # Signature Canvas Area
        pad_x, pad_y, pad_w, pad_h = 240, 230, 1440, 680
        safe_rect(draw, pad_x, pad_y, pad_x + pad_w, pad_y + pad_h, fill=(12, 17, 26, 200), outline=COLOR_CYAN, width=2)
        draw_hud_bracket(draw, pad_x, pad_y, pad_w, pad_h, color=COLOR_GOLD, size=32)

        # Dynamic Inking Signature Vector Spline
        pts_count = int(min(600, local_t * 650))
        sig_pts = []
        for i in range(pts_count):
            u = i / 45.0
            sx = pad_x + 160 + i * 1.8 + math.sin(u * 2.8) * 55
            sy = pad_y + 340 + math.sin(u * 1.6) * 120 + math.cos(u * 3.4) * 60
            sig_pts.append((sx, sy))

        if len(sig_pts) > 1:
            # Pressure Heatmap: Color shifts along stroke
            for seg in range(len(sig_pts) - 1):
                p_ratio = (math.sin(seg * 0.08) + 1) / 2.0
                seg_col = (
                    int(COLOR_CYAN[0] * (1 - p_ratio) + COLOR_GOLD_BRIGHT[0] * p_ratio),
                    int(COLOR_CYAN[1] * (1 - p_ratio) + COLOR_GOLD_BRIGHT[1] * p_ratio),
                    int(COLOR_CYAN[2] * (1 - p_ratio) + COLOR_GOLD_BRIGHT[2] * p_ratio),
                )
                draw.line([sig_pts[seg], sig_pts[seg + 1]], fill=seg_col, width=4)
            
            # Active Inking Nib with glow
            lx, ly = sig_pts[-1]
            draw.ellipse([lx - 7, ly - 7, lx + 7, ly + 7], fill=COLOR_GOLD_BRIGHT)
            draw.ellipse([lx - 16, ly - 16, lx + 16, ly + 16], outline=(212, 175, 95, 120), width=2)

        # Vector Bounding Boxes & Slant Angles
        if local_t > 0.3:
            # Word polygon boxes
            safe_rect(draw, pad_x + 220, pad_y + 200, pad_x + 540, pad_y + 490, outline=(14, 165, 233, 140), width=1)
            draw.text((pad_x + 230, pad_y + 210), "LOOP FORMATION [0.88]", fill=COLOR_CYAN, font=FONT_HUD_LABEL)
            
            safe_rect(draw, pad_x + 580, pad_y + 180, pad_x + 980, pad_y + 510, outline=(212, 175, 95, 140), width=1)
            draw.text((pad_x + 590, pad_y + 190), "SLANT VECTOR [+18.4° RIGHT]", fill=COLOR_GOLD, font=FONT_HUD_LABEL)

        # Sweeping Laser Scanner Beam (Top to bottom)
        laser_y = int(pad_y + (local_t * 1.3 % 1.0) * pad_h)
        draw.line([(pad_x, laser_y), (pad_x + pad_w, laser_y)], fill=COLOR_RED_LASER, width=3)
        safe_rect(draw, pad_x, max(pad_y, laser_y - 25), pad_x + pad_w, min(pad_y + pad_h, laser_y + 25), fill=(239, 68, 68, 40))
        draw.text((pad_x + 30, max(pad_y + 10, laser_y - 30)), "LASER CV MORPHOLOGY HEATMAP SCAN", fill=COLOR_RED_LASER, font=FONT_HUD_LABEL)

        # Live Bottom Telemetry Strip
        draw.text((pad_x + 40, pad_y + pad_h - 45), "PRESSURE: 0.82 FIRM  |  BASELINE JITTER: 0.04%  |  MOTOR STABILITY: 94.6%", fill=COLOR_GOLD, font=FONT_HUD_LABEL)

    # ------------------------------------------------------------
    # SHOT 3: 3.8s – 5.5s (High-Impact Title Slam & Emblem)
    # ------------------------------------------------------------
    elif t < 5.5:
        local_t = (t - 3.8) / 1.7
        
        # Glitch / Impact Flash at start of shot (3.8s - 4.0s)
        if local_t < 0.15:
            flash_intensity = int((1 - (local_t / 0.15)) * 180)
            draw.rectangle([0, 0, WIDTH, HEIGHT], fill=(flash_intensity, flash_intensity, flash_intensity, flash_intensity))
        
        # Camera Impact Zoom (starts big, snaps down with easing)
        scale_anim = 1.0 + max(0.0, (1 - min(1.0, local_t * 3.5))) * 0.25
        
        # Circular Shockwave Ring expanding outward
        shock_r = int(local_t * 800)
        draw.ellipse([WIDTH // 2 - shock_r, HEIGHT // 2 - shock_r, WIDTH // 2 + shock_r, HEIGHT // 2 + shock_r], outline=(212, 175, 95, max(0, int((1 - local_t) * 160))), width=3)
        
        # Central Poster Mesh Graphic Overlay
        if poster_crop:
            cw, ch = poster_crop.size
            disp_h = int(520 * scale_anim)
            disp_w = int(cw * (disp_h / ch))
            crop_resized = poster_crop.resize((disp_w, disp_h), Image.Resampling.BILINEAR)
            
            # Composite onto center
            paste_x = (WIDTH - disp_w) // 2
            paste_y = (HEIGHT - disp_h) // 2 + 10
            img.paste(crop_resized, (paste_x, paste_y), crop_resized)

        # Main Title Header: M I N D M A T T E R S
        title_text = "M I N D M A T T E R S"
        title_y = int(HEIGHT * 0.18 + math.sin(local_t * 6) * 3)
        
        # Gold drop shadow / glow
        draw.text((WIDTH // 2 + 2, title_y + 2), title_text, fill=(80, 60, 20), font=FONT_TITLE_HERO, anchor="mm")
        draw.text((WIDTH // 2, title_y), title_text, fill=COLOR_GOLD_BRIGHT, font=FONT_TITLE_HERO, anchor="mm")

        # Subtitle: EVERY STROKE TELLS A STORY
        sub_y = title_y + 70
        draw.text((WIDTH // 2, sub_y), "EVERY STROKE TELLS A STORY", fill=COLOR_GOLD, font=FONT_TITLE_SUB, anchor="mm")

        # Bottom Reveal: REVEALING SOON
        rev_y = int(HEIGHT * 0.88)
        draw.text((WIDTH // 2, rev_y), "REVEALING SOON", fill=COLOR_GOLD, font=FONT_REVEAL, anchor="mm")

    # ------------------------------------------------------------
    # SHOT 4: 5.5s – 7.8s (Final Credit Slate: Aditya ✕ Chris)
    # ------------------------------------------------------------
    else:
        local_t = (t - 5.5) / 2.3
        
        # Slow, elegant cinematic zoom-out (scale from 1.04 down to 1.0)
        zoom = 1.04 - local_t * 0.04
        
        # Dark carbon textured card center
        card_w = int(1400 * zoom)
        card_h = int(720 * zoom)
        card_x = (WIDTH - card_w) // 2
        card_y = (HEIGHT - card_h) // 2
        
        safe_rect(draw, card_x, card_y, card_x + card_w, card_y + card_h, fill=(12, 16, 24, 230), outline=COLOR_GOLD, width=2)
        draw_hud_bracket(draw, card_x, card_y, card_w, card_h, color=COLOR_GOLD, size=36)

        # 1. Main Title
        draw.text((WIDTH // 2, card_y + int(card_h * 0.24)), "M I N D M A T T E R S", fill=COLOR_GOLD_BRIGHT, font=FONT_CREDIT_TITLE, anchor="mm")

        # Gold separator flourish line
        fl_w = int(380 * zoom)
        draw.line([(WIDTH // 2 - fl_w, card_y + int(card_h * 0.38)), (WIDTH // 2 + fl_w, card_y + int(card_h * 0.38))], fill=COLOR_GOLD, width=2)

        # 2. "A PROJECT BY"
        draw.text((WIDTH // 2, card_y + int(card_h * 0.50)), "A   P R O J E C T   B Y", fill=COLOR_MUTED_GOLD, font=FONT_CREDIT_SUB, anchor="mm")

        # 3. "ADITYA ✕ CHRIS"
        draw.text((WIDTH // 2, card_y + int(card_h * 0.66)), "A D I T Y A   ✕   C H R I S", fill=COLOR_GOLD_BRIGHT, font=FONT_CREDIT_NAMES, anchor="mm")

        # 4. Bottom tagline
        draw.text((WIDTH // 2, card_y + int(card_h * 0.82)), "M U L T I M O D A L   B I O M E T R I C   I N T E L L I G E N C E", fill=COLOR_CYAN, font=FONT_HUD_LABEL, anchor="mm")

        # Subtle floating dust/shimmer particles
        for sp in range(20):
            sx = int((sp * 103 + t * 40) % WIDTH)
            sy = int((sp * 73 + math.sin(t * 4 + sp) * 30) % HEIGHT)
            draw.ellipse([sx - 1, sy - 1, sx + 1, sy + 1], fill=(212, 175, 95, 120))

    return np.array(img.convert("RGB"))

def generate_teaser_audio(duration, sample_rate=44100):
    total_samples = int(duration * sample_rate)
    t = np.linspace(0, duration, total_samples, endpoint=False)
    audio = np.zeros(total_samples, dtype=np.float64)

    # 1. SHOT 1 (0.0s - 1.8s): Sub-bass drone + Sharp rhythmic mechanical clicks
    # 55Hz sub drone
    mask_shot1 = (t >= 0.0) & (t < 2.0)
    audio[mask_shot1] += 0.35 * np.sin(2 * np.pi * 55 * t[mask_shot1])
    
    # Mechanical clicks every 0.11s
    for ct in np.arange(0.08, 1.75, 0.11):
        idx = int(ct * sample_rate)
        click_len = int(0.025 * sample_rate)
        if idx + click_len < total_samples:
            tc = np.linspace(0, 0.025, click_len)
            click_wave = (np.sin(2 * np.pi * 3400 * tc) + 0.6 * np.random.randn(click_len)) * np.exp(-tc * 220)
            audio[idx:idx + click_len] += 0.45 * click_wave

    # 2. SHOT 2 (1.8s - 3.8s): Accelerating Shepard Tone Riser + Laser Sweep Hum
    mask_shot2 = (t >= 1.7) & (t < 3.85)
    t_rise = t[mask_shot2] - 1.7
    # Frequency ramps exponentially from 140Hz to 1600Hz
    freq_sweep = 140.0 * (12.0 ** (t_rise / 2.15))
    riser = 0.38 * np.sin(2 * np.pi * freq_sweep * t_rise) * (t_rise / 2.15)
    # Laser harmonic buzz
    laser_buzz = 0.15 * np.sin(2 * np.pi * (freq_sweep * 2.0) * t_rise) * (t_rise / 2.15)
    audio[mask_shot2] += (riser + laser_buzz)

    # 3. SHOT 3 (3.8s - 5.5s): Massive BOOM! Sub-bass drop + Digital Static Snap
    impact_idx = int(3.8 * sample_rate)
    impact_len = int(2.4 * sample_rate)
    if impact_idx + impact_len <= total_samples:
        ti = np.linspace(0, 2.4, impact_len)
        # Deep 45Hz sub bass drop
        sub_drop = 0.85 * np.sin(2 * np.pi * (45.0 * np.exp(-ti * 1.8)) * ti) * np.exp(-ti * 1.2)
        # Metallic clank harmonic
        metal = 0.35 * (np.sin(2 * np.pi * 840 * ti) + np.sin(2 * np.pi * 1260 * ti)) * np.exp(-ti * 12.0)
        # Digital snap burst (first 0.04s)
        snap_len = int(0.04 * sample_rate)
        snap = np.zeros(impact_len)
        snap[:snap_len] = 0.55 * np.random.randn(snap_len) * np.exp(-np.linspace(0, 0.04, snap_len) * 80)
        
        audio[impact_idx:impact_idx + impact_len] += (sub_drop + metal + snap)

    # 4. SHOT 4 (5.5s - 7.8s): Deep Sub-Hum Decay + Crystalline Shimmer
    mask_shot4 = t >= 5.5
    t_end = t[mask_shot4] - 5.5
    sub_hum = 0.28 * np.sin(2 * np.pi * 60 * t_end) * np.exp(-t_end * 0.45)
    shimmer = 0.14 * np.sin(2 * np.pi * 880 * t_end) * np.sin(2 * np.pi * 1.5 * t_end) * np.exp(-t_end * 0.35)
    audio[mask_shot4] += (sub_hum + shimmer)

    # Global fade out in last 0.4s
    fade_out_idx = int((duration - 0.4) * sample_rate)
    fade_len = total_samples - fade_out_idx
    audio[fade_out_idx:] *= np.linspace(1.0, 0.0, fade_len)

    # Normalize to 16-bit PCM
    audio = np.clip(audio, -1.0, 1.0)
    audio_int16 = (audio * 32767).astype(np.int16)
    stereo = np.column_stack((audio_int16, audio_int16))
    return stereo, sample_rate

def main():
    print(f"Rendering MindMatters Official Teaser ({TOTAL_FRAMES} frames @ {FPS} fps, 1080p)...")
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    
    temp_video = "temp_teaser_vid.mp4"
    temp_audio = "temp_teaser_aud.wav"
    output_video = "mindmatters_teaser.mp4"
    
    # 1. Synthesize audio
    stereo_pcm, srate = generate_teaser_audio(DURATION_SEC)
    with wave.open(temp_audio, 'wb') as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(srate)
        wav.writeframes(stereo_pcm.tobytes())
    print("Sound design & SFX mix synthesized.")

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
        if f % 100 == 0:
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
    print(f"Successfully generated official teaser video: {output_video}")

    # Copy to static and artifacts
    import shutil
    shutil.copy(output_video, "backend/static/mindmatters_teaser.mp4")
    shutil.copy(output_video, r"C:\Users\adity\.gemini\antigravity\brain\93e354ed-6dce-4b95-886a-41e980fdcfc9\mindmatters_teaser.mp4")

    # Cleanup temp
    if os.path.exists(temp_video): os.remove(temp_video)
    if os.path.exists(temp_audio): os.remove(temp_audio)

if __name__ == "__main__":
    main()
