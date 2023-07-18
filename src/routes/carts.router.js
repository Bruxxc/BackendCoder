import express from "express";
import { MDBCartManager } from "../dao/MDBManagers/MDBCartManager.js";

export const cartsRouter = express.Router();

const CartManager= new MDBCartManager();

cartsRouter.get("/", async (req, res) => {
    try {
        const carts=await CartManager.getCarts();
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
        const cart =await CartManager.getCartById(id);
        return res.status(200).json({
          status: "success",
          msg: "cart found",
          data: cart,
        });

      } catch (e) {
        console.log(e);
        return res.status(500).json({
          status: "error",
          msg: e.message,
          data: {},
        });
      }

});


cartsRouter.post("/", async (req,res)=>{
  try{
    const cartCreated = await CartManager.createCart();
    return res.status(201).json({status:"Success",msg:"Cart created", data:cartCreated});
  } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: "error",
        msg: error.message,
        data: {},
      });
    }

});

cartsRouter.put("/:cid", async (req,res)=>{
  let cid=req.params.cid;
  let products=req.body;
  try{
    const editCart= await CartManager.addProductsArray(cid,products);
    return res.status(200).json({
      status: "success",
      msg: "cart updated",
    });
  }
  catch(e){
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
});

cartsRouter.post("/:cid/products/:pid", async (req,res)=>{
    let cid=req.params.cid;
    let pid=req.params.pid;

    try {
        const editCart= await CartManager.addProductToCart(pid,cid);

        return res.status(200).json({
            status: "success",
            msg: "cart updated",
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


/////NUEVO

//ELIMINAR PRODUCTO DEL CARRITO
cartsRouter.delete("/:cid/products/:pid", async (req,res)=>{
  let cid=req.params.cid;
  let pid=req.params.pid;

  try {
      
      const editCart= await CartManager.deleteProductFromCart(pid,cid);
      return res.status(200).json({
          status: "success",
          msg: "cart updated",
          data: {
            editCart,
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

///VACIAR CARRITO
cartsRouter.delete("/:cid", async (req,res)=>{
  let cid=req.params.cid;
  try {
     
    const editCart=await CartManager.emptyCart(cid);
      return res.status(200).json({
          status: "success",
          msg: "cart emptied",
          data: {
              editCart
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

///MODIFICAR CANTIDAD DE UN PRODUCTO DEL CARRITO
cartsRouter.put("/:cid/products/:pid", async (req,res)=>{
  let cid=req.params.cid;
  let pid=req.params.pid;
  let {newquant}=req.body;

  try {
          const editCart= await CartManager.editProductQuantity(cid,pid,newquant);
          return res.status(200).json({
              status: "success",
              msg: "cart updated",
              data: {
                  cart:editCart,
                  product:pid,
              },
            });

  } catch(e){
      console.log(e);
      return res.status(500).json({
        status: "error",
        msg: e.message,
        data: {},
      });

  }


});


cartsRouter.get("/actual/cart",async (req,res)=>{
  const cart=req.session.cart;

  if(cart){
    return res.status(201).json({
      cart:cart
    });
  }

  else{
    return res.status(201).json({
      msg:"Not logged"
    })
  }
});