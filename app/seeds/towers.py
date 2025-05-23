from app.models import db, Tower
from sqlalchemy.sql import text

def seed_towers():
    towers = [
        Tower(
            name="Basic Tower",
            description="A well-balanced tower with decent range and speed.",
            damage=5,
            attack_speed=3,
            attack_range=4,
            tile_id=None
        ),
        Tower(
            name="Fast Tower",
            description="A quick-shooting tower that deals less damage per hit.",
            damage=2,
            attack_speed=7,
            attack_range=3,
            tile_id=None
        ),
        Tower(
            name="Strong Tower",
            description="A powerful tower with high damage but short range.",
            damage=10,
            attack_speed=2,
            attack_range=2,
            tile_id=None
        )
    ]

    db.session.add_all(towers)
    db.session.commit()

def undo_towers():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.towers RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM towers")

    db.session.commit()