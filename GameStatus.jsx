import React from 'react';
import styles from './styles/GameStatus.module.css';

const GameStatus = () => {
  // Можна передавати статус через props або context
  return <div className={styles.status}>Game in progress...</div>;
};

export default GameStatus;