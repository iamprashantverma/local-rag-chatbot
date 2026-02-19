# AI Chatbot with RAG

A full-stack intelligent chatbot application featuring RAG (Retrieval-Augmented Generation) capabilities, user authentication, and conversation memory. Built with FastAPI backend and React frontend.

## Features

- **RAG-Powered Responses**: Retrieves relevant context from documents using ChromaDB vector database
- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Conversation Memory**: Maintains chat history for contextual conversations
- **Modern UI**: Responsive React interface with smooth animations
- **Real-time Chat**: Interactive chat interface with message streaming support

## Tech Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **LangChain**: LLM orchestration and RAG implementation
- **ChromaDB**: Vector database for document embeddings
- **Sentence Transformers**: Text embedding generation
- **MySQL**: User data and authentication storage
- **JWT**: Secure token-based authentication

### Frontend
- **React 19**: Modern UI library
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests
- **SCSS**: Styling with Sass preprocessor
- **React Hook Form**: Form validation and management

## Project Structure

```
.
├── ChatBot-Backend/
│   ├── app/
│   │   ├── api/          # API routes and endpoints
│   │   ├── core/         # Core functionality (LLM, JWT, security)
│   │   ├── crud/         # Database operations
│   │   ├── db/           # Database configuration
│   │   ├── models/       # SQLAlchemy models
│   │   ├── rag/          # RAG implementation
│   │   ├── schemas/      # Pydantic schemas
│   │   └── services/     # Business logic
│   ├── data/             # Document storage
│   ├── scripts/          # Utility scripts
│   ├── vectordb/         # ChromaDB storage
│   └── requirements.txt
│
└── chatbot-frontend/
    ├── src/
    │   ├── components/   # Reusable UI components
    │   ├── contexts/     # React context providers
    │   ├── pages/        # Page components
    │   ├── services/     # API service layer
    │   └── style/        # SCSS stylesheets
    └── package.json
```

## Prerequisites

- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- npm or yarn

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd ChatBot-Backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables in `.env`:
```env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/fastapi_db
APP_NAME=FastAPI Production App
SECRET_KEY=your-secret-key-here
```

5. Create the MySQL database:
```sql
CREATE DATABASE fastapi_db;
```

6. Build the vector index (optional, if you have documents):
```bash
python scripts/build_index.py
```

7. Start the backend server:
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd chatbot-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

1. **Sign Up**: Create a new account on the signup page
2. **Login**: Authenticate with your credentials
3. **Chat**: Start asking questions to the AI chatbot
4. **RAG Context**: The bot retrieves relevant information from indexed documents

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Chat
- `POST /api/chat` - Send message and get AI response

### Health
- `GET /api/health` - Check API status

## Development

### Backend Development
```bash
cd ChatBot-Backend
uvicorn app.main:app --reload
```

### Frontend Development
```bash
cd chatbot-frontend
npm run dev
```

### Build for Production
```bash
cd chatbot-frontend
npm run build
```

## Configuration

### Adding Documents for RAG

1. Place your documents in `ChatBot-Backend/data/`
2. Run the indexing script:
```bash
python scripts/build_index.py
```

### Customizing the LLM

Edit `ChatBot-Backend/app/core/llm.py` to configure:
- Model selection
- Temperature settings
- Token limits
- Prompt templates

## License

This project is available for educational and personal use.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
