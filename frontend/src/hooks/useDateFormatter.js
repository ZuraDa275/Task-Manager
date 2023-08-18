import useMonthStore from "../store/monthAndDaysStore";

export const useDateFormatter = () => {
  const months = useMonthStore((state) => state.months);

  return (inputDate) => {
    return (
      (inputDate.split("-")[2].split("")[0] === "0"
        ? inputDate.split("-")[2].split("")[1]
        : inputDate.split("-")[2]) +
      " " +
      (inputDate.split("-")[1].split("")[0] === "0"
        ? months[inputDate.split("-")[1].split("")[1] - 1]
        : months[inputDate.split("-")[1] - 1]) +
      ", " +
      inputDate.split("-")[0]
    );
  };
};
