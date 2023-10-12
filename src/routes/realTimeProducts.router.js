import express from "express";
import { MDBProductManager } from "../dao/helpers/MDBManagers/MDBProductManager.js";
export const realtimeproducts = express.Router();
const PManager= new MDBProductManager;
 
///REALTIMEPRODUCTS--> MODIFICADO:UTILIZADO PARA QUE UN USUARIO PREMIUM CREE Y ADMINISTRE PRODUCTOS
realtimeproducts.get("/", async (req,res)=>{
    const username = req.session.user ;
    const products=await PManager.getAll();
    const style="realTimeProducts.css";
    return res.status(200).render('realTimeProducts',{style,products,username:username});
  
  }); 