import { urlencoded } from "express";
import express from "express";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { usersRouter } from "./routes/users.router.js";
import { chatRouter } from "./routes/chat.router.js";
import handlebars from "express-handlebars";
import { __dirname, connectMongo, connectSocket  } from "./utils.js";
import { home } from "./routes/home.router.js";
import { realtimeproducts } from "./routes/realTimeProducts.router.js";


const app = express();
const port = 8080;
app.use(urlencoded({extended:true}));
app.use(express.json());


//HTTP SERVER
const httpServer=app.listen(port, () => {
  console.log(`Example app listening http://localhost:${port}`);
});
connectSocket(httpServer);
connectMongo();


//STATIC
app.use('/static', express.static('public'));

//CONFIG DEL MOTOR DE PLANTILLAS
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");


//TODOS MIS ENDPOINTS
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);

//TEST PLANTILLAS

app.use("/views",home);
app.use("/views",realtimeproducts);
app.use("/views",chatRouter);

//OTROS ENDPOINTS
app.get("*", (req, res) => {
  return res
    .status(404)
    .json({ status: "error", msg: "no se encuentra esa ruta", data: {} });
});


