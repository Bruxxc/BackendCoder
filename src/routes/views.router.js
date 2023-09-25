import express from "express";
import { UserMongoose } from "../dao/models/Mongoose/users.mongoose.js";
export const viewsRouter = express.Router();

viewsRouter.get("/documents", async (req,res)=>{
    const user=req.session.user;
    const email=req.session.email;
    try{
      if(!user){
        return res.redirect("/views/sessions/login");
      }
      else{
        const style="updocs.css";
        const checkUser=await UserMongoose.findOne({email:email});
        const uid=checkUser._id;
        return res.status(200).render('updocs',{style,uid});
      }
  
    }
    catch(e){
      console.log(e);
      throw e;
    }
  });
  