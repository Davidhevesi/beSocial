import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
} from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";

    return (
      <div className="flex items-center text-gray-900 mb-4 p-6">
        <button
          type="button"
          className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          onClick={prevMonth}
        >
          <span className="sr-only">Previous month</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="flex-auto text-sm font-semibold">
          <span>{format(currentMonth, dateFormat)}</span>
        </div>
        <button
          type="button"
          className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          onClick={nextMonth}
        >
          <span className="sr-only">Next month</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "EEE";
    const days = [];

    let startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-xs text-center" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        const dayIdx = days.length;

        days.push(
          <button
            key={day}
            type="button"
            className={classNames(
              "py-1.5 hover:bg-gray-100 focus:z-10",
              isSameMonth(day, monthStart) ? "bg-white" : "bg-gray-50",
              (isSameDay(day, selectedDate) || isSameDay(day, new Date())) &&
                "font-semibold",
              isSameDay(day, selectedDate) && "text-white",
              !isSameDay(day, selectedDate) &&
                isSameMonth(day, monthStart) &&
                !isSameDay(day, new Date()) &&
                "text-gray-900",
              !isSameDay(day, selectedDate) &&
                !isSameMonth(day, monthStart) &&
                !isSameDay(day, new Date()) &&
                "text-gray-400",
              isSameDay(day, new Date()) &&
                !isSameDay(day, selectedDate) &&
                "text-indigo-600",
              dayIdx === 0 && "rounded-tl-lg",
              dayIdx === 6 && "rounded-tr-lg",
              dayIdx === days.length - 7 && "rounded-bl-lg",
              dayIdx === days.length - 1 && "rounded-br-lg"
            )}
            onClick={() => onDateClick(cloneDay)}
          >
            <time
              dateTime={format(day, "yyyy-MM-dd")}
              className={classNames(
                "mx-auto flex h-7 w-7 items-center justify-center rounded-full",
                isSameDay(day, selectedDate) &&
                  isSameDay(day, new Date()) &&
                  "bg-indigo-600",
                isSameDay(day, selectedDate) &&
                  !isSameDay(day, new Date()) &&
                  "bg-gray-900"
              )}
            >
              {formattedDate}
            </time>
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day}>
          {days}
        </div>
      );
      days = [];
    }

    return <div>{rows}</div>;
  };

  const onDateClick = (day) => {
    setSelectedDate(day);
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };

  return (
    <div className="p-6">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      <button
        type="button"
        className="mt-8 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Add event
      </button>
    </div>
  );
};

export default Calendar;
