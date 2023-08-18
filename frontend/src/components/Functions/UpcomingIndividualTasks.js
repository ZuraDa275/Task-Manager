import React from "react";
import useNameStore from "../../store/usernameStore";
import SubTaskDisplay from "./SubTaskDisplay";
import TaskIcon from "./TaskIcons";
import useMonthStore from "../../store/monthAndDaysStore";
import { useDeleteTask } from "../../hooks/useDeleteTask";
import TaskMembers from "./TaskMembers";
import { LinearWithValueLabel } from "./Progress";

function UpcomingIndividualTasks({ task }) {
  const username = useNameStore((state) => state.userName);
  const setStatusTrack = useMonthStore((state) => state.setStatusTrack);
  const deleteTask = useDeleteTask();
  return (
    <>
      <div className="blinker-time">
        <span className="blinker" />
        <span
          style={{
            fontFamily: "Raleway",
            fontWeight: "bold",
            fontSize: "1.5em",
          }}
        >
          {task.taskStartTime}
        </span>
      </div>

      <div
        id={`taskID`}
        key={task._id}
        className="individual-tasks"
        style={{ marginBottom: "3em" }}
      >
        <div className="title-bar">
          <h2>{task.taskName}</h2>
          <div className="update-n-delete">
            {task.subtasks.length > 0 && <SubTaskDisplay task={task} />}
            {task?.memberList?.members?.length > 0 ? (
              task?.memberList?.members?.find((mem) => mem?.name === username)
                ?.isTaskAdmin ? (
                <TaskIcon
                  taskMembers={task?.memberList?.members}
                  username={username}
                  task={task}
                  setStatusTrack={() => setStatusTrack(1)}
                  deleteTask={(id) => deleteTask(id)}
                />
              ) : (
                ""
              )
            ) : (
              <TaskIcon
                taskMembers={task?.memberList?.members}
                username={username}
                task={task}
                setStatusTrack={() => setStatusTrack(1)}
                deleteTask={(id) => deleteTask(id)}
              />
            )}
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
        {task.subtasks.length > 0 && (
          <LinearWithValueLabel
            completePercentage={
              (task.subtasks.filter((sub) => sub.isCompleted).length /
                task.subtasks.length) *
              100
            }
          />
        )}
      </div>
    </>
  );
}

export default UpcomingIndividualTasks;
