from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agent.reasoning import analyze_question


app = FastAPI(title="MetricMind Agent API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    question: str


@app.get("/")
def root():
    return {
        "message": "MetricMind Agent API is running"
    }


@app.post("/chat")
def chat(request: ChatRequest):

    answer = analyze_question(request.question)

    return {
        "question": request.question,
        "answer": answer,
    }