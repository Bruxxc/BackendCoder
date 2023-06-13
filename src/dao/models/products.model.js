import { Schema, model } from "mongoose";

const schema = new Schema({
  title: { type: String, required: true, max: 100 },
  description: { type: String, required: true, max: 400 },
  price: { type: Number, required: true},
  code: { type: String, required: true, max: 100 },
  stock: { type: String, required: true, max: 100 },
  category: { type: String, required: true, max: 100 },
  thumbnail: { type: String, required: false, max: 100 },
  status:{ type: Boolean, required: true, max: 100 },
});

export const ProductModel = model("product", schema);
