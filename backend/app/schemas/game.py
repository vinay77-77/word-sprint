from pydantic import BaseModel, Field


class GameCreate(BaseModel):
    username: str = Field(
        min_length=3,
        max_length=50
    )

    score: int = Field(
        ge=0
    )