import { ProductsModel } from "../../models/Mongo/products.model.js";
import { generateProductInfoError } from "../../../errors/products/info.js";
import { resourceNotFoundError } from "../../../errors/custom/resNotFound.js";

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
                const error=resourceNotFoundError("PRODUCT");
                throw error;
            }
        } catch(e){
            throw e;
        }
    };


    async createProduct(title, description, price, code, stock ,category, thumbnail){
        try{
        if (!title || !description || !price || !code || !stock|| !category){

            const product={
                title:title,
                description:description,
                price:price,
                code:code,
                stock:stock,
                category:category,
                thumbnail:thumbnail?thumbnail:undefined
            }
            const message=generateProductInfoError(product);
            const error={message:message};
            throw error;
        }
        else{
            const product={
                title:title,
                description:description,
                price:price,
                code:code,
                stock:stock,
                category:category,
                thumbnail:thumbnail?thumbnail:undefined
            }
            const message=generateProductInfoError(product);
            if(typeof title !== "string" || typeof price !== "number" || typeof stock !== "number"){
                const error={message:message};
                throw error;
            }

            else{
            const productCreated = await PModel.create( title, description, price, code, stock ,category, thumbnail);
            return productCreated;}
        }
        }
        catch(e){
            console.log(e);
            throw e;
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