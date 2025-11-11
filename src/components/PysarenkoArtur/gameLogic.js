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
  
  export function generateField(rows, cols, mines) {
    const field = createField(rows, cols);
    let placed = 0;
  
    while (placed < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if (!field[r][c].hasMine) {
        field[r][c].hasMine = true;
        placed++;
      }
    }
  
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!field[r][c].hasMine) field[r][c].adjacentMines = countNeighbourMines(field, r, c);
      }
    }
  
    return field;
  }
  
  function countNeighbourMines(field, row, col) {
    const dirs = [-1, 0, 1];
    let count = 0;
    dirs.forEach((dr) => {
      dirs.forEach((dc) => {
        if (dr || dc) {
          const r = row + dr, c = col + dc;
          if (field[r]?.[c]?.hasMine) count++;
        }
      });
    });
    return count;
  }
  
  export function openCell(game, row, col) {
    const cell = game.field[row][col];
    if (cell.state !== CELL_STATE.CLOSED || game.status !== GAME_STATUS.IN_PROGRESS) return game;
  
    if (cell.hasMine) {
      cell.state = CELL_STATE.EXPLODED;
      game.status = GAME_STATUS.LOSE;
      revealMines(game);
      return game;
    }
  
    cell.state = CELL_STATE.OPEN;
    if (cell.adjacentMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr || dc) {
            const nr = row + dr,
              nc = col + dc;
            if (nr >= 0 && nc >= 0 && nr < game.rows && nc < game.cols)
              openCell(game, nr, nc);
          }
        }
      }
    }
  
    checkWin(game);
    return game;
  }
  
  export function revealMines(game) {
    for (let r = 0; r < game.rows; r++) {
      for (let c = 0; c < game.cols; c++) {
        const cell = game.field[r][c];
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
    const totalSafe = game.rows * game.cols - game.minesCount;
    let opened = 0;
    for (let r = 0; r < game.rows; r++) {
      for (let c = 0; c < game.cols; c++) {
        const cell = game.field[r][c];
        if (cell.state === CELL_STATE.OPEN && !cell.hasMine) opened++;
      }
    }
    if (opened === totalSafe) {
      game.status = GAME_STATUS.WIN;
    }
    return opened === totalSafe;
  }
  