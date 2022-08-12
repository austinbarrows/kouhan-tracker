import { Box, Container, Grid, Skeleton } from "@mantine/core";
import CoreLayout from "components/corelayout";
import dayjs from "dayjs";
import create from "zustand";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";

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
}));

export default function Calendar(props) {
  const startDay = useWeekStore((state) => state.startDay);
  const weekdays = useWeekStore((state) => state.weekdays);
  const setWeek = useWeekStore((state) => state.setWeek);
  const setStart = useWeekStore((state) => state.setStart);

  const weekdayComponents = weekdays.map((day) => {
    return (
      <Grid.Col span={1} key={day.format("LLLL")}>
        <Box className="bg-amber-300 h-104 border">{day.format("LLLL")}</Box>
      </Grid.Col>
    );
  });

  return (
    <Box onLoadStart={() => setWeek(startDay, "current")}>
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
              <Grid.Col span={7}>
                <Box className="flex select-none p-1 pb-2">
                  <IconChevronLeft
                    stroke={1.5}
                    size={48}
                    className="border rounded-lg cursor-pointer"
                    onClick={() => {
                      setWeek(startDay, "previous");
                      setStart(startDay.subtract(7, "day"));
                    }}
                  />
                  <IconChevronRight
                    stroke={1.5}
                    size={48}
                    className="border rounded-lg cursor-pointer"
                    onClick={() => {
                      setWeek(startDay, "next");
                      setStart(startDay.add(7, "day"));
                    }}
                  />
                </Box>
              </Grid.Col>
              {weekdayComponents}
            </Grid>
          </Box>
        </Grid.Col>
        <Grid.Col span={4}>
          <Skeleton animate={false} className="h-64"></Skeleton>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

Calendar.getLayout = function getLayout(page) {
  return <CoreLayout>{page}</CoreLayout>;
};
