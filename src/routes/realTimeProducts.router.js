import express from "express";
export const realtimeproducts = express.Router();
import { ProductModel } from "../dao/models/products.model.js";


realtimeproducts.get("/", async (req,res)=>{
    const products=await ProductModel.find({});
    const style="realTimeProducts.css";
    return res.status(200).render('realTimeProducts',{style,products});
  
  });