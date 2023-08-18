import UpdateMainTask from "./UpdateMainTask";
import AddSubTask from "./AddSubTask";
import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import "../Styles/modal.css";

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
};

export default function UpdateModal({ task, menuListClose }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    menuListClose();
  };

  return (
    <>
      <div
        onClick={handleOpen}
        style={{ display: "flex", gap: ".5em", alignItems: "center" }}
      >
        <FiEdit2
          style={{
            cursor: "pointer",
            transform: "translateY(2px)",
            color: "orange",
            fontSize: "1.2em",
          }}
        />
        <span style={{ fontFamily: "Poppins", fontSize: "1.2em" }}>UPDATE</span>
      </div>
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
            <UpdateMainTask task={task} menuListClose={() => menuListClose()} />
            <AddSubTask task={task} />
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
