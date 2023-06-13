import express from "express";
import { CartModel } from "../dao/models/carts.model.js";
import { ProductModel } from "../dao/models/products.model.js";


export const cartsRouter = express.Router();


cartsRouter.post("/", async (req,res)=>{
    try{
    const cartCreated = await CartModel.create({});
    return res.status(201).json({status:"Success",msg:"Cart created", data:cartCreated});
    } catch (e) {
        console.log(e);
        return res.status(500).json({
          status: "error",
          msg: "something went wrong :(",
          data: {},
        });
      }

});


cartsRouter.get("/", async (req, res) => {
    try {
        const carts = await CartModel.find({});
        console.log("get carts");
        return res.status(200).json({
          status: "success",
          msg: "carts list",
          data: carts,
        });
      } catch (e) {
        console.log(e);
        return res.status(500).json({
          status: "error",
          msg: "something went wrong :(",
          data: {},
        });
      }

});


cartsRouter.get("/:cid", async (req,res)=>{
    let id=req.params.cid;
    

    try {
        const cart = await CartModel.find({_id:id});
        console.log(`get cart ${id}`);
        if(cart[0]){
          return res.status(200).json({
            status: "success",
            msg: "cart found",
            data: cart,
          });
        }
        else{
          return res.status(201).json({
            status: "error",
            msg: "cart not found",
            data: cart,
          });
        }
      } catch (e) {
        console.log(e);
        return res.status(500).json({
          status: "error",
          msg: "something went wrong :(",
          data: {},
        });
      }

});

cartsRouter.post("/:cid/product/:pid", async (req,res)=>{
    let cid=req.params.cid;
    let pid=req.params.pid;

    try {
        const cart = await CartModel.find({_id:cid});
        const product= await ProductModel.find({_id:pid});
        const products= cart[0].products;
        const newProd={
            id:product[0]._id,
            quantity:1,
        }
        products.push(newProd);

        const editCart= await CartModel.updateOne({ _id: cid }, {products});

        return res.status(200).json({
            status: "success",
            msg: "listado de carritos",
            data: {
                cart:editCart,
                product:product,
                update:products
            },
          });
    } catch(e){
        console.log(e);
        return res.status(500).json({
          status: "error",
          msg: "something went wrong :(",
          data: {},
        });

    }


});


cartsRouter.delete("/:cid", async (req,res)=>{
  const id= req.params.cid;
  try{
    const cart = await CartModel.find({"_id":id});
    console.log(cart);
    if(cart[0]){
      const cartDeleted = await CartModel.deleteOne(
        { _id: id },
      );
      return res.status(201).json({
        status: "success",
        msg: "cart deleted",
        data: cart,
        info:cartDeleted
      });
    }
  }  catch(e){
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });

}

});