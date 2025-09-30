import { useParams, Link } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import { useKanban } from "../context/useKanban";
import TaskModal from "./TaskModal";

function ColumnPage() {
  const { columnId } = useParams();
  const { columns, moveTask } = useKanban();
  const column = columns[columnId];

  // ====================
  // State och refs
  // ====================
  const [selectedTask, setSelectedTask] = useState(null); // task som öppnas i modal
  const [draggedItem, setDraggedItem] = useState(null); // desktop drag
  const [touchDragging, setTouchDragging] = useState(false); // touch drag flag
  const [touchTask, setTouchTask] = useState(null); // task som dras med touch
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 }); // touch position
  const longPressTimer = useRef(null); // timer för långtryck på touch

  // ====================
  // Touch end callback
  // ====================
  const handleTouchEnd = useCallback(() => {
    clearTimeout(longPressTimer.current);

    if (touchDragging && touchTask) {
      const element = document.elementFromPoint(
        touchPosition.x,
        touchPosition.y
      );

      if (element) {
        const colDiv = element.closest(".column");
        if (colDiv) {
          // Hitta kolumnen baserat på namn
          const targetColumnId = Object.keys(columns).find(
            (key) =>
              columns[key].name ===
              colDiv.querySelector(".column-header").textContent
          );
          if (targetColumnId) {
            moveTask(touchTask.columnId, targetColumnId, touchTask.item);
          }
        }
      }
    }

    setTouchDragging(false);
    setTouchTask(null);
  }, [touchDragging, touchTask, touchPosition, columns, moveTask]);

  // Global touchend effect

  useEffect(() => {
    const handleGlobalTouchEnd = () => handleTouchEnd();
    document.addEventListener("touchend", handleGlobalTouchEnd);
    return () => document.removeEventListener("touchend", handleGlobalTouchEnd);
  }, [handleTouchEnd]);

  // Early return om kolumn inte finns
  if (!column) return <h2>Column not found</h2>;

  // Desktop drag handlers
  const handleDragStart = (item) => {
    setDraggedItem({ columnId, item });
  };

  const handleDrop = () => {
    if (!draggedItem) return;
    moveTask(draggedItem.columnId, columnId, draggedItem.item);
    setDraggedItem(null);
  };

  // Touch handlers
  const handleTouchStart = (item, e) => {
    longPressTimer.current = setTimeout(() => {
      setTouchDragging(true);
      setTouchTask({ columnId, item });
      setTouchPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }, 300); // långtryck 300ms
  };

  const handleTouchMove = (e) => {
    if (!touchDragging) return;
    setTouchPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  // Render
  return (
    <div className="app">
      <h1 className="title">{column.name}</h1>

      <Link to="/" style={{ color: "#facc15", marginBottom: "20px" }}>
        ← Back to Board
      </Link>

      <div
        className="column-content"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {column.items.map((item) => (
          <div
            key={item.id}
            className="task"
            draggable
            onDragStart={() => handleDragStart(item)}
            onClick={() => setSelectedTask({ columnId, ...item })}
            onTouchStart={(e) => handleTouchStart(item, e)}
            onTouchMove={handleTouchMove}
          >
            {item.content}
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

export default ColumnPage;
