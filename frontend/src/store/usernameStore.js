import create from "zustand";
import { devtools, persist } from "zustand/middleware";

const nameFunction = (set) => ({
  userName: "",
  setUserName: (userName) => set({ userName }),
  email: "",
  setEmail: (email) => set({ email }),
  profileImage: "",
  setProfileImage: (profileImage) => set({ profileImage }),
  totalNotifCount: 0,
  setTotalNotifCount: (totalNotifCount) => set({ totalNotifCount }),
});

const useNameStore = create(
  devtools(persist(nameFunction, { name: "username" }))
);

export default useNameStore;
