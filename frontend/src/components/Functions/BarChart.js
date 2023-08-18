import React from "react";
import { Bar } from "react-chartjs-2";
import { useDateFormatter } from "../../hooks/useDateFormatter";
import "chart.js/auto";
import { useTaskContext } from "../../TaskContext";
import ImageNotif from "./ImageNotif";

const taskCompletionCounterForStats = (tasks, today) => {
  let dates = [
    ...new Set(
      tasks
        .filter((task) => task.taskStartDate.localeCompare(today))
        .map((task) => task.taskStartDate)
    ),
  ].sort((a, b) => a.localeCompare(b));

  let countForCompletedTasks = [];
  let countForIncompletedTasks = [];
  for (let date of dates) {
    countForCompletedTasks.push(
      tasks.filter((task) => task.taskStartDate === date && task.isCompleted)
        .length
    );
    countForIncompletedTasks.push(
      tasks.filter((task) => task.taskStartDate === date && !task.isCompleted)
        .length
    );
  }

  return {
    countForCompletedTasks,
    countForIncompletedTasks,
    dates,
  };
};
let delayed;

const options = {
  options: {
    animation: {
      onComplete: () => {
        delayed = true;
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === "data" && context.mode === "default" && !delayed) {
          delay = context.dataIndex * 50 + context.datasetIndex * 20;
        }
        return delay;
      },
    },
    radius: 5,
    hoverRadius: 12,
    hitRadius: 100,
    responsive: true,
    scales: {
      y: {
        ticks: {
          precision: 0,
        },
        stacked: true,
      },
      x: {
        stacked: true,
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 20,
            family: "Raleway",
          },
        },
      },
      title: {
        display: true,
        text: "User's Overall Stats",
      },
    },
  },
};

function BarChart({ tasks }) {
  const { today } = useTaskContext();
  const dateFormatter = useDateFormatter();
  let { countForCompletedTasks, countForIncompletedTasks, dates } =
    taskCompletionCounterForStats(tasks, today);

  const dateInReadableFormat = dates.map((inputDate) =>
    dateFormatter(inputDate)
  );

  return dates.length > 0 ? (
    <Bar
      data={{
        labels: dateInReadableFormat,
        datasets: [
          {
            label: "Completed Tasks",
            data: countForCompletedTasks,
            backgroundColor: "#F6E199",
            borderColor: "#F6E199",
            borderWidth: 2,
            borderRadius: 5,
          },
          {
            label: "Incompleted Tasks",
            data: countForIncompletedTasks,
            backgroundColor: "#e76062",
            borderColor: "#e76062",
            borderWidth: 2,
            borderRadius: 5,
          },
        ],
      }}
      options={options.options}
    />
  ) : (
    <ImageNotif
      illustration="https://i.imgur.com/xrkHYvO.png"
      message="Get started and gauge your performance!"
    />
  );
}

export default BarChart;
