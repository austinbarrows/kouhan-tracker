import { useToggle, upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  Box,
  Grid,
  Radio,
} from "@mantine/core";
import {
  Calendar,
  DatePicker,
  TimeInput,
  Month,
  DateRangePicker,
} from "@mantine/dates";
import { useAuthUser, withAuthUser } from "next-firebase-auth";
import { getAuth } from "firebase/auth";
import create from "zustand";
import dayjs from "dayjs";
import { useEffect } from "react";

const useErrorStore = create((set) => ({
  error: false,
  setError: (updatedError) => {
    set((state) => ({
      error: updatedError,
    }));
  },
}));

const useRecurringStore = create((set) => ({
  recurring: false,
  setRecurring: (updatedValue) => {
    set((state) => ({
      recurring: updatedValue,
    }));
  },
}));

const useAllDayStore = create((set) => ({
  allDay: false,
  setAllDay: (updatedValue) => {
    set((state) => ({
      allDay: updatedValue,
    }));
  },
}));

const useRecurringScaleStore = create((set) => ({
  recurringScale: "daily",
  setRecurringScale: (updatedValue) => {
    set((state) => ({
      recurringScale: updatedValue,
    }));
  },
}));

// Helper function to invert a given weekday's value
function weekdayTransform(weekdays, index) {
  weekdays[index].selected = !weekdays[index].selected;
  // Must clone like this or the state doesn't update and buttons do not change
  const newWeekdays = [...weekdays];
  console.log(newWeekdays);
  return newWeekdays;
}

const useSelectedWeekdaysStore = create((set) => ({
  weekdays: [
    { weekday: "M", selected: false },
    { weekday: "T", selected: false },
    { weekday: "W", selected: false },
    { weekday: "Th", selected: false },
    { weekday: "F", selected: false },
    { weekday: "S", selected: false },
    { weekday: "Su", selected: false },
  ],
  setWeekday: (dayIndex) => {
    set((state) => ({ weekdays: weekdayTransform(state.weekdays, dayIndex) }));
  },
}));

const useMonthlyDayStore = create((set) => ({
  monthlyDay: new Date(2018, 0, 1),
  setMonthlyDay: (updatedValue) => {
    set((state) => ({ monthlyDay: updatedValue }));
  },
}));

const useYearlyDayStore = create((set) => ({
  yearlyDay: new Date(2018, 0, 1),
  setYearlyDay: (updatedValue) => {
    set((state) => ({ yearlyDay: updatedValue }));
  },
}));

async function submitForm(values) {
  const body = { itemData: values };
  let token = getAuth().currentUser.accessToken;
  console.dir(token);
  let test = await fetch("/api/addCalendarData", {
    method: "POST",
    headers: {
      authorization: token,
    },
    body: JSON.stringify(body),
  });
}

export function AddCalendarItemCard() {
  // State
  const errorState = useErrorStore((state) => state.error);
  const setError = useErrorStore((state) => state.setError);
  const recurring = useRecurringStore((state) => state.recurring);
  const setRecurring = useRecurringStore((state) => state.setRecurring);
  const allDay = useAllDayStore((state) => state.allDay);
  const setAllDay = useAllDayStore((state) => state.setAllDay);
  const recurringScale = useRecurringScaleStore(
    (state) => state.recurringScale
  );
  const setRecurringScale = useRecurringScaleStore(
    (state) => state.setRecurringScale
  );
  const weekdays = useSelectedWeekdaysStore((state) => state.weekdays);
  const setWeekday = useSelectedWeekdaysStore((state) => state.setWeekday);
  const monthlyDay = useMonthlyDayStore((state) => state.monthlyDay);
  const setMonthlyDay = useMonthlyDayStore((state) => state.setMonthlyDay);
  const yearlyDay = useYearlyDayStore((state) => state.yearlyDay);
  const setYearlyDay = useYearlyDayStore((state) => state.setYearlyDay);

  // For sycnhronization purposes, this is computed once up here
  const currentDate = new Date();

  const form = useForm({
    initialValues: {
      name: "",
      date: "",
      time: new Date(),
      recurring: recurring,
      recurringScale: recurringScale,
      allDay: allDay,
      weekdays: weekdays,
      monthlyDay: monthlyDay,
      yearlyDay: yearlyDay,
      spanningPeriod: [null, null],
    },

    validate: {},
  });

  // Set yearlyDay to the current date only once on component load
  useEffect(() => {
    setYearlyDay(currentDate);
  }, []);

  return (
    <Paper radius="md" p="xl" withBorder className="p-2 pt-3 pl-4">
      <Grid columns={7} gutter={0}>
        <Grid.Col span={7} className="text-3xl">
          Add calendar item
        </Grid.Col>
        <form
          onSubmit={form.onSubmit(async (values) => {
            await submitForm(values);
          })}
          className="w-full"
        >
          <Stack>
            <TextInput
              required
              label="Calendar item"
              placeholder='e.g. "Go to gym"'
              value={form.values.name}
              onChange={(event) =>
                form.setFieldValue("name", event.currentTarget.value)
              }
            />

            <Checkbox
              label="All-day (no time)"
              checked={allDay}
              onChange={(event) => {
                setAllDay(event.currentTarget.checked);
                form.setFieldValue("allDay", event.currentTarget.checked);
              }}
            />

            <Checkbox
              label="Recurring"
              checked={recurring}
              onChange={(event) => {
                setRecurring(event.currentTarget.checked);
                form.setFieldValue("recurring", event.currentTarget.checked);
              }}
            />

            {recurring && (
              <Radio.Group
                name="recurringScale"
                className="p-0"
                value={recurringScale}
                onChange={(value) => {
                  setRecurringScale(value);
                  form.setFieldValue("recurringScale", value);
                }}
              >
                <Radio value="daily" label="Daily" />
                <Radio value="weekly" label="Weekly" />
                <Radio value="monthly" label="Monthly" />
                <Radio value="yearly" label="Yearly" />
              </Radio.Group>
            )}

            {recurring && recurringScale === "weekly" && (
              <Button.Group>
                {weekdays.map((day, index) => {
                  return (
                    <Button
                      key={day.weekday}
                      variant={day.selected ? "filled" : "outline"}
                      onClick={(event) => {
                        setWeekday(index);
                        form.setFieldValue("weekdays", weekdays);
                      }}
                    >
                      {day.weekday}
                    </Button>
                  );
                })}
              </Button.Group>
            )}

            {recurring && recurringScale === "monthly" && (
              <Box>
                <Month
                  hideWeekdays
                  hideOutsideDates
                  weekendDays={[]}
                  value={monthlyDay}
                  onChange={(value) => {
                    setMonthlyDay(value);
                    form.setFieldValue("monthlyDay", value);
                  }}
                  month={new Date(2018, 0, 1)}
                />
                <Box className="text-xs">
                  *Selecting days beyond the 28th will place the recurring date
                  on the latest day possible in each month
                </Box>
              </Box>
            )}

            {recurring && recurringScale === "yearly" && (
              <Box>
                <Calendar
                  disableOutsideEvents
                  value={yearlyDay}
                  onChange={(value) => {
                    setYearlyDay(value);
                    form.setFieldValue("yearlyDay", value);
                  }}
                />
              </Box>
            )}

            {!recurring && (
              <DatePicker
                required
                allowFreeInput
                placeholder="Choose date"
                value={form.values.date}
                label="Date"
                onChange={(value) => {
                  form.setFieldValue("date", value);
                }}
              />
            )}

            {!allDay && (
              <TimeInput
                required
                label="Time"
                value={form.values.time}
                format="12"
                onChange={(value) => {
                  form.setFieldValue("time", value);
                }}
              />
            )}

            {recurring && (
              <DateRangePicker
                required
                label="Spanning period"
                placeholder="Choose dates spanned"
                value={form.values.spanningPeriod}
                onChange={(value) => {
                  form.setFieldValue("spanningPeriod", value);
                }}
              />
            )}
          </Stack>
          <Group position="apart" mt="xl">
            <Button
              type="submit"
              variant="gradient"
              gradient={{ from: "#ed6ea0", to: "#ec8c69", deg: 35 }}
            >
              Add
            </Button>
          </Group>
        </form>
      </Grid>
    </Paper>
  );
}