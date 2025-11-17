import React from "react";
import styles from "./MinesweeperAll.module.css";

export default function Timer({ seconds }) {
  return (
    <div className={styles.infoBox}>
      ⏱️ <span className={styles.number}>{String(seconds).padStart(3, "0")}</span>
    </div>
  );
}
