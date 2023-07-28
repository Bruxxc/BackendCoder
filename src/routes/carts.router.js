import express from "express";
import { CartsController } from "../controllers/carts.controller.js";
export const cartsRouter = express.Router();

const CController= new CartsController;
cartsRouter.get("/", async (req, res) => {
  CController.getAll(req,res);

});


cartsRouter.get("/:cid", async (req,res)=>{
   CController.getById(req,res);
});


cartsRouter.post("/", async (req,res)=>{
  CController.create(req,res);

});

cartsRouter.put("/:cid", async (req,res)=>{
  CController.update(req,res);
});

cartsRouter.post("/:cid/products/:pid", async (req,res)=>{
    CController.addProduct(req,res);

});

cartsRouter.delete("/:cid/products/:pid", async (req,res)=>{
  CController.deleteProduct(req,res);
});

cartsRouter.delete("/:cid", async (req,res)=>{
  CController.emptyCart(req,res);
});

cartsRouter.put("/:cid/products/:pid", async (req,res)=>{
  CController.editProductQuantity(req,res);
});


