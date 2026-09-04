from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
from app.db.base import Base
import app.models

from app.db.database import engine
from sqlalchemy import text

from app.api.games import router as games_router

from app.words import WORDS
class GuessRequest(BaseModel):
    guess: str
app = FastAPI(title="Word Sprint API")
app.include_router(games_router)

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    print("✅ Connected to PostgreSQL!")


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