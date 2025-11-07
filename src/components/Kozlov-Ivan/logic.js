// logic.js
import {CellState} from "./enums";

export function createCell(hasMine = false) {
    return {hasMine, adjacentMines: 0, state: CellState.CLOSED, isFlagged: false};
}

export function inBounds(rows, cols, r, c) {
    return r >= 0 && c >= 0 && r < rows && c < cols;
}

export function countNeighbourMines(field, row, col) {
    const rows = field.length;
    const cols = field[0].length;
    let mines = 0;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = row + dr;
            const nc = col + dc;
            if (inBounds(rows, cols, nr, nc) && field[nr][nc].hasMine) mines++;
        }
    }
    return mines;
}

export function generateField(cfg) {
    const {rows, cols, mines} = cfg;
    if (mines >= rows * cols) throw new Error("Кількість мін має бути меншою за кількість клітинок");

    const field = Array.from({length: rows}, () =>
        Array.from({length: cols}, () => createCell(false)),
    );

    const positions = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) positions.push([r, c]);
    for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    for (let m = 0; m < mines; m++) {
        const [r, c] = positions[m];
        field[r][c].hasMine = true;
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            field[r][c].adjacentMines = countNeighbourMines(field, r, c);
        }
    }

    return field;
}

export function floodOpen(field, startR, startC) {
    const rows = field.length;
    const cols = field[0].length;
    const stack = [[startR, startC]];
    const seen = new Set();
    const key = (r, c) => `${r},${c}`;

    while (stack.length) {
        const [r, c] = stack.pop();
        if (!inBounds(rows, cols, r, c)) continue;
        if (seen.has(key(r, c))) continue;
        seen.add(key(r, c));

        const cell = field[r][c];
        if (cell.isFlagged) continue;
        if (cell.state !== CellState.OPENED) cell.state = CellState.OPENED;

        if (!cell.hasMine && cell.adjacentMines === 0) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    stack.push([r + dr, c + dc]);
                }
            }
        }
    }
}

export function cloneField(field) {
    return field.map(row => row.map(cell => ({...cell})));
}

export function allNonMinesOpened(field) {
    for (let r = 0; r < field.length; r++) {
        for (let c = 0; c < field[0].length; c++) {
            const cell = field[r][c];
            if (!cell.hasMine && cell.state !== CellState.OPENED) return false;
        }
    }
    return true;
}