import express from "express";
import env from '../config/enviroment.config.js';
import { UserMongoose } from "../dao/models/Mongoose/users.mongoose.js";
export const premiumRouter = express.Router();

premiumRouter.get("/", async(req,res)=>{
    const user=req.session.user;
    const role=req.session.role;
    const email=req.session.email;
  try{

  
        if(user){
        console.log(user);
        if(email==env.adminEmail){
            return res.send("ERES ADMIN");
        }

        else{
            if(role=="premium"){
                return res.send("YA ERES PREMIUM");
            }

            else if(role=="user"){
                const premiumUpgrade= await UserMongoose.updateOne({email:email},{role:"premium"});
                req.session.role="premium";
                return res.send("SE TE HA OTORGADO EL RANGO DE PREMIUM");
            }
        }
        }
        else{
        return res.redirect("/views/sessions/login");
        }

    }
    catch(e){
        console.log(e);
    }
});