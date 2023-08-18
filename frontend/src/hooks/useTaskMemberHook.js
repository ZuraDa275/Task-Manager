import { useGetUserInfo } from "./useGetUserInfo";
import { useAsyncDecorator } from "./useAsyncDecorator";
import axios from "axios";
import useStore from "../store/tokenStore";
import useMonthStore from "../store/monthAndDaysStore";

export const useTaskMemberHook = () => {
  const getUserInfo = useGetUserInfo();
  const setStatusTrack = useMonthStore((state) => state.setStatusTrack);
  const token = useStore((state) => state.token);

  const memberFunc = useAsyncDecorator(async (url, reqBody) => {
    const res = await axios.put(url, reqBody, {
      headers: {
        "x-auth-token": token,
      },
    });
    await getUserInfo();
    setStatusTrack(res.status);
    return res.data.msg;
  });
  return memberFunc;
};
