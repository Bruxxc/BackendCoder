import express from "express";
import { ProductsController } from "../controllers/products.controller.js";


export const productsRouter = express.Router();

const PController = new ProductsController;

///OBTENER TODOS LOS PRODUCTOS
productsRouter.get("/", async (req, res) => {
  PController.getAll(req,res);
});

///OBTENER PRODUCTO POR ID
productsRouter.get("/:pid", async (req, res) => {
  PController.getById(req,res);
});

///CREAR PRODUCTO
productsRouter.post("/", async (req, res) => {
  PController.create(req,res);
});

///MODIFICAR PRODUCTO
productsRouter.put("/:id", async (req, res) => {
  PController.update(req,res);
});

///ELIMINAR PRODUCTO
productsRouter.delete("/:pid", async (req,res)=>{
  PController.delete(req,res);
});


