import React, { useState, useEffect } from "react";
import { KanbanContext } from "./KanbanContextObject";

export const KanbanProvider = ({ children }) => {
  // === State-hantering ===
  // Försök läsa in sparade kolumner från localStorage
  const savedColumns = JSON.parse(localStorage.getItem("kanbanColumns"));

  // Om det finns sparade kolumner används de, annars skapas en startstruktur
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

  // Varje gång state (columns) ändras sparas det i localStorage
  useEffect(() => {
    localStorage.setItem("kanbanColumns", JSON.stringify(columns));
  }, [columns]);

  // === Funktioner för att hantera tasks ===

  // Lägg till en ny task i en specifik kolumn
  const addTask = (columnId, content) => {
    if (!content || !content.trim()) return; // förhindra tom text
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

  // Uppdatera innehållet i en befintlig task
  const updateTask = (columnId, itemId, newContent) => {
    setColumns((prev) => {
      const updated = { ...prev };
      const item = updated[columnId].items.find((i) => i.id === itemId);
      if (item) item.content = newContent;
      return updated;
    });
  };

  // Ta bort en task från en kolumn
  const removeTask = (columnId, itemId) => {
    setColumns((prev) => {
      const updated = { ...prev };
      updated[columnId].items = updated[columnId].items.filter(
        (i) => i.id !== itemId
      );
      return updated;
    });
  };

  // Flytta en task från en kolumn till en annan
  const moveTask = (fromColumn, toColumn, item) => {
    if (fromColumn === toColumn) return; // inget händer om samma kolumn
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

  // Ta bort en hel kolumn
  const removeColumn = (columnId) => {
    setColumns((prev) => {
      const updated = { ...prev };
      delete updated[columnId];
      return updated;
    });
  };

  // Provider skickar ut både data (columns) och funktioner
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
