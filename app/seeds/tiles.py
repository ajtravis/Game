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
        
      1 : [133, 134, 135, 136, 137, 138, 139, 140, 141, 142,
              143, 144, 132, 120, 108, 96, 84, 72, 60, 48, 36,
              24, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],

      2 : [145,157,169,170,171,172,173,185,197,209,
              210,211,212,213,225,237,236,248,247,246,245,
              244,243,242,241,253,265,277],
      3 : [
              289, 290, 291, 303, 315, 316, 317, 318, 319, 331, 343, 344, 345, 346, 347,
              359, 371, 370, 369, 368, 367, 366, 365, 364, 363, 362, 374, 386, 398, 410,
              411, 412, 413, 414, 415, 416, 417, 418, 419, 420
              ],
      4 : [438, 450, 462, 474, 486,
              487, 488, 489, 501, 513,
              525, 537, 536, 535, 534,
              533, 532, 531, 543, 555,
              556, 557, 558, 559, 560,
              561, 562, 563, 564],
      5 : [709, 710, 711, 712, 713, 714,
      715, 716, 717, 718, 719, 720, 708, 696,
        695, 694, 693, 692, 691, 679, 667, 665,
        656, 657, 658, 646, 634, 622, 610, 609,
          608, 607, 606, 605, 617, 629, 641, 653,
          665, 577, 676, 675, 663, 651, 639, 627,
            615, 603, 591, 579, 578, 577]
    }
    # Loop over each map and update next_tile for its path
    # for map_id, path_coords in map_paths.items():
    #     # Get all tiles for this map
    #     tiles = Tile.query.filter_by(map_id=map_id).all()
    #     tile_lookup = {(tile.x, tile.y): tile for tile in tiles}

    #     # Assign next_tile using the path
    #     for i in range(len(path_coords) - 1):
    #         current_coord = tuple(path_coords[i])
    #         next_coord = tuple(path_coords[i + 1])
            
    #         current_tile = tile_lookup.get(current_coord)
    #         next_tile = tile_lookup.get(next_coord)

    #         if current_tile and next_tile:
    #             current_tile.next_tile = next_tile.id
    #         else:
    #             print(f"Missing tile at {current_coord} or {next_coord} for map {map_id}")

    # db.session.commit()
    x = 1
    while x <= 5:
      path = map_paths[x]
      i = 0
      while i < len(path)-1:
        cur = path[i]
        nxt = path[i+1]
        tile = Tile.query.get(cur)
        tile.next_tile = nxt
        i+=1
      x+=1
    db.session.commit()
    
def undo_tiles():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tiles RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM tiles")

    db.session.commit()
