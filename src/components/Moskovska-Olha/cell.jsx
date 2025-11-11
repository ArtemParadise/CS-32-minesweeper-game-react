import React from 'react';
import { CellState } from './constants';
import styles from './styles.module.css';

const Cell = ({ cellData, onClick, onContextMenu }) => {
    const { state, hasMine, adjacentMines } = cellData;

    const getDisplay = () => {
        if (state === CellState.OPENED) {
            if (hasMine) return '💥';
            if (adjacentMines > 0) return adjacentMines;
            return '';
        }
        if (state === CellState.FLAGGED) return '🚩';
        if (state === 'mine-shown') return '💣';
        return '';
    };

    const getClassName = () => {
        let classes = styles.cell;

        if (state === 'mine-hit') {
            return `${classes} ${styles.mineHit}`;
        }
        if (state === 'mine-shown') {
            return `${classes} ${styles.mine}`;
        }

        switch (state) {
            case CellState.OPENED:
                classes += ` ${styles.open}`;
                if (adjacentMines > 0) {
                    classes += ` ${styles[`n${adjacentMines}`]}`;
                }
                break;
            case CellState.FLAGGED:
                classes += ` ${styles.flag}`;
                break;
            case CellState.CLOSED:
            default:
                classes += ` ${styles.closed}`;
                break;
        }
        return classes;
    };

    return (
        <div
            className={getClassName()}
            onClick={onClick}
            onContextMenu={onContextMenu}
        >
            {getDisplay()}
        </div>
    );
};

export default Cell;