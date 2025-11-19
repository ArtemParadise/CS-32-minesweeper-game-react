import React from "react";
import {Cell} from "./Cell";
import styles from "./minesweeper.module.css";

export function Board({field, gameOver, highlight, onOpen, onToggleFlag}) {
    const columnCount = field[0]?.length ?? 0;
    return (
        <div
            className={styles.gameBoard}
            style={{gridTemplateColumns: `repeat(${columnCount}, 32px)`}}
            role="grid"
            aria-label="Minesweeper board"
        >
            {field.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <Cell
                        key={`${rowIndex}-${colIndex}`}
                        cell={cell}
                        row={rowIndex}
                        col={colIndex}
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