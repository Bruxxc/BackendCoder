import express from "express";
import passport from "passport";
export const registerRouter = express.Router();

///PROCESO DE REGISTRO
registerRouter.post("/", async (req, res, next) => {
  passport.authenticate('register', (err, user, info) => {
    if (err) {
      return res.status(500).send({ status: "error", error: "Internal server error" });
    }
    else if (!user) {
      return res.status(400).send({ status: "error", error: info.message });
    }
    else{
      const userCreated = user;
      return res.status(201).send({ status: "success", userCreated: userCreated });
    }

  })(req, res, next);
});

///PÁGINA DE REGISTR
registerRouter.get("/", async (req,res)=>{
    const username = req.session.user ;
    if(username){
      req.logger.info("redirecting");
      return res.redirect("/views/products");
    }
    else{
      const style="register.css";
      return res.status(200).render('register',{style});
    }

});
