import useNameStore from "../../store/usernameStore";
import ImageAvatars from "./userProfileImage";
import { Link } from "react-router-dom";

function AfterSignInNav() {
  const username = useNameStore((state) => state.userName);
  return (
    <header className="intro-navbar-container">
      <h3 className="web-name" style={{ marginRight: "auto" }}>
        <Link className="intro-navbar-links" to="/users">
          VITALS
        </Link>
      </h3>
      <div className="user-directions">
        <p className="user-welcome">Hello, {username}!</p>
        <Link to="/edit-profile">
          <ImageAvatars />
        </Link>
      </div>
    </header>
  );
}

export default AfterSignInNav;
