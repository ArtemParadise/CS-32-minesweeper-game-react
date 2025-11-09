import React from "react";
import styles from "./Minesweeper.module.css";

export default function Cell({ cell, onLeftClick, onRightClick }) {
  let content = "";
  if (cell.state === "flag") content = "🚩";
  else if (cell.state === "mine") content = "💣";
  else if (cell.state === "open" && cell.neighborMines > 0)
    content = cell.neighborMines;

  return (
    <button
      className={`${styles.cell} ${styles[cell.state]}`}
      onClick={onLeftClick}
      onContextMenu={onRightClick}
    >
      {content}
    </button>
  );
}
