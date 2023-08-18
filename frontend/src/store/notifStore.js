import create from "zustand";
import { devtools, persist } from "zustand/middleware";

const notifFunction = (set) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  unshiftNotifications: (newNotifs) =>
    set((state) => ({
      notifications: [...newNotifs, ...state.notifications],
    })),
});

const useNotifStore = create(
  devtools(persist(notifFunction, { name: "notifications" }))
);

export default useNotifStore;
