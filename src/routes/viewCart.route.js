import express from "express";
import { MDBCartManager } from "../dao/helpers/MDBManagers/MDBCartManager.js";

export const viewCart = express.Router();

const CartManager= new MDBCartManager();


viewCart.get("/:cid", async (req,res)=>{

    try{
        const id=req.params.cid;
        const cart=await CartManager.getCartById(id);
        let esVacio;
        const style="viewCart.css";
        esVacio=cart[0].products.length==0;
        console.log(cart[0].products);
        
        return res.status(200).render('cart',{
            style:style,
            cart:cart,
            esVacio:esVacio,
            products:cart[0].products,
        });

    }
    catch(e){
        console.log(e);
        return res.status(500).render('login');
    }
  
});