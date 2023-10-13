import express from "express";
import PaymentService from "../services/Payment.service.js";
export const paymentsRouter = express.Router();

///CREAR PAYMENT INTENT
paymentsRouter.post("/intent", async (req,res)=>{
    try{
        if(req.body.amount==0){
            console.log('REDIRECIONAR, CARRITO VACÍO');
            return res.send({status:"error",'message':'empty cart'});
        }
        else{
            const realAmount=req.body.amount * 100;
            const paymentIntentInfo ={
                amount: realAmount,
                currency: "usd"
            };
            const service= new PaymentService();
            let result = await service.createPaymentIntent(paymentIntentInfo);
            console.log("PAYMENT INTENT", result)
            return res.send({status:"success",payload:result});}
    }
    catch(e){
        throw e;
    }
});


//// COMPRA COMPLETADA CON ÉXITO
paymentsRouter.get("/completed", async (req,res)=>{
    const style="paymentCompleted.css";
    return res.status(200).render('paymentCompleted',{style});
}); 


