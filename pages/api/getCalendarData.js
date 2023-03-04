// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import mongoose from "mongoose";
import { getAuth } from "firebase-admin/auth";
import { init } from "next-firebase-auth";
import dayjs from "dayjs";
import User from "../../db/models/userModel";

function eventsOnDate(formattedDate, calendar) {
  if (!calendar.dates[formattedDate]) {
    return null;
  }

  const allDay = calendar.dates[formattedDate].allDay;
  const times = calendar.dates[formattedDate].times;
  let events = {};

  for (let i = 0; i < allDay.length; i++) {
    const eventUUID = allDay[i];
    events[eventUUID] = calendar.events[eventUUID];
  }

  for (const [time, eventUUIDArray] of Object.entries(times)) {
    for (let i = 0; i < eventUUIDArray.length; i++) {
      const eventUUID = eventUUIDArray[i];
      events[eventUUID] = calendar.events[eventUUID];
    }
  }

  return events;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json("ERROR: Only POST requests are allowed.");
  }

  // This feels like a possible security vulnerability but I don't know exactly why...
  const body = JSON.parse(req.body);

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

  // Gather data from mongodb for a user for the given period of time after some start date
  try {
    await mongoose.connect(process.env.MONGODB_URI + "/" + "kt-test");
    const dbMongoose = mongoose.connection;

    // Find user and extract their calendar
    const userSearchResult = await User.find({ userID: userID });

    let calendar;
    if (userSearchResult.length === 1) {
      const user = userSearchResult[0];
      calendar = user.calendar;
    } else {
      // If there are no users with a given uid, there was an error upon account creation where the user was never added to the database, so return an error
      // *OR*
      // If there is more than 1 user with a given uid, there is a bug occurring, since uids are supposed to be unique, so return an error
      throw new Error(
        "BUG: Failed to gather calendar data -- 0 users found OR 2+ users found for a single user ID"
      );
    }

    /* 
    This algorithm could be improved to use binary search later by changing the stored calendar to an array, since inserts are rare compared to searching;
    however, this app will probably last only a few years to maybe a decade by some miracle, where the most heavyweight users will have approx. 10 x 365 + max 3 leap days by pigeonhole = 3653 days stored, so I don't think performance will actually be improved much

    UPDATE -- Just kidding, out of curiosity I searched up how JS objects work and they use hash tables internally (should have guessed lol), so I don't believe this would be faster by much if at all
  */

    let date = dayjs(body.startDate);

    let calendarData = [];
    for (let i = 0; i < body.numberOfDays; i++) {
      let formattedDate = date.format("YYYY-MM-DD");
      // calendarData will have 'undefined' for any days in the user's calendar that have no scheduled events
      calendarData[i] = {
        dates: calendar.dates[formattedDate] || null,
        events: eventsOnDate(formattedDate, calendar),
      };
      date = date.add(1, "day");
    }
    console.log("Calendar data: ", calendarData);

    res.status(200).json({ userID: userID, calendar: calendarData });
  } catch (e) {
    console.log("Failed to gather calendar data!");
    console.log(e);
    res.status(400).json({ error: "Failed to gather calendar data." });
  }
}

/*
Mongo schema for user data, can be expanded later as I flesh out what data will be stored and how
The goal of this application is to make access extremely fast, so most of the design choices follow (or SHOULD follow) in accordance with this principle
  - This is why the times are sorted on insert and why there will be no option to truly have recurring tasks scheduled each day, only for some finite but potentially extremely long period of time, like 10 years+
{
    userID: uid from firebase,
    displayName: displayName from firebase,
    calendar: {
        **keys are dates, only add dates if the user attaches some information to them, which saves a massive amount of space and time
        Information in each date will be in either the "full-day" array or the "times" array, depending on whether the event starts at a set time or lasts the full day/can be done at any time
        Each time in "times" will be an array so that multiple events can be scheduled at the same time if desired
        All times will be in UTC
        The times in "times" will be sorted, so the client doesn't have to perform any kind of sorting to display them in the proper order
        Each event in a given array will be an object with at minimum the "title" property OR the "recurring" property so the recurring event can be looked up in the recurring event object for this user (TODO: Maybe stabilize this so each object has all possible properties, which are just null if unused)
        All recurring events should be labeled with a UUID in the "recurring" object that will be accessed in the case that there is a recurring event on a given date
          - This is because if a user wants to change the information related to a recurring event, it should only be changed in one location
        e.g.:
        "recurring": {
          cab6cd5b-0bbd-4ca6-9dc9-3e37c95df393: {
            title: "workout",
            description: "resistance training @ southwest rec"
          },
          87995835-d68c-402e-a62e-1767309a99c0: {
            title: "read for 30 minutes",
          }
        }
        "dates": [
          "2022-8-16": {
            "full-day": [
              {recurring: 87995835-d68c-402e-a62e-1767309a99c0}
            ],
            "times": [
              "02:05:43": [ // 2:05:43 am (UTC)
                {title: "event1"} , {title: "event2"}, {recurring: cab6cd5b-0bbd-4ca6-9dc9-3e37c95df393}
              ],
              "17:05:00": [  // 5:05 pm (UTC)
                {title: "event1"}, {title: "homework"}, {title: "stretching"}, {title: "make dinner"}
              ]
            ]
          }
          
          "2022-8-17": [
            "times": [
              "17:05:00": [  // 5:05 pm (UTC)
                {title: "event1"}, {title: "homework"}, {title: "stretching"}, {title: "make dinner"}
              ]
            ]
          ],
          "2022-8-22": {
              
          }
        ]
    }
}
*/
