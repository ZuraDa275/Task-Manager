import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import "../Styles/modal.css";
import TaskCommentSection from "./TaskCommentSection";
import SearchBar from "./SearchBar";
import useMonthStore from "../../store/monthAndDaysStore";
import useNameStore from "../../store/usernameStore";
import Button from "@mui/material/Button";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import RemoveModeratorIcon from "@mui/icons-material/RemoveModerator";
import Tooltip from "@mui/material/Tooltip";
import { useTaskMemberHook } from "../../hooks/useTaskMemberHook";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  width: "auto",
  height: 800,
};

export default function TaskMembers({ taskMembers, taskID, referralTaskID }) {
  const memberFunc = useTaskMemberHook();
  const setStatusTrack = useMonthStore((state) => state.setStatusTrack);
  const newTaskMembers = useMonthStore((state) => state.taskMembers);
  const username = useNameStore((state) => state.userName);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <div
        style={{ display: "flex", marginBottom: ".5em", cursor: "pointer" }}
        onClick={handleOpen}
      >
        <AvatarGroup>
          {taskMembers?.map((mem) => (
            <Avatar
              key={mem?._id}
              alt={mem?.name}
              src={mem?.profileImage ?? mem?.name}
            />
          ))}
        </AvatarGroup>
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "3fr 1fr",
                height: "100%",
              }}
            >
              <TaskCommentSection
                taskMembers={taskMembers}
                taskID={taskID}
                referralTaskID={referralTaskID}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h1 style={{ fontFamily: "Poppins" }}>Members: </h1>
                {taskMembers?.map((mem) => (
                  <div
                    style={{
                      display: "flex",
                      marginBottom: "1.3em",
                      gap: "1.2em",
                      alignItems: "center",
                    }}
                    key={mem?._id}
                  >
                    <Avatar
                      alt={mem?.name}
                      src={mem?.profileImage ?? mem?.name}
                      sx={{ width: 80, height: 80 }}
                    />
                    <p style={{ fontFamily: "Quicksand", fontSize: "1.3rem" }}>
                      {mem?.name}
                    </p>
                    {mem?.isTaskAdmin && (
                      <span
                        style={{
                          color: "#6b9e82",
                          background: "#e3f4ea",
                          marginLeft: "auto",
                          padding: ".7rem",
                          fontFamily: "Raleway",
                          borderRadius: "1vh",
                        }}
                      >
                        Admin
                      </span>
                    )}
                    {taskMembers?.find((mem) => mem?.name === username)
                      ?.isTaskAdmin === true &&
                      mem?.name !== username && (
                        <div
                          style={{
                            marginLeft: "auto",
                            display: "flex",
                          }}
                        >
                          {mem?.isTaskAdmin ? (
                            <Tooltip title="Dismiss as an Admin">
                              <RemoveModeratorIcon
                                style={{
                                  cursor: "pointer",
                                  color: "orange",
                                }}
                                onClick={() => {
                                  setStatusTrack(1);
                                  memberFunc("/api/dismiss-admin", {
                                    userToBeDismissedID: mem?._id,
                                    taskID,
                                    referralTaskID,
                                  });
                                }}
                              />
                            </Tooltip>
                          ) : (
                            <Tooltip title="Make an Admin">
                              <AdminPanelSettingsOutlinedIcon
                                style={{
                                  cursor: "pointer",
                                  color: "green",
                                }}
                                onClick={() => {
                                  setStatusTrack(1);
                                  memberFunc("/api/make-admin", {
                                    userToBeAdminID: mem?._id,
                                    taskID,
                                    referralTaskID,
                                  });
                                }}
                              />
                            </Tooltip>
                          )}
                          <RemoveCircleOutlineIcon
                            style={{
                              cursor: "pointer",
                              color: "red",
                            }}
                            onClick={() => {
                              setStatusTrack(1);
                              memberFunc("/api/remove-member", {
                                userToBeRemovedID: mem?._id,
                                taskID,
                                referralTaskID,
                              });
                            }}
                          />
                        </div>
                      )}
                  </div>
                ))}

                {taskMembers?.length < 5 &&
                  taskMembers?.find((mem) => mem?.name === username)
                    ?.isTaskAdmin && (
                    <>
                      <SearchBar />
                      <button
                        className="add-task-1"
                        style={{
                          fontSize: "1em",
                          transform: "translateY(0)",
                        }}
                        onClick={() => {
                          setStatusTrack(1);
                          memberFunc("/api/add-member", {
                            taskID,
                            referralTaskID,
                            members: newTaskMembers,
                          });
                        }}
                      >
                        ADD MEMBERS
                      </button>
                    </>
                  )}
                {taskMembers?.length > 1 && (
                  <Button
                    variant="outlined"
                    color="error"
                    style={{ marginTop: "auto" }}
                    onClick={() => {
                      setStatusTrack(1);
                      memberFunc("/api/exit-task", {
                        taskID,
                        referralTaskID,
                      });
                    }}
                  >
                    LEAVE
                  </Button>
                )}
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
