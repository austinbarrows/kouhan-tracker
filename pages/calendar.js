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

export default function Calendar(props) {
  let day = dayjs();
  let week = generateWeek(day, "previous");

  const weekdays = week.map((day) => {
    return (
      <Grid.Col span={1} key={day}>
        <Box className="bg-amber-300 h-104 border">{day}</Box>
      </Grid.Col>
    );
  });

  return (
    <Box>
      <Grid>
        <Grid.Col span={8}>
          <Grid columns={7} gutter={0}>
            <Grid.Col span={7}>
              <Box className="flex">
                <IconChevronLeft
                  stroke={1.5}
                  size={48}
                  className="border rounded-lg cursor-pointer"
                />
                <IconChevronRight
                  stroke={1.5}
                  size={48}
                  className="border rounded-lg cursor-pointer"
                />
              </Box>
            </Grid.Col>
            {weekdays}
          </Grid>
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
