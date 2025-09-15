import { useState } from "react";
// Importerar vår Kanban-context för att kunna uppdatera eller ta bort tasks
import { useKanban } from "./KanbanContext";

// Komponent för modalen som öppnas när man vill redigera en task
function TaskModal({ task, onClose }) {
  // Hämtar funktioner från Kanban-context
  const { updateTask, removeTask } = useKanban();

  // Local state för inputfältet i modalen, startar med taskens nuvarande innehåll
  const [value, setValue] = useState(task.content);

  // Funktion som körs när man klickar "Save"
  const handleSave = () => {
    // Uppdatera tasken med det nya värdet
    updateTask(task.columnId, task.id, value);
    onClose(); // stäng modalen
  };

  // Funktion som körs när man klickar "Delete"
  const handleDelete = () => {
    // Ta bort tasken från kolumnen
    removeTask(task.columnId, task.id);
    onClose(); // stäng modalen
  };

  return (
    <div className="modal-backdrop">
      {/* Själva modalen */}
      <div className="modal">
        <h3>Edit Task</h3>
        {/* Inputfält för att ändra texten */}
        <input value={value} onChange={(e) => setValue(e.target.value)} />

        {/* Knappar för att spara, ta bort eller avbryta */}
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
