import useStore from "../../store/tokenStore";
import axios from "axios";
import { useState, useRef } from "react";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import useMonthStore from "../../store/monthAndDaysStore";
import { useAsyncDecorator } from "../../hooks/useAsyncDecorator";

function UpdateMainTask({ task, menuListClose }) {
  const getUserInfo = useGetUserInfo();
  const setStatusTrack = useMonthStore((state) => state.setStatusTrack);
  const [prio, setPrio] = useState("");
  const token = useStore((state) => state.token);
  const taskRef = useRef(null);
  const taskDescRef = useRef(null);
  const taskStartTimeRef = useRef(null);
  const [taskStartDate, setTaskStartDate] = useState("");

  const updateTask = useAsyncDecorator(async () => {
    const res = await axios.put(
      "/api/taskupdate",
      {
        id: task._id,
        referralTaskID: task.referralTaskID ?? task.referralTaskID,
        taskName: taskRef.current.value,
        taskDescription: taskDescRef.current.value,
        taskStartDate,
        taskStartTime: taskStartTimeRef.current.value,
        priority: prio,
      },
      {
        headers: { "x-auth-token": token },
      }
    );
    await getUserInfo();
    setStatusTrack(res.status);
    return res.data.msg;
  });
  return (
    <>
      <h1 style={{ fontFamily: "Raleway" }}>Update Task</h1>
      <input
        className="user-inputs"
        placeholder="Title"
        type="text"
        ref={taskRef}
        defaultValue={task?.taskName}
      />
      <textarea
        className="user-inputs"
        placeholder="Description"
        ref={taskDescRef}
        defaultValue={task?.taskDescription}
      />

      <div className="timing-container-1">
        <input
          className="user-inputs"
          name="update-date-picker"
          type="date"
          defaultValue={task?.taskStartDate}
          onChange={(e) => {
            setTaskStartDate(e.target.value);
          }}
        />
        <select
          required
          className="user-inputs"
          style={{
            width: "125px",
            cursor: "pointer",
            fontFamily: "Quicksand",
          }}
          value={prio}
          onChange={(e) => {
            setPrio(e.target.value);
          }}
        >
          <option value="" disabled>
            {task.priority}
          </option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input
          className="user-inputs start-time"
          type="time"
          style={{ width: "20%" }}
          ref={taskStartTimeRef}
          defaultValue={task?.taskStartTime}
        />
        <button
          className="add-task-1"
          onClick={() => {
            setStatusTrack(1);
            updateTask();
            menuListClose();
          }}
        >
          UPDATE
        </button>
      </div>
    </>
  );
}

export default UpdateMainTask;
