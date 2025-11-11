import React from "react";
import styles from "./Board.module.css";
import Cell from "./Cell";

export default function Board({ game, onLeftClick, onRightClick }) {
  const rows = game?.rows ?? 9
  const cols = game?.cols ?? 9
  const field = game?.field ?? Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ hasMine: false, adjacentMines: 0, state: "closed" }))
  )

  return (
    <div
      className={`${styles.grid} ${!game ? styles.hidden : ''}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, 35px)`,
        gridTemplateRows: `repeat(${rows}, 35px)`,
      }}
    >
      {game && field.map((row, r) =>
        row.map((cell, c) => (
          <Cell
            key={`${r}-${c}`}
            cell={cell}
            onLeftClick={() => {
              onLeftClick(r, c)
            }}
            onRightClick={(e) => {
              e.preventDefault()
              onRightClick(r, c)
            }}
          />
        ))
      )}
    </div>
  )
}
