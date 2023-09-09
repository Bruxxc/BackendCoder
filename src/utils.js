import { faker } from "@faker-js/faker";
import mongoose, { connect } from 'mongoose';
import multer from "multer";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import env from "./config/enviroment.config.js";
import { MDBCartManager } from "./dao/helpers/MDBManagers/MDBCartManager.js";
import { MDBProductManager } from "./dao/helpers/MDBManagers/MDBProductManager.js";
import { ProductMongoose } from "./dao/models/Mongoose/products.mongoose.js";
import { MsgService } from "./services/Msg.service.js";
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);



/////////GENERAR EDAD RANDOM
function randomNum(a,b) {
  const min = a;
  const max = b;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

////////GENERAR CODIGO RANDOM

export function genRandomCode() {
  const longitudCodigo = 16; 
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  for (let i = 0; i < longitudCodigo; i++) {
    const indice = Math.floor(Math.random() * caracteres.length);
    code += caracteres.charAt(indice);
  }

  return code;
};

/////////GENERAR MOCKING DE USUARIO

export const generateUser=()=>{
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const age = randomNum(18,80);
  const userName = faker.internet.userName();
  const email = faker.internet.email();
  const password = faker.internet.password();

  const createdUser = {
    firstName,
    lastName,
    age,
    userName,
    email,
    password
};

return createdUser;}

///////////////////GENERAR MOCKING DE PRODUCTO

export const generateProduct=()=>{
  const title = faker.commerce.productName();
  const description= faker.commerce.productDescription();
  const price = faker.commerce.price();
  const code=genRandomCode();
  const stock = randomNum(1,1000);
  const category= faker.commerce.department();
  const thumbnail= faker.image.urlLoremFlickr({ category: 'food' });



  const createdProduct = {
    title: title,
    description: description,
    price:price,
    code:code,
    stock:stock,
    category:category,
    thumbnail:thumbnail
  };

  return createdProduct;}


const MService= new MsgService;
const PManager= new MDBProductManager;
const CManager= new MDBCartManager;

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

    ///AGREGAR CAPAS
    socket.on("delete_product", async (msg)=>{
      console.log('recibido',msg);
      let res;
      if(mongoose.isValidObjectId(msg.id)){
        const product = await ProductMongoose.findOne({"_id":msg.id});
        console.log(product);
        if(product){
          if((product.owner==msg.owner) || (msg.owner==env.adminEmail)){
            console.log(`OWNER DEL PRODUCTO--->${product.owner}`);
            console.log(`OWNER REQUEST--->${msg.owner}`);
            const deleteProduct= await ProductMongoose.deleteOne({"_id":msg.id});
            res=1;
            socket.emit("delete_res",{res:res});
          }
          else{
            res=2;
            socket.emit("delete_res",{res:res});
          }
        }

        else{
          res=0;
          socket.emit("delete_res",{res:res});
        }

      }

      else{
        console.log("id invalida");
        res=3;
        socket.emit("delete_res",{res:res})
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
          ////AGREGAR CAPAS
          console.log("INTENTO DE CREAR PRODUCTO");
          const productCreated = await ProductMongoose.create({title:prod.title,description:prod.description, price:prod.price, code:prod.code, stock:prod.stock, category:prod.category,thumbnail:prod.thumbnail,owner:prod.owner,status:true});
          console.log(productCreated);
          socket.emit("add_res",{res:productCreated});
        }
        catch(e){
          console.log(e);
        }
      }

      
    });

  ///OWNER PRODUCTS

  socket.on("set_owner_products",async (owner)=>{
    console.log("owner:-->",owner);
    let products;
    if(owner.owner==env.adminEmail){
      console.log("ADMIN");
      products=await ProductMongoose.find({});
    }

    else{
      console.log("PREMIUM USER");
      products=await ProductMongoose.find({'owner':owner.owner});
    }

    socket.emit("set_owner_products_res",{products:products});
  });
///RTP END

/////IPQ

socket.on("increaseProductQuantity", async ({ cid, pid }) => {
  try {
    const editCart = await CManager.increaseProductQuantity(cid, pid);
    socket.emit("cartUpdated",{msg:"SUCCESS",newTotal:editCart.total});
  } catch (error) {
    socket.emit("cartUpdated",{msg:"ERROR"} );
    console.log("Error:", error);
    // Manejar el error, si es necesario
  }
});


/////DPQ


socket.on("decreaseProductQuantity", async ({ cid, pid }) => {
  try {
    const editCart = await CManager.decreaseProductQuantity(cid, pid);
    socket.emit("cartUpdated",{msg:"SUCCESS",newTotal:editCart.total});
  } catch (error) {
    socket.emit("cartUpdated",{msg:"ERROR"} );
    console.log("Error:", error);
    // Manejar el error, si es necesario
  }
});

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

