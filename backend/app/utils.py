from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema import Document
import re

def clean_text(text):
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\w\s\-.,;:()!?]', ' ', text)
    text = ' '.join(text.split())
    return text.strip()
    
def load_and_split(file_path:str, chunk_size:int=800, chunk_overlap:int=100):
    loader = PyPDFLoader(file_path)
    docs = loader.load()
    
    # clean doc
    enhanced_docs = []
    for i,doc in enumerate(docs):
        cleaned_content = clean_text(doc.page_content)
        doc.metadata.update({
            'page_number': i + 1,
            'total_pages': len(docs),
            'chunk_type': 'page_content',
            'document_name': file_path.split('/')[-1].replace('.pdf', '')
        })
        enhanced_doc = Document(
            page_content=cleaned_content,
            metadata=doc.metadata
        )
        enhanced_docs.append(enhanced_doc)
        
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap, length_function=len, separators=["\n\n", "\n", ". ", "! ", "? ", " ", ""])
    chunks = text_splitter.split_documents(enhanced_docs)
    for i, chunk in enumerate(chunks):
        chunk.metadata.update({
            'chunk_id': i,
            'total_chunks': len(chunks)
        })
    return chunks


    