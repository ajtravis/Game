from app.models import db, Map
from sqlalchemy.sql import text

def seed_maps():
    maps = [
        Map(spawn=133, base=1),  # id will be assigned automatically
        Map(spawn=145, base=277),
        Map(spawn=289, base=420),
        Map(spawn=438, base=564),
        Map(spawn=709, base=577),
    ]
    db.session.add_all(maps)
    db.session.commit()

def undo_maps():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.maps RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM maps")

    db.session.commit()