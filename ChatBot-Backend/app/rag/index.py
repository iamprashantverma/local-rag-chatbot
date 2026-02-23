from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

from app.rag.loader import load_docs

def build_index():
    docs = load_docs()

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(docs)

    embeddings = HuggingFaceEmbeddings()

    db = Chroma.from_documents(chunks,embeddings,persist_directory="vectordb")

    db.persist()

# if __name__ == "__main__":
#     build_index()
