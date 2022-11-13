import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  userID: String, // String is shorthand for {type: String}
  displayName: String,
  calendar: {
    recurring: { type: Map, of: { type: Object } }, // Maybe a pointless way to define this? But also possibly safer (due to POSSIBLE prototype pollution prevention)???
    dates: [],
  },
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
