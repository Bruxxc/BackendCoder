import express from "express";
import { MDBProductManager } from "../dao/helpers/MDBManagers/MDBProductManager.js";
export const home = express.Router();
const PManager= new MDBProductManager;


home.get("/",async (req,res)=>{

    let products=await PManager.getAll();
    const style="home.css";
    return res.status(200).render('home',{style,products});
  
  });