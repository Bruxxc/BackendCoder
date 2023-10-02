import MongoStore from "connect-mongo";
import cookieParser from 'cookie-parser';
import cors from "cors";
import express, { urlencoded } from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import nodemailer from "nodemailer";
import passport from "passport";
import FileStore from "session-file-store";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import twilio from "twilio";
import env from './config/enviroment.config.js';
import { iniPassport } from "./config/passport.config.js";
import { cartsRouter } from "./routes/carts.router.js";
import { catalogueRouter } from "./routes/catalogue.router.js";
import { chatRouter } from "./routes/chat.router.js";
import { home } from "./routes/home.router.js";
import { loggerRouter } from "./routes/logger.test.router.js";
import { loginRouter } from "./routes/login.router.js";
import { logoutRouter } from "./routes/logout.router.js";
import { mockingRouter } from "./routes/mocking.router.js";
import { productsRouter } from "./routes/products.router.js";
import { realtimeproducts } from "./routes/realTimeProducts.router.js";
import { registerRouter } from "./routes/register.router.js";
import { sessionsRouter } from "./routes/sessions.router.js";
import { ticketsRouter } from "./routes/tickets.router.js";
import { usersRouter } from "./routes/users.router.js";
import { viewCart } from "./routes/viewCart.router.js";
import { __dirname, connectMongo, connectSocket } from "./utils.js";
import { addLogger } from "./utils/logger.js";
import { viewsRouter } from "./routes/views.router.js";
import { adminRouter } from "./routes/admin.router.js";


console.log(env);
const app = express();
const port = env.port;

//NODEMAILER
const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user:"elbrunoconde@gmail.com",
    pass: "iitwopvmoymhldek",
  },
});

//TWILIO
const client = twilio(
	"ACa7a320230931603b84966fb776ea95e8",
	"b1fed7c2ec7ff37770c901ae7ec6ebee"
)

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
			mongoUrl: env.mongoUrl,
			dbName: 'sessions',
			mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
			ttl: 1800,
		}),
	})
);
iniPassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(addLogger);

//HTTP SERVER
const httpServer=app.listen(port, () => {
  console.log(`Example app listening http://localhost:${port}`);
});



  


connectSocket(httpServer);
connectMongo();

//SWAGGER
const specs = swaggerJSDoc({
	definition: {
	  openapi: "3.0.1",
	  info: {
		title: "Documentacion API de ecommerce",
		description: "Proyecto de ecommerce",
	  },
	},
	apis: [`${__dirname}/docs/**/*.yaml`],
  });
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

//STATIC
app.use('/static', express.static('public'));

//CONFIG DEL MOTOR DE PLANTILLAS
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");


//////TODOS MIS ENDPOINTS

///API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);
app.use("/api/tickets",ticketsRouter);
app.use("/api/mocking",mockingRouter);
app.use("/api/logger",loggerRouter);

//PLANTILLAS
app.use("/views/home",home);
app.use("/views/realtimeproducts",realtimeproducts);
app.use("/views/chat",chatRouter);
app.use("/views/products",catalogueRouter);
app.use("/views/carts",viewCart);
app.use("/views/misc", viewsRouter);
app.use("/views/admin", adminRouter);

//SESSIONS
app.use("/views/sessions/login", loginRouter);
app.use("/views/sessions/logout", logoutRouter);
app.use("/views/sessions/register", registerRouter);
app.get(
	"/views/sessions/github",
	passport.authenticate("github", { scope: ["user:email"] })
);
app.get(
	"/views/sessions/githubcallback",
	passport.authenticate("github", { failureRedirect: "/views/sessions/login" }),
	(req, res) => {
		req.session.email= req.user.email;
		req.session.user = req.user.userName;
		req.session.role = req.user.role;
		req.session.cart= req.user.cart;
		res.redirect("/views/products");
	}
);

///SESSIONS
app.use("/api/sessions",sessionsRouter);

///RUTAS NO CONTEMPLADAS
app.get("*", (req, res) => {
  return res
    .status(404)
    .json({ status: "error", msg: "no se encuentra esa ruta", data: {} });
});


//OTROS ENDPOINTS
// app.get("/mail", async (req, res) => {
// 	const result = await transport.sendMail({
// 	  from: "elbrunoconde@gmail.com",
// 	  to: "elbrunoconde@gmail.com",
// 	  subject: "TEST",
// 	  html: `
// 				<div>
// 					<h1>TEST DE CORREO</h1>
// 				</div>
// 			`,
// 	  attachments: [
		
// 	  ],
// 	})
// });
// app.get("/sms", async (req,res)=>{
// 	const result = await client.messages.create({
// 		body: "PRUEBA DE MENSAJE",
// 		from: "+17792106139",
// 		to:"+598091229510"
// 	});
// 	console.log(result);

// 	res.send("SMS sent");
// });