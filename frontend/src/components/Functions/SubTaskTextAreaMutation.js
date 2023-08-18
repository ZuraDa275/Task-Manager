function SubTaskTextAreaMutation({
  taskMembers,
  username,
  subtask,
  setSubTaskTextAreaMutation,
  setOnTitleChange,
}) {
  return (
    <>
      {taskMembers ? (
        taskMembers.find((mem) => mem.name === username).isTaskAdmin ||
        (subtask.hasOwnProperty("assignedMember") &&
          subtask?.assignedMember?.name === username) ? (
          //Visible to task admins and assigned members
          <textarea
            style={{
              textDecoration: subtask.isCompleted ? "line-through" : "",
              cursor: subtask.isCompleted ? "not-allowed" : "",
              pointerEvents: subtask.isCompleted ? "none" : "",
            }}
            className="input-desc"
            defaultValue={subtask.taskDescription}
            onChange={(e) => {
              if (
                e.target.value !== subtask.taskDescription &&
                e.target.value
              ) {
                setSubTaskTextAreaMutation(e.target.value);
                setOnTitleChange(true);
              } else {
                setSubTaskTextAreaMutation("");
                setOnTitleChange(false);
              }
            }}
          />
        ) : (
          //Visible to only members
          <p className="input-desc" style={{ marginTop: "-.5em" }}>
            {subtask.taskDescription}
          </p>
        )
      ) : (
        //Visible when task has no members
        <textarea
          style={{
            textDecoration: subtask.isCompleted ? "line-through" : "",
            cursor: subtask.isCompleted ? "not-allowed" : "",
            pointerEvents: subtask.isCompleted ? "none" : "",
          }}
          className="input-desc"
          defaultValue={subtask.taskDescription}
          onChange={(e) => {
            if (e.target.value !== subtask.taskDescription && e.target.value) {
              setSubTaskTextAreaMutation(e.target.value);
              setOnTitleChange(true);
            } else {
              setSubTaskTextAreaMutation("");
              setOnTitleChange(false);
            }
          }}
        />
      )}
    </>
  );
}

export default SubTaskTextAreaMutation;
