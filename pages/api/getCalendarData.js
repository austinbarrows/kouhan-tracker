// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "lib/mongodb";
import { getFirebaseAdmin } from "next-firebase-auth";
import dayjs from "dayjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json("ERROR: Only POST requests are allowed.");
  }
  // Validate user ID token and throw error if invalid
  const idToken = req.headers.authorization;
  const fbAdmin = getFirebaseAdmin();
  let uid;
  try {
    uid = (await fbAdmin.auth().verifyIdToken(idToken)).uid;
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Could not verify user" });
    return true;
  }

  // Gather data from mongodb for a user for the given period of time after some start date
  try {
  const client = await clientPromise;
  const db = client.db("kt-test");
  const collection = db.collection("users");

  // Find user and extract their calendar
  const userSearchResult = await collection.find({ uid: uid }).toArray();
  let calendar;
  if (findResult.length === 1) {
    const user = userSearchResult[0];
    calendar = user.calendar;
  } else {
    // If there are no users with a given uid, there was an error upon account creation where the user was never added to the database, so return an error
    // *OR*
    // If there is more than 1 user with a given uid, there is a bug occurring, since uids are supposed to be unique, so return an error
      throw new Error("BUG: Failed to gather calendar data");
  }

  /* 
    This algorithm could be improved to use binary search later by changing the stored calendar to an array, since inserts are rare compared to searching;
    however, this app will probably last only a few years to maybe a decade by some miracle, where the most heavyweight users will have approx. 10 x 365 + max 3 leap days by pigeonhole = 3653 days stored, so I don't think performance will actually be improved much

    UPDATE -- Just kidding, out of curiosity I searched up how JS objects work and they use hash tables internally (should have guessed lol), so I don't believe this would be faster by much if at all
  */

  let date = dayjs(req.body.startDate);

  let calendarData = [];
  for (let i = 0; i < req.body.numberOfDays; i++) {
    // calendarData will have 'undefined' for any days in the user's calendar that have no scheduled events
    calendarData[i] = calendar[date.format("YYYY-MM-DD")];
    date = date.add(1, "day");
  }
  console.log("Calendar data: ", calendarData);

  res.status(200).json({ uid: uid });
  } catch (e) {
    console.log("Failed to gather calendar data!");
    console.log(e);
    res.status(400).json({ error: "Failed to gather calendar data." });
  }
}

/*
Mongo schema for user data, can be expanded later as I flesh out what data will be stored and how
{
    userID: uid from firebase,
    displayName: displayName from firebase,
    calendar: {
        **keys are dates, only add dates if the user attaches some information to them, which saves a massive amount of space and time
        Information in each date will be in either the "full-day" array or the "times" array, depending on whether the event starts at a set time or lasts the full day/can be done at any time
        Each time in "times" will be an array so that multiple events can be scheduled at the same time if desired
        All times will be in UTC
        The times in "times" will be sorted
        e.g.:
        "2022-8-16": {
          "full-day": [],
          "times": [
            "02:05:43": [ // 2:05:43 am (UTC)
              "event1", "event2", "workout"
            ],
            "17:05:00": [  // 5:05 pm (UTC)
              "event1", "homework", "stretching", "make dinner"
            ]
          ]
        }
        
        },
        "2022-8-17": [
            "17:05:00": [  // 5:05 pm (UTC)
              "event1", "homework", "stretching", "make dinner"
            ]
        ],
        "2022-8-22": {
            
        }
    }
}
*/
