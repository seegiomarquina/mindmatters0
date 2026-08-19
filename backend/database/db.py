import json
import sqlite3
import os
from datetime import datetime
from typing import Optional, Dict, Any

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'mindmatters.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS reports (
            id TEXT PRIMARY KEY,
            user_name TEXT,
            mind_score INTEGER,
            traits_json TEXT,
            pdf_path TEXT,
            created_at TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

def save_report(report_id: str, user_name: str, mind_score: int, traits: Dict[str, Any], pdf_path: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT OR REPLACE INTO reports (id, user_name, mind_score, traits_json, pdf_path, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (report_id, user_name, mind_score, json.dumps(traits), pdf_path, datetime.utcnow().isoformat()))
    conn.commit()
    conn.close()

def get_report(report_id: str) -> Optional[Dict[str, Any]]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, user_name, mind_score, traits_json, pdf_path, created_at FROM reports WHERE id = ?", (report_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    return {
        "id": row[0],
        "user_name": row[1],
        "mind_score": row[2],
        "traits": json.loads(row[3]) if row[3] else {},
        "pdf_path": row[4],
        "created_at": row[5]
    }

init_db()
