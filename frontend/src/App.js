import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import IntroPage from "./components/Functions/IntroPage";
import LoginPage from "./routes/Functions/LoginPage";
import RegisterPage from "./routes/Functions/RegisterPage";
import UserPage from "./components/Functions/UserPage";
import AddTask from "./routes/Functions/AddTask";
import Notifications from "./routes/Functions/Notifications";
import NotFound from "./routes/Functions/NotFound";
import Stats from "./routes/Functions/Stats";
import EditProfile from "./routes/Functions/EditProfile";
import SuccessSnackbar from "./components/Functions/SuccessSnackbar";
import ErrorSnackbar from "./components/Functions/ErrorSnackbar";
import { useTaskContext } from "./TaskContext";
import useMonthStore from "./store/monthAndDaysStore";
import { Progress } from "./components/Functions/Progress";

function App() {
  const { error, response } = useTaskContext();
  const statusTrack = useMonthStore((state) => state.statusTrack);
  return (
    <BrowserRouter>
      <div className="App">
        {statusTrack === 1 && <Progress />}
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="users" element={<UserPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="add-tasks" element={<AddTask />}></Route>
          <Route path="notifications" element={<Notifications />}></Route>
          <Route path="stats" element={<Stats />}></Route>
          <Route path="edit-profile" element={<EditProfile />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
        {response && <SuccessSnackbar />}
        {error && <ErrorSnackbar />}
      </div>
    </BrowserRouter>
  );
}

export default App;
