import Badge from "@mui/material/Badge";
import { MdNotifications } from "react-icons/md";

export default function NotifIcon({ notifCount, totalNotifCount }) {
  return (
    <Badge
      color="success"
      variant={notifCount > totalNotifCount ? "dot" : ""}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      overlap="circular"
    >
      <MdNotifications className="sidebar-links" />
    </Badge>
  );
}
