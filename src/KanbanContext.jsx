import { createContext, useContext, useState, useEffect } from "react";

// Skapar ett nytt Context-objekt för Kanban
const KanbanContext = createContext();

// Provider-komponent som omsluter hela appen och gör Kanban-data tillgänglig
export const KanbanProvider = ({ children }) => {
  // Försök att läsa sparade kolumner från localStorage
  const savedColumns = JSON.parse(localStorage.getItem("kanbanColumns"));

  // State: "columns" innehåller alla kolumner och deras tasks
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

  // useEffect: Spara kolumnerna i localStorage varje gång de ändras
  useEffect(() => {
    localStorage.setItem("kanbanColumns", JSON.stringify(columns));
  }, [columns]);

  //FUNKTIONER FÖR TASKS

  // Lägg till en ny task i en viss kolumn
  const addTask = (columnId, content) => {
    if (!content || !content.trim()) return; // ignorera tomma inputs

    // Uppdatera state med en ny array som inkluderar den nya tasken
    setColumns((prev) => {
      return {
        ...prev, // behåll alla andra kolumner
        [columnId]: {
          ...prev[columnId], // behåll alla andra properties i kolumnen
          items: [
            ...prev[columnId].items, // behåll gamla tasks
            { id: Date.now().toString(), content: content.trim() }, // lägg till ny task
          ],
        },
      };
    });
  };

  // Uppdatera innehållet i en befintlig task
  const updateTask = (columnId, itemId, newContent) => {
    setColumns((prev) => {
      const updated = { ...prev }; // kopiera hela state
      const item = updated[columnId].items.find((i) => i.id === itemId); // hitta tasken
      if (item) item.content = newContent; // uppdatera texten
      return updated;
    });
  };

  // Ta bort en task
  const removeTask = (columnId, itemId) => {
    setColumns((prev) => {
      const updated = { ...prev }; // kopiera hela state
      // filtrera bort tasken som ska tas bort
      updated[columnId].items = updated[columnId].items.filter(
        (i) => i.id !== itemId
      );
      return updated;
    });
  };

  // Flytta en task från en kolumn till en annan
  const moveTask = (fromColumn, toColumn, item) => {
    if (fromColumn === toColumn) return; // om samma kolumn, gör inget

    setColumns((prev) => {
      // Ta bort tasken från källkolumnen
      const sourceItems = prev[fromColumn].items.filter(
        (i) => i.id !== item.id
      );
      // Lägg till tasken i målkolumnen
      const targetItems = [...prev[toColumn].items, item];

      return {
        ...prev,
        [fromColumn]: {
          ...prev[fromColumn],
          items: sourceItems, // ny array utan tasken
        },
        [toColumn]: {
          ...prev[toColumn],
          items: targetItems, // ny array med tasken
        },
      };
    });
  };

  // PROVIDER
  // Här gör vi state och funktioner tillgängliga för alla komponenter som använder useKanban
  return (
    <KanbanContext.Provider
      value={{ columns, addTask, updateTask, removeTask, moveTask }}
    >
      {children}
    </KanbanContext.Provider>
  );
};

// Hook för att använda KanbanContext lätt i andra komponenter
export const useKanban = () => useContext(KanbanContext);
