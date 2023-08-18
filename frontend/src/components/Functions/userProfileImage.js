import Avatar from "@mui/material/Avatar";
import useNameStore from "../../store/usernameStore";

export default function ImageAvatars() {
  const userName = useNameStore((state) => state.userName);
  const profileImage = useNameStore((state) => state.profileImage);

  return (
    <Avatar alt={userName} sx={{ width: 70, height: 70 }} src={profileImage} />
  );
}
