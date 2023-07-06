import express from "express";
import { UserModel } from "../dao/models/users.model.js";
import { isValidPassword } from "../utils/bcrypt.js";
import passport from "passport";
export const loginRouter = express.Router();


loginRouter.post("/",passport.authenticate('login',{failureRedirect:"/"}),async (req,res)=>{
  if(!req.user) {
    return res.status(400).send({status:"error", error:"Invalid credentials"})}

  else{
    req.session.user = req.user.userName;
    req.session.role = req.user.role;
    res.redirect("/views/products");
  }
})


// loginRouter.post("/", async (req, res) => {
//   const { email, password } = req.body;
//   const user = await UserModel.findOne({ email: email});
  
//   console.log("Trying to log in");
//   console.log(email, password);
//   console.log(user);
  
//   if (user && isValidPassword(password,user.password)) {
//     req.session.user = user.userName;
//     req.session.role = user.role;
//     console.log(user.userName, user.role);
//     res.redirect("/views/products");
//   } else {
//     const error=true;
//     const style="login.css";
//     return res.status(200).render('login',{style,error});
//   }
// });


loginRouter.get("/", async (req,res)=>{
    const username = req.session.user ;
    console.log(username);

    if(username){
      console.log("redirecting");
      return res.redirect("/views/products");
    }
    else{
      const style="login.css";
      return res.status(200).render('login',{style});
    }

  });


  