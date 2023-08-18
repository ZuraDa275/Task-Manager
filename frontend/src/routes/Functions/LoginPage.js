import axios from "axios";
import "../Styles/LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useStore from "../../store/tokenStore";
import { useAsyncDecorator } from "../../hooks/useAsyncDecorator";
import useMonthStore from "../../store/monthAndDaysStore";
import BeforeSignInNav from "../../components/Functions/BeforeSignInNav";

function LoginPage() {
  const setStatusTrack = useMonthStore((state) => state.setStatusTrack);
  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    password: "",
  });
  let navigate = useNavigate();
  const token = useStore((state) => state.token);
  const setToken = useStore((state) => state.setToken);

  const postUserLogin = useAsyncDecorator(async () => {
    const res = await axios.post("/api/login", {
      email: loginCredentials.email,
      password: loginCredentials.password,
    });
    if (res.headers["x-auth-token"]) {
      setToken(res.headers["x-auth-token"]);
    }
    setStatusTrack(res.status);
    return res.data.msg;
  });

  useEffect(() => {
    if (token) {
      navigate("/users");
    }
  }, [navigate, token]);

  return (
    <div>
      <BeforeSignInNav />
      <main className="login-container">
        <div className="login-info">
          <h1
            className="login-title"
            style={{ transform: "translateY(-30px)" }}
          >
            Login
          </h1>
          <form
            className="login-input"
            onSubmit={(e) => {
              e.preventDefault();
              setStatusTrack(1);
              postUserLogin();
            }}
          >
            <div className="input-container">
              <input
                required
                className="user-inputs"
                type="email"
                placeholder="Email"
                onChange={(e) =>
                  setLoginCredentials({
                    ...loginCredentials,
                    email: e.target.value,
                  })
                }
              />
              <input
                required
                className="user-inputs"
                type="password"
                placeholder="Password"
                onChange={(e) =>
                  setLoginCredentials({
                    ...loginCredentials,
                    password: e.target.value,
                  })
                }
              />
            </div>
            <p className="not-a-user">
              Not a member?{" "}
              <Link
                style={{ color: "#e76062", textDecoration: "none" }}
                className="register-now-link"
                to="/register"
              >
                Register Now!
              </Link>
            </p>
            <button className="login-button">LOG IN</button>
          </form>
        </div>
        <div className="welcome-back-container">
          <h1 style={{ color: "white" }} className="welcome-back-title">
            WELCOME BACK
          </h1>
          <p style={{ color: "white" }} className="welcome-back-desc">
            Let's get started again!
          </p>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
