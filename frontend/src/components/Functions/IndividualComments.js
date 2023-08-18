import Avatar from "@mui/material/Avatar";
import { intlFormatDistance } from "date-fns";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { useState } from "react";
import TextField from "@mui/material/TextField";

export default function IndividualComments({
  username,
  taskMembers,
  individualComment,
  updateComments,
  deleteComment,
}) {
  const [editToggle, setEditToggle] = useState(false);
  const [editedValue, setEditedValue] = useState("");
  const commenterProfileImage = taskMembers.find(
    (mem) => mem.name === individualComment.name
  )?.profileImage;
  individualComment.profileImage = commenterProfileImage;
  return (
    <div className="individual-comments" style={{ marginBottom: "2em" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1em" }}>
        <Avatar
          alt={individualComment?.name}
          src={individualComment?.profileImage ?? individualComment?.name}
        />
        <p
          style={{
            fontFamily: "Poppins",
            fontSize: "1.3em",
            fontWeight: "bolder",
          }}
        >
          {individualComment?.name}
        </p>
        <div
          style={{
            marginLeft: "auto",
            marginRight: ".5em",
            display: "flex",
            alignItems: "center",
          }}
        >
          {individualComment?.name === username && (
            <>
              <FiEdit2
                className="individual-comment-mutation"
                onClick={() => {
                  setEditToggle(true);
                  setEditedValue(individualComment?.comment);
                }}
              />
              <AiOutlineDelete
                className="individual-comment-mutation"
                onClick={() => deleteComment(individualComment?.creationTime)}
              />
            </>
          )}
          <span
            style={{
              marginLeft: "auto",
              marginRight: ".5em",
              fontFamily: "raleway",
              opacity: ".6",
            }}
          >
            {intlFormatDistance(
              individualComment?.creationTime,
              new Date().getTime()
            )}
          </span>
        </div>
      </div>
      {!editToggle ? (
        <p style={{ width: "100%" }}>{individualComment?.comment}</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <TextField
            value={editedValue}
            id="outlined-basic"
            label="Edit the comment..."
            variant="outlined"
            style={{ width: "95%" }}
            onChange={(e) => {
              setEditedValue(e.target.value);
            }}
          />
          <button
            className="add-task-1"
            style={{ margin: "1.5em 1.2em 0 auto" }}
            onClick={() => {
              updateComments(editedValue, individualComment?.creationTime);
              setEditToggle(false);
            }}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
