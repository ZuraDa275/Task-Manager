import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/RegisterPage.css";
import axios from "axios";
import useStore from "../../store/tokenStore";
import { useAsyncDecorator } from "../../hooks/useAsyncDecorator";
import useMonthStore from "../../store/monthAndDaysStore";
import BeforeSignInNav from "../../components/Functions/BeforeSignInNav";

function RegisterPage() {
  const [registerCredentials, setRegisterCredentials] = useState({
    name: "",
    email: "",
    password: "",
  });
  let navigate = useNavigate();
  const token = useStore((state) => state.token);
  const setToken = useStore((state) => state.setToken);
  const setStatusTrack = useMonthStore((state) => state.setStatusTrack);

  const postUserInfo = useAsyncDecorator(async () => {
    const res = await axios.post("/api/register", {
      name: registerCredentials.name,
      email: registerCredentials.email,
      password: registerCredentials.password,
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
      <main className="register-container">
        <div className="register-info">
          <h1
            className="register-title"
            style={{ transform: "translateY(-30px)" }}
          >
            Register
          </h1>
          <form
            className="register-input"
            onSubmit={(e) => {
              e.preventDefault();
              setStatusTrack(1);
              postUserInfo();
            }}
          >
            <div className="input-container">
              <input
                required
                type="text"
                className="register-inputs"
                placeholder="Name"
                onChange={(e) =>
                  setRegisterCredentials({
                    ...registerCredentials,
                    name: e.target.value,
                  })
                }
              />
              <input
                required
                className="register-inputs"
                type="email"
                placeholder="Email"
                onChange={(e) =>
                  setRegisterCredentials({
                    ...registerCredentials,
                    email: e.target.value,
                  })
                }
              />
              <input
                required
                className="register-inputs"
                type="password"
                placeholder="Password"
                onChange={(e) =>
                  setRegisterCredentials({
                    ...registerCredentials,
                    password: e.target.value,
                  })
                }
              />
            </div>
            <p className="not-a-user">
              A member already?{" "}
              <Link
                style={{ color: "#ff4b2b", textDecoration: "none" }}
                className="login-now-link"
                to="/login"
              >
                Login Here!
              </Link>
            </p>
            <button className="register-button">SIGN UP</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default RegisterPage;
