import { CartModel } from "../Mongoose/carts.mongoose.js";

export class CartsModel{

    async getAll(){
        try{
        const carts = await CartModel.find({});
        console.log("get carts");
        return carts;
        }

        catch(e){
            throw e;
        }
    };

    async getById(id){
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

    async create(){
        try{
        const cartCreated = await CartModel.create({});
        console.log("Cart created");
        return cartCreated;
        }
        catch(e){
            throw e;
        }
    };

    async update(cid,info){
        try{
            const cart = await CartModel.findByIdAndUpdate({_id:cid},{info});
            return cart;

        }
        catch(e){
            console.log(e);
            throw e;
        }
    };

    async delete(cid) {
        try {
          const deletedCart = await CartModel.findByIdAndDelete(id);
      
          if (!deletedCart) {
            const error = { message: "Cart not found" };
            throw error;
          }
      
          console.log(`Cart deleted: ${id}`);
          return deletedCart;
        } catch (e) {
          throw e;
        }
      }

}