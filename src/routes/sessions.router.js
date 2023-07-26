import express from "express";

export const sessionsRouter = express.Router();


sessionsRouter.get("/current",(req,res)=>{
    const user=req.session.user;
    const role=req.session.role;
    const cart=req.session.cart;

    if(user){
        return res.status(201).json({
            user:user,
            role:role,
            cart:cart
        });
    }

    else{
        return res.status(201).json({
            msg:"Not logged"
          });
    }
});
