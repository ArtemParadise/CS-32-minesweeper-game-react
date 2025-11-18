import React, { useEffect, useState } from 'react';
import styles from './styles/Timer.module.css';

const Timer = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return <div className={styles.timer}>⏱ {seconds}s</div>;
};

export default Timer;