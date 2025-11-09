import React from "react";
export default function Timer({ seconds }) {
  return <div>⏱ {seconds.toString().padStart(3, "0")}</div>;
}
