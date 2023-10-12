import express from "express";

export const sessionsRouter = express.Router();


///DEVUELVE LA SESIÓN ACTUAL

sessionsRouter.get("/current",(req,res)=>{
    const user=req.session.user;
    const role=req.session.role;
    const cart=req.session.cart;
    const email=req.session.email;
    if(user){
        return res.status(201).json({
            user:user,
            role:role,
            cart:cart,
            email:email
        });
    }

    else{
        return res.status(201).json({
            user:null,
            msg:"Not logged"
        });
    }
});
