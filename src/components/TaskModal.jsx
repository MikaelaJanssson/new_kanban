import { useState } from "react";
import { useKanban } from "../context/KanbanContext";

function TaskModal({ task, onClose }) {
  const { updateTask, removeTask } = useKanban();
  const [value, setValue] = useState(task.content);

  const handleSave = () => {
    updateTask(task.columnId, task.id, value);
    onClose();
  };
  const handleDelete = () => {
    removeTask(task.columnId, task.id);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Edit Task</h3>
        <input value={value} onChange={(e) => setValue(e.target.value)} />
        <div className="modal-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleDelete} style={{ color: "red" }}>
            Delete
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
