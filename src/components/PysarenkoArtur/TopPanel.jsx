import React from "react";
import styles from "./TopPanel.module.css";
import { CELL_STATE } from "./gameLogic";

export default function TopPanel({ game, timer, message }) {
  // Показуємо кількість мін (5) навіть коли гра не почата
  const flagsLeft = game 
    ? game.minesCount - countFlags(game) 
    : 5;

  const notificationClass = message.includes("Виграш") 
    ? styles.success 
    : message.includes("Програш") 
    ? styles.error 
    : "";

  return (
    <div className={styles.topPanel}>
      <div className={styles.indicator}>
        <span>{String(flagsLeft).padStart(3, "0")}</span>
      </div>
      <h2 className={`${styles.notification} ${notificationClass}`}>
        {message}
      </h2>
      <div className={styles.indicator}>
        <span>{String(timer).padStart(3, "0")}</span>
      </div>
    </div>
  );
}

function countFlags(game) {
  return game.field.flat().filter((c) => c.state === CELL_STATE.FLAGGED).length;
}
