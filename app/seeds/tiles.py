from app.models import db, Tile, environment, SCHEMA

raw_maps = [
  [
    "BPPPPPPPPPPP",
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
    "SPPPPPPPPPPP",
  ],
  [
    "B...........",
    "P...........",
    "PPPPP.......",
    "....P.......",
    "....P.......",
    "....PPPPP...",
    "........P...",
    ".......PP...",
    "PPPPPPPP....",
    "P......P....",
    "P......PPPPS",
    "S...........",
  ],
  [
    "SPP.........",
    "..P.........",
    "..PPPPP.....",
    "......P.....",
    "......PPPPP.",
    "..........P.",
    ".PPPPPPPPPP.",
    ".P..........",
    ".P..........",
    ".P..........",
    ".PPPPPPPPPPB",
    "............",
  ],
  [
    ".....S......",
    ".....P......",
    ".....P......",
    ".....P......",
    ".....PPPP...",
    "........P...",
    "........P...",
    "........P...",
    "..PPPPPPP...",
    "..P.........",
    "..PPPPPPPPPB",
    "............",
  ],
  [
    "BPP.........",
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
    "SPPPPPPPPPPP",
  ],
]

def seed_tiles():
    i = 0
    while i < len(raw_maps):
      for y, row in enumerate(raw_maps[i]):
          for x, char in enumerate(row):
              tile = Tile(
                  x=x,
                  y=y,
                  is_path=(char == "P"),
                  has_tower=False,
                  is_spawn=(char == "S"),
                  is_base=(char == "B"),
                  map_id=(i+1)

              )
              db.session.add(tile)
      i+=1
    db.session.commit()
    
def undo_tiles():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tiles RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM tiles")

    db.session.commit()
