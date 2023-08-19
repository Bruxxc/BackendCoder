import express from "express";
import passport from "passport";
export const loginRouter = express.Router();


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


  