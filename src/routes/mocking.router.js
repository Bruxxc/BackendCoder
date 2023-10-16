import express from "express";
export const mockingRouter = express.Router();
import { generateUser, generateProduct } from "../utils.js";
import { MDBProductManager } from "../dao/helpers/MDBManagers/MDBProductManager.js";

const PManager=new MDBProductManager;


///CREAR 1 MOCKING USER
mockingRouter.get("/user", async (req,res)=>{
    const user= generateUser();

    return res.status(200).json({
        status: "success",
        msg: "mocking user:",
        data: user,
      });

});

///CREAR 1 MOCKING PRODUCT
mockingRouter.get("/product",async (req,res)=>{
   const product= generateProduct();

   return res.status(200).json({
    status: "success",
    msg: "mocking product:",
    data: product,
  });
});

///CARGA LA BASE DE DATOS CON 20 MOCKING PRODUCTS
mockingRouter.get("/mockingproducts",async (req,res)=>{
  try{
    let productsArray=[];

    for(let i=0;i<20;i++){///modificar el rango de i para cambiar la cantidad de productos
      let prod=generateProduct();
      let createProd= await PManager.createProduct(prod.title,prod.description,parseFloat(prod.price),prod.code,prod.stock,prod.category,prod.thumbnail);
      productsArray.push(prod);
    }
    
    return res.status(201).json({
      status: "success",
      msg: "mocking products:",
      data: productsArray,
    });
  }

  catch(e){
    req.logger.error(`ERROR AT MOCKING PRODUCTS ---> ${e}`);
    throw e;
  }
    
});
