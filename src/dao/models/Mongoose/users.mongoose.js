import { Schema, model } from "mongoose";

const schema = new Schema({
  firstName: { type: String, required: true, max: 100 },
  lastName: { type: String, required: true, max: 100 },
  age: { type: String, required: false },
  userName: { type: String, required: true, max: 100 },
  password: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100 },
  role: { type: String, default: "user", required: true, max: 100 },
  cart: { type: String, required: false },
  documents: [
    {
      name: { type: String, required: true },
      reference: { type: String, required: true },
    },
  ],
  last_connection: {type:String, default:"_"}
});

export const UserMongoose = model("users", schema);