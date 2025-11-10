import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Minesweeper from './components/ korneeva sofiya/Minesweeper';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/korneeva sofiya" element={<Minesweeper />} />
      </Routes>
    </Router>
  );
}

export default App;