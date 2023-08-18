import Variants from "./Skeleton";
import "../Styles/UserPage.css";
import { priorityOrder } from "./Upcoming";
import { useTaskContext } from "../../TaskContext";
import waitingForTasks from "../../WAITING.png";
import { upcomingTasksFilter } from "./Upcoming";
import ImageNotif from "./ImageNotif";
import IncomingIndividualTasks from "./IncomingIndividualTasks";

const ongoingTasksFilter = (tasks, today, currentTime) => {
  return tasks.filter(
    (task) =>
      task.taskStartDate === today &&
      !task.isCompleted &&
      task.taskStartTime.localeCompare(currentTime) < 0
  );
};

function Incoming({ tasks }) {
  const { sortBy, today, currentTime } = useTaskContext();
  const chosenCallbackForSort =
    sortBy === "Start-Time"
      ? (a, b) => b.taskStartTime.localeCompare(a.taskStartTime)
      : (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority];

  const incomingTasks = ongoingTasksFilter(tasks, today, currentTime);
  const upcomingTasks = upcomingTasksFilter(tasks, today, today, currentTime);

  return (
    <>
      <div className="task-display-1">
        <h2 className="status" style={{ marginBottom: "1.6em" }}>
          <span
            style={{
              height: "10px",
              width: "10px",
              backgroundColor: "orange",
              borderRadius: "50%",
              display: "inline-block",
              transform: "translateY(-3px)",
            }}
          />{" "}
          Ongoing Today
        </h2>
        {tasks ? (
          incomingTasks.length > 0 ? (
            incomingTasks
              .sort(chosenCallbackForSort)
              .map((task) => <IncomingIndividualTasks task={task} />)
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {upcomingTasks.length === 0 ? (
                <ImageNotif
                  illustration="https://i.imgur.com/QkR9ILI.png"
                  message="All tasks are completed!"
                />
              ) : (
                <ImageNotif
                  illustration={waitingForTasks}
                  message="Tasks yet to start!"
                />
              )}
            </div>
          )
        ) : (
          <Variants />
        )}
      </div>
    </>
  );
}

export default Incoming;
