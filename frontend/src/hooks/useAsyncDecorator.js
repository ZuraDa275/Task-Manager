import { useTaskContext } from "../TaskContext";
import useMonthStore from "../store/monthAndDaysStore";

export const useAsyncDecorator = (apiCallToBeHandled) => {
  const { setResponse, setError, setOpen } = useTaskContext();
  const setStatusTrack = useMonthStore((state) => state.setStatusTrack);

  return async (...args) => {
    try {
      const response = await apiCallToBeHandled(...args);
      setResponse(response);
      setOpen(true);
    } catch (error) {
      setStatusTrack(error?.response?.status);
      setError(error?.response?.data?.msg);
      setOpen(true);
    }
  };
};
