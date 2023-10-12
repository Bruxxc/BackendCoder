import express from "express";
import passport from "passport";
import nodemailer from "nodemailer";
import { randomBytes } from 'crypto';
import { createHash } from "../utils/bcrypt.js";
import { RecoverCodesMongoose } from "../dao/models/Mongoose/recover-codes.mongoose.js";
import { UserMongoose } from "../dao/models/Mongoose/users.mongoose.js";
import { isValidPassword } from "../utils/bcrypt.js";
import env from "../config/enviroment.config.js";
export const loginRouter = express.Router();


const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user:"elbrunoconde@gmail.com",
    pass: "iitwopvmoymhldek",
  },
});

///PROCESO DE LOGIN
loginRouter.post("/",passport.authenticate('login',{failureRedirect:"/views/sessions/login?error=true"}),async (req,res)=>{
  
 
  if(!req.user) {
    return res.status(400).send({status:"error", error:"Invalid credentials"});
  }

  else{
    req.logger.info(`USER:   ${req.user}`);
    req.session.email= req.user.email;
    req.session.user = req.user.userName;
    req.session.role = req.user.role;
    req.session.cart= req.user.cart;
    res.redirect("/views/products");
  }
})

///PÁGINA DE LOGIN
loginRouter.get("/", async (req,res)=>{
    const username = req.session.user ;

    if(username){
      req.logger.info("redirecting");
      return res.redirect("/views/products");
    }
    else{
      let error=false;
      if(req.query.error){
        error=true;
      }
      const style="login.css";
      return res.status(200).render('login',{style,error});
    }

});

///RECUPERAR CONTRASEÑA
loginRouter.get("/retrievePassword", async (req,res)=>{
  const username = req.session.user ;

    if(username){
      req.logger.info("redirecting");
      return res.redirect("/views/products");
    }
  
    const style="retrievePassword.css";
      return res.status(200).render('retrievePass',{style});
});


loginRouter.post("/retrievePassword", async (req,res)=>{
  const email=req.body.email;
  const token=randomBytes(20).toString('hex');
  const expire= Date.now() + 3600000;
  try{
    const recoverCode= await RecoverCodesMongoose.create({email,token,expire});
    console.log(token,email);
    const result = await transport.sendMail({
      from: "elbrunoconde@gmail.com",
      to: email,
      subject: "RECUPERAR CONTRASEÑA",
      html: `
          <div>
            <p>Tu código para cambiar la contraseña es: ${token}</p>
            <a href="${env.api_url}/views/sessions/login/changePassword?token=${token}&email=${email}">CAMBIAR CONTRASEÑA</a>
          </div>
        `,
      attachments: [
      
      ],
    });
    res.render('checkEmail');
  }
  catch(e){
    console.log(e);
    res.send("ERROR");
  }

 
 
});

loginRouter.get("/changePassword", async (req,res)=>{
  const { token, email } = req.query;
  const foundToken= await RecoverCodesMongoose.findOne({email, token});
  if(foundToken && (foundToken.expire > Date.now())){
    const style= "changePassword.css";
    res.render('changePassword',{style,email,token})
  }

  else{
    res.send("El código para recuperar la contraseña expiró o es inválido");
  }
  
});

//LUEGO IMPLEMENTAR CAPAS
loginRouter.post("/changePassword", async (req,res)=>{
  let newPassword=req.body.new_Password
  let token= req.body.token;
  let email= req.body.email;
  console.log(req.body);
  try{
    let hashedPassword=createHash(newPassword);

    const validCode= await RecoverCodesMongoose.findOne({email,token});
    console.log(validCode);
    if(validCode){

      const user= await UserMongoose.findOne({email});
      const lastPassword=user.password;
      console.log(isValidPassword(newPassword,lastPassword));
      if(isValidPassword(newPassword,lastPassword)){
        res.status(200).json({
          redir:false,
          msg:"NO PUEDE UTILIZAR SU ULTIMA CONTRASEÑA"}
        );
      }

      else{
        const changePassword= await UserMongoose.updateOne({email:email},{password:hashedPassword});
        res.status(200).json({
          redir:true,
          msg:"CONTRASEÑA MODIFICADA CON ÉXITO"}
        );
      }
    }

    else{
      res.status(200).json({
        redir:false,
        msg:"CÓDIGO O MAIL INVÁLIDOS"}
      );
    }

  }catch(e){
    console.log(e);
  }
});
