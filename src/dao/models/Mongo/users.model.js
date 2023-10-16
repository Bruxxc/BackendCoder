import { UserMongoose } from "../Mongoose/users.mongoose.js";

export class UsersModel{

    async getAll(){
        try{
            const users=await UserMongoose.find({})
            return users;
        }
        catch(e){
            throw e;
        }
    };

    async getByEmail(email){
        try{

            const user= await UserMongoose.find({"email":email});

            if(user[0]){
                return user[0];
            }

            else return undefined;
            
        }
        catch(e){
            throw e;
        }
    };

    async getByUsername(username){
        try{

            const user= await UserMongoose.find({"userName":username});

            if(user[0]){
                return user[0];
            }

            else return undefined;
            
        }
        catch(e){
            throw e;
        }
    };

    async getById(id){
        try{

            const user= await UserMongoose.find({"_id":id});

            if(user[0]){
                return user[0];
            }

            else return undefined;
            
        }
        catch(e){
            throw e;
        }
    };



    async create(user){
        try{ 
            
            let userCreated = await UserMongoose.create(user);
            return userCreated;
        }
        catch(e){
            throw e;
        }
    };

    async update(id,info){
        try{
            const userUpdated = await UserMongoose.updateOne(
                { _id: id },
                info
            );
            return userUpdated;
        }
        catch(e){
            throw e;
        }
    };

    async delete(id){
        try{
            const userDeleted = await UserMongoose.deleteOne({"_id":id});
            return userDeleted;
        }
        catch(e){
            throw e;
        }
    };

}