import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import Board from './board';
import { createBoard } from './gameLogic';
import {
    ROWS,
    COLS,
    MINES_COUNT,
    CellState,
    GameState,
    directions
} from './constants';

const openCellRecursive = (r, c, boardCopy) => {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;

    const cell = boardCopy[r][c];
    if (cell.state !== CellState.CLOSED) return;

    cell.state = CellState.OPENED;

    if (cell.adjacentMines === 0) {
        for (const [dr, dc] of directions) {
            openCellRecursive(r + dr, c + dc, boardCopy);
        }
    }
};


const checkWin = (currentBoard) => {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = currentBoard[r][c];
            if (!cell.hasMine && cell.state === CellState.CLOSED) {
                return false;
            }
        }
    }
    return true;
};


const MinesweeperGame = () => {
    const [board, setBoard] = useState(() => createBoard(ROWS, COLS, MINES_COUNT));
    const [gameState, setGameState] = useState(GameState.IN_PROGRESS);
    const [minesLeft, setMinesLeft] = useState(MINES_COUNT);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval = null;
        if (gameState === GameState.IN_PROGRESS) {
            interval = setInterval(() => {
                setTimer(t => t + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [gameState]);

    useEffect(() => {
        const handleContext = (e) => e.preventDefault();
        document.addEventListener('contextmenu', handleContext);
        return () => document.removeEventListener('contextmenu', handleContext);
    }, []);

    const handleNewGame = () => {
        setBoard(createBoard(ROWS, COLS, MINES_COUNT));
        setGameState(GameState.IN_PROGRESS);
        setMinesLeft(MINES_COUNT);
        setTimer(0);
    };

    const handleCellClick = (r, c) => {
        if (gameState !== GameState.IN_PROGRESS) return;

        const cell = board[r][c];
        if (cell.state !== CellState.CLOSED) return;

        if (cell.hasMine) {
            setGameState(GameState.LOST);

            const newBoard = board.map(row => row.map(cell => {
                if (cell.hasMine) {
                    return { ...cell, state: 'mine-shown' };
                }
                return cell;
            }));
            newBoard[r][c].state = 'mine-hit';
            setBoard(newBoard);
            return;
        }


        const newBoard = board.map(row => row.map(cell => ({ ...cell })));
        openCellRecursive(r, c, newBoard);

        if (checkWin(newBoard)) {
            setGameState(GameState.WON);
            const finalBoard = newBoard.map(row => row.map(cell =>
                (cell.hasMine ? { ...cell, state: CellState.FLAGGED } : cell)
            ));
            setBoard(finalBoard);
            setMinesLeft(0);
        } else {
            setBoard(newBoard);
        }
    };

    const handleCellFlag = (e, r, c) => {
        e.preventDefault();
        if (gameState !== GameState.IN_PROGRESS) return;

        const cell = board[r][c];
        if (cell.state === CellState.OPENED) return;

        const newBoard = board.map(row => row.map(cell => ({ ...cell })));
        const newCell = newBoard[r][c];
        let newMinesLeft = minesLeft;

        if (newCell.state === CellState.CLOSED) {
            newCell.state = CellState.FLAGGED;
            newMinesLeft--;
        } else if (newCell.state === CellState.FLAGGED) {
            newCell.state = CellState.CLOSED;
            newMinesLeft++;
        }

        setBoard(newBoard);
        setMinesLeft(newMinesLeft);
    };

    const getGameStatusFace = () => {
        if (gameState === GameState.WON) return '✨Won✨';
        if (gameState === GameState.LOST) return '💣Lost💣';
        return "New Game";
    };

    return (
        <div className={styles.minesweeper}>
            <div className={styles.topPanel}>
                <div className={styles.counter}>{String(minesLeft).padStart(3, '0')}</div>
                <button className={styles.newGame} onClick={handleNewGame}>
                    {getGameStatusFace()}
                </button>
                <div className={styles.timer}>{String(timer).padStart(3, '0')}</div>
            </div>
            <Board
                board={board}
                onCellClick={handleCellClick}
                onCellFlag={handleCellFlag}
            />
        </div>
    );
};

export default MinesweeperGame;