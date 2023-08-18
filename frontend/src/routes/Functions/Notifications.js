import SideBar from "../../components/Functions/SideBar";
import "../Styles/Notifications.css";
import NotifNav from "../../components/Functions/NotifNav";
import NotifMessages from "../../components/Functions/NotifMessages";
import { useTaskContext } from "../../TaskContext";
import useNameStore from "../../store/usernameStore";
import { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import axios from "axios";
import useStore from "../../store/tokenStore";
import useNotifStore from "../../store/notifStore";
import useTaskStore from "../../store/taskStore";
import AfterSignInNav from "../../components/Functions/AfterSignInNav";
import { Avatar } from "@mui/material";
import { useAsyncDecorator } from "../../hooks/useAsyncDecorator";
import useMonthStore from "../../store/monthAndDaysStore";

function Notifications() {
  const setStatusTrack = useMonthStore((state) => state.setStatusTrack);
  const tasks = useTaskStore((state) => state.tasks);
  const [notificationDifference, setNotificationDifference] = useState([]);
  const { unshiftNotifications, notifications } = useNotifStore(
    (state) => ({
      unshiftNotifications: state.unshiftNotifications,
      notifications: state.notifications,
    }),
    shallow
  );
  const token = useStore((state) => state.token);
  const [notifType, setNotifType] = useState("");
  const { notifCount } = useTaskContext();
  const { totalNotifCount, setTotalNotifCount } = useNameStore(
    (state) => ({
      totalNotifCount: state.totalNotifCount,
      setTotalNotifCount: state.setTotalNotifCount,
    }),
    shallow
  );

  const getNotifications = useAsyncDecorator(async (notifCount) => {
    const res = await axios.post(
      "/api/get-notifs",
      {
        notifCount,
      },
      {
        headers: {
          "x-auth-token": token,
        },
      }
    );
    setStatusTrack(res.status);
    unshiftNotifications(res.data.newNotifs);
    setNotificationDifference([...res.data.newNotifs]);
    return res.data.msg;
  });

  useEffect(() => {
    if (notifCount !== 0 && totalNotifCount < notifCount) {
      setStatusTrack(1);
      getNotifications(notifCount - totalNotifCount);
      setTotalNotifCount(notifCount);
    }
  }, [notifCount, totalNotifCount]);

  return (
    <>
      <SideBar />
      <AfterSignInNav />
      <main className="notif-container">
        <NotifNav setNotifType={(e) => setNotifType(e.target.textContent)} />
        {notifications.length > 0 ? (
          <NotifMessages
            notifType={notifType}
            notifications={notifications}
            notificationDifference={notificationDifference}
            incompletedTasks={tasks.filter((task) => !task.isCompleted)}
          />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Avatar
              alt="No notifications"
              src="https://i.imgur.com/V6QjFpG.jpg"
              sx={{ width: 650, height: 650 }}
            />
            <h2 style={{ fontFamily: "raleway" }}>No notifications yet!</h2>
          </div>
        )}
      </main>
    </>
  );
}

export default Notifications;
