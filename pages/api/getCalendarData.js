// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clientPromise from "lib/mongodb";
import { getAuth } from "firebase-admin/auth";
import { getFirebaseAdmin } from "next-firebase-auth";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json("ONLY GET REQUESTS!!!!!!!!!!!!");
  }
  const idToken = req.headers.authorization;
  const fbAdmin = getFirebaseAdmin();
  const uid = (await fbAdmin.auth().verifyIdToken(idToken)).uid;

  const client = await clientPromise;
  const db = client.db("kt-test");
  const collection = db.collection("users");
  //   const insertResult = await collection.insertMany([
  //     { uid: uid, special_key: "MongoDB working very nice" },
  //   ]);
  //   console.log(insertResult);

  const findResult = await collection.find({ uid: uid }).toArray();
  if (findResult.length === 0) {
    const insertResult = await collection.insertMany([
      { uid: uid, special_key: "MongoDB working very nice" },
    ]);
    console.log(insertResult);
  }
  console.log("Found documents =>", findResult);

  res.status(200).json({ uid: uid });
}

/*
Mongo schema for user data, can be expanded later as I flesh out what data will be stored and how
{
    userID: uid from firebase,
    displayName: displayName from firebase,
    calendar: {
        **keys are dates, only add dates if the user attaches some information to them, which saves a massive amount of space and time
        Information in each date will be listed either under "full-day" or under a time on that date
        e.g.:
        "2022-8-16": {
            
        },
        "2022-8-17": {
            
        },
        "2022-8-22": {
            
        }
    }
}
*/
