import express from "express";
import { MDBProductManager } from "../dao/helpers/MDBManagers/MDBProductManager.js";
export const realtimeproducts = express.Router();
const PManager= new MDBProductManager;
 
realtimeproducts.get("/", async (req,res)=>{
    
    const products=await PManager.getAll();
    const style="realTimeProducts.css";
    return res.status(200).render('realTimeProducts',{style,products});
  
  }); 