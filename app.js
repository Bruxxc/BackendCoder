const ProductManager = require("./Product_Manager")
const { urlencoded } = require("body-parser");
const fs = require("fs");
const express = require('express');
const app = express();
app.use(urlencoded({extended:true}));

const port = 3000;

let Manager= new ProductManager("data.json");

app.get("/products",(req,res)=>{
    let limit= req.query.limit;
    if (limit){
        return res.status(200).json({status:"Success",msg:"products found",products:Manager.getProducts().slice(0,limit),limit});
    }

    else{
        return res.status(200).json({status:"Success",msg:"products found",products:Manager.getProducts(),limit});
    }
});

app.get("/products/:id",(req,res)=>{
    let id=req.params.id;
    let products=Manager.getProducts();
    let result=products.find((prod)=>prod.id==id);
    if(!result){
        return res.status(400).json({status:"Error",msg:"product not found"});
    }
    else{
        return res.status(200).json({status:"Success",msg:"product found",product:result});
    }
    

});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });