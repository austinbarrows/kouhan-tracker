// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "lib/mongodb";
import { getAuth } from "firebase-admin/auth";
import { init } from "next-firebase-auth";
import dayjs from "dayjs";
import { getAuth } from "firebase/auth";

/*
  Must be called with request body of the following form:

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

  *** Dates, times, and events are examples
  body: {
    authorization: user ID token,
    dates: [
        {
            "date": "2022-08-17"
            "full-day": [
                "eventA", "meditate"
            ] 
            "times": [
                "02:05:43": [ // 2:05:43 am (UTC)
                    "event1", "event2", "workout"
                ],
                "17:05:00": [  // 5:05 pm (UTC)
                    "event1", "homework", "stretching", "make dinner"
                ]
            ]
        }, 
        {}, 
        {}
    ]
  }
*/
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json("ONLY POST REQUESTS!!!!!!!!!!!!");
  }
  // Validate user ID token and throw error if invalid
  const idToken = req.body.authorization;
  let uid;
  try {
    uid = (await getAuth().verifyIdToken(idToken)).uid;
  } catch (e) {
    console.log(e);
    return new Error("Failed to validate User ID Token");
  }

  // Store given events on given dates in the user's calendar
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
    return new Error("BUG: Failed to gather calendar data");
  }

  // Store new events in calendar

  res.status(200).json({ uid: uid });
}
