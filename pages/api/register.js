// ./pages/api/register
import clientPromise from "lib/mongodb";
import { getFirebaseAdmin } from "next-firebase-auth";
import initAuth from "initAuth";
import mongoose from "mongoose";
const { Schema } = mongoose;

initAuth();

const blogSchema = new Schema({
  userID: String, // String is shorthand for {type: String}
  displayName: String,
  calendar: {
    recurring: { type: Map, of: { type: Object } }, // Maybe a pointless way to define this? But also possibly safer (due to POSSIBLE prototype pollution prevention)???
    dates: [],
  },
});

const handler = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json("ERROR: Only POST requests are allowed.");
  }

  // Validate user ID token and throw error if invalid
  const idToken = req.headers.authorization;
  const fbAdmin = getFirebaseAdmin();
  let userID;
  try {
    userID = (await fbAdmin.auth().verifyIdToken(idToken)).uid;
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Could not verify user" });
    return true;
  }

  // MongoDB setup
  const client = await clientPromise;
  const db = client.db("kt-test");
  const collection = db.collection("users");

  const userSearchResult = await collection.find({ userID: userID }).toArray();
  if (userSearchResult.length !== 0) {
    res.status(400).json({ error: "User is already registered" });
    return true;
  }

  return res.status(200).json({ success: true });
};

export default handler;
