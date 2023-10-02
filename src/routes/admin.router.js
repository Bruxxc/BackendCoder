import express from "express";
import { UserMongoose } from "../dao/models/Mongoose/users.mongoose.js";
export const adminRouter = express.Router();

adminRouter.get('/manage', async (req,res)=>{
    const style="admin.css";
    return res.render('admin',{style:style});
});

adminRouter.get('/manage/users', async (req,res)=>{
    const users = await UserMongoose.find({ role: { $ne: 'admin' } }).lean();
    const style="manageUsers.css";
    return res.render('manageUsers',{style:style,users:users});
});