import express from "express";
export const logoutRouter = express.Router();

logoutRouter.get("/", async (req,res)=>{
    console.log("log out");
    req.session.destroy((err) => {
      if (err) {
        console.error("Error Loggin out", err);
      }
      res.redirect("/views/products");
    });
});