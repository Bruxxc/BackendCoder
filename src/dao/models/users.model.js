import { Schema, model } from "mongoose";

const schema = new Schema({
  firstName: { type: String, required: true, max: 100 },
  lastName: { type: String, required: true, max: 100 },
  userName:{ type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100 },
  password:{type: String ,required: true, max: 100},
  role:{type: String ,default: "user",required: true, max: 100},
});

export const UserModel = model("users", schema);