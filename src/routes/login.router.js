import express from "express";
import { UserModel } from "../dao/models/users.model.js";
export const loginRouter = express.Router();


loginRouter.post("/", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email: email, password: password });
  
  console.log("Try to log in");
  console.log(email, password);
  console.log(user);
  
  if (user) {
    req.session.user = user.userName;
    req.session.role = user.role;
    console.log(user.userName, user.role);
    res.redirect("/views/products");
  } else {
    const error=true;
    const style="login.css";
    return res.status(200).render('login',{style,error});
  }
});


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


  