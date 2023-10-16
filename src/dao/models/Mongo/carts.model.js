import { CartMongoose } from "../Mongoose/carts.mongoose.js";

export class CartsModel{

    async getAll(){
        try{
        const carts = await CartMongoose.find({});
        return carts;
        }

        catch(e){
            throw e;
        }
    };

    async getById(id){
        try{
            const cart = await CartMongoose.find({_id:id}).lean(); 

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
        const cartCreated = await CartMongoose.create({});
        return cartCreated;
        }
        catch(e){
            throw e;
        }
    };

    async update(cid,info){
        try{
            const cart = await CartMongoose.findByIdAndUpdate({_id:cid},{products: info});
            return cart;

        }
        catch(e){
            console.log(e);
            throw e;
        }
    };

    async delete(cid) {
        try {
          const deletedCart = await CartMongoose.findByIdAndDelete(cid);
      
          if (!deletedCart) {
            const error = { message: "Cart not found" };
            throw error;
          }
      
          return deletedCart;
        } catch (e) {
          throw e;
        }
      }

}