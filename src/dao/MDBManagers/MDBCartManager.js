import { CartModel } from "../models/carts.model.js";
import { ProductModel } from "../models/products.model.js";

export class MDBCartManager{

    async getCarts(){
        try{
        const carts = await CartModel.find({});
        console.log("get carts");
        return carts;
        }

        catch(e){
            throw e;
        }
    };

    async getCartById(id){
        try{
            const cart = await CartModel.find({_id:id}).lean();
            console.log(`get cart ${id}`);      

            if(cart[0]){
                return cart;
            }

            else{
                const error={message:"cart not found"};
                throw error;
            }
        }

        catch(e){
            throw e;
        }

    };

    async createCart(){
        try{
        const cartCreated = await CartModel.create({});
        return cartCreated;
    }
        catch(e){
            throw e;
        }
    }

    async addProductToCart(pid,cid){

        try{
            const cart = await CartModel.find({_id:cid});
            const product= await ProductModel.find({_id:pid});
            let products= cart[0].products;
            let ANY=products.filter(prod=>prod.product._id==pid);

            if(ANY.length>0){
            let index=products.findIndex(prod=>prod.product._id==pid);
            (products[index].quantity)++;
            }

            else{

            const newProd={
                product:product[0]._id,
                quantity:1,
            }

            products.push(newProd);

            }

            const editCart= await CartModel.updateOne({ _id: cid }, {products});
            return editCart;
        }

        catch(e){
            throw e;
        }
    };

    async addProductsArray(cid, productsArray) {
        try {
          console.log(productsArray);
          for (const product of productsArray) {
            console.log(product._id);
            await this.addProductToCart(product._id, cid);
          }
        } catch (e) {
          throw e;
        }
    }

    async deleteProductFromCart(pid,cid){
        try{
        const cart = await CartModel.find({_id:cid});
        let products= cart[0].products;
        let newARR = products.filter(prod => prod.product._id.toString() !== pid);
        const editCart= await CartModel.updateOne({ _id: cid }, {products:newARR});
        return editCart;
    }
        
        catch(e){
            throw e;
        }
    };

    async emptyCart(id){
        try{

            const cart = await CartModel.find({_id:cid});
            let newARR=[];
            const editCart= await CartModel.updateOne({ _id: cid }, {products:newARR});
            return editCart;
        }

        catch(e){
            throw e;
        }
    };

    async editProductQuantity(cid,pid,newquant){

        try{
        const cart = await CartModel.find({_id:cid});
        let products= cart[0].products;
        console.log(products);
        let ANY=products.filter(prod=>prod.product._id==pid);
        if(ANY.length>0){
            let index=products.findIndex(prod=>prod.product._id==pid);
            if(newquant){
              (products[index].quantity)=newquant;
              const editCart= await CartModel.updateOne({ _id: cid }, {products});
              return editCart;  
            }
    
            else{
                const error={message:"newquant not defined"};
                throw error;
            }
        }
        
        else{
            const error={message:"product is not in this cart"};
            throw error;
        }
           
        }
        catch(e){
            throw e;
        }
    }

}