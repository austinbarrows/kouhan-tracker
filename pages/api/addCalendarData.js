// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "lib/mongodb";
import mongoose from "mongoose";
import { getAuth } from "firebase-admin/auth";
import { init } from "next-firebase-auth";
import dayjs from "dayjs";
import User from "../../db/models/userModel";
import { randomUUID } from "crypto";

const { Schema, model } = mongoose;

/* Modifies user object to add an item to 
   their calendar and then returns that modified user object */
function addCalendarItem(user, calendarItem, eventID, formattedDay, time) {
  if (!user.calendar.dates.get(formattedDay)) {
    user.calendar.dates.set(formattedDay, {
      allDay: [],
      times: {},
    });
  }

  if (calendarItem.allDay) {
    let updatedAllDay = user.calendar.dates.get(formattedDay).allDay;
    updatedAllDay.push(eventID);

    user.calendar.dates.set(formattedDay, {
      allDay: updatedAllDay,
      times: user.calendar.dates.get(formattedDay).times,
    });
  } else {
    if (!user.calendar.dates.get(formattedDay).times[time]) {
      user.calendar.dates.get(formattedDay).times[time] = [];
    }

    let updatedTimes = user.calendar.dates.get(formattedDay).times;
    updatedTimes[time].push(eventID);

    user.calendar.dates.set(formattedDay, {
      allDay: user.calendar.dates.get(formattedDay).allDay,
      times: updatedTimes,
    });
  }

  return user;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json("ERROR: Only POST requests are allowed.");
  }

  // This feels like a possible security vulnerability but I don't know exactly why...
  const body = JSON.parse(req.body);
  console.log(body);

  // Validate user ID token and throw error if invalid
  const idToken = req.headers.authorization;
  let userID;
  try {
    userID = (await getAuth().verifyIdToken(idToken)).uid;
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Could not verify user" });
    return true;
  }

  // Store given events on given dates in the user's calendar
  await mongoose.connect(process.env.MONGODB_URI + "/" + "kt-test");
  const dbMongoose = mongoose.connection;

  // Verify user is unique and extract them if so
  const userSearchResult = await User.find({ userID: userID });

  let calendar;
  let user;
  if (userSearchResult.length === 1) {
    user = userSearchResult[0];
  } else {
    // If there are no users with a given uid, there was an error upon account creation where the user was never added to the database, so return an error
    // *OR*
    // If there is more than 1 user with a given uid, there is a bug occurring, since uids are supposed to be unique, so return an error
    throw new Error(
      "BUG: Failed to gather calendar data -- 0 users found OR 2+ users found for a single user ID"
    );
  }

  const calendarItem = body.itemData;
  let daySpan = 0; // Only possible if not recurring or if some type of error occurs
  if (calendarItem.recurring) {
    // Should error if these spanning period endpoints don't exist
    daySpan =
      dayjs(calendarItem.spanningPeriod[1]).diff(
        dayjs(calendarItem.spanningPeriod[0]),
        "day"
      ) + 1; // +1 to include both endpoint days -- used for iteration later
  }

  const event = {
    title: calendarItem.name,
  };

  const eventID = randomUUID();
  user.calendar.events.set(eventID, event);

  const time = dayjs(calendarItem.time).format("HH:mm:ss");

  // Determine how to schedule the event based on provided form parameters
  if (calendarItem.recurring) {
    let date = dayjs(calendarItem.spanningPeriod[0]);
    switch (calendarItem.recurringScale) {
      case "daily":
        // Place event ID on each date in the time period
        for (let i = 0; i < daySpan; i++) {
          const formattedDay = date.format("YYYY-MM-DD");

          user = addCalendarItem(
            user,
            calendarItem,
            eventID,
            formattedDay,
            time
          );
          date = date.add(1, "day");
        }
        break;

      case "weekly":
        // Place event ID on each date in the time period
        for (let i = 0; i < daySpan; i++) {
          const dayOfWeek = (date.day() + 6) % 7; // Offset because my weekdays array is Monday-indexed and dayjs is Sunday-indexed
          // Do not add events on a given date unless it is one of the desired days of the week
          if (!calendarItem.weekdays[dayOfWeek].selected) {
            date = date.add(1, "day");
            continue;
          }

          const formattedDay = date.format("YYYY-MM-DD");
          user = addCalendarItem(
            user,
            calendarItem,
            eventID,
            formattedDay,
            time
          );
          date = date.add(1, "day");
        }
        break;

      case "monthly":
        // Place event ID on each date in the time period
        // NOT DONE*************************
        const monthlyDateBasis = dayjs(calendarItem.monthlyDay).date();
        /**For use in non-strict monthly event-setting -- basically, if a 
           monthly event falls on a date that does not exist in a month 
           (i.e. february 30th or april 31st), then the event's date will get
           floored to the final date of that month. This is completed by
           not doing anything if the date is past the final date in a month
           (indicated by the starting values in monthDateSet), or replacing
           the value in monthDateSet with the event's provided date if the date
           is within the possible dates of a given month.
        */
        const monthDateSet = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        for (let i = 0; i < monthDateSet.length; i++) {
          if (monthlyDateBasis < monthDateSet[i]) {
            monthDateSet[i] = monthlyDateBasis;
          }
        }

        for (let i = 0; i < daySpan; i++) {
          // Do not add events on a given date unless it is on the desired day of the month
          const monthlyDate = monthDateSet[date.month()]; // date.month() return values match indices of monthDateSet
          if (date.date() !== monthlyDate) {
            date = date.add(1, "day");
            continue;
          }

          const formattedDay = date.format("YYYY-MM-DD");
          user = addCalendarItem(
            user,
            calendarItem,
            eventID,
            formattedDay,
            time
          );
          date = date.add(1, "day");
        }
        break;

      case "yearly":
        // Place event ID on each date in the time period
        const yearlyDate = dayjs(calendarItem.yearlyDay).format("MM-DD");
        for (let i = 0; i < daySpan; i++) {
          // Do not add events on a given date unless it is on the desired day of the month
          if (date.format("MM-DD") !== yearlyDate) {
            date = date.add(1, "day");
            continue;
          }

          const formattedDay = date.format("YYYY-MM-DD");
          user = addCalendarItem(
            user,
            calendarItem,
            eventID,
            formattedDay,
            time
          );
          date = date.add(1, "day");
        }
        break;
    }
  } else {
    const date = dayjs(calendarItem.date);
    const formattedDay = date.format("YYYY-MM-DD");
    user = addCalendarItem(user, calendarItem, eventID, formattedDay, time);
  }

  const test = await user.save();
  console.log(test.calendar);

  res.status(200).json({ userID: userID });
}
