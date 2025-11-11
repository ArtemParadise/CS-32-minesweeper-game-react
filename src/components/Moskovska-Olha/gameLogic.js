import { directions, CellState } from './constants';

function createCell(hasMine = false) {
    return {
        hasMine,
        adjacentMines: 0,
        state: CellState.CLOSED,
    };
}

export function createBoard(rows, cols, minesCount) {
    const board = [];

    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            row.push(createCell());
        }
        board.push(row);
    }

    let placedMines = 0;
    while (placedMines < minesCount) {
        const randomRow = Math.floor(Math.random() * rows);
        const randomCol = Math.floor(Math.random() * cols);

        if (!board[randomRow][randomCol].hasMine) {
            board[randomRow][randomCol].hasMine = true;
            placedMines++;
        }
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].hasMine) continue;

            let count = 0;
            for (const [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].hasMine) {
                    count++;
                }
            }
            board[r][c].adjacentMines = count;
        }
    }

    return board;
}