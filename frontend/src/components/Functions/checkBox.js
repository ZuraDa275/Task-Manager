import { styled } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import useStore from "../../store/tokenStore";
import useMonthStore from "../../store/monthAndDaysStore";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { useAsyncDecorator } from "../../hooks/useAsyncDecorator";

const BpIcon = styled("span")(() => ({
  borderRadius: 50,
  width: 25,
  height: 25,
  boxShadow: "0 0 0 1px rgb(16 22 26 / 40%)",
  "input:hover ~ &": {
    backgroundColor: "#e76062",
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: "#e76062",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
  "&:before": {
    display: "block",
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
});

function BpCheckbox({ task }) {
  const getUserInfo = useGetUserInfo();
  const setStatusTrack = useMonthStore((state) => state.setStatusTrack);
  const token = useStore((state) => state.token);

  const taskCompleted = useAsyncDecorator(async () => {
    const res = await axios.put(
      "/api/taskcomplete",
      {
        id: task._id,
        referralTaskID: task.referralTaskID,
      },
      {
        headers: { "x-auth-token": token },
      }
    );
    await getUserInfo();
    setStatusTrack(res.status);
    return res.data.msg;
  });
  return (
    <Checkbox
      disableRipple
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      inputProps={{ "aria-label": "Checkbox demo" }}
      onClick={() => {
        setStatusTrack(1);
        taskCompleted();
      }}
      style={{ marginLeft: ".1em" }}
    />
  );
}

export default function UltimateCheckbox({ task }) {
  return (
    <div>
      <BpCheckbox task={task} />
    </div>
  );
}
