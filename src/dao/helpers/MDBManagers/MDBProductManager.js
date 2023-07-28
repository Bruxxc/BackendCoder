import { ProductsModel } from "../../models/Mongo/products.model.js";

const PModel= new ProductsModel;

export class MDBProductManager{

    async getProducts(filter,limit,page,sort){

        try{
            const products = await PModel.getPaginated(filter,limit,page,sort);
            return products;

        }catch(e){
            throw e;
        }
        
        
    };

    async getAll(){

        try{
            const products = await PModel.getAll();
            return products;

        }catch(e){
            throw e;
        }
        
    }

    async getProductById(id){

        try{
            const product = await PModel.getById(id);
            if(product[0]){
            return product;
            }
            else{
                const error={message:"product not found"};
                throw error;
            }
        } catch(e){
            throw e;
        }
    };


    async createProduct(title, description, price, code, stock ,category, thumbnail){

        if (!title || !description || !price || !code || !stock|| !category){
            console.log(
              "validation error: please complete all required fields."
            );
            const error={message:"validation error: please complete all required fields."};
            throw error;
        }
        else{
            const productCreated = await PModel.create( title, description, price, code, stock ,category, thumbnail);
            return productCreated;
        }
       
    };

    async editProduct(id, title, description, price, stock, category, thumbnail, status) {
        try {
            console.log(title,description,price,stock,category,thumbnail,status);
            if (!title && !description && !price && !stock && !category && !thumbnail && status==undefined) {
                console.log("validation error: all fields are empty. Nivel 1");
                const error = { message: "validation error: all fields are empty. Nivel 1" };
                throw error;
            } else {
                const found = await PModel.getById(id);
    
                if (found[0]) {
                    const productUpdated = await PModel.update(
                        id, title, description, price, stock, category, thumbnail, status
                    );
                    return productUpdated;
                } else {

                    const error = { message: "product not found" };
                    throw error;
                }
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async deleteProduct(id){
        try{
          const productDeleted = await PModel.delete(id);
          return productDeleted;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    }
}