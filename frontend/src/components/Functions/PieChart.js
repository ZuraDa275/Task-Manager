import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { useTaskContext } from "../../TaskContext";

const pieChartCounter = (tasks, today) => {
  const completedTaskCount = tasks.filter(
    (task) => task.taskStartDate === today && task.isCompleted
  ).length;
  const incompletedTaskCount = tasks.filter(
    (task) => task.taskStartDate === today && !task.isCompleted
  ).length;
  return {
    completedTaskCount,
    incompletedTaskCount,
  };
};

const options = {
  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 10,
            family: "Poppins",
          },
        },
      },
      title: {
        display: true,
        text: "Today's Stats",
      },
    },
  },
};

function PieChart({ tasks }) {
  const { today } = useTaskContext();

  const { completedTaskCount, incompletedTaskCount } = pieChartCounter(
    tasks,
    today
  );

  return (
    <Pie
      data={{
        labels: ["Completed Tasks", "Incompleted Tasks"],
        datasets: [
          {
            label: "Total",
            data: [completedTaskCount, incompletedTaskCount],
            backgroundColor: ["#F6E199", "#e76062"],
            borderColor: ["#F6E199", "#e76062"],
          },
        ],
      }}
      options={options.options}
    />
  );
}

export default PieChart;
