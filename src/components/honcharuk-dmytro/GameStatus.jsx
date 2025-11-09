import React from "react";
export default function GameStatus({ status }) {
  if (status === "win") return <div>🏆 Перемога!</div>;
  if (status === "lose") return <div>💥 Поразка!</div>;
  return <div>🙂 Гра триває</div>;
}
