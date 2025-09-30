import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useKanban } from "../context/useKanban";
import TaskModal from "./TaskModal";

function Board() {
  const { columns, addTask, moveTask } = useKanban();

  // State för input och modal
  const [newTask, setNewTask] = useState(""); // text för ny task
  const [activeColumn, setActiveColumn] = useState("todo"); // vilken kolumn inputen ska läggas i
  const [selectedTask, setSelectedTask] = useState(null); // aktuell task för modal

  // Desktop drag
  const [draggedItem, setDraggedItem] = useState(null);

  //  Touch drag
  const [touchDragging, setTouchDragging] = useState(false);
  const [touchTask, setTouchTask] = useState(null);
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const longPressTimer = useRef(null);

  // Lägg till ny task
  const handleAddTask = () => {
    if (!newTask.trim()) return;
    addTask(activeColumn, newTask);
    setNewTask("");
  };

  // Desktop drag
  const handleDragStart = (columnId, item) => {
    setDraggedItem({ columnId, item });
  };
  const handleDrop = (columnId) => {
    if (!draggedItem) return;
    moveTask(draggedItem.columnId, columnId, draggedItem.item);
    setDraggedItem(null);
  };

  //  Touch drag
  const handleTouchStart = (columnId, item, e) => {
    // Starta långtryck-timer (300ms) innan drag start
    longPressTimer.current = setTimeout(() => {
      setTouchDragging(true);
      setTouchTask({ columnId, item });
      setTouchPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }, 300);
  };

  const handleTouchMove = (e) => {
    if (!touchDragging) return;
    setTouchPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  // useCallback så vi kan lista den i useEffect dependencies
  const handleTouchEnd = useCallback(() => {
    clearTimeout(longPressTimer.current);
    if (touchDragging && touchTask) {
      // Kolla vilken kolumn som ligger under fingret
      const element = document.elementFromPoint(
        touchPosition.x,
        touchPosition.y
      );
      if (element) {
        const colDiv = element.closest(".column");
        if (colDiv && colDiv.dataset.columnId) {
          const targetColumnId = colDiv.dataset.columnId;
          moveTask(touchTask.columnId, targetColumnId, touchTask.item);
        }
      }
    }
    setTouchDragging(false);
    setTouchTask(null);
  }, [touchDragging, touchTask, touchPosition, moveTask]);

  //  Global touchend
  useEffect(() => {
    const handleGlobalTouchEnd = () => {
      handleTouchEnd();
    };
    document.addEventListener("touchend", handleGlobalTouchEnd);
    return () => document.removeEventListener("touchend", handleGlobalTouchEnd);
  }, [handleTouchEnd]); // useCallback säkerställer rätt dependencies

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
          <div key={columnId} className="column" data-column-id={columnId}>
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
      {touchDragging && touchTask && (
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
          {touchTask.item.content}
        </div>
      )}

      {/* Modal för redigering av task */}
      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}

export default Board;
