import express from "express";
export const chatRouter = express.Router();

chatRouter.get("/", (req, res) => {
  const style="chat.css";
  return res.render("chat", {style});
});