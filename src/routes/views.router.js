import express from "express";
import { UserMongoose } from "../dao/models/Mongoose/users.mongoose.js";
export const viewsRouter = express.Router();
 
  //// PERFIL DE USUARIO
  viewsRouter.get("/profile", async (req,res)=>{
    try{
      const email=req.session.email;
      if(email){
        const userInfo=await UserMongoose.findOne({email:email});
        let documents=userInfo.documents;
        ///CHECKEAR LOS DOCUMENTOS SUBIDOS
        const hasIdentification = documents.some((doc) => doc.name === "Identification");
        const hasAddress = documents.some((doc) => doc.name === "Address");
        const hasAccountStatus = documents.some((doc) => doc.name === "Account Status");
        const style="userProfile.css";
        const isAdmin= userInfo.role=="admin";
        const isUser=!isAdmin;
        return res.status(200).render('userProfile',{
          style: style,
          uid:userInfo._id,
          username: userInfo.userName,
          email: email,
          role: userInfo.role,
          firstname: userInfo.firstName,
          lastname: userInfo.lastName,
          hasIdentification:hasIdentification,
          hasAddress:hasAddress,
          hasAccountStatus:hasAccountStatus,
          isAdmin:isAdmin,
          isUser:isUser
          
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

//// MOSTRAR CARRITO
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
});

viewsRouter.get("/payment/intent", async (req,res)=>{
  const style="payment.css";
  return res.status(200).render('payment',{style});
});

