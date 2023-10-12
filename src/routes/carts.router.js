import express from "express";
import { CartsController } from "../controllers/carts.controller.js";
import { TicketService } from "../services/Ticket.service.js";
export const cartsRouter = express.Router();

const TService= new TicketService;
const CController= new CartsController;

///OBTENER TODOS LOS CARRITOS
cartsRouter.get("/", async (req, res) => {
  CController.getAll(req,res);
});

///OBTENER CARRITO POR ID
cartsRouter.get("/:cid", async (req,res)=>{
   CController.getById(req,res);
});

///CREAR CARRITO
cartsRouter.post("/", async (req,res)=>{
  CController.create(req,res);
});

///MODIFICAR CARRITO
cartsRouter.put("/:cid", async (req,res)=>{
  CController.update(req,res);
});

///AÑADIR PRODUCTO A CARRITO
cartsRouter.post("/:cid/products/:pid", async (req,res)=>{
  CController.addProduct(req,res);
});

///ELIMINAR PRODUCTO DE CARRITO
cartsRouter.delete("/:cid/products/:pid", async (req,res)=>{
  CController.deleteProduct(req,res);
});

///VACIAR CARRITO
cartsRouter.delete("/:cid", async (req,res)=>{
  CController.emptyCart(req,res);
});

///MODIFICAR CANTIDAD DE UN PRODUCTO PERTENECIENTE A UN CARRITO
cartsRouter.put("/:cid/products/:pid", async (req,res)=>{
  CController.editProductQuantity(req,res);
});

///VERIFICAR STOCK Y VALIDEZ DE LA COMPRA
cartsRouter.post("/:cid/purchase", async (req,res)=>{
 CController.purchase(req,res);
});
