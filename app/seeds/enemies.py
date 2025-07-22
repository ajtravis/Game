from app.models import db, Enemy
from sqlalchemy.sql import text

def seed_enemies():
    # Assuming these are being placed on path tile_id = 1, 2, 3 for seeding purposes
    enemies = [
        Enemy(
            name="basic",
            damage=1,
            description="A standard enemy with average speed and health.",
            health=10,
            speed=1,
            tile_id=None  # Replace with actual path tile ID
        ),
        Enemy(
            name="fast",
            damage=1,
            description="A fast enemy that moves quickly but is fragile.",
            health=5,
            speed=5,
            tile_id=None  # Replace with actual path tile ID
        ),
        Enemy(
            name="tanky",
            damage=5,
            description="A slow but tough enemy that can take a lot of hits.",
            health=50,
            speed=1,
            tile_id=None  # Replace with actual path tile ID
        )
    ]

    db.session.add_all(enemies)
    db.session.commit()


def undo_enemies():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.enemies RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM enemies"))
        
    db.session.commit()