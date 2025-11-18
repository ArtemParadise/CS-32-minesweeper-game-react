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
  const [currentGame, setCurrentGame] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // створення нової гри
  const startNewGame = () => {
    const newGameState = createGameState(9, 9, 5);
    newGameState.field = generateField(newGameState.rows, newGameState.cols, newGameState.minesCount);
    setCurrentGame(newGameState);
    setElapsedTime(0);
    setIsGameStarted(false);
    setStatusMessage("");
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // керування таймером
  useEffect(() => {
    if (isGameStarted && currentGame && currentGame.status === GAME_STATUS.IN_PROGRESS) {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => setElapsedTime((t) => t + 1), 1000);
      }
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isGameStarted, currentGame?.status]);

  const handleLeftClick = (rowIndex, colIndex) => {
    if (!currentGame || currentGame.status !== GAME_STATUS.IN_PROGRESS) return;

    // запускаємо таймер при першому кліку
    if (!isGameStarted) setIsGameStarted(true);

    const updatedGame = structuredClone(currentGame);
    openCell(updatedGame, rowIndex, colIndex);
    checkWin(updatedGame);
    setCurrentGame(updatedGame);

    if (updatedGame.status === GAME_STATUS.WIN) {
      setStatusMessage("Виграш!");
    } else if (updatedGame.status === GAME_STATUS.LOSE) {
      setStatusMessage("Програш!");
    }
  };

  const handleRightClick = (rowIndex, colIndex) => {
    if (!currentGame || currentGame.status !== GAME_STATUS.IN_PROGRESS) return;
    const updatedGame = structuredClone(currentGame);
    toggleFlag(updatedGame, rowIndex, colIndex);
    setCurrentGame(updatedGame);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>💣 Neon Minesweeper 💣</h1>
      <div className={styles.gameContainer}>
        <TopPanel game={currentGame} timer={elapsedTime} message={statusMessage} />
        <Board game={currentGame} onLeftClick={handleLeftClick} onRightClick={handleRightClick} />
      </div>
      <button className={styles.playBtn} onClick={startNewGame}>
        PLAY
      </button>
    </div>
  );
}
