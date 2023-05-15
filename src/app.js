import { urlencoded } from "express";
import express from "express";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";

const app = express();
const port = 8080;
app.use(urlencoded({extended:true}));
app.use(express.static("public"));
app.use(express.json());


//TODOS MIS ENDPOINTS
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//OTROS ENDPOINTS
app.get("*", (req, res) => {
  return res
    .status(404)
    .json({ status: "error", msg: "no se encuentra esa ruta", data: {} });
});



app.listen(port, () => {
    console.log(`Example app listening http://localhost:${port}`);
  });