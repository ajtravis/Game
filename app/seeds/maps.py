from app.models import db, Map
from sqlalchemy.sql import text

def seed_maps():
    maps = [
        Map(),  # id will be assigned automatically
        Map(),
        Map(),
        Map(),
        Map()
    ]
    db.session.add_all(maps)
    db.session.commit()

def undo_maps():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.maps RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM maps")

    db.session.commit()