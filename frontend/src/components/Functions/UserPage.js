import { useEffect } from "react";
import useTaskStore from "../../store/taskStore";
import "../Styles/UserPage.css";
import TaskDisplay from "./TaskDisplay";
import SideBar from "./SideBar";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import AfterSignInNav from "./AfterSignInNav";

function UserPage() {
  const getUserInfo = useGetUserInfo();
  const tasks = useTaskStore((state) => state.tasks);

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <>
      <SideBar />
      <AfterSignInNav />
      <main style={{ paddingLeft: "3em" }}>
        <TaskDisplay tasks={tasks} />
      </main>
    </>
  );
}

export default UserPage;
