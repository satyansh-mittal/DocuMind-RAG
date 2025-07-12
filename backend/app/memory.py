from collections import defaultdict
from datetime import datetime
import json

_history = defaultdict(list)
_document_summaries = defaultdict(dict)

def append_message(session_id: str, role: str, message: str):
    timestamp = datetime.now().isoformat()
    _history[session_id].append({
        'role': role, 
        'message': message, 
        'timestamp': timestamp
    })
    
def get_history(session_id: str):
    history_data = _history[session_id]
    return [(item['role'], item['message']) for item in history_data]

def get_full_history(session_id: str):
    return _history[session_id]

def store_document_summary(session_id: str, filename: str, summary: str):
    _document_summaries[session_id][filename] = {
        'summary': summary,
        'timestamp': datetime.now().isoformat()
    }

def get_document_summaries(session_id: str):
    return _document_summaries[session_id]

def clear_session(session_id: str):
    """Clear session data"""
    if session_id in _history:
        del _history[session_id]
    if session_id in _document_summaries:
        del _document_summaries[session_id]

def clear_all_sessions():
    """Clear all session data"""
    _history.clear()
    _document_summaries.clear()