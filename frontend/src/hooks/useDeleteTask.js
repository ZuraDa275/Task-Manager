import axios from "axios";
import useStore from "../store/tokenStore";
import useMonthStore from "../store/monthAndDaysStore";
import { useGetUserInfo } from "./useGetUserInfo";
import { useAsyncDecorator } from "./useAsyncDecorator";

export const useDeleteTask = () => {
  const getUserInfo = useGetUserInfo();
  const setStatusTrack = useMonthStore((state) => state.setStatusTrack);
  const token = useStore((state) => state.token);

  const deleteTask = useAsyncDecorator(async (id) => {
    const res = await axios.put(
      "/api/taskdelete",
      {
        id,
      },
      {
        headers: { "x-auth-token": token },
      }
    );
    await getUserInfo();
    setStatusTrack(res.status);
    return res.data.msg;
  });
  return deleteTask;
};
