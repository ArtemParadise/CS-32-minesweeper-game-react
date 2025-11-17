import { useState, useEffect } from "react";
import Board from "./Board";
import Controls from "./Controls";
import Timer from "./Timer";
import styles from "./MinesweeperAll.module.css";

const CELL = { closed:"closed", open:"open", flag:"flag", mine:"mine", exploded:"exploded" };
const GAME = { ready:"ready", running:"running", win:"win", lose:"lose" };

const DIRS = [
  [-1,-1],[-1,0],[-1,1],
  [0,-1],        [0,1],
  [1,-1],[1,0],[1,1]
];

export default function Minesweeper() {

  const ROWS = 10, COLS = 10, MINES = 10;

  const [board, setBoard] = useState([]);
  const [status, setStatus] = useState(GAME.ready);
  const [flagsLeft, setFlagsLeft] = useState(MINES);
  const [openedSafe, setOpenedSafe] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [firstClick, setFirstClick] = useState(false);

  // === TIMER ===
  useEffect(() => {
    if (status !== GAME.running) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  // === NEW GAME ===
  function newGame() {
    const empty = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => ({
        hasMine: false,
        neighborMines: 0,
        state: CELL.closed
      }))
    );
    setBoard(empty);
    setStatus(GAME.ready);
    setOpenedSafe(0);
    setFlagsLeft(MINES);
    setSeconds(0);
    setFirstClick(false);
  }

  useEffect(newGame, []);

  // === HELPERS ===
  function inBounds(r, c) {
    return r >= 0 && r < ROWS && c >= 0 && c < COLS;
  }

  function neighbors(r, c) {
    return DIRS
      .map(([dr, dc]) => [r + dr, c + dc])
      .filter(([nr, nc]) => inBounds(nr, nc));
  }

  // === PLACE MINES ON FIRST CLICK ===
  function placeMines(exR, exC, tempBoard) {
    let used = new Set();
    const total = ROWS * COLS;

    while (used.size < MINES) {
      const idx = Math.floor(Math.random() * total);
      const r = Math.floor(idx / COLS);
      const c = idx % COLS;

      if ((r === exR && c === exC) ||
          neighbors(exR, exC).some(([nr, nc]) => nr === r && nc === c)) continue;

      if (used.has(idx)) continue;

      used.add(idx);
      tempBoard[r][c].hasMine = true;
    }

    // count neighbor mines
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (tempBoard[r][c].hasMine) continue;

        let count = 0;
        for (const [nr, nc] of neighbors(r, c)) {
          if (tempBoard[nr][nc].hasMine) count++;
        }
        tempBoard[r][c].neighborMines = count;
      }
    }
  }

  // === TOGGLE FLAG ===
  function toggleFlag(r, c) {
    if (status === GAME.lose || status === GAME.win) return;

    setBoard(prev => {
      const copy = prev.map(row => row.map(cell => ({ ...cell })));
      const cell = copy[r][c];

      if (cell.state === CELL.open) return prev;

      if (cell.state === CELL.flag) {
        cell.state = CELL.closed;
        setFlagsLeft(f => f + 1);
      } else if (flagsLeft > 0) {
        cell.state = CELL.flag;
        setFlagsLeft(f => f - 1);
      }

      return copy;
    });
  }

  // === OPEN CELL ===
  function openCell(r, c) {
    if (status === GAME.lose || status === GAME.win) return;

    setBoard(prev => {
      const temp = prev.map(row => row.map(cell => ({ ...cell })));
      const cell = temp[r][c];

      if (cell.state !== CELL.closed) return prev;

      if (!firstClick) {
        placeMines(r, c, temp);
        setFirstClick(true);
        setStatus(GAME.running);
      }

      if (cell.hasMine) {
        cell.state = CELL.exploded;
        revealMines(temp);
        setStatus(GAME.lose);
        return temp;
      }

      floodOpen(temp, r, c);

      const safeCells = ROWS * COLS - MINES;
      if (openedSafe + 1 >= safeCells) {
        setStatus(GAME.win);
      }

      return temp;
    });
  }

  // === FLOOD FILL (OPEN AREA) ===
  function floodOpen(temp, r, c) {
    const stack = [[r, c]];
    let count = openedSafe;

    while (stack.length) {
      const [x, y] = stack.pop();
      const cell = temp[x][y];

      if (cell.state !== CELL.closed) continue;

      cell.state = CELL.open;
      count++;

      if (cell.neighborMines === 0) {
        for (const [nx, ny] of neighbors(x, y)) {
          if (temp[nx][ny].state === CELL.closed && !temp[nx][ny].hasMine) {
            stack.push([nx, ny]);
          }
        }
      }
    }

    setOpenedSafe(count);
  }

  // === SHOW ALL MINES ===
  function revealMines(temp) {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (temp[r][c].hasMine && temp[r][c].state !== CELL.exploded) {
          temp[r][c].state = CELL.mine;
        }
      }
    }
  }

  return (
    <div className={styles.wrapper}>
      <Controls onRestart={newGame} flagsLeft={flagsLeft} />
      <Timer seconds={seconds} />
      <Board board={board} openCell={openCell} toggleFlag={toggleFlag} />
      {/* <GameStatus status={status} /> — добавишь позже */}
    </div>
  );
}
