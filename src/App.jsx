import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Minesweeper from "./components/honcharuk-dmytro/Minesweeper";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/honcharuk-dmytro" replace />} />
        <Route path="/honcharuk-dmytro" element={<Minesweeper />} />
      </Routes>
    </Router>
  );
}

export default App;