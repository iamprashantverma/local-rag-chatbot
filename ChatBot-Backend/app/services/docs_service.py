from app.rag.index import  ingest_incremental

def update_docs(content: str):
    ingest_incremental([content])
