// Cell.jsx
import React from "react";
import styles from "./minesweeper.module.css";
import { CellState } from "./enums";

export function Cell({ cell, r, c, gameOver, highlight, onOpen, onToggleFlag }) {
    const opened = cell.state === CellState.OPENED || (gameOver && cell.hasMine);
    const classes = [styles.cell];

    if (opened) {
        classes.push(styles.opened);
        if (cell.hasMine) {
            const isTriggered = highlight && highlight.r === r && highlight.c === c;
            classes.push(styles.mine, isTriggered ? styles.mineTriggered : styles.revealed);
        } else if (cell.adjacentMines > 0) {
            classes.push(styles[`num${cell.adjacentMines}`]);
        }
    } else {
        classes.push(styles.closed);
        if (cell.isFlagged) classes.push(styles.flagged);
    }

    const handleClick = (e) => {
        e.preventDefault();
        if (!opened) onOpen(r, c);
    };

    const handleContext = (e) => {
        e.preventDefault();
        if (!opened) onToggleFlag(r, c);
    };

    return (
        <button
            type="button"
            className={classes.join(" ")}
            onClick={handleClick}
            onContextMenu={handleContext}
            aria-label={`cell ${r},${c}`}
        >
            {opened && !cell.hasMine && cell.adjacentMines > 0 ? cell.adjacentMines : null}
        </button>
    );
}