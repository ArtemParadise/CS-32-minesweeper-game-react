import React, { useState, useEffect, useCallback } from "react";
import Board from "./Board";
import Timer from "./Timer";
import GameStatus from "./GameStatus";
import RestartButton from "./RestartButton";
import styles from "./Minesweeper.module.css";

const CellState = {
  CLOSED: "closed",
  OPEN: "open",
  FLAG: "flag",
  MINE: "mine",
};
const Status = { RUNNING: "running", WIN: "win", LOSE: "lose" };

function makeCell(hasMine = false) {
  return { hasMine, neighborMines: 0, state: CellState.CLOSED };
}

function generateField(rows, cols, mines) {
  const field = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => makeCell(false))
  );
  // розміщення мін
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!field[r][c].hasMine) {
      field[r][c].hasMine = true;
      placed++;
    }
  }
  // підрахунок сусідів
  const dirs = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let count = 0;
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nc >= 0 && nr < rows && nc < cols && field[nr][nc].hasMine)
          count++;
      }
      field[r][c].neighborMines = count;
    }
  }
  return field;
}

export default function Minesweeper() {
  const [field, setField] = useState([]);
  const [status, setStatus] = useState(Status.RUNNING);
  const [seconds, setSeconds] = useState(0);
  const [rows] = useState(8);
  const [cols] = useState(8);
  const [mines] = useState(10);

  // створення нового поля
  const newGame = useCallback(() => {
    setField(generateField(rows, cols, mines));
    setStatus(Status.RUNNING);
    setSeconds(0);
  }, [rows, cols, mines]);

  useEffect(() => { newGame(); }, [newGame]);

  // таймер
  useEffect(() => {
    if (status !== Status.RUNNING) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [status]);

  return (
    <div className={styles.app}>
      <div className={styles.bar}>
        <Timer seconds={seconds} />
        <GameStatus status={status} />
        <RestartButton onClick={newGame} />
      </div>
      <Board
        field={field}
        status={status}
        setField={setField}
        setStatus={setStatus}
      />
    </div>
  );
}