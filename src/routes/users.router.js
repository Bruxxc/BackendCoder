import express from "express";
import { UserModel } from "../dao/models/Mongoose/users.mongoose.js";

export const usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
  try {
    const users = await UserModel.find({});
    return res.status(200).json({
      status: "success",
      msg: "users list",
      data: users,
    });
  } catch (e) {
    return res.status(500).json({
      status: "error",
      msg: e,
      data: {},
    });
  }
});

usersRouter.get("/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const user = await UserModel.find({"_id":uid});
    if (user[0]) {
      return res.status(200).json({
        status: "success",
        msg: "user found",
        data: user,
      });
    }
    else{
        return res.status(201).json({
          status: "error",
          msg: "user not found",
          data:{}
        });
     }
  } catch (e) {
    return res.status(500).json({
      status: "Error",
      msg: e,
      data:{}
    });
  }
});


usersRouter.delete("/:uid", async (req,res)=>{
    const id=req.params.uid;
  
    try{
      const user = await UserModel.find({"_id":id});
      console.log(user);
      if(user[0]){
        const userDeleted = await UserModel.deleteOne(
          { _id: id },
        );
        return res.status(201).json({
          status: "success",
          msg: "user deleted",
          data: user,
          info:userDeleted
        });
      }
  
      else{
        return res.status(200).json({
          status: "error",
          msg: "user not found",
        });
  
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        data: {},
      });
    }
  
  
  });

usersRouter.post("/", async (req, res) => {
  try {
    const {firstName, lastName, userName, email, password} = req.body;
    const userCreated = await UserModel.create({firstName, lastName, userName, email, password});
    return res.status(201).json({
      status: "succes",
      msg: "user created.",
      data: { userCreated },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error.",
      msg: "something went wrong :(",
      data: {},
    });
  }
});

usersRouter.put("/:uid", async (req, res) => {
  try {
    const id = req.params.uid;
    const {firstName, lastName, userName, email, password} = req.body;
    const userUpdated = await UserModel.updateOne(
        { _id: id },
        {firstName, lastName, userName, email, password}
      );

    return res.status(201).json({
      status: "success",
      msg: "user updated",
      data: {userUpdated},
    });
  } catch (e) {
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
});

