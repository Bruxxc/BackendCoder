import express from "express";
import { CartManager } from "../CartManager.js";
import { ProductManager } from "../ProductManager.js";
let CManager=new CartManager("./data/carts.json");
let PManager=new ProductManager("./data/products.json");
export const cartsRouter = express.Router();


cartsRouter.post("/",(req,res)=>{
    let id=CManager.newCart();
    return res.status(201).json({status:"Success",msg:"Cart created",id:id});

});

cartsRouter.get("/",(req,res)=>{
    const result=CManager.getCarts();
    return res.status(200).json({status:"Success",carts:result});
});

cartsRouter.get("/:cid",(req,res)=>{
    let id=req.params.cid;
    let result=CManager.getCartById(id);

    if(!result){
        return res.status(400).json({status:"Error",msg:"Cart not found"});
    }
    else{
        result=result.products;
        return res.status(200).json({status:"Success",msg:"Cart found",products:result});
    }
});

cartsRouter.post("/:cid/product/:pid",(req,res)=>{
    let cid=req.params.cid;
    let pid=req.params.pid;

    let existe=PManager.getProductById(pid);

    if(!existe){
        return res.status(400).json({status:"Error",msg:"Product does not exist"});
    }

    else{
        let stock=PManager.getProductById(pid).stock;
        let quantity=CManager.productQuantity(cid,pid); 

        if(quantity==undefined){  
            return res.status(400).json({status:"Error",msg:"Cart not found"});

        }

        else if (quantity<stock){
            CManager.addProduct(cid,pid);
            return res.status(201).json({status:"Success",msg:"Product added",quantity:quantity+1,stock:stock});
            
        }

        else if(quantity>=stock){
                return res.status(200).json({status:"Error",msg:"Stock limit",quantity:quantity,stock:stock});
        }

    }

})