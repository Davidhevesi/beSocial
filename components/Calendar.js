import { useState } from "react";
import React from "react";
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
import { Dialog, Transition } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: "", date: "", time: "" });

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";

    return (
      <div className="flex items-center text-gray-900 mb-4">
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
            {events
              .filter((event) => isSameDay(new Date(event.date), day))
              .map((event, idx) => (
                <div key={idx} className="mt-1 text-xs text-gray-600">
                  {event.name}
                </div>
              ))}
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

  const handleAddEvent = () => {
    setEvents([
      ...events,
      { ...newEvent, date: format(selectedDate, "yyyy-MM-dd") },
    ]);
    setNewEvent({ name: "", date: "", time: "" });
    setIsModalOpen(false);
  };

  return (
    <div>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      <button
        type="button"
        className="mt-8 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={() => setIsModalOpen(true)}
      >
        Add event
      </button>

      {/* Modal for adding event */}
      <Transition show={isModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsModalOpen(false)}
        >
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Add New Event
                </Dialog.Title>
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Event Name"
                    value={newEvent.name}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, time: e.target.value })
                    }
                    className="w-full mt-2 px-4 py-2 border rounded-md"
                  />
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleAddEvent}
                  >
                    Add Event
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Calendar;
