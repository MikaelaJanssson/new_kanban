import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { KanbanProvider } from "./context/KanbanContext";
import Board from "./components/Board";
import ColumnPage from "./components/ColumnPage";
import "./App.css";

function App() {
  return (
    <KanbanProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Board />} />
          <Route path="/column/:columnId" element={<ColumnPage />} />
        </Routes>
      </Router>
    </KanbanProvider>
  );
}

export default App;
