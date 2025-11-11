import React, { useState, useEffect, useRef } from "react";
import styles from "./Game.module.css";
import Board from "./Board";
import TopPanel from "./TopPanel";
import {
  createGameState,
  generateField,
  openCell,
  toggleFlag,
  checkWin,
  GAME_STATUS,
} from "./gameLogic";

export default function Game() {
  const [game, setGame] = useState(null);
  const [timer, setTimer] = useState(0);
  const intervalIdRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [message, setMessage] = useState("");

  // створення нової гри
  const startNewGame = () => {
    const newGame = createGameState(9, 9, 5);
    newGame.field = generateField(newGame.rows, newGame.cols, newGame.minesCount);
    setGame(newGame);
    setTimer(0);
    setStarted(false);
    setMessage("");
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };

  // керування таймером
  useEffect(() => {
    if (started && game && game.status === GAME_STATUS.IN_PROGRESS) {
      if (!intervalIdRef.current) {
        intervalIdRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
      }
    } else {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [started, game?.status]);

  const handleLeftClick = (r, c) => {
    if (!game || game.status !== GAME_STATUS.IN_PROGRESS) return;

    // запускаємо таймер при першому кліку
    if (!started) setStarted(true);

    const updated = structuredClone(game);
    openCell(updated, r, c);
    checkWin(updated);
    setGame(updated);

    if (updated.status === GAME_STATUS.WIN) {
      setMessage("Виграш!");
    } else if (updated.status === GAME_STATUS.LOSE) {
      setMessage("Програш!");
    }
  };

  const handleRightClick = (r, c) => {
    if (!game || game.status !== GAME_STATUS.IN_PROGRESS) return;
    const updated = structuredClone(game);
    toggleFlag(updated, r, c);
    setGame(updated);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>💣 Neon Minesweeper 💣</h1>
      <div className={styles.gameContainer}>
        <TopPanel game={game} timer={timer} message={message} />
        <Board game={game} onLeftClick={handleLeftClick} onRightClick={handleRightClick} />
      </div>
      <button className={styles.playBtn} onClick={startNewGame}>
        PLAY
      </button>
    </div>
  );
}
