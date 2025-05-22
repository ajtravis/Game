from app.models import db, Tile, environment, SCHEMA

raw_maps = [
  [
    "PPPPPPPPPPPP",
    "...........P",
    "...........P",
    "...........P",
    "...........P",
    "...........P",
    "...........P",
    "...........P",
    "...........P",
    "...........P",
    "...........P",
    "PPPPPPPPPPPP",
  ],
  [
    "P...........",
    "P...........",
    "PPPPP.......",
    "....P.......",
    "....P.......",
    "....PPPPP...",
    "........P...",
    ".......PP...",
    "PPPPPPPP....",
    "P......P....",
    "P......PPPPP",
    "P...........",
  ],
  [
    "PPP.........",
    "..P.........",
    "..PPPPP.....",
    "......P.....",
    "......PPPPP.",
    "..........P.",
    ".PPPPPPPPPP.",
    ".P..........",
    ".P..........",
    ".P..........",
    ".PPPPPPPPPPP",
    "............",
  ],
  [
    ".....P......",
    ".....P......",
    ".....P......",
    ".....P......",
    ".....PPPP...",
    "........P...",
    "........P...",
    "........P...",
    "..PPPPPPP...",
    "..P.........",
    "..PPPPPPPPPP",
    "............",
  ],
  [
    "PPP.........",
    "..P.........",
    "..P.PPPPPP..",
    "..P.P....P..",
    "..P.P....P..",
    "..P.P....P..",
    "..P.P.PPPP..",
    "..P.P.P.....",
    "..PPP.P.....",
    "......PPPPPP",
    "...........P",
    "PPPPPPPPPPPP",
  ],
]

def seed_tiles():
    for y, row in enumerate(raw_maps[0]):
        for x, char in enumerate(row):
            tile = Tile(
                x=x,
                y=y,
                is_path=(char == "P"),
                has_tower=False,
            )
            db.session.add(tile)
    db.session.commit()
    
def undo_tiles():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tiles RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM tiles")

    db.session.commit()
