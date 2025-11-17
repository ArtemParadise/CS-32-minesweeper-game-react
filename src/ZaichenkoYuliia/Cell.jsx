import React from "react";
import styles from "./MinesweeperAll.module.css";

export default function Cell({ data, onLeftClick, onRightClick }) {
  const cellClass = `${styles.cell} ${styles[data.state]}`;

  let content = null;

  // Эмодзи состояния
  if (data.state === "flag") content = "🚩";
  else if (data.state === "mine") content = "💣";
  else if (data.state === "exploded") content = "💥";

  // Цветные цифры
  else if (data.state === "open" && data.neighborMines > 0) {
    content = (
      <span className={styles[`num${data.neighborMines}`]}>
        {data.neighborMines}
      </span>
    );
  }

  return (
    <button
      className={cellClass}
      onClick={onLeftClick}
      onContextMenu={onRightClick}
    >
      {content}
    </button>
  );
}
