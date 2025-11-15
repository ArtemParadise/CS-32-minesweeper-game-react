import React from "react";
import styles from "./TopPanel.module.css";
import { CELL_STATE } from "./gameLogic";

export default function TopPanel({ game, timer, message }) {
  // Показуємо кількість мін навіть коли гра ще не почата
  const remainingFlags = game 
    ? game.minesCount - countPlacedFlags(game) 
    : 5;

  const messageClass = message.includes("Виграш") 
    ? styles.success 
    : message.includes("Програш") 
    ? styles.error 
    : "";

  return (
    <div className={styles.topPanel}>
      <div className={styles.indicator}>
        <span>{String(remainingFlags).padStart(3, "0")}</span>
      </div>
      <h2 className={`${styles.notification} ${messageClass}`}>
        {message}
      </h2>
      <div className={styles.indicator}>
        <span>{String(timer).padStart(3, "0")}</span>
      </div>
    </div>
  );
}

// Порахуємо кількість встановлених прапорців
function countPlacedFlags(game) {
  return game.field.flat().filter((cell) => cell.state === CELL_STATE.FLAGGED).length;
}
