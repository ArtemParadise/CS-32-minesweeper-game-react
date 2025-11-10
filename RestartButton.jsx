import React from 'react';
import styles from './styles/RestartButton.module.css';

const RestartButton = ({ onClick }) => (
  <button className={styles.button} onClick={onClick}>
    🔄 Restart
  </button>
);

export default RestartButton;