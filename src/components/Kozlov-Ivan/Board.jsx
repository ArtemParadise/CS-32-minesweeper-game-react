// Board.jsx
import React from "react";
import {Cell} from "./Cell";
import styles from "./minesweeper.module.css";

export function Board({field, gameOver, highlight, onOpen, onToggleFlag}) {
    const cols = field[0]?.length ?? 0;
    return (
        <div
            className={styles.gameBoard}
            style={{gridTemplateColumns: `repeat(${cols}, 32px)`}}
            role="grid"
            aria-label="Minesweeper board"
        >
            {field.map((row, r) =>
                row.map((cell, c) => (
                    <Cell
                        key={`${r}-${c}`}
                        cell={cell}
                        r={r}
                        c={c}
                        gameOver={gameOver}
                        highlight={highlight}
                        onOpen={onOpen}
                        onToggleFlag={onToggleFlag}
                    />
                )),
            )}
        </div>
    );
}