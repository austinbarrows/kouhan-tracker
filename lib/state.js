import create from "zustand";
import dayjs from "dayjs";
import { getAuth } from "firebase/auth";

// Day is a dayjs() date object, direction is either "next" or "previous"
function generateWeek(day, direction = "") {
  // Find nearest monday and start week array with that monday
  let j = day;
  // Max number of days from Monday is 6 (Sunday)
  for (let i = 0; i < 6; i++) {
    if (j.format("dddd") === "Monday") {
      break;
    }
    j = j.subtract(1, "day");
  }

  // Adjust week offset if necessary
  if (direction === "next") {
    j = j.add(7, "day");
  } else if (direction === "previous") {
    j = j.subtract(7, "day");
  }

  // Generate week array with all 7 days starting on a given day
  let week = [];
  for (let i = 0; i < 7; i++) {
    week[i] = j;
    j = j.add(1, "day");
  }

  return week;
}

const weekdaysInitial = generateWeek(dayjs(), "current");
const useWeekStore = create((set, get) => ({
  weekdays: weekdaysInitial,
  calendar: [],
  setWeek: (day, direction) => {
    set((state) => ({
      weekdays: generateWeek(day, direction),
    }));
  },
  setCalendar: (calendar) => {
    set((state) => ({
      calendar: calendar,
    }));
  },
  updateCalendar: async (token) => {
    if (token === null || token === undefined) {
      // On logout, do not try to fetch data
      return;
    }

    const weekdays = get().weekdays;
    const response = await fetch("/api/getCalendarData", {
      method: "POST",
      headers: {
        authorization: token,
      },
      body: JSON.stringify({
        startDate: weekdays[0].format(),
        numberOfDays: 7,
      }),
    });
    const data = await response.json();
    const newCalendar = data.calendar;
    // console.log(newCalendar);
    get().setCalendar(newCalendar);
    set((state) => ({}));
  },
}));

export default useWeekStore;
