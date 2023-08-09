import express from "express";
import { TicketsController } from "../controllers/tickets.controller.js";
export const ticketsRouter = express.Router();

const TController= new TicketsController;

ticketsRouter.get("/", async (req, res) => {  
    TController.getAll(req,res);
});


ticketsRouter.get("/:tid", async (req,res)=>{
    TController.getById(req,res);
});


ticketsRouter.post("/", async (req,res)=>{
    TController.create(req,res);    
});