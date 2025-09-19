import { createContext, useContext, useState, useEffect } from "react";

const KanbanContext = createContext();

export const KanbanProvider = ({ children }) => {
  const savedColumns = JSON.parse(localStorage.getItem("kanbanColumns"));

  const [columns, setColumns] = useState(
    savedColumns || {
      todo: {
        name: "To Do",
        items: [
          { id: "1", content: "Market research" },
          { id: "2", content: "Write projects" },
        ],
      },
      inProgress: {
        name: "In Progress",
        items: [{ id: "3", content: "Design UI mockups" }],
      },
      done: {
        name: "Done",
        items: [{ id: "4", content: "Set up repository" }],
      },
    }
  );

  useEffect(() => {
    localStorage.setItem("kanbanColumns", JSON.stringify(columns));
  }, [columns]);

  // Task-funktioner
  const addTask = (columnId, content) => {
    if (!content || !content.trim()) return;
    setColumns((prev) => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        items: [
          ...prev[columnId].items,
          { id: Date.now().toString(), content: content.trim() },
        ],
      },
    }));
  };

  const updateTask = (columnId, itemId, newContent) => {
    setColumns((prev) => {
      const updated = { ...prev };
      const item = updated[columnId].items.find((i) => i.id === itemId);
      if (item) item.content = newContent;
      return updated;
    });
  };

  const removeTask = (columnId, itemId) => {
    setColumns((prev) => {
      const updated = { ...prev };
      updated[columnId].items = updated[columnId].items.filter(
        (i) => i.id !== itemId
      );
      return updated;
    });
  };

  const moveTask = (fromColumn, toColumn, item) => {
    if (fromColumn === toColumn) return;
    setColumns((prev) => {
      const sourceItems = prev[fromColumn].items.filter(
        (i) => i.id !== item.id
      );
      const targetItems = [...prev[toColumn].items, item];
      return {
        ...prev,
        [fromColumn]: { ...prev[fromColumn], items: sourceItems },
        [toColumn]: { ...prev[toColumn], items: targetItems },
      };
    });
  };

  // Kolumn-funktioner
  const addColumn = (name) => {
    const id = Date.now().toString();
    setColumns((prev) => ({
      ...prev,
      [id]: { name, items: [] },
    }));
  };

  const removeColumn = (columnId) => {
    setColumns((prev) => {
      const updated = { ...prev };
      delete updated[columnId];
      return updated;
    });
  };

  return (
    <KanbanContext.Provider
      value={{
        columns,
        addTask,
        updateTask,
        removeTask,
        moveTask,
        removeColumn,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanban = () => useContext(KanbanContext);
