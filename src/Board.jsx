import { useState } from "react";
import { Link } from "react-router-dom";
import { useKanban } from "./KanbanContext";
import TaskModal from "./TaskModal";

function Board() {
  const { columns, addTask, moveTask } = useKanban();
  const [newTask, setNewTask] = useState("");
  const [activeColumn, setActiveColumn] = useState("todo");
  const [draggedItem, setDraggedItem] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  // --- Lägg till ny task ---
  const handleAddTask = () => {
    if (!newTask.trim()) return;
    addTask(activeColumn, newTask);
    setNewTask(""); // töm input efter add
  };

  // --- Drag & Drop ---
  const handleDragStart = (columnId, item) => {
    setDraggedItem({ columnId, item }); // bara spara, inte ändra state ännu
  };

  const handleDrop = (columnId) => {
    if (!draggedItem) return;
    moveTask(draggedItem.columnId, columnId, draggedItem.item);
    setDraggedItem(null);
  };

  return (
    <div className="app">
      <h1 className="title">React Kanban Board</h1>

      {/* Input för ny task */}
      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
        />
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
        <button onClick={handleAddTask}>Add</button>
      </div>

      {/* Kolumner */}
      <div className="columns">
        {Object.keys(columns).map((columnId) => (
          <div key={columnId} className="column">
            <div className={`column-header ${columnId}`}>
              <Link to={`/column/${columnId}`} style={{ color: "inherit" }}>
                {columns[columnId].name}
              </Link>
              <span className="count">{columns[columnId].items.length}</span>
            </div>

            <div
              className="column-content"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(columnId)}
            >
              {columns[columnId].items.map((item) => (
                <div
                  key={item.id}
                  className="task"
                  draggable
                  onDragStart={() => handleDragStart(columnId, item)}
                  onClick={() => setSelectedTask({ columnId, ...item })}
                >
                  {item.content}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}

export default Board;
