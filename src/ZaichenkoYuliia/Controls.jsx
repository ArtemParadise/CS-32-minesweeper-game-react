import React from "react";
import styles from "./MinesweeperAll.module.css";

export default function Controls({ onRestart, flagsLeft }) {
  return (
    <div className={styles.topPanel}>
      <div className={styles.counter}>
        ⏱ {String(0).padStart(3, "0")}
      </div>

      <button className={styles.restartBtn} onClick={onRestart}>
        🔄 Нова гра
      </button>

      <div className={styles.counter}>
        🚩 {String(flagsLeft).padStart(3, "0")}
      </div>
    </div>
  );
}
