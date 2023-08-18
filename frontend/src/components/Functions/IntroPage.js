import { Outlet, Link } from "react-router-dom";
import "../Styles/introPage.css";
import useStore from "../../store/tokenStore";

function IntroPage() {
  const token = useStore((state) => state.token);
  return (
    <div>
      <header className="intro-navbar-container">
        <h3 className="web-name">
          <Link className="intro-navbar-links" to="/">
            VITALS
          </Link>
        </h3>
        {token ? (
          <Link
            to="/users"
            style={{
              textDecoration: "none",
              marginLeft: "auto",
              marginRight: "2em",
            }}
          >
            <h3
              className="intro-navbar-links"
              style={{ color: "#e76062", fontSize: "1.6em" }}
            >
              Welcome Back!
            </h3>
          </Link>
        ) : (
          <nav className="intro-navbar">
            <Link to="/login">
              <button className="intro-navbar-links login">LOG IN</button>
            </Link>

            <Link to="/register">
              <button className="intro-navbar-links signup">SIGN UP</button>
            </Link>
          </nav>
        )}
      </header>
      <main className="intro-welcome">
        <div className="intro-welcome-sign">
          <div className="intro-desc">
            <h5 style={{ fontSize: "1.2em" }}>THE</h5>
            <h1>TASK</h1>
            <h3>MANAGER</h3>
          </div>
          <span
            style={{
              width: "50px",
              height: "5px",
              borderRadius: "5vw",
              background: "#e76062",
            }}
          ></span>
        </div>
        <p className="intro-quote">KEEP TRACK OF YOUR TASKS!</p>
      </main>
      <Outlet />
    </div>
  );
}

export default IntroPage;
