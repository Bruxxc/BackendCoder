import express from "express";
import { ProductModel } from "../dao/models/Mongoose/products.mongoose.js";
export const home = express.Router();

home.get("/",async (req,res)=>{

    let products=await ProductModel.find({}).lean();
    console.log(products);
    const style="home.css";
    return res.status(200).render('home',{style,products});
  
  });