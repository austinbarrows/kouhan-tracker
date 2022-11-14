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
  let newUserUID;
  try {
    newUserUID = (await getAuth().verifyIdToken(idToken)).uid;
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Could not verify user" });
    return true;
  }

  const displayName = (await getAuth().getUser(newUserUID)).displayName;

  await mongoose.connect(process.env.MONGODB_URI + "/" + "kt-test");
  const dbMongoose = mongoose.connection;

  // Test to see if user already exists
  const userSearchResult = await User.find({ userID: newUserUID });
  if (userSearchResult.length !== 0) {
    res.status(400).json({ error: "User is already registered" });
    return true;
  }

  // Add new user to database
  const newUserDoc = new User({
    userID: newUserUID,
    displayName: displayName,
  });
  const addResult = await newUserDoc.save();
  console.log(addResult);

  return res.status(200).json({ success: true });
};

export default handler;
