
const fs = require("fs");

class ProductManager{

    constructor(path){
        this.path=path;
    }

    getProducts(){
        let data= fs.readFileSync(this.path,"utf-8");
        if(data){
           data=JSON.parse(data); 
        }
        return data;
    }

    getProductById(id){
        const products=this.getProducts();
        let product=undefined;

        if(products.length>0){
            product=products.find(p => p.id===id);
        }
        
        
        if(!product){
            console.log("ERROR: Product not found");    
            return undefined;
        }

        else{
            return product;
        }

    }

    saveData(products){
        fs.writeFileSync(this.path,JSON.stringify(products),"utf-8");
    }

    addProduct(product){
        let products=this.getProducts();
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock){
            console.log("Todos los campos son obligatorios")
        }
        else{


            if(( products.length>0) && (products.some((prod)=>prod.code===product.code))){
                console.log("ERROR: code repeat");
            }

            else{
                let id;
                if (products.length>0){
                    id=products[products.length-1].id + 1;}
                else{
                    id=1;
                }
                const newProduct ={
                    id,
                    ...product

                }
                products=[...products, newProduct];
                this.saveData(products);
            }
        
        }
        
    }

    updateProduct(id,title,description,price,thumbnail,code,stock){
        let products=this.getProducts();
        if (products){
            let target=this.getProductById(id);
            if (target){
                let index=products.findIndex((prod)=>prod.id==id);
                let edit={
                    id:target.id,
                    title:title ? title : target.title,
                    description:description ? description : target.description,
                    price: price ? price : target.price,
                    thumbnail: thumbnail ? thumbnail : target.thumbnail,
                    code: code ? code : target.code,
                    stock: stock ? stock : target.stock,
                }
                products[index]=edit;
                this.saveData(products);
            }
        }

    }

    deleteProduct(id){
        let products=this.getProducts();

        if (products){
            let index=products.findIndex((prod)=>prod.id==id);
            if(index!=-1){
                let result=products.filter((prod)=>prod.id!=id);
                this.saveData(result);
            }

            else{
                console.log("ERROR: Product not found");
            }

        }

        else{
            console.log("ERROR: Product not found");
        }
    }


}

module.exports=ProductManager;