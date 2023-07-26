import { ProductModel } from "../../models/Mongoose/products.mongoose.js";

export class MDBProductManager{

    async getProducts(filter,limit,page,sort){

        try{
            const products = await ProductModel.paginate(filter, {
                limit,
                page,
                sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : undefined,
            });
            return products;

        }catch(e){
            throw e;
        }
        
        
    };

    async getProductById(id){

        try{
            const product = await ProductModel.find({"_id":id});
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
            const status=true;
            const productCreated = await ProductModel.create({ title, description, price, code, stock ,category, thumbnail,status });
            return productCreated;
        }
       
    };

    async editProduct(id,title, description, price, stock ,category, thumbnail, status){
    
        if (!title && !description && !price && !stock && !category && !thumbnail && !status ) {
            console.log(
              "validation error: all fields are empty."
            );
            const error={message:"validation error: all fields are empty."};
            throw error;
        }


        else{

            const found= await ProductModel.find({"_id":id});

            if(found[0]){
                const productUpdated = await ProductModel.updateOne(
                    { _id: id },
                    { title, description, price, stock, category, thumbnail, status  }
                );
                return productUpdated;
            }

            else{
                const error={message:"product not found"};
                throw error;
            }
        }

    };

    async deleteProduct(id){
        const product = await ProductModel.find({"_id":id});
        console.log(product);
        if(product[0]){
          const productDeleted = await ProductModel.deleteOne(
            { _id: id },
          );
          return productDeleted;
        }

        else{
            const error={message:"product not found"};
            throw error;
        }
    }
}