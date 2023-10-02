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
  
  viewsRouter.get("/profile", async (req,res)=>{
    try{
      const email=req.session.email;
      if(email){
        const userInfo=await UserMongoose.findOne({email:email});
        const style="userProfile.css";
        return res.status(200).render('userProfile',{
          style: style,
          uid:userInfo._id,
          username: userInfo.userName,
          email: email,
          role: userInfo.role,
          firstname: userInfo.firstName,
          lastname: userInfo.lastName
        });
      }
      else{
        return res.redirect('/views/sessions/login');
      }
    }
    catch(e){
      console.log(e);
      throw e;
    }
  });

viewsRouter.get("/viewCart", async (req,res)=>{
  try{
    const email=req.session.email;
    if(email){ 
      const user=await UserMongoose.findOne({email:email});
      return res.redirect(`/views/carts/${user.cart}`);
    }
    else{
      return res.redirect('/views/sessions/login');
    }
  }
  catch(e){
    console.log(e);
    throw e;
  }
})