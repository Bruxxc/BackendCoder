import express from "express";
import { MDBCartManager } from "../dao/helpers/MDBManagers/MDBCartManager.js";

export const viewCart = express.Router();

const CartManager= new MDBCartManager();

///PÁGINA PARA VISUALIZAR EL CARRITO CON ID=CID (solo disponible para su usuario)
viewCart.get("/:cid", async (req,res)=>{

    try{
        const user=req.session.user;
        const id=req.params.cid;
        if(!user){
            return res.redirect("/views/sessions/login");
        }
        
        else{
            const userCart=req.session.cart;
            if(id==userCart){
                const cart=await CartManager.getCartById(userCart);
                let esVacio;
                let total=0;
                esVacio=cart[0].products.length==0;
                if(!esVacio){
                    cart[0].products.forEach(product => {
                        total=total+((product.quantity)*(product.product.price));
                    });
                }
                const style="viewCart.css";
                return res.status(200).render('cart', {
                    style: style,
                    cart: cart,
                    userCart: req.session.cart, 
                    esVacio: esVacio,
                    total: total,
                    products: cart[0].products,
                    username:user
                });
            }
            
            else{
                return res.redirect("/views/products");
            }

        }

    }
    catch(e){
        req.logger.error(`ERROR--->${e}`);
        throw e;
    }
  
});