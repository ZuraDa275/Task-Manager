import { Link } from "react-router-dom";

function BeforeSignInNav() {
  return (
    <header className="intro-navbar-container">
      <h3 className="web-name">
        <Link className="intro-navbar-links" to="/">
          VITALS
        </Link>
      </h3>
    </header>
  );
}

export default BeforeSignInNav;
