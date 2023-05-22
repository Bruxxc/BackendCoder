import { urlencoded } from "express";
import express from "express";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import { home } from "./routes/home.router.js";
import { realtimeproducts } from "./routes/realTimeProducts.router.js";
import { ProductManager } from "./ProductManager.js";

const app = express();
const port = 8080;
app.use(urlencoded({extended:true}));
app.use(express.json());

const PManager=new ProductManager("data/products.json");

//STATIC
app.use('/static', express.static('public'));


//CONFIG DEL MOTOR DE PLANTILLAS
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//TEST PLANTILLAS

app.use("/api/views",home);
app.use("/api/views",realtimeproducts);
//HTTP SERVER
const httpServer=app.listen(port, () => {
  console.log(`Example app listening http://localhost:${port}`);
});

//SOCKET SERVER
const socketServer= new Server(httpServer);

socketServer.on("connection",(socket)=>{
  socket.on("set_products",()=>{
    const products=PManager.getProducts();
    socket.emit("set_products_res",{products:products});
  });
  socket.on("delete_product",(msg)=>{
    console.log('recibido',msg);
    const res=PManager.deleteProduct(msg.id);
    socket.emit("delete_res",{res:res});
  });
  socket.on("add_product",(prod)=>{
    console.log('recibido',prod);
    const res=PManager.addProduct(prod);
    console.log(res);
    socket.emit("add_res",{res:res});
  });
});



//TODOS MIS ENDPOINTS
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//OTROS ENDPOINTS
app.get("*", (req, res) => {
  return res
    .status(404)
    .json({ status: "error", msg: "no se encuentra esa ruta", data: {} });
});


