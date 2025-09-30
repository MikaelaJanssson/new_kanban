import { useState } from "react";
import { useKanban } from "../context/useKanban";

// TaskModal används för att visa och redigera en enskild task
function TaskModal({ task, onClose }) {
  // Hämtar funktioner från KanbanContext
  const { updateTask, removeTask } = useKanban();

  // Lokal state för input-fältet, initieras med task nuvarande innehåll
  const [value, setValue] = useState(task.content);

  // Spara ändringar: uppdaterar task i context och stänger modal
  const handleSave = () => {
    updateTask(task.columnId, task.id, value);
    onClose();
  };

  // Ta bort task: tar bort task från context och stänger modal
  const handleDelete = () => {
    removeTask(task.columnId, task.id);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Edit Task</h3>
        {/* Inputfält där användaren kan redigera taskens innehåll */}
        <input value={value} onChange={(e) => setValue(e.target.value)} />
        <div className="modal-buttons">
          {/* Spara-knapp */}
          <button onClick={handleSave}>Save</button>
          {/* Ta bort-knapp */}
          <button onClick={handleDelete} style={{ color: "red" }}>
            Delete
          </button>
          {/* Avbryt-knapp: stänger modalen utan att ändra */}
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
