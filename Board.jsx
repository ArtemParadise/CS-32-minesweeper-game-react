import React, { useState, useEffect } from 'react';
import Cell from './Cell';
import styles from './styles/Board.module.css';

const Board = () => {
  const rows = 10;
  const cols = 10;
  const mines = 10;

  const generateBoard = () => {
    // Логіка генерації поля з мінами
  };

  const [board, setBoard] = useState(generateBoard());

  return (
    <div className={styles.board}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((cell, colIndex) => (
            <Cell key={colIndex} data={cell} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;