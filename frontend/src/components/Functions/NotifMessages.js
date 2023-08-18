import AccordionForIncomplete from "./AccordionForIncomplete";
import { intlFormatDistance } from "date-fns";

const formatDate = (inputDate) => {
  const dateParts = inputDate.split(" ");
  const month = dateParts[0];
  const day = dateParts[1];
  const year = dateParts[2];

  const monthMap = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  const formattedMonth = monthMap[month];

  const formattedDate = `${year}-${formattedMonth}-${day}`;
  return formattedDate;
};

const extractDateFromIncompletedMessage = (inputString) => {
  const regexPattern = /<span[^>]*>(.*?)<\/span>/;
  const matchResult = inputString.match(regexPattern);
  const dateSubstring = matchResult[1];
  return formatDate(dateSubstring);
};

function NotifMessages({
  notifType,
  notifications,
  notificationDifference,
  incompletedTasks,
}) {
  return (
    <section className="notif-messages">
      {(notifType === "All" || notifType === ""
        ? notifications
        : notifType === "Today's Tasks"
        ? notifications.filter((notif) => notif.tag === "Today's Tasks")
        : notifType === "Task Updates"
        ? notifications.filter((notif) => notif.tag === "Task Updates")
        : notifications.filter((notif) => notif.tag === "Incompleted Tasks")
      )?.map((notifs, i) => (
        <div
          key={i}
          className="individual-notifs"
          style={{
            display: "flex",
            alignItems: "center",
            borderLeft: notificationDifference?.find(
              (nt) => nt?.createdAt === notifs?.createdAt
            )
              ? "10px solid #E76062"
              : "",
          }}
        >
          {notifs?.tag === "Incompleted Tasks" ? (
            <AccordionForIncomplete
              incompletedTasks={incompletedTasks.filter(
                (incTask) =>
                  incTask.taskStartDate ===
                  extractDateFromIncompletedMessage(notifs?.notifMessage)
              )}
              incompletedNotif={notifs}
            />
          ) : (
            <>
              <p
                style={{ width: "80%" }}
                dangerouslySetInnerHTML={{ __html: notifs?.notifMessage }}
              />
              <span
                style={{
                  marginLeft: "auto",
                  fontFamily: "Poppins",
                  fontSize: ".8em",
                  opacity: ".5",
                }}
              >
                {intlFormatDistance(notifs?.createdAt, new Date().getTime())}
              </span>
            </>
          )}
        </div>
      ))}
    </section>
  );
}

export default NotifMessages;
