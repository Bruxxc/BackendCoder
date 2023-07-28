import express from "express";
import { UsersController } from "../controllers/users.controller.js";
export const usersRouter = express.Router();

const UController= new UsersController;
usersRouter.get("/", async (req, res) => {
 UController.getAll(req,res);
});

usersRouter.get("/:uid", async (req, res) => {
 UController.getById(req,res);
});


usersRouter.delete("/:uid", async (req,res)=>{
 UController.delete(req,res);
});

usersRouter.post("/", async (req, res) => {
  UController.create(req,res)
});

usersRouter.put("/:uid", async (req, res) => {
  UController.update(req,res);
});

