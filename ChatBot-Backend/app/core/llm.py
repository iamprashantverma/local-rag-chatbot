from langchain_ollama import ChatOllama
from app.core.config import settings
llm = ChatOllama( model="qwen2.5:7b", temperature=0.6,base_url=settings.OLLAMA_BASE_URL)


