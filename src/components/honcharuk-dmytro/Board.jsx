import React from "react";
import Cell from "./Cell";
import styles from "./Minesweeper.module.css";

export default function Board({ field, status, setField, setStatus }) {
  const handleLeftClick = (r, c) => {
    const newField = field.map(row => row.map(cell => ({ ...cell })));
    const cell = newField[r][c];
    if (cell.state !== "closed" || status !== "running") return;

    if (cell.hasMine) {
      cell.state = "mine";
      setStatus("lose");
    } else {
      openCell(newField, r, c);
      if (checkWin(newField)) setStatus("win");
    }
    setField(newField);
  };

  const handleRightClick = (r, c, e) => {
    e.preventDefault();
    const newField = field.map(row => row.map(cell => ({ ...cell })));
    const cell = newField[r][c];
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
      for (const [dr, dc] of dirs) {
        const nr = row + dr, nc = col + dc;
        if (nr >= 0 && nc >= 0 && nr < fld.length && nc < fld[0].length)
          openCell(fld, nr, nc);
      }
    }
  };

  const checkWin = (fld) =>
    fld.flat().every(c => c.hasMine || c.state === "open");

  return (
    <div
      className={styles.grid}
      style={{
        gridTemplateColumns: `repeat(${field[0]?.length || 0}, 32px)`
      }}
    >
      {field.map((row, r) =>
        row.map((cell, c) => (
          <Cell
            key={`${r}-${c}`}
            cell={cell}
            onLeftClick={() => handleLeftClick(r, c)}
            onRightClick={(e) => handleRightClick(r, c, e)}
          />
        ))
      )}
    </div>
  );
}
