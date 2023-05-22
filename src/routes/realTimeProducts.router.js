import express from "express";
import { ProductManager } from "../ProductManager.js";
export const realtimeproducts = express.Router();

const Manager=new ProductManager("data/products.json");

realtimeproducts.get("/realtimeproducts",(req,res)=>{
    const products=Manager.getProducts();
    const style="realTimeProducts.css";
    return res.status(200).render('realTimeProducts',{style,products})
  
  })