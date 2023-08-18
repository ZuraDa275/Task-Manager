import { useState } from "react";

const notifNavArray = [
  "All",
  "Task Updates",
  "Today's Tasks",
  "Incompleted Tasks",
];
function NotifNav({ setNotifType }) {
  const [notifHighlightTrack, setNotifHighlightTrack] = useState(0);

  return (
    <section className="notif-nav">
      <h5 style={{ transform: "translateX(-1.2em)", fontFamily: "Raleway" }}>
        Notifications
      </h5>
      {notifNavArray.map((notifType, i) => (
        <p
          key={i}
          id="notif-nav-element"
          style={{
            backgroundColor:
              notifHighlightTrack === i ? "#e76062" : "transparent",
            color: notifHighlightTrack === i ? "white" : "black",
          }}
          onClick={(e) => {
            setNotifHighlightTrack(i);
            setNotifType(e);
          }}
        >
          {notifType}
        </p>
      ))}
    </section>
  );
}

export default NotifNav;
