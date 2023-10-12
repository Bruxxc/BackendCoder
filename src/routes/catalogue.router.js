import express from "express";
export const catalogueRouter = express.Router();
import { MDBProductManager } from "../dao/helpers/MDBManagers/MDBProductManager.js";
import env from "../config/enviroment.config.js";


const ProductManager= new MDBProductManager();

///PÁGINA DE CATÁLOGO CON TODOS LOS PRODUCTOS
catalogueRouter.get("/", async (req,res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 12;
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let sort = req.query.sort || "";
    let filter = {};
    let products = await ProductManager.getProducts(filter,limit,page,sort);
    const username = req.session.user ;
    const role = req.session.role;
    const cart= req.session.cart;
    const fullName= req.session.fullName;

    const style="catalogue.css";
    return res.status(200).render('catalogue',{
        style:style,
        products:products.docs,
        pagingCounter: products.pagingCounter,
        totalPages: products.totalPages,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        limit:limit,
        sort:sort,
        username: username,
        fullName:fullName,
        role:role,
        cart:cart,
        api_url:env.api_url
    })
  
  });

