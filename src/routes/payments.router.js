import express from "express";
import PaymentService from "../services/Payment.service.js";
export const paymentsRouter = express.Router();

paymentsRouter.post("/intent", async (req,res)=>{
    const paymentIntentInfo ={
        amount: 1000,
        currency: "usd"
    };
    const service= new PaymentService();
    let result = await service.createPaymentIntent(paymentIntentInfo);
    console.log(result);
    return res.send({status:"success",payload:result});
});


//// COMPRA COMPLETADA CON ÉXITO
paymentsRouter.get("/completed", async (req,res)=>{
    const style="paymentCompleted.css";
    return res.status(200).render('paymentCompleted',{style});
}); 


