import { useState } from "react";
import React, { Fragment } from "react";
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
  const [selectedRange, setSelectedRange] = useState({
    start: null,
    end: null,
  });
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
          onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
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
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
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

        const isSelected =
          selectedRange.start &&
          (isSameDay(day, selectedRange.start) ||
            (selectedRange.end &&
              day >= selectedRange.start &&
              day <= selectedRange.end));

        days.push(
          <button
            key={day}
            type="button"
            className={classNames(
              "py-1.5 hover:bg-gray-100 focus:z-10",
              isSameMonth(day, monthStart) ? "bg-white" : "bg-gray-50",
              (isSelected || isSameDay(day, new Date())) && "font-semibold",
              isSelected && "text-black",
              !isSelected &&
                isSameMonth(day, monthStart) &&
                !isSameDay(day, new Date()) &&
                "text-gray-900",
              !isSelected &&
                !isSameMonth(day, monthStart) &&
                !isSameDay(day, new Date()) &&
                "text-gray-400",
              isSameDay(day, new Date()) && !isSelected && "text-indigo-600",
              isSelected && "bg-indigo-600" // Add this line to change the background color of the selected range
            )}
            onClick={() => onDateClick(cloneDay)}
          >
            <time
              dateTime={format(day, "yyyy-MM-dd")}
              className="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
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
    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({ start: day, end: null });
    } else if (selectedRange.start && !selectedRange.end) {
      if (day < selectedRange.start) {
        setSelectedRange({ start: day, end: selectedRange.start });
      } else {
        setSelectedRange({ ...selectedRange, end: day });
      }
    }
  };

  const handleAddEvent = () => {
    setEvents([
      ...events,
      { ...newEvent, date: format(selectedRange.start, "yyyy-MM-dd") },
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

      {/* Event List */}
      <div className="mt-8">
        <h2 className="text-base font-semibold leading-6 text-gray-900">
          Upcoming events
        </h2>
        <ul className="mt-4 space-y-4">
          {events.map((event, index) => (
            <li key={index} className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {event.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {format(new Date(event.date), "MMMM d, yyyy")}
                </p>
                <p className="text-sm text-gray-600">{event.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

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
