import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
import multer from "multer";
import { connect } from "mongoose";
import env from "./config/enviroment.config.js";
import { MsgService } from "./services/Msg.service.js";
import { MDBProductManager } from "./dao/helpers/MDBManagers/MDBProductManager.js";

const MService= new MsgService;
const PManager= new MDBProductManager;

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

  /// CHAT START

    socket.on("set_chat",async ()=>{
      const msgs= await MService.getAll();
      socket.emit("set_chat_res",{msgs:msgs});
    });

    socket.on("msg_front_to_back", async (msg)=>{
      const createmsg= await MService.create(msg.text,msg.userName);
      const msgs= await MService.getAll();
      socket.emit("set_chat_res",{msgs:msgs});
    });

/// CHAT END    

///RTP START

    socket.on("set_products",async ()=>{
      const products=await PManager.getAll();
      socket.emit("set_products_res",{products:products});
    });

    socket.on("delete_product", async (msg)=>{
      console.log('recibido',msg.id);
      const toDelete= await PManager.getProductById(msg.id);
      console.log(toDelete);
      if(toDelete[0]){

        try{
          const productDeleted= await PManager.deleteProduct(msg.id);
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
          const productCreated = await PManager.createProduct(prod.title ,prod.description, prod.price, prod.code, prod.stock, prod.category,prod.thumbnail);
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