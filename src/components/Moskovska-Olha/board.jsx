import React from 'react';
import Cell from './cell';
import { COLS } from './constants';
import styles from './styles.module.css';

const Board = ({ board, onCellClick, onCellFlag, gameState }) => {
    return (
        <div className={styles.board} style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
            {board.map((row, r) =>
                row.map((cell, c) => (
                    <Cell
                        key={`${r}-${c}`}
                        cellData={cell}
                        onClick={() => onCellClick(r, c)}
                        onContextMenu={(e) => onCellFlag(e, r, c)}
                    />
                ))
            )}
        </div>
    );
};

export default Board;