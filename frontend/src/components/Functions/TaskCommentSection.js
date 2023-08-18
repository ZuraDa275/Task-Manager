import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import IndividualComments from "./IndividualComments";
import useNameStore from "../../store/usernameStore";
import axios from "axios";
import useStore from "../../store/tokenStore";
import Chip from "@mui/material/Chip";
import { intlFormatDistance } from "date-fns";
import { useAsyncDecorator } from "../../hooks/useAsyncDecorator";
import ImageNotif from "./ImageNotif";

export default function TaskCommentSection({
  taskMembers,
  taskID,
  referralTaskID,
}) {
  const username = useNameStore((state) => state.userName);
  const [comments, setComments] = useState([]);
  const [commentValue, setCommentValue] = useState("");
  const token = useStore((state) => state.token);

  const getComments = async () => {
    const response = await axios.post(
      "/api/get-comments",
      {
        taskID,
        referralTaskID,
      },
      {
        headers: { "x-auth-token": token },
      }
    );
    setComments(response?.data?.comments);
  };

  const addCommentFunc = useAsyncDecorator(async (comments) => {
    const response = await axios.put(
      "/api/add-comment",
      {
        taskID,
        referralTaskID,
        comments,
      },
      {
        headers: { "x-auth-token": token },
      }
    );
    getComments();
    return response.data.msg;
  });

  const updateComment = useAsyncDecorator(
    async (comment, commentCreationTime) => {
      const response = await axios.put(
        "/api/update-comment",
        {
          taskID,
          referralTaskID,
          commentCreationTime,
          comment,
        },
        {
          headers: { "x-auth-token": token },
        }
      );
      getComments();
      return response.data.msg;
    }
  );

  const deleteComment = useAsyncDecorator(async (commentCreationTime) => {
    const response = await axios.put(
      "/api/delete-comment",
      {
        taskID,
        referralTaskID,
        commentCreationTime,
      },
      {
        headers: { "x-auth-token": token },
      }
    );
    getComments();
    return response.data.msg;
  });

  useEffect(() => {
    getComments();
  }, []);

  return (
    <div
      style={{
        borderRight: "2px solid #E76062",
        marginRight: "1em",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <h1 style={{ fontFamily: "Poppins" }}>Comment Section: </h1>

      <div>
        {comments?.length > 0 ? (
          comments?.map((com, i) => {
            if (com.name === com.comment) {
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "1.5em",
                  }}
                  key={i}
                >
                  <Chip
                    label={`${
                      username === com.name ? "You" : com.name
                    } left ${intlFormatDistance(
                      com.creationTime,
                      new Date().getTime()
                    )}`}
                    style={{ fontFamily: "poppins" }}
                  />
                </div>
              );
            } else {
              return (
                <IndividualComments
                  key={i}
                  username={username}
                  taskMembers={taskMembers}
                  individualComment={com}
                  updateComments={(editedValue, commentCreationTime) => {
                    updateComment(editedValue, commentCreationTime);
                  }}
                  deleteComment={(commentCreationTime) => {
                    deleteComment(commentCreationTime);
                  }}
                />
              );
            }
          })
        ) : (
          <ImageNotif
            illustration="https://i.imgur.com/4jWyfsF.png"
            message="No comments yet, be the first to say something!../"
          />
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          bottom: 0,
          width: "100%",
          padding: "1.2rem",
          backgroundColor: "white",
        }}
      >
        <TextField
          value={commentValue}
          id="outlined-basic"
          label="Add a comment..."
          variant="outlined"
          style={{ width: "95%" }}
          onChange={(e) => {
            setCommentValue(e.target.value);
          }}
        />
        {commentValue && (
          <button
            className="add-task-1"
            style={{ margin: "1.5em 1.2em 0 auto", boxShadow: "none" }}
            onClick={() => {
              addCommentFunc({
                name: username,
                creationTime: new Date().getTime(),
                comment: commentValue,
              });
              setCommentValue("");
            }}
          >
            Comment
          </button>
        )}
      </div>
    </div>
  );
}
