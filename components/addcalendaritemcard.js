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

function validateWeekdays(weekdays) {
  let anySelected = false;
  for (let i = 0; i < weekdays.length; i++) {
    if (weekdays[i].selected) {
      anySelected = true;
      break;
    }
  }

  return anySelected;
}

export function AddCalendarItemCard() {
  // State
  const errorState = useErrorStore((state) => state.error);
  const setError = useErrorStore((state) => state.setError);
  const weekdays = useSelectedWeekdaysStore((state) => state.weekdays);
  const setWeekday = useSelectedWeekdaysStore((state) => state.setWeekday);

  // For sycnhronization purposes, this is computed once up here
  const currentDate = new Date();

  const form = useForm({
    initialValues: {
      name: "",
      date: "",
      time: new Date(),
      recurring: false,
      recurringScale: "daily",
      allDay: false,
      weekdays: weekdays,
      monthlyDay: new Date(2018, 0, 1),
      yearlyDay: new Date(2018, 0, 1),
      spanningPeriod: [null, null],
      monthlyStrict: false,
    },

    validate: {
      spanningPeriod: (value) =>
        !form.values.recurring || (value[0] && value[1])
          ? null
          : "Please provide a spanning period for this recurring action",
      weekdays: (value) =>
        !form.values.recurring ||
        form.values.recurringScale !== "weekly" ||
        validateWeekdays(value)
          ? null
          : "Please select at least one weekday",
    },
  });

  // Set yearlyDay to the current date only once on component load
  useEffect(() => {
    form.setFieldValue("yearlyDay", currentDate);
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
              checked={form.values.allDay}
              onChange={(event) => {
                form.setFieldValue("allDay", event.currentTarget.checked);
              }}
            />

            <Checkbox
              label="Recurring"
              checked={form.values.recurring}
              onChange={(event) => {
                form.setFieldValue("recurring", event.currentTarget.checked);
              }}
            />

            {form.values.recurring && (
              <Radio.Group
                name="recurringScale"
                className="p-0"
                value={form.values.recurringScale}
                onChange={(value) => {
                  form.setFieldValue("recurringScale", value);
                }}
              >
                <Radio value="daily" label="Daily" />
                <Radio value="weekly" label="Weekly" />
                <Radio value="monthly" label="Monthly" />
                <Radio value="yearly" label="Yearly" />
              </Radio.Group>
            )}

            {form.values.recurring && form.values.recurringScale === "weekly" && (
              <Box>
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
                        sx={
                          form.errors.weekdays &&
                          ((theme) => ({
                            borderColor:
                              theme.colorScheme === "dark"
                                ? theme.colors.red[9]
                                : theme.colors.red[5],
                            color:
                              theme.colorScheme === "dark"
                                ? theme.colors.red[9]
                                : theme.colors.red[5],
                          }))
                        }
                      >
                        {day.weekday}
                      </Button>
                    );
                  })}
                </Button.Group>
                <Box
                  sx={(theme) => ({
                    fontSize: theme.fontSizes.xs,
                    color:
                      theme.colorScheme === "dark"
                        ? theme.colors.red[9]
                        : theme.colors.red[5],
                  })}
                >
                  {form.errors.weekdays}
                </Box>
              </Box>
            )}

            {form.values.recurring && form.values.recurringScale === "monthly" && (
              <Box>
                <Month
                  hideWeekdays
                  hideOutsideDates
                  weekendDays={[]}
                  value={form.values.monthlyDay}
                  onChange={(value) => {
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

            {form.values.recurring && form.values.recurringScale === "yearly" && (
              <Box>
                <Calendar
                  disableOutsideEvents
                  value={form.values.yearlyDay}
                  onChange={(value) => {
                    form.setFieldValue("yearlyDay", value);
                  }}
                />
              </Box>
            )}

            {!form.values.recurring && (
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

            {!form.values.allDay && (
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

            {form.values.recurring && (
              <DateRangePicker
                required
                label="Spanning period"
                placeholder="Choose dates spanned"
                value={form.values.spanningPeriod}
                onChange={(value) => {
                  form.setFieldValue("spanningPeriod", value);
                }}
                minDate={currentDate}
                {...form.getInputProps("spanningPeriod")}
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
