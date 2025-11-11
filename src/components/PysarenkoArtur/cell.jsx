import React from "react";
import styles from "./Cell.module.css";
import { CELL_STATE } from "./gameLogic";

export default function Cell({ cell, onLeftClick, onRightClick }) {
  const cls = [styles.cell];
  
  if (cell.state === CELL_STATE.OPEN) {
    cls.push(styles.open);
    if (cell.adjacentMines > 0 && cell.adjacentMines <= 3) {
      cls.push(styles[`num${cell.adjacentMines}`]);
    }
    if (cell.hasMine) {
      cls.push(styles.mine);
    }
  } else if (cell.state === CELL_STATE.FLAGGED) {
    cls.push(styles.flag);
  } else if (cell.state === CELL_STATE.EXPLODED) {
    cls.push(styles.exploded);
    cls.push(styles.mine);
  } else {
    cls.push(styles.closed);
  }

  let content = "";
  if (cell.state === CELL_STATE.OPEN) {
    if (cell.hasMine) {
      content = "💣";
    } else if (cell.adjacentMines > 0) {
      content = cell.adjacentMines;
    }
  } else if (cell.state === CELL_STATE.FLAGGED) {
    content = "🚩";
  } else if (cell.state === CELL_STATE.EXPLODED) {
    content = "💥";
  }

  return (
    <div 
      className={cls.join(" ")} 
      onClick={onLeftClick} 
      onContextMenu={onRightClick}
    >
      {content}
    </div>
  );
}
