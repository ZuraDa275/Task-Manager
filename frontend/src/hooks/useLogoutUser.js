import useStore from "../store/tokenStore";
import useNotifStore from "../store/notifStore";
import useTaskStore from "../store/taskStore";
import useNameStore from "../store/usernameStore";
import { useNavigate } from "react-router-dom";

export const useLogoutUser = () => {
  let navigate = useNavigate();
  const setNotifications = useNotifStore((state) => state.setNotifications);
  const setProfileImage = useNameStore((state) => state.setProfileImage);
  const setTotalNotifCount = useNameStore((state) => state.setTotalNotifCount);
  const setUserName = useNameStore((state) => state.setUserName);
  const addTasks = useTaskStore((state) => state.addTasks);
  const setEmail = useNameStore((state) => state.setEmail);
  const setToken = useStore((state) => state.setToken);

  const logout = () => {
    setToken("");
    setUserName("");
    addTasks("");
    setEmail("");
    setProfileImage("");
    setTotalNotifCount(0);
    setNotifications("");
    localStorage.clear();
    navigate("/");
  };
  return logout;
};
