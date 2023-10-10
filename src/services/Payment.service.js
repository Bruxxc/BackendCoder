import Stripe from "stripe";
import env from "../config/enviroment.config.js"

export default class PaymentService {
    constructor(){
        this.stripe = new Stripe(env.stripe_key);
    }
    createPaymentIntent = async (data) =>{
        const paymentIntent= this.stripe.paymentIntents.create(data);
        return paymentIntent;
    }
}