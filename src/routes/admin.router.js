import express from "express";
import { UserMongoose } from "../dao/models/Mongoose/users.mongoose.js";
export const adminRouter = express.Router();

////PÁGINAS DE ADMINISTRACIÓN DEL ADMIN

adminRouter.get('/manage', async (req,res)=>{
    if(req.session.role=="admin"){
        const username=req.session.user;
        const style="admin.css";
        return res.render('admin',{style:style,username:username});
    }
    else{
        return res.redirect("/views/products");
    }
});

adminRouter.get('/manage/users', async (req,res)=>{
    if(req.session.role=="admin"){
    const users = await UserMongoose.find({ role: { $ne: 'admin' } }).lean();
    const username=req.session.user;
    const style="manageUsers.css";
    return res.render('manageUsers',{style:style,users:users,username:username});}
    else{
        return res.redirect("/views/products");
    }
});