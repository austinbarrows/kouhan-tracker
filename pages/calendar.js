import { Box, Container, Grid, Skeleton, Text } from "@mantine/core";
import CoreLayout from "components/coreLayout";
import { AddCalendarItemCard } from "components/addCalendarItemCard";
import dayjs from "dayjs";
import create from "zustand";
import { IconChevronLeft, IconChevronRight, IconRefresh } from "@tabler/icons";
const { Server, Client } = require("react-hydration-provider");
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from "next-firebase-auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

const localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

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

// This feels hacky but for some reason there's no way to set a default value for weekdays based on startDay since startDay doesn't exist when I'm trying to use it
const startDayInitial = dayjs();
const weekdaysInitial = generateWeek(startDayInitial, "current");
const useWeekStore = create((set) => ({
  weekdays: weekdaysInitial,
  startDay: startDayInitial,
  calendar: [],
  setWeek: (day, direction) => {
    set((state) => ({
      weekdays: generateWeek(day, direction),
    }));
  },
  setStart: (day) => {
    set((state) => ({
      startDay: day,
    }));
  },
  setCalendar: (calendar) => {
    set((state) => ({
      calendar: calendar,
    }));
  },
}));

const Calendar = (props) => {
  const startDay = useWeekStore((state) => state.startDay);
  const weekdays = useWeekStore((state) => state.weekdays);
  const calendar = useWeekStore((state) => state.calendar);
  const setWeek = useWeekStore((state) => state.setWeek);
  const setStart = useWeekStore((state) => state.setStart);
  const setCalendar = useWeekStore((state) => state.setCalendar);

  console.log("testABC");
  useEffect(() => {
    setWeek(startDay, "current");

    const updateCalendar = async () => {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        const startDate = dayjs().format();
        const token = getAuth().currentUser.accessToken;
        console.log(token);
        const response = await fetch("/api/getCalendarData", {
          method: "POST",
          headers: {
            authorization: token,
          },
          body: JSON.stringify({
            startDate: startDate,
            numberOfDays: 7,
          }),
        });
        const data = await response.json();
        const newCalendar = data.calendar;
        console.log(newCalendar);
        setCalendar(newCalendar);
      });
    };

    updateCalendar();
  }, []);

  return (
    <Box>
      <Grid>
        <Grid.Col span={8}>
          <Box
            sx={(theme) => ({
              border: `1px solid ${
                theme.colorScheme === "dark"
                  ? theme.colors.dark[4]
                  : theme.colors.gray[2]
              }`,
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[7]
                  : theme.white,
              borderRadius: theme.radius.md,
            })}
            className="p-2"
          >
            <Grid columns={7} gutter={0}>
              <Grid.Col span={7} className="text-3xl ml-2 mb-2 mt-1">
                Weekly Calendar
              </Grid.Col>
              <Grid.Col span={7}>
                <Box className="flex select-none p-1 pb-2 justify-between">
                  <Box className="flex">
                    <IconChevronLeft
                      stroke={1.5}
                      size={48}
                      className="border rounded-lg cursor-pointer mr-1"
                      onClick={() => {
                        setWeek(startDay, "previous");
                        setStart(startDay.subtract(7, "day"));
                      }}
                    />
                    <IconChevronRight
                      stroke={1.5}
                      size={48}
                      className="border rounded-lg cursor-pointer mr-2"
                      onClick={() => {
                        setWeek(startDay, "next");
                        setStart(startDay.add(7, "day"));
                      }}
                    />
                  </Box>
                  <IconRefresh
                    stroke={1.5}
                    size={48}
                    className="border rounded-lg cursor-pointer mr-2"
                    onClick={() => {
                      const updated = dayjs();
                      setStart(updated);
                      setWeek(updated);
                    }}
                  />
                </Box>
              </Grid.Col>
              {weekdays.map((day, index) => {
                return (
                  <Grid.Col span={1} key={index}>
                    <Box className="bg-amber-300 h-104 border">
                      <Text>{day.format("YYYY-MM-DD")}</Text>
                      <Text>{JSON.stringify(calendar[index])}</Text>
                    </Box>
                  </Grid.Col>
                );
              })}
            </Grid>
          </Box>
        </Grid.Col>
        <Grid.Col span={4}>
          <AddCalendarItemCard></AddCalendarItemCard>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

Calendar.getLayout = function getLayout(page) {
  return <CoreLayout>{page}</CoreLayout>;
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})();

export default withAuthUser()(Calendar);
