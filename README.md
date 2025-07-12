# 🚀 RAG Chat Application

A modern, production-ready **Retrieval-Augmented Generation (RAG)** chat application with PDF document processing capabilities.

## 📋 Overview

This full-stack application allows users to upload PDF documents and chat with their content using advanced AI. The system processes PDFs, creates vector embeddings, and provides intelligent responses based on the document content.

### Architecture

```
├── backend/                 # FastAPI Python backend
│   ├── app/
│   │   ├── main.py         # FastAPI application entry point
│   │   ├── routers/        # API route handlers
│   │   ├── vectorstore.py  # FAISS vector storage
│   │   ├── memory.py       # Conversation memory
│   │   └── utils.py        # Utility functions
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   └── react/
│       ├── src/
│       │   ├── components/ # React components
│       │   ├── services/   # API services
│       │   └── App.jsx     # Main application
│       └── package.json    # Node.js dependencies
└── README.md              # This file
```

## ✨ Features

### Backend Features
- **PDF Processing**: Extract and chunk text from PDF documents
- **Vector Storage**: FAISS-based semantic search with HuggingFace embeddings
- **AI Chat**: Ollama integration with Llama 3.2 model
- **Memory Management**: Session-based conversation history
- **RESTful API**: FastAPI with automatic documentation

### Frontend Features
- **Modern UI**: Material-UI design system
- **Drag & Drop**: Intuitive file upload with progress tracking
- **Real-time Chat**: Interactive conversation interface
- **Responsive Design**: Mobile-first, works on all devices
- **Error Handling**: Comprehensive error management
- **Session Management**: Unique session IDs for conversation persistence

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **LangChain** - LLM application framework
- **FAISS** - Vector similarity search
- **Ollama** - Local LLM inference
- **HuggingFace** - Text embeddings
- **PyPDF** - PDF text extraction

### Frontend
- **React 19** - Latest React features
- **Material-UI v6** - Component library
- **Vite** - Fast build tool
- **Axios** - HTTP client
- **React Dropzone** - File upload
- **UUID** - Session management

## 📦 Installation & Setup

### Prerequisites
- **Python 3.8+**
- **Node.js 18+**
- **Ollama** ([Download here](https://ollama.ai))

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Install and setup Ollama**:
   ```bash
   # Download and install Ollama from https://ollama.ai
   ollama pull llama3.2:3b
   ```

5. **Start the backend server**:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend/react
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🚀 Usage

1. **Start both servers**:
   - Backend: `http://localhost:8000`
   - Frontend: `http://localhost:5173`

2. **Upload a PDF**:
   - Drag and drop or click to upload a PDF file
   - Wait for processing and indexing completion

3. **Start chatting**:
   - Ask questions about your uploaded document
   - The AI will provide answers based on the document content

4. **API Documentation**:
   - View interactive API docs at `http://localhost:8000/docs`

## 📊 API Endpoints

### Upload PDF
```http
POST /api/upload
Content-Type: multipart/form-data

{
  "file": "document.pdf"
}
```

### Chat with Documents
```http
POST /api/chat
Content-Type: application/json

{
  "session_id": "unique-session-id",
  "question": "What is this document about?"
}
```

## 🔧 Development

### Backend Development
```bash
# Run with hot reload
uvicorn app.main:app --reload

# Run tests
pytest

# Format code
black .
isort .
```

### Frontend Development
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## 🏗️ Production Deployment

### Backend Deployment
```bash
# Build Docker image
docker build -t rag-backend .

# Run container
docker run -p 8000:8000 rag-backend
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel/Netlify
# or serve with any static file server
```

## 🔒 Security Considerations

- **File Upload**: 10MB file size limit, PDF validation
- **Input Sanitization**: XSS protection on chat inputs
- **CORS**: Properly configured cross-origin requests
- **Rate Limiting**: API rate limiting (recommended for production)
- **Authentication**: Add authentication for production use

## 🐛 Troubleshooting

### Common Issues

**Backend not starting**:
- Ensure Ollama is installed and running
- Check Python dependencies are installed
- Verify virtual environment is activated

**Frontend build errors**:
- Use `npm install --legacy-peer-deps`
- Check Node.js version (requires 18+)
- Clear node_modules and reinstall

**CORS errors**:
- Verify backend CORS configuration
- Check frontend API base URL in `.env`

**Chat not working**:
- Ensure backend is running on port 8000
- Check Ollama model is downloaded
- Upload a PDF document first

## 📈 Performance Optimization

### Backend
- **Vector Storage**: FAISS for fast similarity search
- **Chunking Strategy**: Optimized text chunking for better retrieval
- **Caching**: Implement Redis for session caching
- **Async Operations**: FastAPI async endpoints

### Frontend
- **Code Splitting**: Lazy loading with React.lazy()
- **Bundle Optimization**: Vite's optimized bundling
- **Caching**: Service worker for static assets
- **Debouncing**: Input debouncing for better UX

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support:
- Open an issue on GitHub
- Check the troubleshooting section
- Review API documentation at `/docs`

---

**Built with ❤️ using modern web technologies**
