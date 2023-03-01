import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    userID: String, // String is shorthand for {type: String}
    displayName: String,
    calendar: {
      events: {},
      dates: {},
    },
  },
  { minimize: false }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);

/*
  Extra info on schema taken from mockup in getCalendarData and modified

  
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
        Each event will be an object with at minimum the "title" property (TODO: Maybe stabilize this so each object has all possible properties, which are just null if unused)
        All events will be stored in the "events" object at the same level as "dates" under UUID keys
        To get information on a given event, look up the corresponding UUID in "events"

        e.g.:
        "events": {
          cab6cd5b-0bbd-4ca6-9dc9-3e37c95df393: {
            title: "workout",
            description: "resistance training @ southwest rec"
          },
          87995835-d68c-402e-a62e-1767309a99c0: {
            title: "read for 30 minutes",
          },
          0980d9ff-f096-488b-a476-f27ab2ee61f4: {
            title: "do homework"
          },
          5fdce84c-a769-4e62-b8b0-e8ce4d40e54b: {
            title: "get scooter maintenance done"
          },
          1b03b42f-2674-49bd-8077-2aa7b30872d5: {
            title: "study for databases exam"
          }
        }
        "dates": {
          "2022-8-16": {
            "full-day": [
              "5fdce84c-a769-4e62-b8b0-e8ce4d40e54b"
            ],
            "times": {
              "02:05:43": [ // 2:05:43 am (UTC)
                "0980d9ff-f096-488b-a476-f27ab2ee61f4"
              ],
              "17:05:00": [  // 5:05 pm (UTC)
                "cab6cd5b-0bbd-4ca6-9dc9-3e37c95df393", "87995835-d68c-402e-a62e-1767309a99c0"
              ]
            }
          }
          
          "2022-8-17": [
            "times": [
              "17:05:00": [  // 5:05 pm (UTC)
                "1b03b42f-2674-49bd-8077-2aa7b30872d5"
              ]
            ]
          ],
          "2022-8-22": {
              
          }
        }
    }
}
*/
