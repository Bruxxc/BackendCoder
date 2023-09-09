import { ProductsModel } from "../../models/Mongo/products.model.js";
import { CartsModel } from "../../models/Mongo/carts.model.js";
import { UserService } from "../../../services/User.service.js";

const CModel= new CartsModel;
const PModel = new ProductsModel;
const UService= new UserService;
export class MDBCartManager{

    async getCarts(){
        try{
        const carts= await CModel.getAll();
        return carts;
        }

        catch(e){
            throw e;
        }
    };

    async getCartById(id){
        try{
            const cart = await CModel.getById(id);
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

    async getCartByEmail(email){

        try{
            const user=await UService.getByEmail(email);
            console.log(user.cart);
            let cid= user.cart;
            const cart = await CModel.getById(cid);     
            console.log("AAAA",cart);
            console.log(cart[0]!=undefined);

            if(cart[0]!=undefined){
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
        const cartCreated = await CModel.create();
        console.log("Cart created");
        return cartCreated;
        }
        catch(e){
            throw e;
        }
    }

    async addProductToCart(pid,cid){

        try{
            const cart = await CModel.getById(cid);
            const product= await PModel.getById(pid);
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

            const editCart= await CModel.update(cid,products);
            return editCart;
        }

        catch(e){
            throw e;
        }
    };

    async addProductsArray(cid, productsArray) {
        try {
          console.log("PRODUCTOS A AGREGAR:",productsArray);
          for (const product of productsArray.products) {
            console.log(product);
            await this.addProductToCart(product, cid);
          }
        } catch (e) {
          throw e;
        }
    }

    async deleteProductFromCart(pid,cid){
        try{
        const cart = await CModel.getById(cid);
        let products= cart[0].products;
        let newARR = products.filter(prod => prod.product._id.toString() !== pid);
        const editCart= await CModel.update(cid, newARR);
        return editCart;
    }
        
        catch(e){
            throw e;
        }
    };

    async emptyCart(cid){
        try{

            const cart = await CModel.getById(cid);
            let newARR=[];
            const editCart= await CModel.update(cid, newARR);
            return editCart;
        }

        catch(e){
            throw e;
        }
    };

    async editProductQuantity(cid,pid,newquant){

        try{
        const cart = await CModel.getById(cid);
        let products= cart[0].products;
        console.log(products);
        let ANY=products.filter(prod=>prod.product._id==pid);
        if(ANY.length>0){
            let index=products.findIndex(prod=>prod.product._id==pid);
            if(newquant){
              (products[index].quantity)=newquant;
              const editCart= await CModel.update(cid, products);
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
    };


    async totalPrice(cid){
        try{
            const cart = await CModel.getById(cid);
            let total=0;
            if(cart[0]){
                cart[0].products.forEach(product => {
                    total=total+(product.quantity*product.product.price);
                });
            }

            return total;
        } catch (e) {
            throw e;
        }
    }

    async increaseProductQuantity(cid, pid) {
        try {
          const cart = await CModel.getById(cid);
          let products = cart[0].products;
          console.log(products);
          let productIndex = products.findIndex(prod => prod.product._id == pid);
      
          if (productIndex !== -1) {
            products[productIndex].quantity += 1;
            const editCart = await CModel.update(cid, products);
            let total=await this.totalPrice(cid);
            let result={
                editCart:editCart,
                total:total
            }
            return result;
          } else {
            const error = { message: "Product is not in this cart" };
            throw error;
          }
        } catch (e) {
          throw e;
        }
    };



    async decreaseProductQuantity(cid, pid) {
        try {
          const cart = await CModel.getById(cid);
          let products = cart[0].products;
          console.log(products);
          let productIndex = products.findIndex(prod => prod.product._id == pid);
      
          if (productIndex !== -1) {
            if (products[productIndex].quantity > 1) {
              products[productIndex].quantity -= 1;
              const editCart = await CModel.update(cid, products);
              let total=await this.totalPrice(cid);
              let result={
                  editCart:editCart,
                  total:total
                }
              return result;
            } else {
              // Remove the product from the cart if quantity becomes 0
              products.splice(productIndex, 1);
              const editCart = await CModel.update(cid, products);
              let total=await this.totalPrice(cid);
              let result={
                  editCart:editCart,
                  total:total
                }
              return result;
            }
          } else {
            const error = { message: "Product is not in this cart" };
            throw error;
          }
        } catch (e) {
          throw e;
        }
    };


    async cartCheckStock(cid){
        try{
            const cart = await CModel.getById(cid);  
            let availableList='';

            if(cart[0]){

                cart[0].products.forEach(product => {
                    if(product.product.stock < product.quantity){
                        availableList=availableList + `<br>` + `${product.product.title} stock is: ${product.product.stock}`;
                    }
                });
                console.log(availableList);
                if(availableList == ''){
                    let info={
                        valid: true,
                        stockError: availableList,
                        products:cart[0].products
                    }
                    return info;
                }

                else {
                    
                    let info={
                        valid: false,
                        stockError: availableList,
                    }
                    return info;
                }

            }

            else{
                const error={message:"cart not found"};
                throw error;
            }
        }

        catch(e){
            console.log(e);
            throw e;
        }

    };

}

