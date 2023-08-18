import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "../Styles/Calendar.css";
import useMonthStore from "../../store/monthAndDaysStore";

const formatDate = (date) => {
  const locale = "fr-CA";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

function CalendarComp() {
  const setStartDate = useMonthStore((state) => state.setStartDate);
  const [value, onChange] = useState(new Date());
  const date = formatDate(value);

  useEffect(() => {
    setStartDate(date);
  }, []);
  return (
    <div>
      <Calendar
        className="check"
        onChange={onChange}
        value={value}
        minDate={new Date()}
      />
    </div>
  );
}
export default CalendarComp;
