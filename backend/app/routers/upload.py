import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from tempfile import NamedTemporaryFile
from langchain_community.vectorstores import FAISS

from app.vectorstore import get_vectorstore, save_vectorstore, create_vectorstore_from_documents
from app.utils import load_and_split

router = APIRouter()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDFs allowed")
    
    # save to a temp file
    with NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name 
    
    #load and split
    docs = load_and_split(tmp_path)
    os.remove(tmp_path)
    
    # create vector store and embeddings
    vs = get_vectorstore()
    
    if vs is None:
        # Create new vectorstore with the first documents
        vs = create_vectorstore_from_documents(docs)
    else:
        # Add to existing vectorstore
        vs.add_documents(docs)
    
    save_vectorstore(vs)
    
    return {"message": "Indexed PDF", "chunks": len(docs)}