import { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import useStore from "../../store/tokenStore";
import { useAsyncDecorator } from "../../hooks/useAsyncDecorator";
import useMonthStore from "../../store/monthAndDaysStore";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default function AssignMemberButton({
  taskMembers,
  taskID,
  subTaskID,
  referralTaskID,
}) {
  const getUserInfo = useGetUserInfo();
  const token = useStore((state) => state.token);
  const setStatusTrack = useMonthStore((state) => state.setStatusTrack);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const assignSubtaskMember = useAsyncDecorator(async (assignedMember) => {
    const res = await axios.put(
      "/api/assign-subtask-member",
      { taskID, subTaskID, referralTaskID, assignedMember },
      {
        headers: {
          "x-auth-token": token,
        },
      }
    );
    await getUserInfo();
    setStatusTrack(res.status);
    return res.data.msg;
  });

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        color="error"
      >
        ASSIGN A MEMBER
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {taskMembers.map((mem) => (
          <MenuItem
            onClick={() => {
              setStatusTrack(1);
              assignSubtaskMember({ _id: mem._id, name: mem.name });
              handleClose();
            }}
            disableRipple
            key={mem?._id}
            style={{ display: "flex", gap: "1em" }}
          >
            <Avatar
              alt={mem?.name}
              src={mem?.profileImage ?? mem?.name}
              sx={{ width: 40, height: 40 }}
            />
            {mem?.name}

            <AddIcon
              style={{ marginLeft: "auto", color: "red", fontSize: "1.5em" }}
            />
          </MenuItem>
        ))}
      </StyledMenu>
    </div>
  );
}
