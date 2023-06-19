import express from "express";
import { MDBProductManager } from "../dao/MDBManagers/MDBProductManager.js";

export const productsRouter = express.Router();

const ProductManager= new MDBProductManager();


productsRouter.get("/", async (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;
  let page = req.query.page ? parseInt(req.query.page) : 1;
  let sort = req.query.sort || "";
  let query = req.query.query || "";

  try {
    let filter = {};
    
    const products = await ProductManager.getProducts(filter,limit,page,sort);

    console.log("get products");

    return res.status(200).json({
      status: "success",
      payload:products.docs,
      totalDocs:products.totalDocs,
      limit:products.limit,
      totalPages: products.totalPages,
      page: products.page,
      pagingCounter: products.pagingCounter,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage
    });
  } catch (error) {
    console.error("Error retrieving products:", error);
    return res.status(500).json({
      status: "error",
      msg: "Failed to retrieve products",
      error: error.message,
    });
  }
});

productsRouter.get("/:pid", async (req, res) => {
    let id=req.params.pid;
    try {
      const product = await ProductManager.getProductById(id);
        return res.status(200).json({
          status: "success",
          msg: "product found",
          data: product,
        });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: "error",
        msg: e.message,
        data: {},
      });
    }
  });



productsRouter.post("/", async (req, res) => {
    const { title, description, price, code, stock, category, thumbnail } = req.body;
    try {
      const productCreated = await ProductManager.createProduct(title, description, price, code, stock ,category, thumbnail);
      return res.status(201).json({
        status: "success",
        msg: "product created",
        data: productCreated,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: "error",
        msg: e.message,
        data: {},
      });
    }
  });


productsRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, price, stock, category, thumbnail, status } = req.body;


    try {
      const productUpdated = ProductManager.editProduct(id,title,description,price,stock,category,thumbnail,status);
      return res.status(201).json({
        status: "success",
        msg: "product updated",
        data: productUpdated,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: "error",
        msg: e.message,
        data: {},
      });
    }
  });

productsRouter.delete("/:pid", async (req,res)=>{
  const id=req.params.pid;

  try{
    const productDeleted = await ProductManager.deleteProduct(id);
    return res.status(201).json({
      status: "success",
      msg: "product deleted",
      info:productDeleted
    });
    
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: e.message,
      data: {},
    });
  }


});
