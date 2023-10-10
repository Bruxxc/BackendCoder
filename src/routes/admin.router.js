import express from "express";
import { UserMongoose } from "../dao/models/Mongoose/users.mongoose.js";
export const adminRouter = express.Router();

adminRouter.get('/manage', async (req,res)=>{
    if(req.session.role=="admin"){
        const style="admin.css";
        return res.render('admin',{style:style});
    }
    else{
        return res.redirect("/views/products");
    }
});

adminRouter.get('/manage/users', async (req,res)=>{
    if(req.session.role=="admin"){
    const users = await UserMongoose.find({ role: { $ne: 'admin' } }).lean();
    const style="manageUsers.css";
    return res.render('manageUsers',{style:style,users:users});}
    else{
        return res.redirect("/views/products");
    }
});