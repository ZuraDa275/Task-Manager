import { createContext, useState, useContext } from "react";

const TaskContext = createContext();

export const TaskContextProvider = ({ children }) => {
  const date = new Date();
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [sortBy, setSortBy] = useState("Start-Time");

  const today =
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0");

  const currentTime =
    String(date.getHours()).padStart(2, "0") +
    ":" +
    String(date.getMinutes()).padStart(2, "0");

  return (
    <TaskContext.Provider
      value={{
        response,
        setResponse,
        error,
        setError,
        open,
        setOpen,
        notifCount,
        setNotifCount,
        sortBy,
        setSortBy,
        today,
        currentTime,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  return useContext(TaskContext);
};
