from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant. Use context if relevant."),
    ("system", "Context: {context}"),
    ("placeholder", "{history}"),
    ("human", "{input}")
])

