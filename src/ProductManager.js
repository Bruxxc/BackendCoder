import fs from "fs";

export class ProductManager{

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
            product=products.find(p => p.id==id);
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
        if (!product.title || !product.description || !product.price || !product.code || !product.stock|| !product.category){
            console.log("Todos los campos son obligatorios");
            return 0;
        }

        else{


            if(( products.length>0) && (products.some((prod)=>prod.code===product.code))){
                return 2;
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
                    status:true,
                    ...product

                }
                products=[...products, newProduct];
                this.saveData(products);
                return 1;
            }
        
        }
        
    }

    updateProduct(id,edit){
        let products=this.getProducts();
        if (products){
            let target=this.getProductById(id);
            if (target){
                let index=products.findIndex((prod)=>prod.id==id);
                let edited={
                    id:target.id,
                    status:edit.status ? edit.status : target.status,
                    title:edit.title ? edit.title : target.title,
                    description:edit.description ? edit.description : target.description,
                    price: edit.price ? edit.price : target.price,
                    thumbnail: edit.thumbnail ? edit.thumbnail : target.thumbnail,
                    code: target.code,
                    stock: edit.stock ? edit.stock : target.stock,
                }
                products[index]=edited;
                this.saveData(products);
                return 1;
            }

            else{
                console.log("ERROR: Product not found");
                return 0;
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
                return 1;
            }

            else{
                console.log("ERROR: Product not found");
                return 0;
            }

        }

        else{
            console.log("ERROR: Product not found");
            return 0;
        }
    }


}
