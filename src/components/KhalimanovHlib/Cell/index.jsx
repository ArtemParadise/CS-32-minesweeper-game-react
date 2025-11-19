import styles from './Cell.module.css'

function Cell({ data, onClick, onContextMenu, disabled }) {
    const getCellContent = () => {
        if (!data.isRevealed) {
            return data.isFlagged ? '🚩' : ''
        }
        if (data.isMine) {
            return '💣'
        }
        return data.neighborCount > 0 ? data.neighborCount : ''
    }

    const getCellClass = () => {
        let classes = [styles.cell]
        if (data.isRevealed) {
            classes.push(styles.revealed)
            if (data.isMine) {
                classes.push(styles.mine)
            } else if (data.neighborCount > 0) {
                classes.push(styles[`number${data.neighborCount}`])
            }
        } else {
            classes.push(styles.hidden)
            if (data.isFlagged) {
                classes.push(styles.flagged)
            }
        }
        return classes.join(' ')
    }

    return (
        <button
            className={getCellClass()}
            onClick={onClick}
            onContextMenu={onContextMenu}
            disabled={disabled}
        >
            {getCellContent()}
        </button>
    )
}

export default Cell