import fs from "fs";

export class CartManager{
    constructor(path){
        this.path=path;
    }

    getCarts(){
        let data= fs.readFileSync(this.path,"utf-8");
        if(data){
           data=JSON.parse(data); 
        }
        return data;
    }

    getCartById(id){
        const carts=this.getCarts();
        let cart=undefined;
        if(carts.length>0){
            cart=carts.find(c => c.id==id);
        }
        
        if(!cart){
            console.log("ERROR: Cart not found");    
            return undefined;
        }

        else{
            return cart;
        }

    }

    saveData(cart){
        fs.writeFileSync(this.path,JSON.stringify(cart),"utf-8");
    }

    newCart(){
        let carts=this.getCarts();
        let id;
        if(carts.length>0){
            id=carts[carts.length-1].id + 1;
        }
        else{
            id=1;
        }
        const newCart ={
            id,
            products:[]

        }
        carts=[...carts, newCart];
        this.saveData(carts);
        return id;
    }


    addProduct(cid,pid){
        let carts=this.getCarts();
        let cart=this.getCartById(cid);
        if(cart){
            let exists=cart.products.some((prod)=>prod.product==pid);
            
            if(exists){
                let nid=carts[cid-1].products.findIndex((prod)=>prod.product==pid);
                carts[cid-1].products[nid].quantity++;
            }
            

            else{

                let newProduct={
                    product:pid,
                    quantity:1
                }
    
                carts[cid-1].products.push(newProduct);
    
            }

            this.saveData(carts);
            return 1;
        }

        else{
            return 0;
        }


    }
    
    productQuantity(cid,pid){
        const cart=this.getCartById(cid);

        if(cart){
            let exist = cart.products.find((prod)=>prod.product==pid);
            
            if(exist){
                return exist.quantity;
            }

            else{
                return 0;
            }
        }

        else{
          return undefined;
        }


    }

}