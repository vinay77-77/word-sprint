from datetime import datetime
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import get_db
from app.models.player import Player
from app.models.game import Game

router = APIRouter()


@router.get("/leaderboard")
def get_leaderboard(
    db: Session = Depends(get_db)
):
    today = datetime.now(ZoneInfo("Asia/Kolkata")).date()

    results = (
        db.query(
            Player.username,
            func.max(Game.score).label("score")
        )
        .join(Game, Player.id == Game.player_id)
        .filter(func.date(Game.played_at) == today)
        .group_by(Player.id, Player.username)
        .order_by(func.max(Game.score).desc())
        .limit(10)
        .all()
    )

    return [
        {
            "username": username,
            "score": score
        }
        for username, score in results
    ]