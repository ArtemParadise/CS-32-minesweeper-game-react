import styles from './GameStatus.module.css'

function GameStatus({ mineCount, time, status, onReset }) {
    return (
        <div className={styles.statusContainer}>
            <div className={styles.infoPanel}>
                <div className={styles.infoItem}>
                    <span>Mines:</span> <strong>{mineCount}</strong>
                </div>
                <div className={styles.infoItem}>
                    <span>Time:</span> <strong>{time}s</strong>
                </div>
                <div className={`${styles.statusText} ${styles[status]}`}>
                    {status === 'playing' ? 'Playing' : status === 'won' ? 'You Won!' : 'Game Over'}
                </div>
            </div>
            <button className={styles.resetBtn} onClick={onReset}>
                Restart Game
            </button>
        </div>
    )
}

export default GameStatus