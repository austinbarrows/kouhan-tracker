// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "lib/mongodb";
import { getFirebaseAdmin } from "next-firebase-auth";
import dayjs from "dayjs";

/*
  Must be called with request body of the following form:
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
  const fbAdmin = getFirebaseAdmin();
  let uid;
  try {
    uid = (await fbAdmin.auth().verifyIdToken(idToken)).uid;
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
