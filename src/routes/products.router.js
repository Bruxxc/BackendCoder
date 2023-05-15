import express from "express";
import { ProductManager } from "../ProductManager.js";


let Manager=new ProductManager("./data/products.json");
export const productsRouter = express.Router();



productsRouter.get("/",(req,res)=>{
    let limit= req.query.limit;
    if (limit){
        return res.status(200).json({status:"Success",msg:"products found",products:Manager.getProducts().slice(0,limit),limit});
    }

    else{
        return res.status(200).json({status:"Success",msg:"products found",products:Manager.getProducts()});
    }
});

productsRouter.get("/:pid",(req,res)=>{
    let id=req.params.pid;
    let result=Manager.getProductById(id);
    if(!result){
        return res.status(400).json({status:"Error",msg:"product not found"});
    }
    else{
        return res.status(200).json({status:"Success",msg:"product found",product:result});
    }
    
 
});

productsRouter.post("/",(req,res)=>{
    let producto= req.body;
    const exito=Manager.addProduct(producto);

    if(exito==1){

        return res
        .status(201)
        .json({ status: "success", msg: "producto creado", data: producto });
        
    }
  
    else if (exito==0){
        return res
        .status(200)
        .json({ status: "error", msg: "producto NO creado",error:"Todos los campos menos tumbnail son obligatorios ", data: producto });

    }

    else if (exito==2){
        return res
        .status(200)
        .json({ status: "error", msg: "producto NO creado",error:"Código de producto repetido", data: producto });

    }

});

productsRouter.delete("/:pid",(req,res)=>{
    const id=req.params.pid;
    const exito=Manager.deleteProduct(id);

    if (exito==1){
        return res
        .status(200)
        .json({ status: "success", msg: "producto eliminado" });

    }

    else if (exito==0){
        return res
        .status(200)
        .json({ status: "error", msg: "producto NO eliminado",error:"el producto no fue encontrado" });
        
    }

});


productsRouter.put("/:pid", (req, res) => {
    const edit = req.body;
    const id=req.params.pid;
    const exito=Manager.updateProduct(id,edit);

    if(exito==1){
        return res
        .status(201)
        .json({ status: "success", msg: "producto modificado"});

    }

    else if(exito==0){
        return res
        .status(200)
        .json({ status: "error", msg: "producto NO modificado", error:"el producto no fue encontrado" });
    }

});