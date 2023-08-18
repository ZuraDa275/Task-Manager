import SideBar from "../../components/Functions/SideBar";
import BarChart from "../../components/Functions/BarChart";
import useTaskStore from "../../store/taskStore";
import AfterSignInNav from "../../components/Functions/AfterSignInNav";

function Stats() {
  const tasks = useTaskStore((state) => state.tasks);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SideBar />
      <AfterSignInNav />
      <div
        style={{
          width: "75%",
          alignSelf: "center",
        }}
      >
        <BarChart tasks={tasks} />
      </div>
    </div>
  );
}

export default Stats;
