import { urlencoded } from "express";
import express from "express";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { usersRouter } from "./routes/users.router.js";
import { chatRouter } from "./routes/chat.router.js";
import { catalogueRouter } from "./routes/catalogue.router.js";
import {registerRouter} from "./routes/register.router.js";
import {loginRouter} from "./routes/login.router.js";
import { logoutRouter } from "./routes/logout.router.js";
import { viewCart } from "./routes/viewcart.route.js";
import handlebars from "express-handlebars";
import { __dirname, connectMongo, connectSocket  } from "./utils.js";
import { home } from "./routes/home.router.js";
import { realtimeproducts } from "./routes/realTimeProducts.router.js";
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import cookieParser from 'cookie-parser';


const app = express();
const port = 8080;
const fileStore = FileStore(session);


app.use(urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(
	session({
		secret: "jhasdkjh671246JHDAhjd",
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({
			mongoUrl:
				"mongodb+srv://bru_conde:xTuT2f8xzqLPDNNP@backendcoder.kqvwier.mongodb.net/?retryWrites=true&w=majority",
			dbName: 'sessions',
			mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
			ttl: 15,
		}),
	})
);

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

//PLANTILLAS
app.use("/views/home",home);
app.use("/views/realtimeproducts",realtimeproducts);
app.use("/views/chat",chatRouter);
app.use("/views/products",catalogueRouter);
app.use("/views/carts",viewCart);

//LOGIN PLANTILLAS
app.use("/views/sessions/login", loginRouter);
app.use("/views/sessions/logout", logoutRouter);
app.use("/views/sessions/register", registerRouter);

//OTROS ENDPOINTS
app.get("*", (req, res) => {
  return res
    .status(404)
    .json({ status: "error", msg: "no se encuentra esa ruta", data: {} });
});




