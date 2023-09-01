import { Schema, model } from "mongoose";

const schema = new Schema({
    email: { type: String, required: true},
    token: { type: String, required: true},
    expire: { type: String, required: true},
});

export const RecoverCodesMongoose = model("recoverCodes", schema);