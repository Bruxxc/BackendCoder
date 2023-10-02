import express from "express";
export const mockingRouter = express.Router();
import { generateUser, generateProduct } from "../utils.js";
import { MDBProductManager } from "../dao/helpers/MDBManagers/MDBProductManager.js";

const PManager=new MDBProductManager;

mockingRouter.get("/user", async (req,res)=>{
    const user= generateUser();

    return res.status(200).json({
        status: "success",
        msg: "mocking user:",
        data: user,
      });

});

mockingRouter.get("/product",async (req,res)=>{
   const product= generateProduct();

   return res.status(200).json({
    status: "success",
    msg: "mocking product:",
    data: product,
  });
});

mockingRouter.get("/mockingproducts",async (req,res)=>{
  try{
    let productsArray=[];

    for(let i=0;i<20;i++){
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
    console.log(e);
    throw e;
  }
    
});
