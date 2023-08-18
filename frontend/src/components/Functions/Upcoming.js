import Variants from "./Skeleton";
import { useRef, useState } from "react";
import useMonthStore from "../../store/monthAndDaysStore";
import "../Styles/Upcoming.css";
import "../Styles/UserPage.css";
import { useTaskContext } from "../../TaskContext";
import NoTasksForThisDate from "../../NO_TASKS_FOR_THIS_DATE.png";
import ImageNotif from "./ImageNotif";
import UpcomingIndividualTasks from "./UpcomingIndividualTasks";
import { useDateFormatter } from "../../hooks/useDateFormatter";

export const priorityOrder = { High: 1, Medium: 2, Low: 3 };

export const upcomingTasksFilter = (
  tasks,
  dateAccToDbFormat,
  today,
  currentTime
) => {
  return tasks.filter(
    (task) =>
      task.taskStartDate === dateAccToDbFormat &&
      !task.isCompleted &&
      (task.taskStartDate === today
        ? task.taskStartTime.localeCompare(currentTime) > 0
        : task.taskStartTime)
  );
};

function Upcoming({ tasks }) {
  const dateFormatter = useDateFormatter();
  const { sortBy, today, currentTime } = useTaskContext();
  const date = new Date();
  let dateAccToDbFormat = useRef(today);
  const months = useMonthStore((state) => state.months);
  const [upcomingDate, setUpcomingDate] = useState(
    date.getDate() + "  " + months[date.getMonth()] + ", " + date.getFullYear()
  );
  const chosenCallbackForSort =
    sortBy === "Start-Time"
      ? (a, b) => a.taskStartTime.localeCompare(b.taskStartTime)
      : (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority];

  const upcomingTasks = upcomingTasksFilter(
    tasks,
    dateAccToDbFormat.current,
    today,
    currentTime
  );

  return (
    <>
      {" "}
      <div className="task-display-1">
        <section
          style={{
            display: "flex",
            alignItems: "center",
            columnGap: "10em",
            marginBottom: "20px",
          }}
        >
          <h2>
            <span
              style={{
                height: "10px",
                width: "10px",
                backgroundColor: "red",
                borderRadius: "50%",
                display: "inline-block",
                transform: "translateY(-3px)",
              }}
            />{" "}
            Upcoming - <span className="upcoming-date">{upcomingDate}</span>
          </h2>

          <input
            type="date"
            name="main-date-picker"
            min={today}
            onChange={(e) => {
              dateAccToDbFormat.current = e.target.value;
              setUpcomingDate(dateFormatter(e.target.value));
            }}
          />
        </section>
        {tasks ? (
          upcomingTasks.length > 0 ? (
            upcomingTasks
              .sort(chosenCallbackForSort)
              .map((task) => <UpcomingIndividualTasks task={task} />)
          ) : (
            <ImageNotif
              illustration={NoTasksForThisDate}
              message={
                tasks.filter(
                  (task) =>
                    task.taskStartDate === dateAccToDbFormat.current &&
                    task.taskStartTime.localeCompare(currentTime) > 0
                ).length === 0 && today === dateAccToDbFormat.current
                  ? "No more upcoming tasks for today!"
                  : "No tasks for this date!"
              }
            />
          )
        ) : (
          <Variants />
        )}
      </div>
    </>
  );
}

export default Upcoming;
