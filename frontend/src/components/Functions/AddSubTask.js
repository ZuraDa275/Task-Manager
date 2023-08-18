import { CProgress } from "./Progress";
import { useState, useRef } from "react";
import { Collapse } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ListItemButton from "@mui/material/ListItemButton";
import useStore from "../../store/tokenStore";
import axios from "axios";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { useAsyncDecorator } from "../../hooks/useAsyncDecorator";
import useMonthStore from "../../store/monthAndDaysStore";

function AddSubTask({ task }) {
  const getUserInfo = useGetUserInfo();
  const setStatusTrack = useMonthStore((state) => state.setStatusTrack);
  const statusTrack = useMonthStore((state) => state.statusTrack);
  const token = useStore((state) => state.token);
  const taskRef = useRef(null);
  const taskDescRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };

  const addSubTask = useAsyncDecorator(async () => {
    const res = await axios.put(
      "/api/addSubTask",
      {
        id: task._id,
        referralTaskID: task.referralTaskID ?? task.referralTaskID,
        taskName: taskRef.current.value,
        taskDescription: taskDescRef.current.value,
      },
      {
        headers: {
          "x-auth-token": token,
        },
      }
    );
    await getUserInfo();
    setStatusTrack(res.status);
    taskRef.current.value = "";
    taskDescRef.current.value = "";
    return res.data.msg;
  });

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <h1 style={{ fontFamily: "Raleway" }}>Add Subtask&nbsp;&nbsp;</h1>
        {open ? (
          <ExpandLess style={{ transform: "scale(2)" }} />
        ) : (
          <ExpandMore style={{ transform: "scale(2)" }} />
        )}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <input
          className="user-inputs"
          placeholder="Title"
          type="text"
          ref={taskRef}
        />
        <textarea
          className="user-inputs"
          placeholder="Description"
          ref={taskDescRef}
        />
        <button
          style={{ marginLeft: "600px", marginTop: "20px" }}
          className="add-task-1"
          onClick={(e) => {
            setStatusTrack(1);
            addSubTask();
          }}
        >
          {statusTrack === 1 ? <CProgress /> : "ADD TASK"}
        </button>
      </Collapse>
    </>
  );
}

export default AddSubTask;
