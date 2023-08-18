import Variants from "./Skeleton";
import "../Styles/UserPage.css";
import TaskMembers from "./TaskMembers";
import ReplayIcon from "@mui/icons-material/Replay";
import axios from "axios";
import useStore from "../../store/tokenStore";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import PieChart from "./PieChart";
import { useAsyncDecorator } from "../../hooks/useAsyncDecorator";
import useMonthStore from "../../store/monthAndDaysStore";
import { useTaskContext } from "../../TaskContext";

const completedTasksFilter = (tasks, today) => {
  return tasks.filter(
    (task) => task.isCompleted && task.taskStartDate === today
  );
};

function Completed({ tasks }) {
  const getUserInfo = useGetUserInfo();
  const { today } = useTaskContext();
  const setStatusTrack = useMonthStore((state) => state.setStatusTrack);
  const token = useStore((state) => state.token);

  const reverseTaskCompletion = useAsyncDecorator(
    async (id, referralTaskID) => {
      const res = await axios.put(
        "/api/reverse-task-completion",
        {
          id,
          referralTaskID,
        },
        {
          headers: { "x-auth-token": token },
        }
      );
      await getUserInfo();
      setStatusTrack(res.status);
      return res.data.msg;
    }
  );

  const completedTasks = completedTasksFilter(tasks, today);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2 className="status">
        <span
          style={{
            height: "10px",
            width: "10px",
            backgroundColor: "green",
            borderRadius: "50%",
            display: "inline-block",
            transform: "translateY(-3px)",
          }}
        ></span>{" "}
        Completed
      </h2>
      <div
        className="task-display-1"
        style={{
          overflowY: "auto",
          maxHeight: "300px",
          scrollbarWidth: "thin",
          scrollbarColor: "#e76062 transparent",
        }}
      >
        {tasks ? (
          completedTasks.length > 0 ? (
            completedTasks.reverse().map((task, i) => (
              <div
                id={`taskID-${i}`}
                key={task._id}
                className="individual-tasks"
                style={{ marginTop: "-0.03em" }}
              >
                <div className="title-bar">
                  <h2>{task.taskName}</h2>
                  <div
                    className="update-n-delete"
                    style={{ cursor: "pointer", marginRight: ".3em" }}
                  >
                    <ReplayIcon
                      onClick={() => {
                        setStatusTrack(1);
                        reverseTaskCompletion(task._id, task.referralTaskID);
                      }}
                    />
                  </div>
                  <p
                    style={{
                      color:
                        task.priority === "Low"
                          ? "#6b9e82"
                          : task.priority === "Medium"
                          ? "#a26e49"
                          : "red",
                      backgroundColor:
                        task.priority === "Low"
                          ? "#e3f4ea"
                          : task.priority === "Medium"
                          ? "#fce3d3"
                          : "#ffcdce",
                    }}
                  >
                    {task.priority}
                  </p>
                </div>
                <p>{task.taskDescription}</p>
                {task?.memberList?.members?.length > 0 && (
                  <TaskMembers
                    taskMembers={task?.memberList?.members}
                    taskID={task?._id}
                    referralTaskID={task?.referralTaskID}
                  />
                )}
              </div>
            ))
          ) : (
            ""
          )
        ) : (
          <Variants />
        )}
      </div>
      <div
        style={{
          marginTop: "1.2em",
          width: "50%",
          alignSelf: "center",
          position: "sticky",
        }}
      >
        <PieChart tasks={tasks} />
      </div>
    </div>
  );
}
export default Completed;
