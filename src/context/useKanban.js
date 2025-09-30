import { useContext } from "react";
import { KanbanContext } from "./KanbanContextObject";

export const useKanban = () => useContext(KanbanContext);
