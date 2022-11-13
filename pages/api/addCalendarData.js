// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "lib/mongodb";
import mongoose from "mongoose";
import { getAuth } from "firebase-admin/auth";
import { init } from "next-firebase-auth";
import dayjs from "dayjs";
import User from "../../db/models/userModel";

const { Schema, model } = mongoose;

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

  console.log(calendar);

  const test = await userSearchResult[0].save();
  console.log(test);

  // Store new events in calendar

  res.status(200).json({ userID: userID });
}
