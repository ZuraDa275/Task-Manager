import { InputAdornment, TextField, Autocomplete } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import useSearchedUserCacheStore from "../../store/searchedCacheStore";
import useStore from "../../store/tokenStore";
import useMonthStore from "../../store/monthAndDaysStore";
import { useTaskContext } from "../../TaskContext";

const useStyles = makeStyles({
  searchBar: {
    "& .MuiFormLabel-root,& .MuiInputLabel-root, & .MuiInputLabel-formControl, & .MuiInputLabel-animated, & .MuiInputLabel-outlined, & .MuiFormLabel-colorPrimary, & .MuiInputLabel-root, & .MuiInputLabel-formControl, & .MuiInputLabel-animated, & .MuiInputLabel-outlined, & .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root":
      {
        color: "rgb(113, 108, 108)",
        fontFamily: "Quicksand",
      },
    "& .MuiButtonBase-root, & .MuiChip-root, & .MuiChip-filled, & .MuiChip-sizeMedium,& .MuiChip-colorDefault, & .MuiChip-deletable, & .MuiChip-deletableColorDefault, & .MuiChip-filledDefault,& .MuiAutocomplete-tag,& .MuiAutocomplete-tagSizeMedium,& .css-1q79v3g-MuiButtonBase-root-MuiChip-root":
      {
        color: "white",
        background: "#E76062",
        fontFamily: "Quicksand",
      },
  },
});

export default function SearchBar() {
  const { setError, setOpen } = useTaskContext();
  const setTaskMembers = useMonthStore((state) => state.setTaskMembers);
  const taskMembers = useMonthStore((state) => state.taskMembers);
  const token = useStore((state) => state.token);
  const [foundUsersList, setFoundUsersList] = useState([]);
  const classes = useStyles();
  const searchedUsers = useSearchedUserCacheStore(
    (state) => state.searchedUsers
  );
  const setSearchedUsers = useSearchedUserCacheStore(
    (state) => state.setSearchedUsers
  );

  const getUserList = async (searchTerm) => {
    try {
      const response = await axios.post(
        "/api/search-user",
        {
          search: searchTerm,
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      setSearchedUsers(response.data.userList);
      setFoundUsersList(response.data.userList);
    } catch (error) {
      setError(error.response.data.msg);
      setOpen(true);
    }
  };

  const searchFromCache = (searchTerm) => {
    if (
      searchedUsers?.filter((user) =>
        user.name.toLowerCase().startsWith(searchTerm.toLowerCase())
      ).length > 0
    )
      setFoundUsersList(
        searchedUsers?.filter((user) =>
          user.name.toLowerCase().startsWith(searchTerm.toLowerCase())
        )
      );
    else {
      setFoundUsersList([]);
      getUserList(searchTerm);
    }
  };
  return (
    <Autocomplete
      onChange={(e, newValue) => {
        setTaskMembers(
          newValue
            // ?.filter((member) => delete member?.profileImage)
            .map((member) => ({ ...member, isTaskAdmin: false }))
        );
      }}
      getOptionDisabled={(options) => (taskMembers.length === 4 ? true : false)}
      multiple
      freeSolo
      limitTags={4}
      id="multiple-limit-tags"
      options={foundUsersList}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField
          {...params}
          id="search"
          type="search"
          label="Search Users (Optional)"
          sx={{ width: "100%" }}
          style={{
            background: "#EEE",
            marginBottom: "1.2em",
            fontFamily: "Quicksand",
          }}
          className={classes.searchBar}
          onChange={(e) => {
            searchFromCache(e.target.value);
          }}
          InputProps={{
            ...params.InputProps,
            type: "search",
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}
