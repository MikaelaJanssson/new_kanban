import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useKanban } from "../context/KanbanContext";
import TaskModal from "./TaskModal";

function Board() {
  const { columns, addTask, moveTask } = useKanban();

  const [newTask, setNewTask] = useState("");
  const [activeColumn, setActiveColumn] = useState("todo");
  const [selectedTask, setSelectedTask] = useState(null);

  // Desktop drag
  const [draggedItem, setDraggedItem] = useState(null);

  // Touch drag
  const [touchDragging, setTouchDragging] = useState(false);
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const longPressTimer = useRef(null);
  const draggedItemRef = useRef(null);

  // Lägg till ny task
  const handleAddTask = () => {
    if (!newTask.trim()) return;
    addTask(activeColumn, newTask);
    setNewTask("");
  };

  // Desktop drag handlers
  const handleDragStart = (columnId, item) => {
    setDraggedItem({ columnId, item });
  };

  const handleDrop = (columnId) => {
    if (!draggedItem) return;
    moveTask(draggedItem.columnId, columnId, draggedItem.item);
    setDraggedItem(null);
  };

  // Touch handlers
  const handleTouchStart = (columnId, item, e) => {
    longPressTimer.current = setTimeout(() => {
      setTouchDragging(true);
      draggedItemRef.current = { columnId, item };
      setTouchPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }, 400); // long press 400ms
  };

  const handleTouchMove = (e) => {
    if (!touchDragging) return;
    setTouchPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleColumnTouchEnd = (columnId) => {
    clearTimeout(longPressTimer.current);
    if (touchDragging && draggedItemRef.current) {
      moveTask(
        draggedItemRef.current.columnId,
        columnId,
        draggedItemRef.current.item
      );
    }
    setTouchDragging(false);
    draggedItemRef.current = null;
  };

  return (
    <div className="app">
      <h1 className="title">Kanban Board</h1>

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
              onTouchEnd={() => handleColumnTouchEnd(columnId)}
            >
              {columns[columnId].items.map((item) => (
                <div
                  key={item.id}
                  className="task"
                  draggable
                  onDragStart={() => handleDragStart(columnId, item)}
                  onClick={() =>
                    !touchDragging && setSelectedTask({ columnId, ...item })
                  }
                  onTouchStart={(e) => handleTouchStart(columnId, item, e)}
                  onTouchMove={handleTouchMove}
                >
                  {item.content}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Touch drag preview */}
      {touchDragging && draggedItemRef.current && (
        <div
          className="task"
          style={{
            position: "fixed",
            top: touchPosition.y - 30,
            left: touchPosition.x - 75,
            width: 150,
            pointerEvents: "none",
            opacity: 0.8,
            zIndex: 999,
          }}
        >
          {draggedItemRef.current.item.content}
        </div>
      )}

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}

export default Board;
