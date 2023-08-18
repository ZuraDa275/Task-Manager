import create from "zustand";
import { devtools, persist } from "zustand/middleware";

const taskFunction = (set, get) => ({
  tasks: "",
  addTasks: (tasks) => set({ tasks }),
});

const useTaskStore = create(devtools(persist(taskFunction, { name: "tasks" })));

export default useTaskStore;
