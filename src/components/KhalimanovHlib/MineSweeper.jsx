import { useState, useEffect } from 'react'
import Board from './Board/index.jsx'
import GameStatus from './GameStatus/index.jsx'
import styles from './MineSweeper.module.css'

const ROWS = 9
const COLS = 9
const MINES = 10

function Minesweeper() {
    const [board, setBoard] = useState([])
    const [gameStatus, setGameStatus] = useState('playing') // playing, won, lost
    const [time, setTime] = useState(0)
    const [isFirstClick, setIsFirstClick] = useState(true)

    // Ініціалізація при завантаженні
    useEffect(() => {
        initializeBoard()
    }, [])

    // Таймер
    useEffect(() => {
        let interval = null
        if (gameStatus === 'playing') {
            interval = setInterval(() => {
                setTime((t) => t + 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [gameStatus])

    const initializeBoard = () => {
        const newBoard = Array(ROWS).fill(null).map(() =>
            Array(COLS).fill(null).map(() => ({
                isRevealed: false,
                isMine: false,
                isFlagged: false,
                neighborCount: 0
            }))
        )
        setBoard(newBoard)
        setGameStatus('playing')
        setTime(0)
        setIsFirstClick(true)
    }

    const placeMines = (clickedRow, clickedCol) => {
        const newBoard = [...board]
        let minesPlaced = 0

        while (minesPlaced < MINES) {
            const row = Math.floor(Math.random() * ROWS)
            const col = Math.floor(Math.random() * COLS)

            if (!newBoard[row][col].isMine && !(row === clickedRow && col === clickedCol)) {
                newBoard[row][col].isMine = true
                minesPlaced++
            }
        }

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (!newBoard[r][c].isMine) {
                    let count = 0;
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            const nr = r + i;
                            const nc = c + j;
                            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newBoard[nr][nc].isMine) {
                                count++;
                            }
                        }
                    }
                    newBoard[r][c].neighborCount = count;
                }
            }
        }
        setBoard(newBoard)
    }

    const revealNeighbors = (row, col, currentBoard) => {
        // Рекурсивне відкриття (Flood Fill)
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const nr = row + i;
                const nc = col + j;
                if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                    if (!currentBoard[nr][nc].isRevealed && !currentBoard[nr][nc].isFlagged) {
                        currentBoard[nr][nc].isRevealed = true;
                        if (currentBoard[nr][nc].neighborCount === 0) {
                            revealNeighbors(nr, nc, currentBoard);
                        }
                    }
                }
            }
        }
    }

    const handleCellClick = (row, col) => {
        if (gameStatus !== 'playing' || board[row][col].isRevealed || board[row][col].isFlagged) return

        if (isFirstClick) {
            placeMines(row, col)
            setIsFirstClick(false)
        }

        const newBoard = [...board]

        newBoard[row][col].isRevealed = true

        if (newBoard[row][col].isMine) {
            setGameStatus('lost')
            // Reveal all mines
            newBoard.forEach(r => r.forEach(c => {
                if (c.isMine) c.isRevealed = true
            }))
        } else if (newBoard[row][col].neighborCount === 0) {
            revealNeighbors(row, col, newBoard)
        }

        setBoard(newBoard)
        checkWin(newBoard)
    }

    const handleRightClick = (e,kz, row, col) => {
        e.preventDefault()
        if (gameStatus !== 'playing' || board[row][col].isRevealed) return

        const newBoard = [...board]
        newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged
        setBoard(newBoard)
    }

    const checkWin = (currentBoard) => {
        let revealed = 0;
        currentBoard.forEach(row => row.forEach(cell => {
            if (cell.isRevealed && !cell.isMine) revealed++;
        }));
        if (revealed === (ROWS * COLS - MINES)) {
            setGameStatus('won');
        }
    }

    return (
        <div className={styles.gameWrapper}>
            <h1>Minesweeper by Khalimnaov Hlib</h1>
            <GameStatus
                mineCount={MINES}
                time={time}
                status={gameStatus}
                onReset={initializeBoard}
            />
            <Board
                board={board}
                onCellClick={handleCellClick}
                onCellRightClick={handleRightClick}
                gameStatus={gameStatus}
            />
        </div>
    )
}

export default Minesweeper