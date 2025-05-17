export function generateGameBoard() {
  const BOARD_SIZE = 10;
  const board = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    const rowArray = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      rowArray.push({
        hasTower: false,
        tower: null,
        isPath: false,
      });
    }
    board.push(rowArray);
  }

  // Random left-to-right path
  let row = Math.floor(Math.random() * BOARD_SIZE);
  let col = 0;

  while (col < BOARD_SIZE) {
    board[row][col].isPath = true;
    const dir = Math.random();
    if (dir < 0.4 && row > 0) row--;
    else if (dir < 0.8 && row < BOARD_SIZE - 1) row++;
    else col++;
  }

  return board;
}
