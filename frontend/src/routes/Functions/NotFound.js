import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Avatar
        src="https://i.imgur.com/MSjgkGw.png"
        alt="Not-found"
        sx={{ width: 800, height: 800 }}
      />
      <h1 style={{ fontFamily: "Raleway" }}>
        This page could not be found.{" "}
        <Link to="/" style={{ color: "#e76062" }}>
          Go Back
        </Link>
      </h1>
    </div>
  );
}

export default NotFound;
