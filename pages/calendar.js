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

import useWeekStore from "lib/state";

const localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

function generateEventElements(weekdayData, type) {
  if (weekdayData === undefined || weekdayData === null) {
    return null;
  }

  let eventElements;
  if (type === "allDay") {
    eventElements = weekdayData.allDay.map((event, index) => {
      return <Text>{event.title}</Text>;
    });
  }

  if (type === "times") {
    eventElements = [];
    Object.keys(weekdayData.times).forEach((time, index) => {
      console.log(weekdayData.times);
      const eventsAtTime = weekdayData.times[time].map((event, index) => {
        return <Text>{event.title}</Text>;
      });
      eventElements[index] = (
        <Text>
          {time}
          {eventsAtTime}
        </Text>
      );
    });
  }
  console.log("Event elements generated: ");
  console.log(eventElements);
  return eventElements;
}

const Calendar = (props) => {
  const weekdays = useWeekStore((state) => state.weekdays);
  const calendar = useWeekStore((state) => state.calendar);
  const formattedCalendar = useWeekStore((state) => state.formattedCalendar);
  const setWeek = useWeekStore((state) => state.setWeek);
  const updateCalendar = useWeekStore((state) => state.updateCalendar);

  const authUser = useAuthUser();
  useEffect(() => {
    const updateCalendarWrapper = async (authUser) => {
      const token = await authUser.getIdToken();
      updateCalendar(token);
      // Gather initial calendar data on component load
      console.log("calendar should be updated");
    };

    updateCalendarWrapper(authUser);
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
                      onClick={async () => {
                        setWeek(weekdays[0], "previous");
                        updateCalendar(await authUser.getIdToken());
                      }}
                    />
                    <IconChevronRight
                      stroke={1.5}
                      size={48}
                      className="border rounded-lg cursor-pointer mr-2"
                      onClick={async () => {
                        setWeek(weekdays[0], "next");
                        updateCalendar(await authUser.getIdToken());
                      }}
                    />
                  </Box>
                  <IconRefresh
                    stroke={1.5}
                    size={48}
                    className="border rounded-lg cursor-pointer mr-2"
                    onClick={async () => {
                      updateCalendar(await authUser.getIdToken());
                    }}
                  />
                </Box>
              </Grid.Col>
              <Grid.Col span={7}>
                <Grid
                  columns={7}
                  gutter={0}
                  className="divide-x border"
                  sx={(theme) => ({
                    borderColor:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[0]
                        : theme.colors.dark[9],
                  })}
                >
                  {weekdays.map((day, index) => {
                    return (
                      <Grid.Col
                        span={1}
                        key={index}
                        sx={(theme) => ({
                          borderColor:
                            theme.colorScheme === "dark"
                              ? theme.colors.dark[0]
                              : theme.colors.dark[9],
                        })}
                      >
                        <Box className="h-104">
                          <Text>{day.format("YYYY-MM-DD")}</Text>
                          <Text>
                            <b>All-day events:</b>
                            {generateEventElements(
                              formattedCalendar[index],
                              "allDay"
                            )}
                          </Text>
                          <Text>
                            <b>Timed events:</b>
                            {generateEventElements(
                              formattedCalendar[index],
                              "times"
                            )}
                          </Text>
                        </Box>
                      </Grid.Col>
                    );
                  })}
                </Grid>
              </Grid.Col>
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
