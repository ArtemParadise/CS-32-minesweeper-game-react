import React from 'react';
import styles from './styles/Cell.module.css';

const Cell = ({ data }) => {
  const handleClick = () => {
    // Обробка кліку
  };

  return (
    <div className={styles.cell} onClick={handleClick}>
      {data.revealed ? (data.mine ? '💣' : data.adjacentMines) : ''}
    </div>
  );
};

export default Cell;