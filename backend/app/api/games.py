from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.game import GameCreate
from app.models.player import Player
from app.models.game import Game

router = APIRouter()

@router.post("/games")
def save_game(
    game: GameCreate,
    db: Session = Depends(get_db)
):
    player = (
    db.query(Player)
      .filter(Player.username == game.username)
      .first()
)
    if player is None:

        player = Player(
                username=game.username
            )
        db.add(player)
        db.commit()

        db.refresh(player)

    new_game = Game(
    player_id=player.id,
    score=game.score
)

    db.add(new_game)
    db.commit()

    new_game = Game(
    player_id=player.id,
    score=game.score
)

    db.add(new_game)
    db.commit()

    return {
    "message": "Game saved successfully!"
}