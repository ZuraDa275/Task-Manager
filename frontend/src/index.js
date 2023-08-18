import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { TaskContextProvider } from "./TaskContext";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  // <React.StrictMode>
  <TaskContextProvider>
    <App />
  </TaskContextProvider>
  // </React.StrictMode>
);
