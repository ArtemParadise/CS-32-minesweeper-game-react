// Header.jsx
import React from "react";
import styles from "./minesweeper.module.css";

export function Header({flagsLeft, seconds, onRestart}) {
    const pad = (n) => String(Math.max(0, Math.min(999, n))).padStart(3, "0");
    return (
        <header className={styles.gameHeader}>
            <div className={styles.minesCounter} aria-live="polite">{pad(flagsLeft)}</div>
            <button className={styles.restartButton} title="Почати знову" onClick={onRestart}>▶</button>
            <div className={styles.timer} aria-live="polite">{pad(seconds)}</div>
        </header>
    );
}