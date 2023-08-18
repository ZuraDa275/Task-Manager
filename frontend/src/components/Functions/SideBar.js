import { useRef, useState } from "react";
import { useLogoutUser } from "../../hooks/useLogoutUser";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { MdQueryStats } from "react-icons/md";
import { BsFillArrowRightSquareFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import NotifIcon from "./NotifIcon";
import { useTaskContext } from "../../TaskContext";
import useNameStore from "../../store/usernameStore";
import LogoutIcon from "@mui/icons-material/Logout";

function SideBar() {
  const logout = useLogoutUser();
  const { notifCount } = useTaskContext();
  const totalNotifCount = useNameStore((state) => state.totalNotifCount);
  const sidebarRef = useRef(null);
  const sectionTwoRef = useRef(null);
  const sectionOneRef = useRef(null);
  let [arrowRotate, setArrowRotate] = useState(false);
  return (
    <div className="sidebar-contents" ref={sidebarRef}>
      <BsFillArrowRightSquareFill
        onClick={() => {
          sidebarRef.current.classList.toggle("sidebar-toggle");
          sectionOneRef.current.classList.toggle("toggle-1");
          sectionTwoRef.current.classList.toggle("toggle-2");
          setArrowRotate(!arrowRotate);
        }}
        style={{
          scale: "2",
          borderRadius: "50%",
          position: "absolute",
          top: "65px",
          cursor: "pointer",
          transform: arrowRotate ? "rotateZ(-180deg) scale(1.5)" : "",
          transition: "transform .5s ease",
        }}
      />
      <div className="sidebar-link-container">
        <section className="section-1" ref={sectionOneRef}>
          <p style={{ transform: "translateY(12px)" }}>
            <Link className="sidebar-links" to="/users">
              <DashboardIcon />
            </Link>
          </p>
          <p>
            <Link className="sidebar-links" to="/notifications">
              <NotifIcon
                notifCount={notifCount}
                totalNotifCount={totalNotifCount}
              />
            </Link>
          </p>
          <p>
            <Link className="sidebar-links" to="/stats">
              <MdQueryStats />
            </Link>
          </p>
        </section>
        <section className="section-2" ref={sectionTwoRef}>
          <p style={{ transform: "translate(10px,8px)" }}>
            <Link className="sidebar-links" to="/users">
              Dashboard
            </Link>
          </p>
          <p style={{ transform: "translate(10px, 2px)" }}>
            <Link className="sidebar-links" to="/notifications">
              Notifications
            </Link>
          </p>
          <p>
            <Link className="sidebar-links" to="/stats">
              Statistics
            </Link>
          </p>
        </section>
      </div>
      <div
        style={{
          margin: "0 auto",
          cursor: "pointer",
          scale: "1.3",
        }}
      >
        <LogoutIcon onClick={logout} />
      </div>
    </div>
  );
}

export default SideBar;
