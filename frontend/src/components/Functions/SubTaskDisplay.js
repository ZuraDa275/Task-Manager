import { AiOutlineEye } from "react-icons/ai";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { useState } from "react";
import "../Styles/SubTaskDisplay.css";
import IndividualSubTasks from "./IndividualSubTasks";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  width: 800,
  height: 800,
  overflowY: "auto",
};

function SubTaskDisplay({ task }) {
  const [countTotalCompletedSubTasks, setCountTotalCompletedSubTasks] =
    useState(task.subtasks.filter((sub) => sub.isCompleted).length);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <AiOutlineEye
        onClick={handleOpen}
        style={{
          cursor: "pointer",
          opacity: "0.5",
          fontSize: "2em",
        }}
      />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <h1
              style={{
                fontFamily: "Raleway",
                borderBottom: "2px solid rgba(0,0,0,0.2)",
                paddingBottom: ".4em",
              }}
            >
              Subtasks Completed: {countTotalCompletedSubTasks}/
              {task.subtasks.length}
            </h1>

            {task.subtasks.map((sub) => (
              <IndividualSubTasks
                subtask={sub}
                task={task}
                key={sub._id}
                setCountTotalCompletedSubTasks={(value) =>
                  setCountTotalCompletedSubTasks(value)
                }
              />
            ))}
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default SubTaskDisplay;
