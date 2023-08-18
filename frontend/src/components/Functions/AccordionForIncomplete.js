import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TaskMembers from "./TaskMembers";
import { Button, Typography } from "@mui/material";
import { intlFormatDistance } from "date-fns";
import { useState } from "react";
import axios from "axios";
import useStore from "../../store/tokenStore";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { useAsyncDecorator } from "../../hooks/useAsyncDecorator";
import useMonthStore from "../../store/monthAndDaysStore";
import { useTaskContext } from "../../TaskContext";

export default function AccordionForIncomplete({
  incompletedTasks,
  incompletedNotif,
}) {
  const getUserInfo = useGetUserInfo();
  const setStatusTrack = useMonthStore((state) => state.setStatusTrack);
  const { today } = useTaskContext();
  const [rescheduledDate, setRescheduledDate] = useState("");
  const [taskToBeRescheduledID, setTaskToBeRescheduledID] = useState("");
  const token = useStore((state) => state.token);

  const rescheduleTask = useAsyncDecorator(
    async (id, referralTaskID, taskStartDate) => {
      const res = await axios.put(
        "/api/reschedule-task",
        {
          id,
          referralTaskID,
          taskStartDate,
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      await getUserInfo();
      setStatusTrack(res.status);
      setRescheduledDate("");
      setTaskToBeRescheduledID("");
      return res.data.msg;
    }
  );
  return (
    <>
      <Accordion className="accordion-style">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
        >
          <p
            style={{ width: "80%" }}
            dangerouslySetInnerHTML={{ __html: incompletedNotif?.notifMessage }}
          />
          <span
            style={{
              marginLeft: "auto",
              alignSelf: "center",
              fontFamily: "Poppins",
              fontSize: ".8em",
              opacity: ".5",
            }}
          >
            {intlFormatDistance(
              incompletedNotif?.createdAt,
              new Date().getTime()
            )}
          </span>
        </AccordionSummary>
        <AccordionDetails>
          {incompletedTasks.length > 0 ? (
            incompletedTasks.map((incTasks, i) => (
              <div
                key={incTasks._id}
                style={{
                  marginTop: "-0.03em",
                  paddingBottom: ".3em",
                  borderBottom:
                    incompletedTasks.length - 1 === i
                      ? ""
                      : "2px solid #f2e0e0",
                }}
              >
                <div className="title-bar">
                  <h2>{incTasks.taskName}</h2>
                  {rescheduledDate && taskToBeRescheduledID === i ? (
                    <Button
                      variant="outlined"
                      color="error"
                      style={{
                        color: "#E76062",
                        fontFamily: "Poppins",
                        marginLeft: "auto",
                        alignSelf: "center",
                        marginRight: "1.2em",
                      }}
                      onClick={() => {
                        setStatusTrack(1);
                        rescheduleTask(
                          incTasks._id,
                          incTasks?.referralTaskID,
                          rescheduledDate
                        );
                      }}
                    >
                      Reschedule
                    </Button>
                  ) : (
                    <input
                      type="date"
                      name="main-date-picker"
                      style={{
                        alignSelf: "center",
                        marginLeft: "auto",
                        marginRight: "2em",
                      }}
                      min={today}
                      onChange={(e) => {
                        setRescheduledDate(e.target.value);
                        setTaskToBeRescheduledID(i);
                      }}
                    />
                  )}
                  <p
                    style={{
                      color:
                        incTasks.priority === "Low"
                          ? "#6b9e82"
                          : incTasks.priority === "Medium"
                          ? "#a26e49"
                          : "red",
                      backgroundColor:
                        incTasks.priority === "Low"
                          ? "#e3f4ea"
                          : incTasks.priority === "Medium"
                          ? "#fce3d3"
                          : "#ffcdce",
                    }}
                  >
                    {incTasks.priority}
                  </p>
                </div>
                <p style={{ fontFamily: "Raleway" }}>
                  {incTasks.taskDescription}
                </p>
                {incTasks?.memberList?.members?.length > 0 && (
                  <TaskMembers
                    taskMembers={incTasks?.memberList?.members}
                    taskID={incTasks?._id}
                    referralTaskID={incTasks?.referralTaskID}
                  />
                )}
              </div>
            ))
          ) : (
            <Typography
              style={{
                fontFamily: "Quicksand",
                fontSize: "1em",
                textAlign: "center",
                fontWeight: "bold",
                color: "green",
              }}
            >
              All tasks have been rescheduled!
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );
}
