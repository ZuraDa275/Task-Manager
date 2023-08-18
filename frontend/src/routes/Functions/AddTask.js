import { useRef, useState } from "react";
import axios from "axios";
import useStore from "../../store/tokenStore";
import CalendarComp from "../../components/Functions/Calendar";
import "../Styles/AddTask.css";
import useMonthStore from "../../store/monthAndDaysStore";
import SearchBar from "../../components/Functions/SearchBar";
import AfterSignInNav from "../../components/Functions/AfterSignInNav";
import SideBar from "../../components/Functions/SideBar";
import { useAsyncDecorator } from "../../hooks/useAsyncDecorator";
import { shallow } from "zustand/shallow";

function AddTask() {
  const { startDate, taskMembers, setTaskMembers, setStatusTrack } =
    useMonthStore(
      (state) => ({
        startDate: state.startDate,
        taskMembers: state.taskMembers,
        setTaskMembers: state.setTaskMembers,
        setStatusTrack: state.setStatusTrack,
      }),
      shallow
    );
  const [prio, setPrio] = useState("");
  const token = useStore((state) => state.token);
  const taskRef = useRef(null);
  const taskDescRef = useRef(null);
  const taskStartTimeRef = useRef(null);

  const addNewTask = useAsyncDecorator(async () => {
    const res = await axios.put(
      "/api/addtasks",
      {
        taskName: taskRef.current.value,
        taskDescription: taskDescRef.current.value,
        taskStartDate: startDate,
        taskStartTime: taskStartTimeRef.current.value,
        isCompleted: false,
        priority: prio,
        members: taskMembers,
      },
      {
        headers: { "x-auth-token": token },
      }
    );
    setStatusTrack(res.status);
    taskRef.current.value = "";
    taskDescRef.current.value = "";
    taskStartTimeRef.current.value = "";
    setPrio("");
    setTaskMembers([]);
    return res.data.msg;
  });

  return (
    <div>
      <SideBar />
      <AfterSignInNav />
      <div className="add-task-container">
        <div className="input-container-1">
          <SearchBar />
          <input
            className="user-inputs"
            placeholder="Title"
            type="text"
            ref={taskRef}
          />

          <textarea
            style={{ width: "766px", height: "182px" }}
            className="user-inputs"
            placeholder="Description"
            ref={taskDescRef}
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
              Priority
            </option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <div className="timing-container">
            <input
              className="user-inputs start-time"
              type="time"
              style={{ width: "20%" }}
              ref={taskStartTimeRef}
            />

            <button
              className="add-task-1"
              onClick={() => {
                setStatusTrack(1);
                addNewTask();
              }}
            >
              ADD TASK
            </button>
          </div>
        </div>
        <CalendarComp />
      </div>
    </div>
  );
}

export default AddTask;
