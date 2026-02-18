from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings()

db = Chroma(persist_directory="vectordb",embedding_function=embeddings)

retriever = db.as_retriever(search_kwargs={"k": 3})
