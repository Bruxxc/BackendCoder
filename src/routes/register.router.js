import express from "express";
export const registerRouter = express.Router();

registerRouter.get("/", async (req,res)=>{
    const username = req.session.user ;
    if(username){
      console.log("redirecting");
      return res.redirect("/views/products");
    }
    else{
      const style="register.css";
      return res.status(200).render('register',{style});
    }

  });

  