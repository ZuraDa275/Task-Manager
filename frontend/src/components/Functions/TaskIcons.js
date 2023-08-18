import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AiOutlineDelete } from "react-icons/ai";
import UpdateModal from "./modal";

const ITEM_HEIGHT = 48;

export default function TaskIcon({
  taskMembers,
  username,
  task,
  setStatusTrack,
  deleteTask,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disableRipple
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch",
          },
        }}
      >
        {taskMembers?.length > 0 ? (
          taskMembers?.find((mem) => mem?.name === username)?.isTaskAdmin ? (
            <div>
              <MenuItem>
                <UpdateModal task={task} menuListClose={() => handleClose()} />
              </MenuItem>
              {taskMembers?.length === 1 && (
                <DeleteTaskIcon
                  setStatusTrack={() => setStatusTrack()}
                  deleteTask={() => deleteTask(task._id)}
                  handleClose={() => handleClose()}
                />
              )}
            </div>
          ) : (
            ""
          )
        ) : (
          <div>
            <MenuItem>
              <UpdateModal task={task} menuListClose={() => handleClose()} />
            </MenuItem>
            <DeleteTaskIcon
              setStatusTrack={() => setStatusTrack()}
              deleteTask={() => deleteTask(task._id)}
              handleClose={() => handleClose()}
            />
          </div>
        )}
      </Menu>
    </div>
  );
}

function DeleteTaskIcon({ setStatusTrack, deleteTask, handleClose }) {
  return (
    <MenuItem
      onClick={() => {
        setStatusTrack();
        deleteTask();
        handleClose();
      }}
      style={{ display: "flex", gap: ".5em", alignItems: "center" }}
    >
      <AiOutlineDelete
        style={{
          cursor: "pointer",
          opacity: "0.65",
          color: "red",
          fontSize: "1.2em",
        }}
      />
      <span style={{ fontFamily: "Poppins", fontSize: "1.2em" }}>DELETE</span>
    </MenuItem>
  );
}
