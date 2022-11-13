// ./pages/api/register
import clientPromise from "lib/mongodb";
import { getAuth } from "firebase-admin/auth";
import { init } from "next-firebase-auth";
import initAuth from "initAuth";
import mongoose from "mongoose";
const { Schema, model } = mongoose;
import User from "../../db/models/userModel";

initAuth();

const handler = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json("ERROR: Only POST requests are allowed.");
  }

  // Validate user ID token and throw error if invalid
  const idToken = req.headers.authorization;
  let newUser;
  try {
    newUser = await getAuth().verifyIdToken(idToken);
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Could not verify user" });
    return true;
  }

  const userID = newUser.uid;
  const displayName = newUser.displayName;

  // MongoDB setup
  const client = await clientPromise;
  const db = client.db("kt-test");
  const collection = db.collection("users");

  await mongoose.connect(process.env.MONGODB_URI + "/" + "kt-test");
  const dbMongoose = mongoose.connection;

  // Test to see if user already exists
  const userSearchResult = await collection.find({ userID: userID }).toArray();
  if (userSearchResult.length !== 0) {
    res.status(400).json({ error: "User is already registered" });
    return true;
  }

  // Add new user to database
  const newUserDoc = new User({
    userID: userID,
    displayName: displayName,
    calendar: { recurring: {}, dates: [] },
  });
  const addResult = await newUserDoc.save();

  return res.status(200).json({ success: true });
};

export default handler;
