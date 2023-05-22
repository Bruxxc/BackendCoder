import express from "express";
import { ProductManager } from "../ProductManager.js";
export const home = express.Router();

const Manager=new ProductManager("data/products.json");

home.get("/home",(req,res)=>{
    const products=Manager.getProducts();
    const style="home.css";
    return res.status(200).render('home',{style,products})
  
  })