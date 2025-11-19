// MinesweeperGame.jsx
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Board} from "./Board";
import {Header} from "./Header";
import styles from "./minesweeper.module.css";
import {allNonMinesOpened, cloneField, floodOpen, generateField} from "./logic";
import {CellState, GameStatus} from "./enums";

const DEFAULT_CFG = {rows: 9, cols: 9, mines: 10};

export function MinesweeperGame({config = DEFAULT_CFG}) {
    const [field, setField] = useState(() => generateField(config));
    const [status, setStatus] = useState(GameStatus.IN_PROGRESS);
    const [flagsLeft, setFlagsLeft] = useState(config.mines);
    const [seconds, setSeconds] = useState(0);
    const [highlight, setHighlight] = useState(null);
    const [started, setStarted] = useState(false);

    const timerRef = useRef(null);

    const reset = useCallback(() => {
        setField(generateField(config));
        setStatus(GameStatus.IN_PROGRESS);
        setFlagsLeft(config.mines);
        setSeconds(0);
        setHighlight(null);
        setStarted(false);
        if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, [config]);

    useEffect(() => {
        reset();
    }, [config, reset]);

    useEffect(() => {
        if (!started || status !== GameStatus.IN_PROGRESS) return;
        if (timerRef.current) return;
        timerRef.current = window.setInterval(() => {
            setSeconds((s) => Math.min(999, s + 1));
        }, 1000);
        return () => {
            if (timerRef.current) {
                window.clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [started, status]);

    const gameOver = status !== GameStatus.IN_PROGRESS;

    const openCell = useCallback((r, c) => {
        if (gameOver) return;
        setStarted(true);
        setField((prev) => {
            const next = cloneField(prev);
            const cell = next[r][c];
            if (cell.state === CellState.OPENED || cell.isFlagged) return prev;

            cell.state = CellState.OPENED;

            if (cell.hasMine) {
                setStatus(GameStatus.LOST);
                setHighlight({r, c});
                return next;
            }

            if (cell.adjacentMines === 0) {
                floodOpen(next, r, c);
            }

            if (allNonMinesOpened(next)) {
                setStatus(GameStatus.WON);
            }

            return next;
        });
    }, [gameOver]);

    const toggleFlag = useCallback((r, c) => {
        if (gameOver) return;
        setStarted(true);
        setField((prev) => {
            const next = cloneField(prev);
            const cell = next[r][c];
            if (cell.state === CellState.OPENED) return prev;

            const willFlag = !cell.isFlagged;
            if (willFlag && flagsLeft <= 0) return prev;

            cell.isFlagged = willFlag;
            cell.state = willFlag ? CellState.FLAGGED : CellState.CLOSED;
            setFlagsLeft((f) => f + (willFlag ? -1 : 1));
            return next;
        });
    }, [gameOver, flagsLeft]);

    useEffect(() => {
        if (status !== GameStatus.IN_PROGRESS && timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, [status]);

    const boardMemo = useMemo(() => (
        <Board
            field={field}
            gameOver={gameOver}
            highlight={highlight}
            onOpen={openCell}
            onToggleFlag={toggleFlag}
        />
    ), [field, gameOver, highlight, openCell, toggleFlag]);

    return (
        <div className={styles.gameContainer}>
            <Header flagsLeft={flagsLeft} seconds={seconds} onRestart={reset}/>
            {boardMemo}
            {status === GameStatus.WON && <div className={styles.banner} role="status">Перемога!</div>}
            {status === GameStatus.LOST && <div className={styles.banner} role="status">Програш</div>}
        </div>
    );
}