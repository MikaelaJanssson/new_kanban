import { useState } from "react"; // Importerar React-hooken useState för att hålla koll på lokala state
import { Link } from "react-router-dom"; // Importerar Link för navigering mellan sidor/URL:er
import { useKanban } from "./KanbanContext"; // Importerar vår egna context-hook för statehantering
import TaskModal from "./TaskModal"; // Importerar komponenten som visar popup/modal för en task

function Board() {
  // Hämtar kolumner och funktioner från KanbanContext
  const { columns, addTask, moveTask } = useKanban();

  // State för inputfältet där användaren skriver en ny task
  const [newTask, setNewTask] = useState("");

  // State för vilken kolumn den nya tasken ska läggas till i
  const [activeColumn, setActiveColumn] = useState("todo");

  // State för vilken task som just nu "dras" under drag & drop
  const [draggedItem, setDraggedItem] = useState(null);

  // State för vilken task som är klickad för att visa modal (detaljer)
  const [selectedTask, setSelectedTask] = useState(null);

  // Funktion för att lägga till en ny task
  const handleAddTask = () => {
    if (!newTask.trim()) return; // Om input är tom, gör inget
    addTask(activeColumn, newTask); // Lägg till task i vald kolumn
    setNewTask(""); // Töm inputfältet efter att tasken lagts till
  };

  // Drag & Drop
  const handleDragStart = (columnId, item) => {
    // När användaren börjar dra en task sparas info om kolumn + task
    setDraggedItem({ columnId, item });
  };

  const handleDrop = (columnId) => {
    // När task släpps i en kolumn
    if (!draggedItem) return; // Om inget dras, gör inget
    moveTask(draggedItem.columnId, columnId, draggedItem.item); // Flytta task från startkolumn till drop-kolumn
    setDraggedItem(null); // Nollställ draggedItem efter flytt
  };

  return (
    <div className="app">
      <h1 className="title"> Kanban Board</h1>

      {/* Input för ny task */}
      <div className="task-input">
        {/* Textfält för task-innehåll */}
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)} // uppdaterar state när användaren skriver
          placeholder="Add a new task..."
          onKeyDown={(e) => e.key === "Enter" && handleAddTask()} // Lägg till task om Enter trycks
        />

        {/* Dropdown för att välja kolumn */}
        <select
          value={activeColumn}
          onChange={(e) => setActiveColumn(e.target.value)}
        >
          {Object.keys(columns).map((colId) => (
            <option key={colId} value={colId}>
              {columns[colId].name}
            </option>
          ))}
        </select>

        {/* Knapp för att lägga till task */}
        <button onClick={handleAddTask}>Add</button>
      </div>

      {/* Kolumner */}
      <div className="columns">
        {Object.keys(columns).map((columnId) => (
          <div key={columnId} className="column">
            {/* Kolumn-header */}
            <div className={`column-header ${columnId}`}>
              {/* Länk för att se enbart den här kolumnen */}
              <Link to={`/column/${columnId}`} style={{ color: "inherit" }}>
                {columns[columnId].name}
              </Link>
              {/* Visa antal tasks i kolumnen */}
              <span className="count">{columns[columnId].items.length}</span>
            </div>

            {/* Kolumninnehåll (tasks) */}
            <div
              className="column-content"
              onDragOver={(e) => e.preventDefault()} // Tillåter drop
              onDrop={() => handleDrop(columnId)} // När task släpps här
            >
              {columns[columnId].items.map((item) => (
                <div
                  key={item.id}
                  className="task"
                  draggable // Gör elementet draggbart
                  onDragStart={() => handleDragStart(columnId, item)} // Starta drag
                  onClick={() => setSelectedTask({ columnId, ...item })} // Öppna modal när task klickas
                >
                  {item.content} {/* Taskens text */}
                </div>
              ))}
            </div>
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

export default Board;
