export const CELL_STATE = {
  CLOSED: "closed",
  OPEN: "open",
  FLAGGED: "flagged",
  EXPLODED: "exploded",
};

export const GAME_STATUS = {
  IN_PROGRESS: "in_progress",
  WIN: "win",
  LOSE: "lose",
};

export function createCell(hasMine = false, adjacentMines = 0, state = CELL_STATE.CLOSED) {
  return { hasMine, adjacentMines, state };
}

export function createField(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => createCell())
  );
}

export function createGameState(rows, cols, minesCount) {
  return {
    rows,
    cols,
    minesCount,
    status: GAME_STATUS.IN_PROGRESS,
    field: createField(rows, cols),
  };
}

export function generateField(rows, cols, minesCount) {
  const field = createField(rows, cols);
  let minesPlaced = 0;

  while (minesPlaced < minesCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (!field[row][col].hasMine) {
      field[row][col].hasMine = true;
      minesPlaced++;
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!field[row][col].hasMine) {
        field[row][col].adjacentMines = countAdjacentMines(field, row, col);
      }
    }
  }

  return field;
}

function countAdjacentMines(field, row, col) {
  const directionOffsets = [-1, 0, 1];
  let adjacentMinesCount = 0;

  directionOffsets.forEach((directionalRow) => {
    directionOffsets.forEach((directionalCol) => {
      if (directionalRow || directionalCol) {
        const neighbourRow = row + directionalRow;
        const neighbourCol = col + directionalCol;
        if (field[neighbourRow]?.[neighbourCol]?.hasMine) adjacentMinesCount++;
      }
    });
  });

  return adjacentMinesCount;
}

export function openCell(game, row, col) {
  const cell = game.field[row][col];
  if (cell.state !== CELL_STATE.CLOSED || game.status !== GAME_STATUS.IN_PROGRESS) return game;

  if (cell.hasMine) {
    cell.state = CELL_STATE.EXPLODED;
    game.status = GAME_STATUS.LOSE;
    revealAllMines(game);
    return game;
  }

  cell.state = CELL_STATE.OPEN;

  if (cell.adjacentMines === 0) {
    for (let directionalRow = -1; directionalRow <= 1; directionalRow++) {
      for (let directionalCol = -1; directionalCol <= 1; directionalCol++) {
        if (directionalRow || directionalCol) {
          const neighbourRow = row + directionalRow;
          const neighbourCol = col + directionalCol;
          if (
            neighbourRow >= 0 &&
            neighbourCol >= 0 &&
            neighbourRow < game.rows &&
            neighbourCol < game.cols
          ) {
            openCell(game, neighbourRow, neighbourCol);
          }
        }
      }
    }
  }

  checkWin(game);
  return game;
}

export function revealAllMines(game) {
  for (let row = 0; row < game.rows; row++) {
    for (let col = 0; col < game.cols; col++) {
      const cell = game.field[row][col];
      if (cell.hasMine && cell.state !== CELL_STATE.EXPLODED) {
        cell.state = CELL_STATE.OPEN;
      }
    }
  }
}

export function toggleFlag(game, row, col) {
  const cell = game.field[row][col];
  if (cell.state === CELL_STATE.CLOSED) cell.state = CELL_STATE.FLAGGED;
  else if (cell.state === CELL_STATE.FLAGGED) cell.state = CELL_STATE.CLOSED;
  return game;
}

export function checkWin(game) {
  const totalSafeCells = game.rows * game.cols - game.minesCount;
  let openedSafeCellsCount = 0;

  for (let row = 0; row < game.rows; row++) {
    for (let col = 0; col < game.cols; col++) {
      const cell = game.field[row][col];
      if (cell.state === CELL_STATE.OPEN && !cell.hasMine) openedSafeCellsCount++;
    }
  }

  if (openedSafeCellsCount === totalSafeCells) {
    game.status = GAME_STATUS.WIN;
  }

  return openedSafeCellsCount === totalSafeCells;
}
