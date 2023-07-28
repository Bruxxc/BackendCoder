import { Schema, model } from "mongoose";

const schema = new Schema({
  text: { type: String, required: true, max: 200 },
  userName: { type: String, required: true, max: 100 },
});

export const MsgMongoose = model("messages", schema);