import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
import multer from "multer";
import { connect } from "mongoose";
import { ProductModel } from "./dao/models/Mongoose/products.mongoose.js";
import { UserModel } from "./dao/models/Mongoose/users.mongoose.js";
import { MsgModel } from "./dao/models/Mongoose/messages.mongoose.js";
import { createHash } from "../src/utils/bcrypt.js";
import env from "./config/enviroment.config.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/public");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });

export function connectSocket(httpServer){
  const socketServer= new Server(httpServer);
  socketServer.on("connection",(socket)=>{

    socket.on("create_user", async (user)=>{
      user=user.newUser;
      console.log(user);
      try{
        const usedEmail= await UserModel.find({email:user.email});
        const usedUserName= await UserModel.find({userName:user.userName});
        console.log(usedEmail);
        
        if(usedEmail[0]){
          const error={
            message:"email in use"
          }
          throw error;
        }
        
        else if(usedUserName[0]){
          const error={
            message:"username in use"
          }
          throw error;
        }

        else{
          let encrypted=createHash(user.password);
          const createUser= await UserModel.create({ firstName:user.firstName, lastName:user.lastName,  userName:user.userName, email:user.email, password:encrypted});
          socket.emit("userCreated",createUser);
        }
        
      }
      catch(e){
        console.log(e.message);
        socket.emit("errorCreatingUser",{error:e.message});
      }

    });


  ///GET CARTID
    socket.on("get_cart_ID",async ()=>{
      try{
        
      }
      catch(e){
        throw e;
      }
    })





  /// CHAT START

    socket.on("set_chat",async ()=>{
      const msgs= await MsgModel.find({});
      socket.emit("set_chat_res",{msgs:msgs});
    });

    socket.on("msg_front_to_back", async (msg)=>{
      const createmsg= await MsgModel.create({"text":msg.text, "userName":msg.userName});
      const msgs= await MsgModel.find({});
      socket.emit("set_chat_res",{msgs:msgs});
    });

/// CHAT END    

///RTP START

    socket.on("set_products",async ()=>{
      const products=await ProductModel.find({});
      socket.emit("set_products_res",{products:products});
    });

    socket.on("delete_product", async (msg)=>{
      console.log('recibido',msg.id);
      const toDelete= await ProductModel.find({"_id":msg.id});
      console.log(toDelete);
      if(toDelete[0]){

        try{
          const productDeleted= await ProductModel.deleteOne({"_id":msg.id});
          socket.emit("delete_res",{res:1});
        } catch(e){
          console.log(e);
        }
        

      }
      
      else{

        socket.emit("delete_res",{res:0});
      }
      
    });

    socket.on("add_product", async (prod)=>{
      console.log('recibido',prod);
      if(!prod.title || !prod.description || !prod.price || !prod.code || !prod.category || !prod.stock){
        console.log("empty fields");
        socket.emit("add_error",{res:1});
      }
      else{
        try{
          const productCreated = await ProductModel.create({ title:prod.title , description:prod.description, price:prod.price, code:prod.code, thumbnail:prod.thumbnail, category:prod.category, stock:prod.stock,  status:true});
          console.log(productCreated);
          socket.emit("add_res",{res:productCreated});
        }
        catch(e){
          console.log(e);
        }
      }

      
    });

///RTP END
  });
  
  
}


export async function connectMongo() {
  try {
    await connect(
      env.mongoUrl,
      {dbName:"ecommerce"}
    );
    console.log("plug to mongo!");
  } catch (e) {
    console.log(e);
    throw "can not connect to the db";
  }
}