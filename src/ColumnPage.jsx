import { useParams, Link } from "react-router-dom";
// Importerar vår context-hook för att läsa och ändra Kanban-data
import { useKanban } from "./KanbanContext";
import { useState } from "react";
import TaskModal from "./TaskModal";

function ColumnPage() {
  // useParams hämtar parametrar från URL, t.ex. "/column/todo" ger columnId = "todo"
  const { columnId } = useParams();

  // Hämtar kolumner och moveTask-funktion från context
  const { columns, moveTask } = useKanban();

  // Hämtar just den kolumnen som matchar columnId från URL
  const column = columns[columnId];

  // State för vilken task som dras just nu (drag & drop)
  const [draggedItem, setDraggedItem] = useState(null);

  // State för vilken task som är klickad och visas i modal
  const [selectedTask, setSelectedTask] = useState(null);

  // Om kolumnen inte finns (t.ex. felaktig URL) visas ett felmeddelande
  if (!column) return <h2>Column not found</h2>;

  // Funktioner för drag & drop
  const handleDragStart = (item) => {
    // När man börjar dra en task sparas info om vilken kolumn och task
    setDraggedItem({ columnId, item });
  };

  const handleDrop = () => {
    // När man släpper tasken i denna kolumn
    if (!draggedItem) return; // Om inget dras, gör inget
    moveTask(draggedItem.columnId, columnId, draggedItem.item); // Flytta tasken
    setDraggedItem(null); // Nollställ draggedItem efter flytt
  };

  return (
    <div className="app">
      {/* Titel på kolumnen */}
      <h1 className="title">{column.name}</h1>

      {/* Länk tillbaka till huvud-board */}
      <Link to="/" style={{ color: "#facc15", marginBottom: "20px" }}>
        ← Back to Board
      </Link>

      {/* Kolumninnehåll (tasks) */}
      <div
        className="column-content"
        onDragOver={(e) => e.preventDefault()} // Tillåter drop
        onDrop={handleDrop} // När en task släpps här
      >
        {column.items.map((item) => (
          <div
            key={item.id} // React kräver unik key för listor
            className="task"
            draggable // Gör tasken draggbart
            onDragStart={() => handleDragStart(item)} // Starta drag
            onClick={() => setSelectedTask({ columnId, ...item })} // Öppna modal när task klickas
          >
            {item.content} {/* Taskens text */}
          </div>
        ))}
      </div>

      {/* Modal för att se/editera task */}
      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}

export default ColumnPage;
