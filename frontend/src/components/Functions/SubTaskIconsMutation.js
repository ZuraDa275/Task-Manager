import { AiOutlineDelete } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import ReplayIcon from "@mui/icons-material/Replay";

function SubTaskIconsMutation({
  taskMembers,
  subtask,
  onTitleChange,
  username,
  completeSubTask,
  reverseSubTaskCompletion,
  deleteSubTask,
}) {
  return (
    <>
      {taskMembers ? (
        taskMembers.find((mem) => mem.name === username).isTaskAdmin ? (
          //Visible to task admins
          <span
            style={{
              marginLeft: "auto",
              display: onTitleChange ? "none" : "block",
            }}
          >
            {!subtask.isCompleted ? (
              <TiTick
                onClick={completeSubTask}
                style={{
                  cursor: "pointer",
                  opacity: "0.65",
                  transform: "scale(1.5)",
                  marginRight: ".5em",
                }}
              />
            ) : (
              <ReplayIcon
                onClick={reverseSubTaskCompletion}
                style={{
                  cursor: "pointer",
                  opacity: "0.65",
                  transform: "scale(1.5)",
                  marginRight: ".5em",
                }}
              />
            )}
            <AiOutlineDelete
              onClick={deleteSubTask}
              style={{
                cursor: "pointer",
                opacity: "0.65",
                transform: "scale(1.5)",
              }}
            />
          </span>
        ) : (
          //Only visible to assigned members
          subtask.hasOwnProperty("assignedMember") &&
          subtask?.assignedMember?.name === username && (
            <span
              style={{
                marginLeft: "auto",
                display: onTitleChange ? "none" : "block",
              }}
            >
              {!subtask.isCompleted ? (
                <TiTick
                  onClick={completeSubTask}
                  style={{
                    cursor: "pointer",
                    opacity: "0.65",
                    transform: "scale(1.5)",
                    marginRight: ".5em",
                  }}
                />
              ) : (
                <ReplayIcon
                  onClick={reverseSubTaskCompletion}
                  style={{
                    cursor: "pointer",
                    opacity: "0.65",
                    transform: "scale(1.5)",
                    marginRight: ".5em",
                  }}
                />
              )}
            </span>
          )
        )
      ) : (
        //When there are no task members
        <span
          style={{
            marginLeft: "auto",
            display: onTitleChange ? "none" : "block",
          }}
        >
          {!subtask.isCompleted ? (
            <TiTick
              onClick={completeSubTask}
              style={{
                cursor: "pointer",
                opacity: "0.65",
                transform: "scale(1.5)",
                marginRight: ".5em",
              }}
            />
          ) : (
            <ReplayIcon
              onClick={reverseSubTaskCompletion}
              style={{
                cursor: "pointer",
                opacity: "0.65",
                transform: "scale(1.5)",
                marginRight: ".5em",
              }}
            />
          )}
          <AiOutlineDelete
            onClick={deleteSubTask}
            style={{
              cursor: "pointer",
              opacity: "0.65",
              transform: "scale(1.5)",
            }}
          />
        </span>
      )}
    </>
  );
}

export default SubTaskIconsMutation;
