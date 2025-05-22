const rawMaps = [
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
];

function convertToBoard(charMap) {
  return charMap.map(row =>
    row.split('').map(cell => ({
      isPath: cell === 'P',
      hasTower: false,
      tower: null,
      isStart: false,
      isEnd: false
    }))
  );
}

export function getGameBoard(index = 0) {
  const map = rawMaps[index % rawMaps.length];
  return convertToBoard(map);
}