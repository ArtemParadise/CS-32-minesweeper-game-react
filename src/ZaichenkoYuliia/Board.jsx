import React from "react";
import Cell from "./Cell";
import styles from "./MinesweeperAll.module.css";

export default function Board({ board, openCell, toggleFlag }) {
  return (
    <div className={styles.boardWrapper}>
      <div className={styles.grid}>
        {board.map((row, r) =>
          row.map((cell, c) => (
            <Cell
              key={`${r}-${c}`}
              data={cell}
              onLeftClick={() => openCell(r, c)}
              onRightClick={(e) => {
                e.preventDefault();
                toggleFlag(r, c);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
