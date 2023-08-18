import { useNavigate } from "react-router-dom";
import Upcoming from "./Upcoming";
import Incoming from "./Incoming";
import Completed from "./Completed";
import { useTaskContext } from "../../TaskContext";
import AddTasks from "../../ADD-TASKS.png";
import ImageNotif from "./ImageNotif";

function TaskDisplay({ tasks }) {
  const { setSortBy, today } = useTaskContext();
  let navigate = useNavigate();

  return (
    <>
      <div className="user-info-display">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "3em",
          }}
        >
          <span style={{ alignSelf: "flex-start", marginBottom: ".5em" }}>
            Sort By:
          </span>
          <select
            required
            className="user-inputs"
            style={{
              width: "150px",
              cursor: "pointer",
              fontFamily: "Quicksand",
            }}
            onChange={(e) => {
              setSortBy(e.target.value);
            }}
          >
            <option value="Start-Time">Start-Time</option>
            <option value="Priority">Priority</option>
          </select>
        </div>
        <button
          className="add-task"
          onClick={() => {
            navigate("/add-tasks");
          }}
        >
          + ADD TASK
        </button>
      </div>
      {tasks.length > 0 &&
      tasks.filter((task) => task.taskStartDate === today).length > 0 ? (
        <div className="main-task-display">
          <Upcoming tasks={tasks} />
          <Incoming tasks={tasks} />
          <Completed tasks={tasks} />
        </div>
      ) : (
        <ImageNotif
          illustration={AddTasks}
          message="No tasks for today. Get Started!"
        />
      )}
    </>
  );
}

export default TaskDisplay;
