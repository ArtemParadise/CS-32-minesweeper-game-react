export const ROWS = 16;
export const COLS = 10;
export const MINES_COUNT = 10;

export const CellState = {
    CLOSED: "closed",
    OPENED: "opened",
    FLAGGED: "flagged",
};

export const GameState = {
    IN_PROGRESS: "inProgress",
    WON: "won",
    LOST: "lost",
};

export const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
];