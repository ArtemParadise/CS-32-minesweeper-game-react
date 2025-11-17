import React from "react";
import Cell from "./Cell";
import styles from "./Minesweeper.module.css";

export default function Board({ field, status, setField, setStatus }) {
  const handleLeftClick = (row, col) => {
    const newField = field.map(row => row.map(cell => ({ ...cell })));
    const cell = newField[row][col];
    if (cell.state !== "closed" || status !== "running") return;

    if (cell.hasMine) {
      cell.state = "mine";
      setStatus("lose");
    } else {
      openCell(newField, row, col);
      if (checkWin(newField)) setStatus("win");
    }
    setField(newField);
  };

  const handleRightClick = (row, col, e) => {
    e.preventDefault();
    const newField = field.map(row => row.map(cell => ({ ...cell })));
    const cell = newField[row][col];
    if (cell.state === "open") return;
    cell.state = cell.state === "flag" ? "closed" : "flag";
    setField(newField);
  };

  const openCell = (fld, row, col) => {
    const cell = fld[row][col];
    if (cell.state !== "closed") return;
    cell.state = "open";
    if (cell.neighborMines === 0 && !cell.hasMine) {
      const dirs = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1],
      ];
      for (const [deltaRow, deltaCol] of dirs) {
        const nr = row + deltaRow, nc = col + deltaCol;
        if (newRow >= 0 && newCol >= 0 && newRow < fld.length && newCol < fld[0].length)
          openCell(fld, newRow, newCol);
      }
    }
  };

  const checkWin = (fld) =>
    fld.flat().every(cell => cell.hasMine || cell.state === "open");

  return (
    <div
      className={styles.grid}
      style={{
        "--rows": field.length,
        "--cols": field[0]?.length || 0,
      }}
    >
      {field.map((row, r) =>
        <div key={`${r}`} className={styles.row}>{
          row.map((cell, c) => (
            <Cell
              key={`${r}-${c}`}
              cell={cell}
              onLeftClick={() => handleLeftClick(r, c)}
              onRightClick={(e) => handleRightClick(r, c, e)}
            />
          ))
        }</div>
      )}
    </div>
  );
}
