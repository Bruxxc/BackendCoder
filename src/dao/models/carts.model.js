import { Schema, model } from "mongoose";

const schema = new Schema({
  num:{type:Number},
  products: { type: Array, default: [] },
});

export const CartModel = model("cart", schema);
