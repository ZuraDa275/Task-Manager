import create from "zustand";
import { devtools, persist } from "zustand/middleware";

const searchedCacheStore = (set) => ({
  searchedUsers: [],
  setSearchedUsers: (newUser) =>
    set((state) => ({
      searchedUsers: [...newUser, ...state.searchedUsers],
    })),
});

const useSearchedUserCacheStore = create(
  devtools(
    persist(searchedCacheStore, {
      name: "searched-users",
    })
  )
);

export default useSearchedUserCacheStore;
