import React from "react";
import styles from "./Board.module.css";
import Cell from "./Cell";

export default function Board({ game, onLeftClick, onRightClick }) {
  const totalRows = game?.rows ?? 9;
  const totalColumns = game?.cols ?? 9;

  const gameField =
    game?.field ??
    Array.from({ length: totalRows }, () =>
      Array.from({ length: totalColumns }, () => ({
        hasMine: false,
        adjacentMines: 0,
        state: "closed",
      }))
    );

  return (
    <div
      className={`${styles.grid} ${!game ? styles.hidden : ""}`}
      style={{
        gridTemplateColumns: `repeat(${totalColumns}, 35px)`,
        gridTemplateRows: `repeat(${totalRows}, 35px)`,
      }}
    >
      {game &&
        gameField.map((rowData, rowIndex) =>
          rowData.map((cellData, columnIndex) => (
            <Cell
              key={`${rowIndex}-${columnIndex}`}
              cell={cellData}
              onLeftClick={() => {
                onLeftClick(rowIndex, columnIndex);
              }}
              onRightClick={(event) => {
                event.preventDefault();
                onRightClick(rowIndex, columnIndex);
              }}
            />
          ))
        )}
    </div>
  );
}
