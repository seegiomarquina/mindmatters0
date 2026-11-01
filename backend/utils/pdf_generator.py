# -*- coding: utf-8 -*-
import os
import uuid
import html
import datetime
from typing import Dict, Any, Optional
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image as RLImage, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

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

    # 0.5 inch margins (36 pt)
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Precise typographic styles with explicit leading to prevent ANY text collision
    title_style = ParagraphStyle(
        'MainTitle',
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#1B1B2F'),
        alignment=TA_CENTER,
        spaceAfter=3
    )
    subtitle_style = ParagraphStyle(
        'SubTitle',
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#8B5E34'),
        alignment=TA_CENTER,
        spaceAfter=8
    )
    section_title = ParagraphStyle(
        'SecTitle',
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15,
        textColor=colors.HexColor('#1B1B2F'),
        spaceBefore=8,
        spaceAfter=4
    )
    body_style = ParagraphStyle(
        'BodyMain',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor('#262640'),
        alignment=TA_JUSTIFY,
        spaceAfter=4
    )
    meta_label = ParagraphStyle(
        'MetaLabel',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#8B5E34')
    )
    meta_val = ParagraphStyle(
        'MetaVal',
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#1B1B2F')
    )
    rec_bullet = ParagraphStyle(
        'RecBullet',
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor('#262640'),
        leftIndent=10,
        spaceAfter=3
    )

    story = []

    # Sanitize user inputs against XML/HTML injection in ReportLab Paragraphs
    safe_user_name = html.escape(str(user_name or "Anonymous"))
    safe_report_id = html.escape(str(report_id))

    # 1. Top Header Banner
    story.append(Paragraph("MindMatters AI", title_style))
    story.append(Paragraph(f"Multimodal Cognitive &amp; Graphological Dossier &bull; Record ID: <b>{safe_report_id}</b>", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#C9A24B'), spaceAfter=8, spaceBefore=0))

    # Extract metrics safely
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
    raw_pattern = handwriting_data.get('dominant_pattern', 'Fluid & Adaptable') if handwriting_data else 'Equilibrium & Cadence'
    safe_pattern = html.escape(str(raw_pattern))

    # Score color & status
    if mind_score >= 75:
        score_color = '#065F46'
        score_status = "Optimal / High Executive Equilibrium"
        status_bg = '#D1FAE5'
    elif mind_score >= 50:
        score_color = '#8B5E34'
        score_status = "Balanced / Moderate Cognitive Load"
        status_bg = '#FEF3C7'
    else:
        score_color = '#A13D3D'
        score_status = "Elevated Cognitive Strain / Fatigue"
        status_bg = '#FEE2E2'

    safe_score_status = html.escape(score_status)

    # 2. Subject Metadata & Score Summary Table
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    
    col1_content = [
        Paragraph(f"<b>Subject Name:</b> {safe_user_name}", meta_val),
        Paragraph(f"<b>Assessment Mode:</b> Multimodal Sensor Fusion (CV + Cadence + Graphology)", meta_val),
        Paragraph(f"<b>Timestamp:</b> {now_str} &bull; Engine: v2.1 Academic Research Edition", meta_val),
        Paragraph(f"<b>Dominant Morphology:</b> <font color='#8B5E34'><b>{safe_pattern}</b></font>", meta_val),
    ]

    col2_content = [
        Paragraph(f"<font size=24 color='{score_color}'><b>{mind_score}</b></font><font size=12 color='#8B5E34'>/100</font>", ParagraphStyle('Sc1', alignment=TA_CENTER, leading=26)),
        Paragraph(f"<font size=8 color='{score_color}'><b>{safe_score_status}</b></font>", ParagraphStyle('Sc2', alignment=TA_CENTER, leading=10))
    ]

    meta_table_data = [
        [col1_content, col2_content]
    ]

    meta_table = Table(meta_table_data, colWidths=[380, 160])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), colors.HexColor('#F4ECDD')),
        ('BACKGROUND', (1, 0), (1, 0), colors.HexColor(status_bg)),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#1B1B2F')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#C9A24B')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 6))

    # 3. Experimental Grapho-Kinetic Analysis Synthesis Paragraph
    safe_pressure = html.escape(str(sig_traits.get('pressure_level', 'medium')))
    safe_slant = html.escape(str(sig_traits.get('slant', 'right')))
    summary_text = (
        f"<b>Experimental Grapho-Kinetic Analysis (Academic Research Prototype):</b> Based on multi-modal biometric evaluation, <b>{safe_user_name}</b> exhibits an integrated "
        f"Mind Score of <b>{mind_score}/100</b> ({safe_score_status.lower()}). "
        f"Signature analysis displays <b>{safe_pressure}</b> optical stroke-thickness proxy with a "
        f"<b>{safe_slant}</b> slant vector, projecting an estimated motor fluidity index of <b>{confidence_val}%</b>. "
        f"Keystroke telemetry demonstrates a typing speed of <b>{wpm_val} WPM</b> with average dwell latency of "
        f"<b>{avg_dwell_val}ms</b> and focus rating of <b>{focus_val}%</b>. "
        f"Handwriting morphology shows a dominant classification of <b>'{safe_pattern}'</b> with "
        f"<b>{formation_val}%</b> formation consistency."
    )
    story.append(Paragraph(summary_text, body_style))
    story.append(Spacer(1, 4))

    # 4. Generate Visual Metric Charts
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

    # Charts Table Layout: Left radar (2.4 in), Right 2 graphs stacked (4.8 in)
    chart_data = [
        [
            RLImage(radar_img_path, width=2.4*inch, height=2.4*inch),
            [
                RLImage(typing_img_path, width=4.8*inch, height=1.15*inch),
                Spacer(1, 4),
                RLImage(pattern_img_path, width=4.8*inch, height=1.15*inch)
            ]
        ]
    ]
    chart_table = Table(chart_data, colWidths=[2.5*inch, 5.0*inch])
    chart_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(chart_table)
    story.append(Spacer(1, 4))

    # 5. Tailored Cognitive & Wellness Recommendations
    story.append(Paragraph("Tailored Cognitive &amp; Behavioral Recommendations", section_title))
    
    rec_1 = "&bull; <b>Pacing &amp; Micro-Breaks:</b> Maintain your rhythm during deep typing intervals by taking 60-second eye-relaxation breaks every 25 minutes."
    rec_2 = "&bull; <b>Motor Precision:</b> Your signature and handwriting consistency indicates high attentiveness. Retain fluid stroke control for balanced motor stamina."
    rec_3 = "&bull; <b>Cadence Modulation:</b> Incorporate 4-7-8 breathing cycles prior to intensive typing sessions to reduce flight time variance."
    
    story.append(Paragraph(rec_1, rec_bullet))
    story.append(Paragraph(rec_2, rec_bullet))
    story.append(Paragraph(rec_3, rec_bullet))
    story.append(Spacer(1, 6))

    # 6. Academic Research & Confidentiality Footer
    footer_text = "<font size=7 color='#8B5E34'>MindMatters AI &bull; Academic Research Prototype &bull; For Educational &amp; Research Evaluation Only &bull; Not a Clinical/Medical Diagnostic Instrument &bull; Confidential</font>"
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#C9A24B'), spaceAfter=4, spaceBefore=2))
    story.append(Paragraph(footer_text, ParagraphStyle('FooterStyle', alignment=TA_CENTER, leading=9)))

    doc.build(story)

    # Cleanup temporary image files
    for p in [radar_img_path, typing_img_path, pattern_img_path]:
        try:
            if os.path.exists(p):
                os.remove(p)
        except Exception:
            pass

    return pdf_path
