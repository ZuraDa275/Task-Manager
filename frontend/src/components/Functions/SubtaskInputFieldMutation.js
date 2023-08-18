function SubtaskInputFieldMutation({
  taskMembers,
  username,
  subtask,
  setSubTaskInputMutation,
  setOnTitleChange,
}) {
  return (
    <>
      {taskMembers ? (
        taskMembers.find((mem) => mem.name === username).isTaskAdmin ||
        (subtask.hasOwnProperty("assignedMember") &&
          subtask?.assignedMember?.name === username) ? (
          //Visible to task admins and assigned members
          <input
            style={{
              textDecoration: subtask.isCompleted ? "line-through" : "",
              cursor: subtask.isCompleted ? "not-allowed" : "",
              pointerEvents: subtask.isCompleted ? "none" : "",
            }}
            type="text"
            defaultValue={subtask.taskName}
            className="input-header"
            onChange={(e) => {
              if (e.target.value !== subtask.taskName && e.target.value) {
                setSubTaskInputMutation(e.target.value);
                setOnTitleChange(true);
              } else {
                setSubTaskInputMutation("");
                setOnTitleChange(false);
              }
            }}
          />
        ) : (
          //Visible to only members
          <h2 className="input-header" style={{ marginTop: "-0.1em" }}>
            {subtask.taskName}
          </h2>
        )
      ) : (
        //Visible when task has no members
        <input
          style={{
            textDecoration: subtask.isCompleted ? "line-through" : "",
            cursor: subtask.isCompleted ? "not-allowed" : "",
            pointerEvents: subtask.isCompleted ? "none" : "",
          }}
          type="text"
          defaultValue={subtask.taskName}
          className="input-header"
          onChange={(e) => {
            if (e.target.value !== subtask.taskName && e.target.value) {
              setSubTaskInputMutation(e.target.value);
              setOnTitleChange(true);
            } else {
              setSubTaskInputMutation("");
              setOnTitleChange(false);
            }
          }}
        />
      )}
    </>
  );
}

export default SubtaskInputFieldMutation;
