// logic.js
import {CellState} from "./enums";

export function createCell(hasMine = false) {
    return {hasMine, adjacentMines: 0, state: CellState.CLOSED, isFlagged: false};
}

export function inBounds(totalRows, totalCols, row, col) {
    return row >= 0 && col >= 0 && row < totalRows && col < totalCols;
}

export function countNeighbourMines(field, row, col) {
    const totalRows = field.length;
    const totalCols = field[0].length;
    let mineCount = 0;
    for (let deltaRow = -1; deltaRow <= 1; deltaRow++) {
        for (let deltaCol = -1; deltaCol <= 1; deltaCol++) {
            if (deltaRow === 0 && deltaCol === 0) continue;
            const neighbourRow = row + deltaRow;
            const neighbourCol = col + deltaCol;
            if (inBounds(totalRows, totalCols, neighbourRow, neighbourCol) && field[neighbourRow][neighbourCol].hasMine) mineCount++;
        }
    }
    return mineCount;
}

export function generateField(cfg) {
    const {rows, cols, mines} = cfg;
    if (mines >= rows * cols) throw new Error("Кількість мін має бути меншою за кількість клітинок");

    const field = Array.from({length: rows}, () =>
        Array.from({length: cols}, () => createCell(false)),
    );

    const positions = [];
    for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) positions.push([row, col]);
    for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    for (let m = 0; m < mines; m++) {
        const [row, col] = positions[m];
        field[row][col].hasMine = true;
    }

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            field[row][col].adjacentMines = countNeighbourMines(field, row, col);
        }
    }

    return field;
}

export function floodOpen(field, startRow, startCol) {
    const totalRows = field.length;
    const totalCols = field[0].length;
    const stack = [[startRow, startCol]];
    const visited = new Set();
    const key = (row, col) => `${row},${col}`;

    while (stack.length) {
        const [row, col] = stack.pop();
        if (!inBounds(totalRows, totalCols, row, col)) continue;
        if (visited.has(key(row, col))) continue;
        visited.add(key(row, col));

        const cell = field[row][col];
        if (cell.isFlagged) continue;
        if (cell.state !== CellState.OPENED) cell.state = CellState.OPENED;

        if (!cell.hasMine && cell.adjacentMines === 0) {
            for (let deltaRow = -1; deltaRow <= 1; deltaRow++) {
                for (let deltaCol = -1; deltaCol <= 1; deltaCol++) {
                    if (deltaRow === 0 && deltaCol === 0) continue;
                    stack.push([row + deltaRow, col + deltaCol]);
                }
            }
        }
    }
}

export function cloneField(field) {
    return field.map(row => row.map(cell => ({...cell})));
}

export function allNonMinesOpened(field) {
    for (let row = 0; row < field.length; row++) {
        for (let col = 0; col < field[0].length; col++) {
            const cell = field[row][col];
            if (!cell.hasMine && cell.state !== CellState.OPENED) return false;
        }
    }
    return true;
}