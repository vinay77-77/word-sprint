from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

from app.words import WORDS
class GuessRequest(BaseModel):
    guess: str
app = FastAPI(title="Word Sprint API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Word Sprint API Running"
    }

@app.get("/word")
def get_random_word():
    return {
        "word": random.choice(WORDS)
    }


@app.post("/validate")
def validate_guess(request: GuessRequest):

    return {
        "valid": request.guess.upper() in WORDS
    }