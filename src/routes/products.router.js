import express from "express";
import { ProductsController } from "../controllers/products.controller.js";

export const productsRouter = express.Router();

const PController = new ProductsController;

productsRouter.get("/", async (req, res) => {
  PController.getAll(req,res);
});

productsRouter.get("/:pid", async (req, res) => {
  PController.getById(req,res);
});



productsRouter.post("/", async (req, res) => {
  PController.create(req,res);
});


productsRouter.put("/:id", async (req, res) => {
  PController.update(req,res);
});

productsRouter.delete("/:pid", async (req,res)=>{
  PController.delete(req,res);
});


