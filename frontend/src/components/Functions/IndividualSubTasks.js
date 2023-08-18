import { useState, useEffect } from "react";
import axios from "axios";
import useStore from "../../store/tokenStore";
import { CProgress } from "./Progress";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import AssignMemberButton from "./AssignMemberButton";
import { Avatar, Tooltip } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import useNameStore from "../../store/usernameStore";
import SubtaskInputFieldMutation from "./SubtaskInputFieldMutation";
import SubTaskTextAreaMutation from "./SubTaskTextAreaMutation";
import SubTaskIconsMutation from "./SubTaskIconsMutation";
import { useTaskMemberHook } from "../../hooks/useTaskMemberHook";
import { useAsyncDecorator } from "../../hooks/useAsyncDecorator";

export default function IndividualSubTasks({
  subtask,
  task,
  setCountTotalCompletedSubTasks,
}) {
  const getUserInfo = useGetUserInfo();
  const memberFunc = useTaskMemberHook();
  const token = useStore((state) => state.token);
  const [onTitleChange, setOnTitleChange] = useState(false);
  const [status, setStatus] = useState(0);
  const username = useNameStore((state) => state.userName);
  const [subtaskInputMutation, setSubTaskInputMutation] = useState("");
  const [subtaskTextAreaMutation, setSubTaskTextAreaMutation] = useState("");

  const updateSubTask = useAsyncDecorator(async () => {
    const res = await axios.put(
      "/api/updateSubTask",
      {
        taskID: task._id,
        subTaskID: subtask._id,
        referralTaskID: task.referralTaskID ?? task.referralTaskID,
        taskName: subtaskInputMutation,
        taskDescription: subtaskTextAreaMutation,
      },
      {
        headers: {
          "x-auth-token": token,
        },
      }
    );
    await getUserInfo();
    setStatus(res.status);
    setOnTitleChange(false);
    return res.data.msg;
  });

  useEffect(() => {
    setCountTotalCompletedSubTasks(
      task.subtasks.filter((sub) => sub.isCompleted).length
    );
  }, [setCountTotalCompletedSubTasks, task.subtasks]);
  return (
    <div
      className="individual-notifs"
      style={{
        width: "100%",
        borderLeft: "5px solid #e76062",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", marginBottom: "1.5em" }}>
          <SubtaskInputFieldMutation
            taskMembers={task?.memberList?.members}
            username={username}
            subtask={subtask}
            setSubTaskInputMutation={(updatedValue) =>
              setSubTaskInputMutation(updatedValue)
            }
            setOnTitleChange={(titleChange) => setOnTitleChange(titleChange)}
          />
          <SubTaskIconsMutation
            taskMembers={task?.memberList?.members}
            subtask={subtask}
            onTitleChange={onTitleChange}
            username={username}
            completeSubTask={() =>
              memberFunc("/api/completeSubTask", {
                taskID: task._id,
                referralTaskID: task.referralTaskID ?? task.referralTaskID,
                subTaskID: subtask._id,
              })
            }
            reverseSubTaskCompletion={() =>
              memberFunc("/api/reverse-subtask-completion", {
                taskID: task._id,
                referralTaskID: task.referralTaskID ?? task.referralTaskID,
                subTaskID: subtask._id,
              })
            }
            deleteSubTask={() =>
              memberFunc("/api/deleteSubTask", {
                taskID: task._id,
                referralTaskID: task.referralTaskID ?? task.referralTaskID,
                subTaskID: subtask._id,
              })
            }
          />
          <button
            className="add-task-1"
            style={{
              marginLeft: "auto",
              fontSize: "1em",
              display: onTitleChange ? "block" : "none",
            }}
            onClick={() => {
              setStatus(1);
              updateSubTask();
            }}
          >
            {status === 1 ? <CProgress /> : "EDIT"}
          </button>
        </div>
        <SubTaskTextAreaMutation
          taskMembers={task?.memberList?.members}
          username={username}
          subtask={subtask}
          setSubTaskTextAreaMutation={(updatedValue) =>
            setSubTaskTextAreaMutation(updatedValue)
          }
          setOnTitleChange={(titleChange) => setOnTitleChange(titleChange)}
        />
        <div style={{ marginLeft: "auto" }}>
          {subtask.hasOwnProperty("assignedMember") &&
          Object.keys(subtask.assignedMember).length > 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: ".5em" }}>
              <Tooltip title={subtask?.assignedMember?.name}>
                <Avatar
                  alt={subtask?.assignedMember?.name}
                  src={
                    task.memberList.members.find(
                      (mem) => mem.name === subtask?.assignedMember?.name
                    ).profileImage
                  }
                  sx={{ width: 40, height: 40 }}
                />
              </Tooltip>
              {task.memberList.members.find((mem) => mem.name === username)
                .isTaskAdmin && (
                <RemoveCircleOutlineIcon
                  style={{
                    cursor: "pointer",
                    color: "red",
                  }}
                  onClick={() =>
                    memberFunc("/api/remove-subtask-member", {
                      taskID: task._id,
                      referralTaskID:
                        task.referralTaskID ?? task.referralTaskID,
                      subTaskID: subtask._id,
                    })
                  }
                />
              )}
            </div>
          ) : (
            task?.memberList?.members.length > 1 &&
            task?.memberList?.members.find((mem) => mem.name === username)
              .isTaskAdmin &&
            !subtask.isCompleted && (
              <AssignMemberButton
                taskMembers={task.memberList.members}
                taskID={task._id}
                subTaskID={subtask._id}
                referralTaskID={task.referralTaskID}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
