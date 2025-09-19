import { useParams, Link } from "react-router-dom";
import { useState, useRef } from "react";
import { useKanban } from "../context/KanbanContext";
import TaskModal from "./TaskModal";

function ColumnPage() {
  const { columnId } = useParams();
  const { columns, moveTask } = useKanban();
  const column = columns[columnId];

  const [selectedTask, setSelectedTask] = useState(null);

  // Desktop drag
  const [draggedItem, setDraggedItem] = useState(null);

  // Touch drag
  const [touchDragging, setTouchDragging] = useState(false);
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const longPressTimer = useRef(null);
  const draggedItemRef = useRef(null);

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
      draggedItemRef.current = { columnId, item };
      setTouchPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }, 400);
  };

  const handleTouchMove = (e) => {
    if (!touchDragging) return;
    setTouchPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleColumnTouchEnd = () => {
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
      <h1 className="title">{column.name}</h1>

      <Link to="/" style={{ color: "#facc15", marginBottom: "20px" }}>
        ← Back to Board
      </Link>

      <div
        className="column-content"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onTouchEnd={handleColumnTouchEnd}
      >
        {column.items.map((item) => (
          <div
            key={item.id}
            className="task"
            draggable
            onDragStart={() => handleDragStart(item)}
            onClick={() =>
              !touchDragging && setSelectedTask({ columnId, ...item })
            }
            onTouchStart={(e) => handleTouchStart(item, e)}
            onTouchMove={handleTouchMove}
          >
            {item.content}
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

export default ColumnPage;
