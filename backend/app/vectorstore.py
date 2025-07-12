import os
import shutil
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import CharacterTextSplitter

STORE_DIR = "faiss_store"

def get_vectorstore():
    embeddings = get_embeddings()
    
    if os.path.exists(STORE_DIR):
        try:
            return FAISS.load_local(STORE_DIR, embeddings, allow_dangerous_deserialization=True)
        except Exception as e:
            print(f"Error loading existing vectorstore: {e}")
            # If loading fails, clear and create new
            clear_vectorstore()
            return None
    else:
        return None

def save_vectorstore(vs):
    vs.save_local(STORE_DIR)

def clear_vectorstore():
    """Clear the vector store by deleting the store directory"""
    if os.path.exists(STORE_DIR):
        shutil.rmtree(STORE_DIR)
    return True

def add_documents_with_metadata(vs, documents):
    """Add documents with enhanced metadata"""
    vs.add_documents(documents)
    return vs

def get_embeddings():
    """Get the embeddings model"""
    return HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-mpnet-base-v2",
        model_kwargs={'device': 'cpu'},
        encode_kwargs={'normalize_embeddings': True} 
    )

def create_vectorstore_from_documents(documents):
    """Create a new vectorstore from documents"""
    embeddings = get_embeddings()
    return FAISS.from_documents(documents, embeddings)