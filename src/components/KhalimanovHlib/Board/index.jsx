import Cell from '../Cell/index.jsx'
import styles from './Board.module.css'

function Board({ board, onCellClick, onCellRightClick, gameStatus }) {
    return (
        <div className={styles.board}>
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className={styles.row}>
                    {row.map((cell, colIndex) => (
                        <Cell
                            key={`${rowIndex}-${colIndex}`}
                            data={cell}
                            onClick={() => onCellClick(rowIndex, colIndex)}
                            onContextMenu={(e) => onCellRightClick(e, rowIndex, colIndex)}
                            disabled={gameStatus !== 'playing'}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}

export default Board