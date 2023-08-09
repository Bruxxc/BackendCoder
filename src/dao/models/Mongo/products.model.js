import { ProductMongoose } from "../Mongoose/products.mongoose.js";

export class ProductsModel{

    async getPaginated(filter,limit,page,sort){

        try{
            const products = await ProductMongoose.paginate(filter, {
                limit,
                page,
                sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : undefined,
            });
            return products;

        }catch(e){
            throw e;
        }
        
        
    };

    async getAll(){
        try{
           const products= await ProductMongoose.find({}).lean();
           return products; 
        }
        catch(e){
            console.log(e);
            throw e;
        }
    };

    async getById(id){

        try{
            const product = await ProductMongoose.find({"_id":id});
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


    async create(title, description, price, code, stock ,category, thumbnail){

        if (!title || !description || !price || !code || !stock|| !category){
            console.log(
              "validation error: please complete all required fields."
            );
            const error={message:"validation error: please complete all required fields."};
            throw error;
        }
        else{
            const status=true;
            const productCreated = await ProductMongoose.create({ title, description, price, code, stock ,category, thumbnail,status });
            return productCreated;
        }
       
    };


    async update(id, title, description, price, stock, category, thumbnail, status) {
        try {
           console.log(title,description,price,stock,category,thumbnail,status);
            const found = await ProductMongoose.find({ "_id": id });
    
            if (found[0]) {
                
                const productUpdated = await ProductMongoose.updateOne(
                    { _id: id },
                    { title, description, price, stock, category, thumbnail, status }
                );
                return productUpdated;
            } else {
               
                const error = { message: "product not found" };
                throw error;
            }
        } catch (e) {
            
            throw e;
        }
    };

    async delete(id){
        const product = await ProductMongoose.find({"_id":id});
        console.log(product);
        if(product[0]){
          const productDeleted = await ProductMongoose.deleteOne(
            { _id: id },
          );
          return productDeleted;
        }

        else{
            const error={message:"product not found"};
            throw error;
        }
    };

}