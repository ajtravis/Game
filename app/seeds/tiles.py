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
    "S...........",
    "P...........",
    "PPPPP.......",
    "....P.......",
    "....P.......",
    "....PPPPP...",
    "........P...",
    ".......PP...",
    "PPPPPPPP....",
    "P...........",
    "P...........",
    "B...........",
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
    # Dictionary of map_id to its path coordinates (ordered from spawn to base)
    map_paths = {
        1: [
            [11, 0], [11, 1], [11, 2], [11, 3], [11, 4], [11, 5],
            [11, 6], [11, 7], [11, 8], [11, 9], [11,10], [11,11],
            [10,11], [9,11], [8,11], [7,11], [6,11],
            [5,11], [4,11], [3,11], [2,11], [1,11], [0,11],
            [0,10], [0, 9], [0, 8], [0, 7], [0, 6],
            [0, 5], [0, 4], [0, 3], [0, 2], [0, 1], [0, 0]
        ],
        2: [
           [0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4],
           [3, 4], [4, 4], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8],
           [6, 8], [7, 7], [7, 8], [8, 0], [8, 1], [8, 2], [8, 3],
           [8, 4], [8, 5], [8, 6], [8, 7], [9, 0], [10, 0], [11, 0]
            ],
        3: [
           [0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [2, 3], [2, 4],
           [2, 5], [2, 6], [3, 6], [4, 6], [4, 7], [4, 8], [4, 9],
           [4, 10], [5, 10], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
           [6, 6], [6, 7], [6, 8], [6, 9], [6, 10], [7, 1], [8, 1],
           [9, 1], [10, 1], [10, 2], [10, 3], [10, 4], [10, 5], [10, 6],
           [10, 7], [10, 8], [10, 9], [10, 10], [10, 11]
          ],
        4: [
           [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [4, 6], [4, 7],
           [4, 8], [5, 8], [6, 8], [7, 8], [8, 2], [8, 3], [8, 4],
           [8, 5], [8, 6], [8, 7], [8, 8], [9, 2], [10, 2], [10, 3],
           [10, 4], [10, 5], [10, 6], [10, 7], [10, 8], [10, 9],
           [10, 10], [10, 11]
        ],
        5: [
           [11,0], [11,1], [11,2],[11,3], [11,4] ,[11,5], [11,6], [11,7],
           [11,8], [11,9], [11,10], [11,11], [10,11], [9,11], [8,11],
           [7,11], [6,11], [5,11], [4,11], [3,11], [3,10], [3,9], [3,8],
           [3,7], [3,6], [3,5], [3,4], [3,3], [3,2], [2,2], [1,2], [0,2],
           [0,1], [0,0]
        ]
    }

    # Loop over each map and update next_tile for its path
    for map_id, path_coords in map_paths.items():
        # Get all tiles for this map
        tiles = Tile.query.filter_by(map_id=map_id).all()
        tile_lookup = {(tile.x, tile.y): tile for tile in tiles}

        # Assign next_tile using the path
        for i in range(len(path_coords) - 1):
            current_coord = tuple(path_coords[i])
            next_coord = tuple(path_coords[i + 1])
            
            current_tile = tile_lookup.get(current_coord)
            next_tile = tile_lookup.get(next_coord)

            if current_tile and next_tile:
                current_tile.next_tile = next_tile.id
            else:
                print(f"Missing tile at {current_coord} or {next_coord} for map {map_id}")

    db.session.commit()
     
    
def undo_tiles():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tiles RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM tiles")

    db.session.commit()
