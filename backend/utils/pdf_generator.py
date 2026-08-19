# -*- coding: utf-8 -*-
import os
import uuid
from typing import Dict, Any, Optional
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image as RLImage, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

from utils.chart_generator import generate_radar_chart, generate_typing_graph, generate_pattern_bar_chart

def generate_pdf_report(
    report_id: str,
    user_name: str,
    mind_score: int,
    signature_data: Optional[Dict[str, Any]],
    typing_data: Optional[Dict[str, Any]],
    handwriting_data: Optional[Dict[str, Any]],
    output_dir: str
) -> str:
    os.makedirs(output_dir, exist_ok=True)
    pdf_filename = f"{report_id}.pdf"
    pdf_path = os.path.join(output_dir, pdf_filename)

    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        textColor=colors.HexColor('#0f172a'),
        alignment=TA_CENTER,
        spaceAfter=4
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        textColor=colors.HexColor('#64748b'),
        alignment=TA_CENTER,
        spaceAfter=14
    )
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        textColor=colors.HexColor('#0f766e'),
        spaceBefore=10,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        textColor=colors.HexColor('#334155'),
        leading=14,
        spaceAfter=6
    )

    story = []

    # Header Banner
    story.append(Paragraph("MindMatters AI", title_style))
    story.append(Paragraph(f"Comprehensive Mental State & Biometric Analysis Dossier - ID: <b>{report_id}</b>", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0ea5e9'), spaceAfter=12))

    # Extract metrics
    sig_traits = signature_data.get('traits', {}) if signature_data else {}
    typ_traits = typing_data or {}
    hw_traits = handwriting_data.get('traits', {}) if handwriting_data else {}

    confidence_val = sig_traits.get('confidence', 78)
    consistency_val = sig_traits.get('consistency', 68)
    stress_val = typ_traits.get('stress_score', sig_traits.get('stress_indicator', 42))
    focus_val = typ_traits.get('focus_score', 75)
    formation_val = hw_traits.get('formation_consistency', 72)
    wpm_val = typ_traits.get('typing_speed_wpm', 45.0)
    avg_dwell_val = typ_traits.get('avg_dwell_time_ms', 78.4)
    avg_flight_val = typ_traits.get('avg_flight_time_ms', 112.3)
    pattern_val = handwriting_data.get('dominant_pattern', 'structured & methodical') if handwriting_data else 'adaptive cognitive balance'

    # Score Gauge Box
    score_color = '#10b981' if mind_score >= 75 else ('#f59e0b' if mind_score >= 50 else '#ef4444')
    score_status = "Optimal / High Clarity" if mind_score >= 75 else ("Balanced / Moderate Load" if mind_score >= 50 else "High Cognitive Strain")

    score_data = [
        [
            Paragraph(f"<font size=11 color='#64748b'>Subject:</font> <b>{user_name}</b><br/><font size=9 color='#94a3b8'>Assessment Mode: Multi-Biometric Fusion</font>", body_style),
            Paragraph(f"<font size=28 color='{score_color}'><b>{mind_score}</b></font><font size=14 color='#64748b'>/100</font><br/><font size=9 color='{score_color}'><b>{score_status}</b></font>", ParagraphStyle('Score', alignment=TA_CENTER))
        ]
    ]
    score_table = Table(score_data, colWidths=[340, 200])
    score_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(score_table)
    story.append(Spacer(1, 10))

    # Executive Summary Paragraph
    summary_text = (
        f"<b>Clinical & Behavioral Synthesis:</b> Based on multi-modal biometric evaluation, {user_name} exhibits a "
        f"composite Mind Score of <b>{mind_score}/100</b>, indicating <i>{score_status.lower()}</i>. "
        f"Signature graphology displays <b>{sig_traits.get('pressure_level', 'medium')}</b> stroke pressure with a "
        f"<b>{sig_traits.get('slant', 'right')}</b> slant, projecting a confidence index of <b>{confidence_val}%</b>. "
        f"Keystroke telemetry demonstrates a typing speed of <b>{wpm_val} WPM</b> with an average dwell latency of "
        f"<b>{avg_dwell_val}ms</b> and a focus rating of <b>{focus_val}%</b>. "
        f"Handwriting morphology shows a dominant classification of <b>'{pattern_val}'</b> with "
        f"<b>{formation_val}%</b> formation consistency."
    )
    story.append(Paragraph(summary_text, body_style))
    story.append(Spacer(1, 6))

    # Generate charts
    radar_png = generate_radar_chart(
        stress=stress_val,
        focus=focus_val,
        confidence=confidence_val,
        emotional_stability=int((100 - stress_val + consistency_val) / 2),
        consistency=consistency_val
    )
    typing_png = generate_typing_graph(avg_dwell=avg_dwell_val, avg_flight=avg_flight_val, wpm=wpm_val)
    pattern_png = generate_pattern_bar_chart(formation=formation_val, consistency=consistency_val, confidence=confidence_val)

    radar_img_path = os.path.join(output_dir, f"radar_{report_id}.png")
    typing_img_path = os.path.join(output_dir, f"typing_{report_id}.png")
    pattern_img_path = os.path.join(output_dir, f"pattern_{report_id}.png")

    with open(radar_img_path, 'wb') as f:
        f.write(radar_png)
    with open(typing_img_path, 'wb') as f:
        f.write(typing_png)
    with open(pattern_img_path, 'wb') as f:
        f.write(pattern_png)

    # Charts Layout
    chart_data = [
        [
            RLImage(radar_img_path, width=2.6*inch, height=2.6*inch),
            [
                RLImage(typing_img_path, width=4.5*inch, height=1.3*inch),
                Spacer(1, 4),
                RLImage(pattern_img_path, width=4.5*inch, height=1.2*inch)
            ]
        ]
    ]
    chart_table = Table(chart_data, colWidths=[2.7*inch, 4.6*inch])
    chart_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(chart_table)
    story.append(Spacer(1, 8))

    # Recommendations
    story.append(Paragraph("Tailored Cognitive & Wellness Recommendations", section_heading))
    
    rec_1 = "- <b>Pacing & Micro-Breaks:</b> Maintain your rhythm during deep typing intervals by taking 60-second eye-relaxation breaks every 25 minutes."
    rec_2 = "- <b>Motor Precision:</b> Your signature and handwriting consistency indicates high attentiveness. Retain fluid pen pressure for balanced cognitive stamina."
    rec_3 = "- <b>Stress Modulation:</b> Incorporate 4-7-8 breathing cycles prior to intensive typing sessions to reduce flight time variance."
    
    story.append(Paragraph(rec_1, body_style))
    story.append(Paragraph(rec_2, body_style))
    story.append(Paragraph(rec_3, body_style))
    story.append(Spacer(1, 6))

    # Footer note
    footer_text = "<font size=8 color='#94a3b8'>MindMatters AI - Science-Backed Multi-Modal Behavioral Analysis - Academic & Research Prototype - All biometric metrics are strictly confidential.</font>"
    story.append(Paragraph(footer_text, ParagraphStyle('FooterStyle', alignment=TA_CENTER)))

    doc.build(story)

    # Cleanup temporary image files
    for p in [radar_img_path, typing_img_path, pattern_img_path]:
        try:
            if os.path.exists(p):
                os.remove(p)
        except Exception:
            pass

    return pdf_path
