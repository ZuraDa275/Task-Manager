import axios from "axios";
import useStore from "../store/tokenStore";
import useNameStore from "../store/usernameStore";
import { shallow } from "zustand/shallow";
import useTaskStore from "../store/taskStore";
import { useTaskContext } from "../TaskContext";

export const useGetUserInfo = () => {
  const { setNotifCount, setError, setOpen } = useTaskContext();
  const token = useStore((state) => state.token);
  const { setUserName, setEmail, setProfileImage } = useNameStore(
    (state) => ({
      setUserName: state.setUserName,
      setEmail: state.setEmail,
      setProfileImage: state.setProfileImage,
    }),
    shallow
  );
  const addTasks = useTaskStore((state) => state.addTasks);

  const getUserInfo = async () => {
    try {
      const res = await axios.get("/api/users", {
        headers: {
          "x-auth-token": token,
        },
      });
      setUserName(res.data.name);
      setEmail(res.data.email);
      setProfileImage(res.data.profileImage);
      setNotifCount(res.data.totalNumberOfNotifs);
      addTasks(res.data.tasks);
    } catch (error) {
      setOpen(true);
      setError(error?.response?.data?.msg);
    }
  };
  return getUserInfo;
};
