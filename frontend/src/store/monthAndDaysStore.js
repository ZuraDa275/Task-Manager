import create from "zustand";

const useMonthStore = create((set) => ({
  months: [
    "Jan",
    "Feb",
    "Mar",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ],
  startDate: "",
  setStartDate: (startDate) => set({ startDate }),
  taskMembers: [],
  setTaskMembers: (taskMembers) => set({ taskMembers }),
  statusTrack: 0,
  setStatusTrack: (statusTrack) => set({ statusTrack }),
}));

export default useMonthStore;
