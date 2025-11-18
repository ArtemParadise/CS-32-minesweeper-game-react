import React, { useState } from 'react';
import Board from './Board';
import Timer from './Timer';
import GameStatus from './GameStatus';
import RestartButton from './RestartButton';

const Minesweeper = () => {
  const [gameKey, setGameKey] = useState(Date.now());

  const restartGame = () => setGameKey(Date.now());

  return (
    <div>
      <h1>Minesweeper</h1>
      <GameStatus />
      <Timer key={gameKey} />
      <Board key={gameKey} />
      <RestartButton onClick={restartGame} />
    </div>
  );
};

export default Minesweeper;