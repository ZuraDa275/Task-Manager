import create from "zustand";
import { devtools, persist } from "zustand/middleware";

const tokenFunction = (set) => ({
  token: "",
  setToken: (token) => set({ token }),
});

const useStore = create(
  devtools(
    persist(tokenFunction, {
      name: "x-auth-token",
    })
  )
);

export default useStore;
