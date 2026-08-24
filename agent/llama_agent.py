from langchain_ollama import ChatOllama

llm = ChatOllama(
    model="llama3",
    temperature=0
)

response = llm.invoke("What is MetricMind in one sentence?")

print(response.content)