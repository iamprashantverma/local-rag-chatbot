from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document

embeddings = HuggingFaceEmbeddings()


def ingest_incremental(texts: list[str]):
    
    db = Chroma( persist_directory="vectordb", embedding_function=embeddings )

    documents = [Document(page_content=t) for t in texts]

    splitter = RecursiveCharacterTextSplitter( chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(documents)
    db.add_documents(chunks)
    db.persist()