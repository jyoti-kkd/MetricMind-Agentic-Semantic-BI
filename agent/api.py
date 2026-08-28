from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_ollama import ChatOllama

app = FastAPI(title="MetricMind Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatOllama(
    model="llama3",
    temperature=0,
)

cube_schema = """
Cube.dev semantic layer: orders

Measures:
- orders.count
- orders.total_revenue
- orders.total_cost
- orders.total_profit
- orders.profit_margin

Dimensions:
- orders.region
- orders.order_date
"""


class ChatRequest(BaseModel):
    question: str


@app.get("/")
def root():
    return {"message": "MetricMind Agent API is running"}


@app.post("/chat")
def chat(request: ChatRequest):
    prompt = f"""
You are the MetricMind BI assistant.

Use only the following Cube.dev semantic layer schema:

{cube_schema}

User question:
{request.question}

Answer clearly and concisely using the available semantic layer.
"""

    response = llm.invoke(prompt)

    return {
        "question": request.question,
        "answer": response.content,
    }