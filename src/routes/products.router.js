import express from "express";
import { ProductModel } from "../dao/models/products.model.js";

export const productsRouter = express.Router();


productsRouter.get("/", async (req, res) => {
  try {
    const products = await ProductModel.find({});
    console.log("get products");
    return res.status(200).json({
      status: "success",
      msg: "product list",
      data: products,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }
});

productsRouter.get("/:pid", async (req, res) => {
    let id=req.params.pid;
    try {
      const product = await ProductModel.find({"_id":id});
      console.log(`get product ${id}`);
      if(product[0]){
        return res.status(200).json({
          status: "success",
          msg: "product found",
          data: product,
        });
      }
      else{
        return res.status(201).json({
          status: "error",
          msg: "product not found",
          data: product,
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        data: {},
      });
    }
  });



productsRouter.post("/", async (req, res) => {
    const { title, description, price, code, stock, category, thumbnail } = req.body;
    try {
        if (!title || !description || !price || !code || !stock|| !category){
        console.log(
          "validation error: please complete all required fields."
        );
        return res.status(400).json({
          status: "error",
          msg: "validation error: please complete all required fields.",
          data: {},
        });
      }
      const status=true;
      const productCreated = await ProductModel.create({ title, description, price, code, stock ,category, thumbnail,status });
      return res.status(201).json({
        status: "success",
        msg: "product created",
        data: productCreated,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        data: {},
      });
    }
  });


productsRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, price, stock, category, thumbnail } = req.body;


    try {
      if (!title && !description && !price && !stock && !category && !thumbnail ) {
        console.log(
          "validation error: all fields are empty."
        );
        return res.status(400).json({
          status: "error",
          msg: "all fields are empty.",
          data: {},
        });
      }

      const productUptaded = await ProductModel.updateOne(
        { _id: id },
        { title, description, price, stock, category, thumbnail  }
      );
      return res.status(201).json({
        status: "success",
        msg: "product uptaded",
        data: productUptaded,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        data: {},
      });
    }
  });

productsRouter.delete("/:pid", async (req,res)=>{
  const id=req.params.pid;

  try{
    const product = await ProductModel.find({"_id":id});
    console.log(product);
    if(product[0]){
      const productDeleted = await ProductModel.deleteOne(
        { _id: id },
      );
      return res.status(201).json({
        status: "success",
        msg: "product deleted",
        data: product,
        info:productDeleted
      });
    }

    else{
      return res.status(200).json({
        status: "error",
        msg: "product not found",
      });

    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      data: {},
    });
  }


});

////CODIGO VIEJO

// import { ProductManager } from "../ProductManager.js";

// let Manager=new ProductManager("./data/products.json");

// productsRouter.delete("/:pid",(req,res)=>{
//   const id=req.params.pid;
//   const exito=Manager.deleteProduct(id);

//   if (exito==1){
//       return res
//       .status(200)
//       .json({ status: "success", msg: "producto eliminado" });

//   }

//   else if (exito==0){
//       return res
//       .status(200)
//       .json({ status: "error", msg: "producto NO eliminado",error:"el producto no fue encontrado" });

//   }

// });



// productsRouter.get("/",(req,res)=>{
//     let limit= req.query.limit;
//     if (limit){
//         return res.status(200).json({status:"Success",msg:"products found",products:Manager.getProducts().slice(0,limit),limit});
//     }

//     else{
//         return res.status(200).json({status:"Success",msg:"products found",products:Manager.getProducts()});
//     }
// });

// productsRouter.get("/:pid",(req,res)=>{
//     let id=req.params.pid;
//     let result=Manager.getProductById(id);
//     if(!result){
//         return res.status(400).json({status:"Error",msg:"product not found"});
//     }
//     else{
//         return res.status(200).json({status:"Success",msg:"product found",product:result});
//     }


// });


// productsRouter.post("/",(req,res)=>{
//     let producto= req.body;
//     const exito=Manager.addProduct(producto);

//     if(exito==1){

//         return res
//         .status(201)
//         .json({ status: "success", msg: "producto creado", data: producto });

//     }

//     else if (exito==0){
//         return res
//         .status(200)
//         .json({ status: "error", msg: "producto NO creado",error:"Todos los campos menos tumbnail son obligatorios ", data: producto });

//     }

//     else if (exito==2){
//         return res
//         .status(200)
//         .json({ status: "error", msg: "producto NO creado",error:"Código de producto repetido", data: producto });

//     }

// });

// productsRouter.put("/:pid", (req, res) => {
//     const edit = req.body;
//     const id=req.params.pid;
//     const exito=Manager.updateProduct(id,edit);

//     if(exito==1){
//         return res
//         .status(201)
//         .json({ status: "success", msg: "producto modificado"});

//     }

//     else if(exito==0){
//         return res
//         .status(200)
//         .json({ status: "error", msg: "producto NO modificado", error:"el producto no fue encontrado" });
//     }

// });