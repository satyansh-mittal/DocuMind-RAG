import os
import re
from fastapi import APIRouter, Body
from langchain.chains import ConversationalRetrievalChain
from langchain_ollama import OllamaLLM
from langchain.prompts import PromptTemplate

from app.vectorstore import get_vectorstore
from app.memory import append_message, get_history

router = APIRouter()

# Enhanced system prompt for better context understanding
SYSTEM_PROMPT = """You are an intelligent document analysis assistant. Your role is to analyze and answer questions about the provided documents comprehensively.

INSTRUCTIONS:
1. Always base your answers on the provided context from the documents
2. For general questions about the document, synthesize information from multiple parts
3. When asked about specific topics (projects, skills, experience, etc.), extract and organize relevant information
4. If information is not explicitly stated, mention what can be reasonably inferred
5. Provide detailed, structured responses when appropriate
6. If you cannot find specific information, clearly state this and suggest what might be available

RESPONSE STYLE:
- Be conversational and helpful
- Use bullet points or lists for multiple items
- Provide specific details when available
- Connect related information across the document"""

# Create a comprehensive prompt template
qa_template = """
{system_prompt}

DOCUMENT CONTEXT:
{context}

CONVERSATION HISTORY:
{chat_history}

CURRENT QUESTION: {question}

DETAILED ANSWER:"""

QA_CHAIN_PROMPT = PromptTemplate(
    input_variables=["context", "question", "chat_history", "system_prompt"],
    template=qa_template,
)

# Use a more powerful model configuration
llm = OllamaLLM(
    model="llama3.2:3b", 
    temperature=0.3,  # Slightly higher for more creative responses
    top_p=0.9,
    num_predict=512,  # Allow longer responses
)

@router.post("/chat")
async def chat(session_id: str = Body(..., embed=True), question: str = Body(..., embed=True)):
    # Get fresh vectorstore
    vs = get_vectorstore()
    
    # Enhanced retriever with more results
    retriever = vs.as_retriever(
        search_type="similarity",
        search_kwargs={
            "k": 6,  # Retrieve more chunks for better context
            "fetch_k": 10  # Consider more candidates
        }
    )
    
    # Create chain with enhanced configuration
    qa_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=retriever,
        combine_docs_chain_kwargs={
            "prompt": QA_CHAIN_PROMPT,
            "document_variable_name": "context"
        },
        return_source_documents=True,  # Enable source tracking
        verbose=True
    )
    
    # Process conversation history
    history = get_history(session_id)
    conv_history = []
    
    # Build conversation history string
    history_text = ""
    for i in range(0, len(history) - 1, 2):
        if i + 1 < len(history) and history[i][0] == "user" and history[i+1][0] == "assistant":
            conv_history.append((history[i][1], history[i+1][1]))
            history_text += f"User: {history[i][1]}\nAssistant: {history[i+1][1]}\n\n"
    
    # Add current question to memory
    append_message(session_id, "user", question)
    
    # Enhanced question preprocessing
    enhanced_question = preprocess_question(question)
    
    # Run RAG with enhanced inputs
    result = qa_chain({
        "question": enhanced_question,
        "chat_history": conv_history,
        "system_prompt": SYSTEM_PROMPT
    })
    
    answer = result['answer']
    
    # Post-process answer for better formatting
    formatted_answer = format_answer(answer)
    
    append_message(session_id, "assistant", formatted_answer)
    return {
        "answer": formatted_answer,
        "source_count": len(result.get('source_documents', []))
    }

def preprocess_question(question: str) -> str:
    """Enhance questions for better retrieval"""
    question = question.strip()
    
    # Add context hints for common question types
    question_patterns = {
        r"what.*projects?": "What projects, work experience, or technical implementations are mentioned?",
        r"what.*skills?": "What technical skills, programming languages, tools, or competencies are listed?",
        r"what.*experience?": "What work experience, internships, or professional background is described?",
        r"what.*education?": "What educational background, degrees, or academic achievements are mentioned?",
        r"tell me about": "Provide a comprehensive summary about",
        r"what can you deduce": "Analyze and summarize the key information to determine",
        r"who is": "Based on the document, describe the person including their background and qualifications"
    }
    
    for pattern, enhancement in question_patterns.items():
        if re.search(pattern, question.lower()):
            question = f"{enhancement} {question}"
            break
    
    return question

def format_answer(answer: str) -> str:
    """Format the answer for better readability"""
    # Add proper spacing around bullet points
    answer = re.sub(r'([.!?])\s*[-•]\s*', r'\1\n\n• ', answer)
    
    # Ensure proper paragraph spacing
    answer = re.sub(r'\n\s*\n', '\n\n', answer)
    
    # Clean up extra whitespace
    answer = ' '.join(answer.split())
    
    return answer.strip()

