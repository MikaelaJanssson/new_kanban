import { useParams, Link } from "react-router-dom";
import { useKanban } from "./KanbanContext";
import { useState } from "react";
import TaskModal from "./TaskModal";

function ColumnPage() {
  const { columnId } = useParams();
  const { columns, moveTask } = useKanban();
  const column = columns[columnId];
  const [draggedItem, setDraggedItem] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  if (!column) return <h2>Column not found</h2>;

  const handleDragStart = (item) => {
    setDraggedItem({ columnId, item });
  };

  const handleDrop = () => {
    if (!draggedItem) return;
    moveTask(draggedItem.columnId, columnId, draggedItem.item);
    setDraggedItem(null);
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
      >
        {column.items.map((item) => (
          <div
            key={item.id}
            className="task"
            draggable
            onDragStart={() => handleDragStart(item)}
            onClick={() => setSelectedTask({ columnId, ...item })}
          >
            {item.content}
          </div>
        ))}
      </div>

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}

export default ColumnPage;
