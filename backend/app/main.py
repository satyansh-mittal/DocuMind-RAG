import os
from dotenv import load_dotenv
load_dotenv()
os.environ["LANGCHAIN_API_KEY"] = os.getenv("LANGCHAIN_API_KEY")  
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_PROJECT"] = os.getenv("LANGCHAIN_PROJECT")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import upload,chat

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(upload.router, prefix="/api")
app.include_router(chat.router, prefix="/api")

from fastapi import Body
from app.memory import clear_session
from app.vectorstore import clear_vectorstore
import os
import shutil

@app.post("/clear-history")
async def clear_history(session_id: str = Body(..., embed=True)):
    """Clear conversation history for a session"""
    try:
        clear_session(session_id)
        return {"message": "History cleared successfully"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/delete-documents")  
async def delete_documents(session_id: str = Body(..., embed=True)):
    """Delete all documents and clear history"""
    try:
        # Clear conversation history
        clear_session(session_id)
        
        # Clear vector store
        clear_vectorstore()
        
        return {"message": "Documents and history deleted successfully"}
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
async def root():
    return {"message": "RAG Chat Application API"}