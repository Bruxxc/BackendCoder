import express from "express";
export const chatRouter = express.Router();

chatRouter.get("/", (req, res) => {
  const username = req.session.user ;
  const role = req.session.role;
  const logged= username? true:false;
  const style="chat.css";
  return res.render("chat", {style,username,role,logged});
});