import express from "express";
import { TicketsController } from "../controllers/tickets.controller.js";
export const ticketsRouter = express.Router();

const TController= new TicketsController;

///OBTENER TODOS LOS TICKETS
ticketsRouter.get("/", async (req, res) => {  
    TController.getAll(req,res);
});

///OBTENER TICKET POR ID
ticketsRouter.get("/:tid", async (req,res)=>{
    TController.getById(req,res);
});

///CREAR TICKET
ticketsRouter.post("/", async (req,res)=>{
    TController.create(req,res);    
});