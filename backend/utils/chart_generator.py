# -*- coding: utf-8 -*-
import io
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
from typing import Dict, Any, Optional

def generate_radar_chart(
    stress: int = 45,
    focus: int = 75,
    confidence: int = 80,
    emotional_stability: int = 70,
    consistency: int = 68
) -> bytes:
    categories = ['Stress Control', 'Focus & Cadence', 'Confidence', 'Emotional Stability', 'Consistency']
    values = [100 - stress, focus, confidence, emotional_stability, consistency]
    num_vars = len(categories)

    angles = np.linspace(0, 2 * np.pi, num_vars, endpoint=False).tolist()
    values += values[:1]
    angles += angles[:1]

    fig, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True), facecolor='#0f172a')
    ax.set_facecolor('#0f172a')

    plt.xticks(angles[:-1], categories, color='#94a3b8', size=11, weight='bold')

    ax.set_rlabel_position(0)
    plt.yticks([20, 40, 60, 80, 100], ["20", "40", "60", "80", "100"], color="#64748b", size=8)
    plt.ylim(0, 100)
    ax.grid(color='#334155', linestyle='--', linewidth=0.8)

    ax.plot(angles, values, color='#14b8a6', linewidth=2.5, linestyle='solid')
    ax.fill(angles, values, color='#0ea5e9', alpha=0.35)
    ax.scatter(angles, values, color='#38bdf8', s=50, zorder=10)

    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format='png', dpi=200, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close(fig)
    buf.seek(0)
    return buf.getvalue()

def generate_typing_graph(avg_dwell: float = 78.4, avg_flight: float = 112.3, wpm: float = 45.0) -> bytes:
    fig, ax = plt.subplots(figsize=(7, 3), facecolor='#0f172a')
    ax.set_facecolor('#1e293b')

    np.random.seed(42)
    x = np.arange(1, 21)
    dwell_series = np.clip(avg_dwell + np.random.normal(0, 8, 20), 40, 180)
    flight_series = np.clip(avg_flight + np.random.normal(0, 15, 20), 50, 300)

    ax.plot(x, dwell_series, color='#38bdf8', label=f'Dwell Time (~{avg_dwell:.1f}ms)', marker='o', linewidth=2)
    ax.plot(x, flight_series, color='#a855f7', label=f'Flight Interval (~{avg_flight:.1f}ms)', marker='s', linewidth=2)

    ax.set_title(f'Keystroke Dynamics & Cadence ({wpm:.0f} WPM)', color='#f8fafc', fontsize=12, pad=10, weight='bold')
    ax.set_xlabel('Keystroke Sequence', color='#94a3b8', fontsize=9)
    ax.set_ylabel('Latency (ms)', color='#94a3b8', fontsize=9)
    ax.tick_params(colors='#94a3b8')
    ax.grid(color='#334155', linestyle=':', alpha=0.6)
    ax.legend(facecolor='#0f172a', edgecolor='#475569', labelcolor='#e2e8f0', fontsize=8)

    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format='png', dpi=200, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close(fig)
    buf.seek(0)
    return buf.getvalue()

def generate_pattern_bar_chart(formation: int = 72, consistency: int = 65, confidence: int = 78) -> bytes:
    fig, ax = plt.subplots(figsize=(7, 2.5), facecolor='#0f172a')
    ax.set_facecolor('#1e293b')

    labels = ['Handwriting Formation', 'Signature Consistency', 'Confidence Index']
    values = [formation, consistency, confidence]
    colors = ['#14b8a6', '#6366f1', '#38bdf8']

    bars = ax.barh(labels, values, color=colors, height=0.5, edgecolor='#334155')
    ax.set_xlim(0, 100)
    ax.tick_params(colors='#94a3b8')
    ax.set_title('Graphological Pattern Breakdown', color='#f8fafc', fontsize=12, pad=10, weight='bold')
    ax.grid(axis='x', color='#334155', linestyle=':', alpha=0.6)

    for bar in bars:
        w = bar.get_width()
        ax.text(w + 2, bar.get_y() + bar.get_height()/2, f'{int(w)}%', color='#f8fafc', va='center', weight='bold', fontsize=9)

    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format='png', dpi=200, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close(fig)
    buf.seek(0)
    return buf.getvalue()
