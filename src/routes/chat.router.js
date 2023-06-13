import express from "express";
export const chatRouter = express.Router();

chatRouter.get("/chat", (req, res) => {
  const style="chat.css";
  return res.render("chat", {style});
});